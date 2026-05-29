import type { Sport, Mode, Availability } from '../types'

export interface CategoryItem {
  title: string
  desc: string
  tags: string[]
}

export const footballCategories: CategoryItem[] = [
  { title: 'Fútbol 5', desc: 'Ideal para equipos cortos y partidos rápidos después del trabajo.', tags: ['5 vs 5', 'Cancha chica', 'Rotación simple'] },
  { title: 'Fútbol 6', desc: 'Formato equilibrado para sumar más gente sin perder intensidad.', tags: ['6 vs 6', 'Flexible', 'Torneo corto'] },
  { title: 'Fútbol 8', desc: 'Más parecido al fútbol tradicional, con espacios y posiciones claras.', tags: ['8 vs 8', 'Cancha media', 'Equipos amplios'] },
  { title: 'Fútbol 11', desc: 'Para quienes quieren armar equipo completo y jugar formato clásico.', tags: ['11 vs 11', 'Cancha grande', 'Liga interna'] },
]

export const padelCategories: CategoryItem[] = [
  { title: 'Pádel inicial', desc: 'Para quienes están empezando o quieren jugar más relajado.', tags: ['Nivel inicial', 'Social', 'Aprendizaje'] },
  { title: 'Pádel intermedio', desc: 'Para duplas con ritmo de juego y experiencia regular.', tags: ['Nivel medio', 'Duplas', 'Ranking interno'] },
  { title: 'Pádel avanzado', desc: 'Para partidos más competitivos y duplas ya consolidadas.', tags: ['Nivel alto', 'Competitivo', 'Copa'] },
  { title: 'Busco dupla', desc: 'Espacio para quienes quieren jugar pero todavía no tienen pareja.', tags: ['Matchmaking', 'Mixto', 'Flexible'] },
]

export interface TabItem {
  sport: Sport
  mode: Mode
  label: string
  sub: string
}

export const sportTabs: TabItem[] = [
  { sport: 'futbol', mode: 'masculino', label: 'Fútbol masculino', sub: 'F5, F6, F8, F11' },
  { sport: 'futbol', mode: 'femenino', label: 'Fútbol femenino', sub: 'F5, F6, F8, F11' },
  { sport: 'futbol', mode: 'mixto', label: 'Fútbol mixto', sub: 'F5, F6, F8, F11' },
  { sport: 'padel', mode: 'masculino', label: 'Pádel masculino', sub: 'Por nivel' },
  { sport: 'padel', mode: 'femenino', label: 'Pádel femenino', sub: 'Por nivel' },
  { sport: 'padel', mode: 'mixto', label: 'Pádel mixto', sub: 'Por nivel' },
]

export const footballCategoryOptions = ['Fútbol 5', 'Fútbol 6', 'Fútbol 8', 'Fútbol 11']
export const padelCategoryOptions = ['Pádel inicial', 'Pádel intermedio', 'Pádel avanzado']
export const allCategoryOptions = [...footballCategoryOptions, ...padelCategoryOptions]

export const availabilityOptions: { value: Availability; label: string }[] = [
  { value: 'lunes-viernes', label: 'Lunes a viernes' },
  { value: 'sabados', label: 'Sábados' },
  { value: 'domingos', label: 'Domingos' },
  { value: 'mediodia', label: 'Mediodía' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noche', label: 'Noche' },
]

export function displayMode(mode: Mode): string {
  const map: Record<Mode, string> = { masculino: 'Masculino', femenino: 'Femenino', mixto: 'Mixto' }
  return map[mode]
}

export function displaySport(sport: Sport): string {
  return sport === 'futbol' ? 'Fútbol' : 'Pádel'
}

export function getSportIcon(sport: string): string {
  const s = sport.toLowerCase()
  return s.includes('fút') || s.includes('fut') || s === 'futbol' ? '⚽' : '🎾'
}

export const statusLabels: Record<string, string> = {
  buscando_rival: 'Buscando rival',
  rival_interesado: 'Rival interesado',
  juntando_jugadores: 'Juntando jugadores',
  cupo_minimo_completo: 'Cupo mínimo completo',
  cancha_completa: 'Cancha completa',
  cancelado: 'Cancelado',
}
