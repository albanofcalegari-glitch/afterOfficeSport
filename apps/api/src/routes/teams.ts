import { Router } from 'express'
import { z } from 'zod'
import { ApiError } from '../lib/errors.js'
import * as teamsService from '../services/teams.service.js'

export const teamsRouter = Router()

const createTeamSchema = z.object({
  teamName: z.string().min(1).max(100),
  sport: z.enum(['futbol', 'padel', 'tenis', 'karting']),
  mode: z.enum(['masculino', 'femenino', 'mixto']),
  category: z.string().min(1),
  area: z.string().optional(),
  membersCount: z.number().int().min(1).max(30),
  representativeName: z.string().min(1),
  representativeContact: z.string().min(1),
  representativeArea: z.string().optional(),
  availability: z.array(z.string()).default([]),
  comments: z.string().optional(),
})

teamsRouter.get('/', async (_req, res) => {
  const teams = await teamsService.listTeams()
  res.json(teams)
})

teamsRouter.get('/:id', async (req, res) => {
  const team = await teamsService.getTeam(req.params.id)
  if (!team) throw new ApiError(404, 'Equipo no encontrado')
  res.json(team)
})

teamsRouter.post('/', async (req, res) => {
  const parsed = createTeamSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues.map(i => i.message).join(', '))
  }
  const team = await teamsService.createTeam(parsed.data)
  res.status(201).json(team)
})

teamsRouter.delete('/:id', async (req, res) => {
  await teamsService.deleteTeam(req.params.id)
  res.status(204).end()
})
