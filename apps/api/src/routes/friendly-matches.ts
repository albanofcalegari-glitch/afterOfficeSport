import { Router } from 'express'
import { z } from 'zod'
import { ApiError } from '../lib/errors.js'
import * as matchesService from '../services/friendly-matches.service.js'
import { participantsRouter } from './participants.js'

export const friendlyMatchesRouter = Router()

friendlyMatchesRouter.use('/:matchId/participants', participantsRouter)

const createMatchSchema = z.object({
  sport: z.enum(['futbol', 'padel']),
  mode: z.enum(['masculino', 'femenino', 'mixto']),
  category: z.string().min(1),
  organizerName: z.string().min(1),
  organizerContact: z.string().min(1),
  organizerType: z.enum(['persona', 'dupla', 'equipo']).default('persona'),
  matchType: z.enum(['team_vs_team', 'closed_match', 'open_court']).default('team_vs_team'),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().optional(),
  message: z.string().optional(),
  minPlayers: z.number().int().min(4).max(12).optional(),
  maxPlayers: z.number().int().min(4).max(12).optional(),
  organizerPlays: z.boolean().default(true),
})

const updateStatusSchema = z.object({
  status: z.enum([
    'buscando_rival', 'rival_interesado', 'juntando_jugadores',
    'cupo_minimo_completo', 'cancha_completa', 'cancelado',
  ]),
  rivalName: z.string().optional(),
  rivalContact: z.string().optional(),
  rivalMessage: z.string().optional(),
  verificationContact: z.string().optional(),
})

function sanitizeMatch(m: any) {
  const { organizerContact, rivalContact, ...rest } = m
  return { ...rest, organizerContact: '***', rivalContact: rivalContact ? '***' : null }
}

friendlyMatchesRouter.get('/', async (_req, res) => {
  const matches = await matchesService.listMatches()
  res.json(matches.map(sanitizeMatch))
})

friendlyMatchesRouter.get('/:id', async (req, res) => {
  const match = await matchesService.getMatch(req.params.id)
  if (!match) throw new ApiError(404, 'Partido no encontrado')
  res.json(sanitizeMatch(match))
})

friendlyMatchesRouter.post('/', async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues.map(i => i.message).join(', '))
  }
  const match = await matchesService.createMatch(parsed.data)
  res.status(201).json(match)
})

friendlyMatchesRouter.patch('/:id/status', async (req, res) => {
  const parsed = updateStatusSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues.map(i => i.message).join(', '))
  }
  const match = await matchesService.updateMatchStatus(req.params.id, parsed.data)
  res.json(match)
})

friendlyMatchesRouter.post('/:id/verify', async (req, res) => {
  const { contact } = req.body
  if (!contact || typeof contact !== 'string') {
    throw new ApiError(400, 'Ingresá tu contacto')
  }
  const match = await matchesService.getMatch(req.params.id)
  if (!match) throw new ApiError(404, 'Partido no encontrado')
  const c = contact.trim().toLowerCase()
  const isOrganizer = match.organizerContact.toLowerCase() === c
  const isRival = match.rivalContact?.toLowerCase() === c
  if (!isOrganizer && !isRival) {
    throw new ApiError(403, 'El contacto no coincide con ninguna de las partes')
  }
  res.json({
    verified: true,
    role: isOrganizer ? 'organizer' : 'rival',
    organizerContact: match.organizerContact,
    rivalContact: match.rivalContact,
  })
})

friendlyMatchesRouter.delete('/:id', async (req, res) => {
  const { contact } = req.body
  if (!contact || typeof contact !== 'string') {
    throw new ApiError(400, 'Ingresá tu contacto para verificar tu identidad')
  }
  await matchesService.deleteMatch(req.params.id, contact)
  res.status(204).end()
})
