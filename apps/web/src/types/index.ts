export type Sport = 'futbol' | 'padel' | 'tenis' | 'karting'
export type Mode = 'masculino' | 'femenino' | 'mixto'
export type OrganizerType = 'persona' | 'dupla' | 'equipo'
export type MatchType = 'team_vs_team' | 'closed_match' | 'open_court'
export type FriendlyMatchStatus =
  | 'buscando_rival'
  | 'rival_interesado'
  | 'juntando_jugadores'
  | 'cupo_minimo_completo'
  | 'cancha_completa'
  | 'cancelado'
export type Availability = 'lunes-viernes' | 'sabados' | 'domingos' | 'mediodia' | 'tarde' | 'noche'

export interface RegisteredTeam {
  id: string
  teamName: string
  sport: Sport
  mode: Mode
  category: string
  area: string | null
  membersCount: number
  representativeName: string
  representativeContact: string
  representativeArea: string | null
  availability: Availability[]
  comments: string | null
  createdAt: string
  updatedAt: string
}

export interface OpenCourtParticipant {
  id: string
  friendlyMatchId: string
  name: string
  contact: string
  comment: string | null
  createdAt: string
}

export interface FriendlyMatch {
  id: string
  sport: Sport
  mode: Mode
  category: string
  organizerName: string
  organizerContact: string
  organizerType: OrganizerType
  matchType: MatchType
  date: string
  time: string
  location: string | null
  message: string | null
  status: FriendlyMatchStatus
  rivalName: string | null
  rivalContact: string | null
  rivalMessage: string | null
  minPlayers: number | null
  maxPlayers: number | null
  organizerPlays: boolean
  participants: OpenCourtParticipant[]
  createdAt: string
  updatedAt: string
}
