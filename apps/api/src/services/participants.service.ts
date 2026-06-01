import { prisma } from '../lib/prisma.js'
import { ApiError } from '../lib/errors.js'
import type { FriendlyMatchStatus } from '@prisma/client'

export interface CreateParticipantDto {
  name: string
  contact: string
  comment?: string
}

export async function listParticipants(matchId: string) {
  return prisma.openCourtParticipant.findMany({
    where: { friendlyMatchId: matchId },
    orderBy: { createdAt: 'asc' },
  })
}

export async function addParticipant(matchId: string, data: CreateParticipantDto) {
  const match = await prisma.friendlyMatch.findUnique({
    where: { id: matchId },
    include: { participants: true },
  })

  if (!match) throw new ApiError(404, 'Partido no encontrado')
  if (match.matchType !== 'open_court' && match.matchType !== 'recruiting') throw new ApiError(400, 'Solo canchas abiertas y reclutamiento aceptan participantes')
  if (match.status === 'cancelado') throw new ApiError(400, 'Partido cancelado')

  const max = match.maxPlayers ?? 8
  if (match.participants.length >= max) throw new ApiError(400, 'Cancha completa')

  const participant = await prisma.openCourtParticipant.create({
    data: { friendlyMatchId: matchId, ...data },
  })

  // Recalculate status
  const newCount = match.participants.length + 1
  const min = match.minPlayers ?? 6
  let newStatus: FriendlyMatchStatus
  if (newCount >= max) newStatus = 'cancha_completa'
  else if (newCount >= min) newStatus = 'cupo_minimo_completo'
  else newStatus = 'juntando_jugadores'

  await prisma.friendlyMatch.update({
    where: { id: matchId },
    data: { status: newStatus },
  })

  return participant
}
