import { prisma } from '../lib/prisma.js'
import { ApiError } from '../lib/errors.js'
import type { Sport, Mode, OrganizerType, MatchType, FriendlyMatchStatus } from '@prisma/client'

function getRecruitingDefaults(sport: Sport, category: string): { min: number; max: number } {
  if (sport === 'futbol') {
    if (category.includes('5')) return { min: 5, max: 5 }
    if (category.includes('6')) return { min: 6, max: 6 }
    if (category.includes('8')) return { min: 8, max: 8 }
    if (category.includes('11')) return { min: 11, max: 11 }
    return { min: 5, max: 5 }
  }
  if (sport === 'padel') return { min: 4, max: 4 }
  if (sport === 'tenis') {
    if (category.toLowerCase().includes('doble')) return { min: 2, max: 2 }
    return { min: 2, max: 2 }
  }
  return { min: 4, max: 8 }
}

export interface CreateMatchDto {
  sport: Sport
  mode: Mode
  category: string
  organizerName: string
  organizerContact: string
  organizerType?: OrganizerType
  matchType?: MatchType
  date: string
  time: string
  location?: string
  message?: string
  minPlayers?: number
  maxPlayers?: number
  organizerPlays?: boolean
}

export interface UpdateStatusDto {
  status: FriendlyMatchStatus
  rivalName?: string
  rivalContact?: string
  rivalMessage?: string
  verificationContact?: string
}

export async function listMatches() {
  return prisma.friendlyMatch.findMany({
    orderBy: { createdAt: 'desc' },
    include: { participants: true },
  })
}

export async function getMatch(id: string) {
  return prisma.friendlyMatch.findUnique({
    where: { id },
    include: { participants: true },
  })
}

export async function createMatch(data: CreateMatchDto) {
  if (data.matchType === 'open_court' && data.sport !== 'padel' && data.sport !== 'karting') {
    throw new ApiError(400, 'Formato abierto solo disponible para pádel y karting')
  }
  if (data.matchType === 'recruiting' && data.sport === 'karting') {
    throw new ApiError(400, 'Karting usa formato carrera abierta, no reclutamiento')
  }

  // Check if organizer already has an active match
  const existingActive = await prisma.friendlyMatch.findFirst({
    where: {
      organizerContact: data.organizerContact,
      status: { notIn: ['cancelado'] },
    },
  })
  if (existingActive) {
    throw new ApiError(400, 'Ya tenés una solicitud activa. Cancelala antes de crear otra.')
  }

  // Check if organizer already has a match at the same date and time
  const existingSchedule = await prisma.friendlyMatch.findFirst({
    where: {
      organizerContact: data.organizerContact,
      date: data.date,
      time: data.time,
      status: { notIn: ['cancelado'] },
    },
  })
  if (existingSchedule) {
    throw new ApiError(400, 'Ya tenés un partido en ese día y horario.')
  }

  const isParticipantBased = data.matchType === 'open_court' || data.matchType === 'recruiting'
  const status: FriendlyMatchStatus = isParticipantBased
    ? 'juntando_jugadores'
    : 'buscando_rival'

  let minPlayers: number | null = null
  let maxPlayers: number | null = null
  if (data.matchType === 'open_court') {
    minPlayers = data.minPlayers ?? 6
    maxPlayers = data.maxPlayers ?? 8
  } else if (data.matchType === 'recruiting') {
    const defaults = getRecruitingDefaults(data.sport, data.category)
    minPlayers = data.minPlayers ?? defaults.min
    maxPlayers = data.maxPlayers ?? defaults.max
  }

  const match = await prisma.friendlyMatch.create({
    data: {
      sport: data.sport,
      mode: data.mode,
      category: data.category,
      organizerName: data.organizerName,
      organizerContact: data.organizerContact,
      organizerType: data.organizerType ?? 'persona',
      matchType: data.matchType ?? 'team_vs_team',
      date: data.date,
      time: data.time,
      location: data.location,
      message: data.message,
      status,
      minPlayers,
      maxPlayers,
      organizerPlays: data.organizerPlays ?? true,
    },
    include: { participants: true },
  })

  if (isParticipantBased && data.organizerPlays !== false) {
    await prisma.openCourtParticipant.create({
      data: {
        friendlyMatchId: match.id,
        name: data.organizerName,
        contact: data.organizerContact,
        comment: 'Organizador',
      },
    })
  }

  return prisma.friendlyMatch.findUnique({
    where: { id: match.id },
    include: { participants: true },
  })
}

export async function updateMatchStatus(id: string, data: UpdateStatusDto) {
  const match = await prisma.friendlyMatch.findUnique({ where: { id } })
  if (!match) throw new ApiError(404, 'Partido no encontrado')

  if (data.status === 'buscando_rival' && match.status === 'rival_interesado') {
    if (!data.verificationContact) {
      throw new ApiError(400, 'Ingresá tu contacto para verificar tu identidad')
    }
    const contact = data.verificationContact.trim().toLowerCase()
    const isOrganizer = match.organizerContact.toLowerCase() === contact
    const isRival = match.rivalContact?.toLowerCase() === contact
    if (!isOrganizer && !isRival) {
      throw new ApiError(403, 'El contacto no coincide con el organizador ni con el rival')
    }
  }

  return prisma.friendlyMatch.update({
    where: { id },
    data: {
      status: data.status,
      rivalName: data.status === 'buscando_rival' ? null : (data.rivalName ?? undefined),
      rivalContact: data.status === 'buscando_rival' ? null : (data.rivalContact ?? undefined),
      rivalMessage: data.status === 'buscando_rival' ? null : (data.rivalMessage ?? undefined),
    },
    include: { participants: true },
  })
}

export async function deleteMatch(id: string, organizerContact: string) {
  const match = await prisma.friendlyMatch.findUnique({ where: { id } })
  if (!match) throw new ApiError(404, 'Partido no encontrado')
  if (match.status !== 'buscando_rival' && match.status !== 'juntando_jugadores') {
    throw new ApiError(400, 'Solo se puede eliminar un partido que todavía está armándose')
  }
  if (match.organizerContact.toLowerCase() !== organizerContact.trim().toLowerCase()) {
    throw new ApiError(403, 'El contacto no coincide con el organizador')
  }
  return prisma.friendlyMatch.delete({ where: { id } })
}
