import { useState } from 'react'
import type { FriendlyMatch, Sport, Mode } from '../types'
import { statusLabels, displaySport, getSportIcon, getRecruitingDefaults, getRecruitingCategoryOptions, displayMode } from '../data/options'
import { matchesApi } from '../api/client'
import type { CreateMatchDto } from '../api/client'

interface Props {
  matches: FriendlyMatch[]
  onCreated: () => void
  onJoin: (matchId: string, data: { name: string; contact: string; comment?: string }) => Promise<void>
  onDelete: (id: string, contact: string) => Promise<void>
}

const recruitingSports: Sport[] = ['futbol', 'padel', 'tenis']

export default function RecruitingSection({ matches, onCreated, onJoin, onDelete }: Props) {
  const [showCreate, setShowCreate] = useState(false)
  const [sport, setSport] = useState<Sport>('futbol')
  const [mode, setMode] = useState<Mode>('masculino')
  const [category, setCategory] = useState('Fútbol 5')
  const [organizerName, setOrganizerName] = useState('')
  const [organizerContact, setOrganizerContact] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')
  const [organizerPlays, setOrganizerPlays] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [filterSport, setFilterSport] = useState<Sport | 'all'>('all')

  function handleSportChange(newSport: Sport) {
    setSport(newSport)
    const cats = getRecruitingCategoryOptions(newSport)
    setCategory(cats[0] || '')
  }

  const defaults = getRecruitingDefaults(sport, category)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data: CreateMatchDto = {
        sport,
        mode,
        category,
        organizerName: organizerName.trim(),
        organizerContact: organizerContact.trim(),
        organizerType: 'persona',
        matchType: 'recruiting',
        date: date.trim(),
        time: time.trim(),
        location: location.trim() || undefined,
        message: message.trim() || undefined,
        minPlayers: defaults.min,
        maxPlayers: defaults.max,
        organizerPlays,
      }
      await matchesApi.create(data)
      onCreated()
      setSuccess(true)
      setShowCreate(false)
      setOrganizerName(''); setOrganizerContact('')
      setDate(''); setTime(''); setLocation(''); setMessage('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al crear la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const filtered = filterSport === 'all' ? matches : matches.filter(m => m.sport === filterSport)

  return (
    <div>
      {success && <div className="success-msg">✅ ¡Solicitud de equipo publicada!</div>}
      {error && <div className="info-banner" style={{ background: '#fff1f2', borderColor: 'rgba(244,63,94,.2)', color: '#be123c' }}>⚠️ {error}</div>}

      {!showCreate && (
        <button className="btn btn-purple" onClick={() => setShowCreate(true)} style={{ marginBottom: 18 }}>
          🙋 Buscar jugadores para mi equipo
        </button>
      )}

      {showCreate && (
        <div className="form-card" style={{ marginBottom: 18 }}>
          <div className="form-badge" style={{ background: '#f3e8ff', color: '#7c3aed' }}>🙋 Armar equipo</div>
          <h3>Busco jugadores para mi equipo</h3>
          <form onSubmit={handleCreate}>
            <div className="two-cols">
              <label>
                Deporte
                <select value={sport} onChange={e => handleSportChange(e.target.value as Sport)}>
                  {recruitingSports.map(s => (
                    <option key={s} value={s}>{displaySport(s)}</option>
                  ))}
                </select>
              </label>
              <label>
                Categoría
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  {getRecruitingCategoryOptions(sport).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="two-cols">
              <label>
                Modalidad
                <select value={mode} onChange={e => setMode(e.target.value as Mode)}>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="mixto">Mixto</option>
                </select>
              </label>
              <label>
                Tu nombre
                <input type="text" placeholder="Ej: Albano Calegari" required value={organizerName} onChange={e => setOrganizerName(e.target.value)} />
              </label>
            </div>
            <label>
              Contacto (mail o teléfono)
              <input type="text" placeholder="Ej: juan@mail.com o 1150616764" required value={organizerContact} onChange={e => setOrganizerContact(e.target.value)} pattern="^([^\s@]+@[^\s@]+\.[^\s@]+|\+?\d[\d\s\-()]{6,})$" title="Ingresá un email o número de teléfono válido" />
            </label>
            <div className="two-cols">
              <label>
                Fecha
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
              </label>
              <label>
                Horario
                <input type="time" required value={time} onChange={e => setTime(e.target.value)} />
              </label>
            </div>
            <label>
              Lugar (opcional)
              <input type="text" placeholder="Ej: Cancha Los Amigos, Palermo" value={location} onChange={e => setLocation(e.target.value)} />
            </label>
            <div className="open-court-info">
              <p>🙋 Equipo de <strong>{defaults.max} jugadores</strong> ({category})</p>
              <label style={{ flexDirection: 'row', alignItems: 'center', gap: 10, display: 'flex', cursor: 'pointer' }}>
                <input type="checkbox" checked={organizerPlays} onChange={e => setOrganizerPlays(e.target.checked)} style={{ width: 'auto', marginRight: 4 }} />
                Yo juego
              </label>
            </div>
            <label>
              Comentario (opcional)
              <input type="text" placeholder="Ej: Necesito un arquero y dos defensores" value={message} onChange={e => setMessage(e.target.value)} />
            </label>
            <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
              <button className="btn btn-purple" type="submit" disabled={loading}>
                {loading ? 'Publicando...' : 'Publicar búsqueda'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => { setShowCreate(false); setError('') }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {matches.length > 0 && (
        <div className="sport-filter">
          <button className={`filter-pill${filterSport === 'all' ? ' active' : ''}`} onClick={() => setFilterSport('all')}>Todos</button>
          {recruitingSports.map(s => (
            <button key={s} className={`filter-pill${filterSport === s ? ' active' : ''}`} onClick={() => setFilterSport(s)}>
              {getSportIcon(s)} {displaySport(s)}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && !showCreate && !success && (
        <div className="empty-state">
          <div className="emoji">🙋</div>
          <p>No hay equipos buscando jugadores. ¡Publicá el primero!</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="requests">
          {filtered.map(match => (
            <RecruitingCard key={match.id} match={match} onJoin={onJoin} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

function RecruitingCard({ match, onJoin, onDelete }: {
  match: FriendlyMatch
  onJoin: Props['onJoin']
  onDelete: Props['onDelete']
}) {
  const [showForm, setShowForm] = useState(false)
  const [showDeleteForm, setShowDeleteForm] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [comment, setComment] = useState('')
  const [deleteContact, setDeleteContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const current = match.participants.length
  const max = match.maxPlayers ?? 5
  const min = match.minPlayers ?? 5
  const pct = Math.round((current / max) * 100)
  const isFull = current >= max

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onJoin(match.id, { name: name.trim(), contact: contact.trim(), comment: comment.trim() || undefined })
      setShowForm(false)
      setName(''); setContact(''); setComment('')
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onDelete(match.id, deleteContact.trim())
      setShowDeleteForm(false); setDeleteContact('')
    } catch (err: any) {
      setError(err.message || 'No se pudo eliminar')
    } finally { setLoading(false) }
  }

  return (
    <article className="request-card">
      <div className="topline">
        <span className={`status${isFull ? ' status-cupo' : current >= min ? ' status-cupo' : ''}`}>
          {isFull ? 'Equipo completo' : current >= min ? 'Cupo mínimo OK' : statusLabels[match.status] || 'Juntando jugadores'}
        </span>
        <span>{getSportIcon(match.sport)}</span>
      </div>

      <div className="card-name-row">
        <strong>{match.organizerName}</strong>
        {!showDeleteForm && !showForm && (
          <button className="btn-delete-subtle" onClick={() => { setShowDeleteForm(true); setError('') }}>🗑 Eliminar</button>
        )}
      </div>

      <p>{match.category} · {displayMode(match.mode)} · {match.date} {match.time}</p>
      {match.location && <p>📍 {match.location}</p>}
      {match.message && <p>{match.message}</p>}

      <div className="progress-section">
        <div className="progress-label">
          <span>🙋 {current}/{max} jugadores</span>
          <span>{isFull ? 'Equipo completo' : `Faltan ${max - current}`}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-purple" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {match.participants.length > 0 && (
        <div className="participant-list">
          {match.participants.map(p => (
            <span key={p.id} className="tag">{p.name}</span>
          ))}
        </div>
      )}

      {!isFull && !showForm && !showDeleteForm && (
        <div className="card-bottom-action">
          <button className="btn btn-purple" onClick={() => setShowForm(true)}>🙋 Me sumo</button>
        </div>
      )}
      {isFull && !showForm && !showDeleteForm && (
        <div className="card-bottom-action">
          <button className="btn btn-secondary" disabled>Equipo completo</button>
        </div>
      )}

      {showDeleteForm && (
        <form className="join-form" onSubmit={handleDelete} style={{ marginTop: 10 }}>
          <div className="form-section-label">¿Sos el organizador? Verificá tu identidad</div>
          <label>Tu mail o WhatsApp<input type="text" placeholder="El que usaste al publicar" required value={deleteContact} onChange={e => { setDeleteContact(e.target.value); setError('') }} /></label>
          {error && <p style={{ color: '#be123c', fontSize: 13, margin: 0 }}>⚠️ {error}</p>}
          <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
            <button className="btn btn-danger" type="submit" disabled={loading} style={{ fontSize: 13 }}>{loading ? 'Eliminando...' : 'Confirmar eliminación'}</button>
            <button className="btn btn-secondary" type="button" style={{ fontSize: 13 }} onClick={() => { setShowDeleteForm(false); setError('') }}>Cancelar</button>
          </div>
        </form>
      )}

      {showForm && (
        <form className="join-form" onSubmit={handleJoin} style={{ marginTop: 10 }}>
          <div className="form-section-label">Tus datos</div>
          <div className="two-cols">
            <label>Tu nombre<input type="text" placeholder="Nombre" required value={name} onChange={e => setName(e.target.value)} /></label>
            <label>Contacto<input type="text" placeholder="WhatsApp o mail" required value={contact} onChange={e => setContact(e.target.value)} /></label>
          </div>
          <label>Comentario (opcional)<input type="text" placeholder="Ej: Juego de mediocampista" value={comment} onChange={e => setComment(e.target.value)} /></label>
          <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
            <button className="btn btn-purple" type="submit" disabled={loading}>{loading ? 'Sumando...' : 'Confirmar'}</button>
            <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </article>
  )
}
