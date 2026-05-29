import { Router } from 'express'
import { z } from 'zod'
import { ApiError } from '../lib/errors.js'
import * as participantsService from '../services/participants.service.js'

export const participantsRouter = Router({ mergeParams: true })

const createParticipantSchema = z.object({
  name: z.string().min(1),
  contact: z.string().min(1),
  comment: z.string().optional(),
})

participantsRouter.get('/', async (req: any, res) => {
  const participants = await participantsService.listParticipants(req.params.matchId)
  res.json(participants)
})

participantsRouter.post('/', async (req: any, res) => {
  const parsed = createParticipantSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues.map((i: any) => i.message).join(', '))
  }
  const participant = await participantsService.addParticipant(req.params.matchId, parsed.data)
  res.status(201).json(participant)
})
