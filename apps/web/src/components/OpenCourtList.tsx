import { useState } from 'react'
import type { FriendlyMatch, Mode } from '../types'
import { displayMode, statusLabels, padelCategoryOptions } from '../data/options'
import type { CreateMatchDto } from '../api/client'

interface Props {
  matches: FriendlyMatch[]
  onJoin: (matchId: string, data: { name: string; contact: string; comment?: string }) => Promise<void>
  onCreateCourt: (data: CreateMatchDto) => Promise<void>
}

export default function OpenCourtList({ matches, onJoin, onCreateCourt }: Props) {
  const [showCreate, setShowCreate] = useState(false)
  const [mode, setMode] = useState<Mode>('mixto')
  const [category, setCategory] = useState('Pádel intermedio')
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onCreateCourt({
        sport: 'padel',
        mode,
        category,
        organizerName: organizerName.trim(),
        organizerContact: organizerContact.trim(),
        organizerType: 'persona',
        matchType: 'open_court',
        date: date.trim(),
        time: time.trim(),
        location: location.trim() || undefined,
        message: message.trim() || undefined,
        minPlayers: 6,
        maxPlayers: 8,
        organizerPlays,
      })
      setSuccess(true)
      setShowCreate(false)
      setOrganizerName(''); setOrganizerContact(''); setDate(''); setTime('')
      setLocation(''); setMessage(''); setMode('mixto'); setCategory('Pádel intermedio')
      setOrganizerPlays(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al crear la cancha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {success && <div className="success-msg">✅ ¡Cancha abierta creada!</div>}
      {error && <div className="info-banner" style={{ background: '#fff1f2', borderColor: 'rgba(244,63,94,.2)', color: '#be123c' }}>⚠️ {error}</div>}

      {!showCreate && (
        <button className="btn btn-blue" onClick={() => setShowCreate(true)} style={{ marginBottom: 18 }}>
          🎾 Crear cancha abierta
        </button>
      )}

      {showCreate && (
        <div className="form-card" style={{ marginBottom: 18 }}>
          <div className="form-badge" style={{ background: '#dbeafe', color: '#1d4ed8' }}>🎾 Nueva cancha abierta</div>
          <h3>Abrir cancha de pádel</h3>
          <form onSubmit={handleCreate}>
            <div className="two-cols">
              <label>
                Tu nombre
                <input type="text" placeholder="Ej: María López" required value={organizerName} onChange={e => setOrganizerName(e.target.value)} />
              </label>
              <label>
                Contacto
                <input type="text" placeholder="WhatsApp o mail" required value={organizerContact} onChange={e => setOrganizerContact(e.target.value)} />
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
                Nivel
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  {padelCategoryOptions.map(opt => <option key={opt}>{opt}</option>)}
                  <option value="Libre">Libre</option>
                </select>
              </label>
            </div>
            <div className="two-cols">
              <label>
                Día
                <input type="text" placeholder="Ej: Viernes" required value={date} onChange={e => setDate(e.target.value)} />
              </label>
              <label>
                Horario
                <input type="text" placeholder="Ej: 20:00" required value={time} onChange={e => setTime(e.target.value)} />
              </label>
            </div>
            <label>
              Lugar / club / zona
              <input type="text" placeholder="Ej: Club Norte" value={location} onChange={e => setLocation(e.target.value)} />
            </label>
            <div className="open-court-info">
              <p>📋 Cupo: <strong>6 mínimo / 8 máximo</strong></p>
              <label style={{ flexDirection: 'row', alignItems: 'center', gap: 10, display: 'flex', cursor: 'pointer' }}>
                <input type="checkbox" checked={organizerPlays} onChange={e => setOrganizerPlays(e.target.checked)} style={{ width: 'auto', marginRight: 4 }} />
                Yo juego
              </label>
            </div>
            <label>
              Comentario (opcional)
              <input type="text" placeholder="Ej: Buscamos gente para rotar" value={message} onChange={e => setMessage(e.target.value)} />
            </label>
            <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
              <button className="btn btn-blue" type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear cancha abierta'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => { setShowCreate(false); setError('') }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {matches.length === 0 && !showCreate && !success && (
        <div className="empty-state">
          <div className="emoji">🎾</div>
          <p>No hay canchas abiertas publicadas. ¡Creá una!</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="requests">
          {matches.map(match => (
            <OpenCourtCard key={match.id} match={match} onJoin={onJoin} />
          ))}
        </div>
      )}
    </div>
  )
}

function OpenCourtCard({ match, onJoin }: { match: FriendlyMatch; onJoin: Props['onJoin'] }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const current = match.participants.length
  const max = match.maxPlayers ?? 8
  const min = match.minPlayers ?? 6
  const pct = Math.round((current / max) * 100)
  const isFull = match.status === 'cancha_completa'

  function statusClass(): string {
    switch (match.status) {
      case 'juntando_jugadores': return 'status-juntando'
      case 'cupo_minimo_completo': return 'status-cupo'
      case 'cancha_completa': return 'status-completa'
      default: return ''
    }
  }

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

  return (
    <article className="request-card open-court-card">
      <div className="topline">
        <span className={`status ${statusClass()}`}>
          {statusLabels[match.status] || match.status}
        </span>
        <span className="tag">Cancha abierta</span>
      </div>

      <strong>{match.organizerName}</strong>
      <p>{match.category} {displayMode(match.mode)} · {match.date} {match.time}</p>
      {match.location && <p>📍 {match.location}</p>}
      {match.message && <p>{match.message}</p>}

      <div className="progress-section">
        <div className="progress-label">
          <span>👥 {current}/{max} jugadores</span>
          <span>Mínimo para jugar: {min}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {match.participants.length > 0 && (
        <div className="participant-list">
          {match.participants.map(p => (
            <span key={p.id} className="tag">{p.name}</span>
          ))}
        </div>
      )}

      {!isFull && !showForm && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>Sumarme</button>
      )}
      {isFull && !showForm && (
        <button className="btn btn-secondary" disabled>Cancha completa</button>
      )}

      {showForm && (
        <form className="join-form" onSubmit={handleJoin}>
          <div className="two-cols">
            <label>
              Tu nombre
              <input type="text" placeholder="Ej: Carlos García" required value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label>
              Contacto
              <input type="text" placeholder="Mail o WhatsApp" required value={contact} onChange={e => setContact(e.target.value)} />
            </label>
          </div>
          <label>
            Comentario (opcional)
            <input type="text" placeholder="Ej: Nivel intermedio" value={comment} onChange={e => setComment(e.target.value)} />
          </label>
          <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Sumando...' : 'Confirmar'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </article>
  )
}
