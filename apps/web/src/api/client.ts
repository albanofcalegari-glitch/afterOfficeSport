const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// Types matching the API response shapes
import type { RegisteredTeam, FriendlyMatch, OpenCourtParticipant } from '../types'

export interface CreateTeamDto {
  teamName: string
  sport: string
  mode: string
  category: string
  area?: string
  membersCount: number
  representativeName: string
  representativeContact: string
  representativeArea?: string
  availability: string[]
  comments?: string
}

export interface CreateMatchDto {
  sport: string
  mode: string
  category: string
  organizerName: string
  organizerContact: string
  organizerType?: string
  matchType?: string
  date: string
  time: string
  location?: string
  message?: string
  minPlayers?: number
  maxPlayers?: number
  organizerPlays?: boolean
}

export interface CreateParticipantDto {
  name: string
  contact: string
  comment?: string
}

export const teamsApi = {
  list: () => request<RegisteredTeam[]>('/teams'),
  get: (id: string) => request<RegisteredTeam>(`/teams/${id}`),
  create: (data: CreateTeamDto) =>
    request<RegisteredTeam>('/teams', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/teams/${id}`, { method: 'DELETE' }),
}

export const matchesApi = {
  list: () => request<FriendlyMatch[]>('/friendly-matches'),
  get: (id: string) => request<FriendlyMatch>(`/friendly-matches/${id}`),
  create: (data: CreateMatchDto) =>
    request<FriendlyMatch>('/friendly-matches', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, data: { status: string; rivalName?: string; rivalContact?: string; rivalMessage?: string; verificationContact?: string }) =>
    request<FriendlyMatch>(`/friendly-matches/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/friendly-matches/${id}`, { method: 'DELETE' }),
  listParticipants: (id: string) =>
    request<OpenCourtParticipant[]>(`/friendly-matches/${id}/participants`),
  addParticipant: (id: string, data: CreateParticipantDto) =>
    request<OpenCourtParticipant>(`/friendly-matches/${id}/participants`, { method: 'POST', body: JSON.stringify(data) }),
  verify: (id: string, contact: string) =>
    request<{ verified: boolean; role: string; organizerContact: string; rivalContact: string | null }>(
      `/friendly-matches/${id}/verify`, { method: 'POST', body: JSON.stringify({ contact }) }
    ),
}
