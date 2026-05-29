import { useState } from 'react'
import type { RegisteredTeam, Sport, Mode } from '../types'
import { getSportIcon, displayMode, displaySport, availabilityOptions } from '../data/options'

interface Props {
  teams: RegisteredTeam[]
}

export default function RegisteredTeamsList({ teams }: Props) {
  const [filterSport, setFilterSport] = useState<Sport | ''>('')
  const [filterMode, setFilterMode] = useState<Mode | ''>('')
  const [filterCategory, setFilterCategory] = useState('')

  const filtered = teams.filter(t => {
    if (filterSport && t.sport !== filterSport) return false
    if (filterMode && t.mode !== filterMode) return false
    if (filterCategory && t.category !== filterCategory) return false
    return true
  })

  const uniqueCategories = [...new Set(teams.map(t => t.category))]

  function availabilityLabel(val: string): string {
    return availabilityOptions.find(a => a.value === val)?.label ?? val
  }

  if (teams.length === 0) {
    return (
      <div className="empty-state">
        <div className="emoji">🏆</div>
        <p>Todavía no hay equipos inscriptos. ¡Inscribí el tuyo!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="filters">
        <select value={filterSport} onChange={e => { setFilterSport(e.target.value as Sport | ''); setFilterCategory('') }}>
          <option value="">Todos los deportes</option>
          <option value="futbol">Fútbol</option>
          <option value="padel">Pádel</option>
        </select>
        <select value={filterMode} onChange={e => setFilterMode(e.target.value as Mode | '')}>
          <option value="">Todas las modalidades</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="mixto">Mixto</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        {(filterSport || filterMode || filterCategory) && (
          <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }}
            onClick={() => { setFilterSport(''); setFilterMode(''); setFilterCategory('') }}>✕ Limpiar</button>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state"><p>No hay equipos para estos filtros.</p></div>
      ) : (
        <div className="requests">
          {filtered.map(team => (
            <article key={team.id} className="request-card">
              <div className="topline">
                <strong style={{ fontSize: 19 }}>{team.teamName}</strong>
                <span>{getSportIcon(team.sport)}</span>
              </div>
              <div className="category-meta" style={{ marginBottom: 12 }}>
                <span className="tag">{displaySport(team.sport)}</span>
                <span className="tag">{displayMode(team.mode)}</span>
                <span className="tag">{team.category}</span>
                {team.membersCount > 0 && <span className="tag">{team.membersCount} integrantes</span>}
              </div>
              {team.area && <p>🏢 {team.area}</p>}
              <p>👤 {team.representativeName}</p>
              <p>📱 {team.representativeContact}</p>
              {team.availability.length > 0 && <p>📅 {team.availability.map(availabilityLabel).join(', ')}</p>}
              {team.comments && <p style={{ fontStyle: 'italic' }}>💬 {team.comments}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
