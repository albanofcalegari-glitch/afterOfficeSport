import { prisma } from '../lib/prisma.js'
import type { Sport, Mode } from '@prisma/client'

export interface CreateTeamDto {
  teamName: string
  sport: Sport
  mode: Mode
  category: string
  area?: string
  membersCount: number
  representativeName: string
  representativeContact: string
  representativeArea?: string
  availability: string[]
  comments?: string
}

export async function listTeams() {
  return prisma.registeredTeam.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getTeam(id: string) {
  return prisma.registeredTeam.findUnique({ where: { id } })
}

export async function createTeam(data: CreateTeamDto) {
  return prisma.registeredTeam.create({ data })
}

export async function deleteTeam(id: string) {
  return prisma.registeredTeam.delete({ where: { id } })
}
