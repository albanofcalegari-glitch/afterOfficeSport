import { useState } from 'react'
import type { FriendlyMatch } from '../types'
import { statusLabels } from '../data/options'
import { matchesApi } from '../api/client'
import type { CreateMatchDto } from '../api/client'

interface Props {
  matches: FriendlyMatch[]
  onCreated: () => void
  onJoin: (matchId: string, data: { name: string; contact: string; comment?: string }) => Promise<void>
  onDelete: (id: string, contact: string) => Promise<void>
}

export default function KartingSection({ matches, onCreated, onJoin, onDelete }: Props) {
  const [showCreate, setShowCreate] = useState(false)
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
      const data: CreateMatchDto = {
        sport: 'karting',
        mode: 'mixto',
        category: 'Karting recreativo',
        organizerName: organizerName.trim(),
        organizerContact: organizerContact.trim(),
        organizerType: 'persona',
        matchType: 'open_court',
        date: date.trim(),
        time: time.trim(),
        location: location.trim() || undefined,
        message: message.trim() || undefined,
        minPlayers: 4,
        maxPlayers: 20,
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
      setError(err.message || 'Error al crear la carrera')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {success && <div className="success-msg">✅ ¡Carrera de karting creada!</div>}
      {error && <div className="info-banner" style={{ background: '#fff1f2', borderColor: 'rgba(244,63,94,.2)', color: '#be123c' }}>⚠️ {error}</div>}

      {!showCreate && (
        <button className="btn btn-dark" onClick={() => setShowCreate(true)} style={{ marginBottom: 18 }}>
          🏎️ Crear carrera de karting
        </button>
      )}

      {showCreate && (
        <div className="form-card" style={{ marginBottom: 18 }}>
          <div className="form-badge" style={{ background: '#f3f4f6', color: '#17211d' }}>🏎️ Nueva carrera</div>
          <h3>Armar carrera de karting</h3>
          <form onSubmit={handleCreate}>
            <div className="two-cols">
              <label>
                Tu nombre
                <input type="text" placeholder="Ej: Albano Calegari" required value={organizerName} onChange={e => setOrganizerName(e.target.value)} />
              </label>
              <label>
                Contacto
                <input type="text" placeholder="WhatsApp o mail" required value={organizerContact} onChange={e => setOrganizerContact(e.target.value)} />
              </label>
            </div>
            <div className="two-cols">
              <label>
                Día
                <input type="text" placeholder="Ej: Viernes" required value={date} onChange={e => setDate(e.target.value)} />
              </label>
              <label>
                Horario
                <input type="text" placeholder="Ej: 19:00" required value={time} onChange={e => setTime(e.target.value)} />
              </label>
            </div>
            <label>
              Kartódromo / lugar
              <input type="text" placeholder="Ej: SpeedPark Pilar" value={location} onChange={e => setLocation(e.target.value)} />
            </label>
            <div className="open-court-info">
              <p>🏎️ Cupo: <strong>4 mínimo / 20 máximo</strong></p>
              <label style={{ flexDirection: 'row', alignItems: 'center', gap: 10, display: 'flex', cursor: 'pointer' }}>
                <input type="checkbox" checked={organizerPlays} onChange={e => setOrganizerPlays(e.target.checked)} style={{ width: 'auto', marginRight: 4 }} />
                Yo participo
              </label>
            </div>
            <label>
              Comentario (opcional)
              <input type="text" placeholder="Ej: Llevamos birra para el podio" value={message} onChange={e => setMessage(e.target.value)} />
            </label>
            <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
              <button className="btn btn-dark" type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear carrera'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => { setShowCreate(false); setError('') }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {matches.length === 0 && !showCreate && !success && (
        <div className="empty-state">
          <div className="emoji">🏎️</div>
          <p>No hay carreras publicadas. ¡Armá la primera!</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="requests">
          {matches.map(match => (
            <KartingCard key={match.id} match={match} onJoin={onJoin} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

function KartingCard({ match, onJoin, onDelete }: {
  match: FriendlyMatch
  onJoin: Props['onJoin']
  onDelete: Props['onDelete']
}) {
  const [showForm, setShowForm] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [comment, setComment] = useState('')
  const [deleteContact, setDeleteContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const current = match.participants.length
  const max = match.maxPlayers ?? 20
  const min = match.minPlayers ?? 4
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
      setShowDelete(false); setDeleteContact('')
    } catch (err: any) {
      setError(err.message || 'No se pudo eliminar')
    } finally { setLoading(false) }
  }

  return (
    <article className="request-card">
      <div className="topline">
        <span className={`status${current >= min ? ' status-cupo' : ''}`}>
          {isFull ? 'Cupo completo' : current >= min ? 'Cupo mínimo OK' : statusLabels[match.status] || 'Juntando pilotos'}
        </span>
        <span>🏎️</span>
      </div>

      <div className="card-name-row">
        <strong>{match.organizerName}</strong>
        {!showDelete && !showForm && (
          <button className="btn-delete-subtle" onClick={() => { setShowDelete(true); setError('') }}>🗑 Eliminar</button>
        )}
      </div>

      <p>{match.category} · {match.date} {match.time}</p>
      {match.location && <p>📍 {match.location}</p>}
      {match.message && <p>{match.message}</p>}

      <div className="progress-section">
        <div className="progress-label">
          <span>🏎️ {current}/{max} pilotos</span>
          <span>Mínimo para correr: {min}</span>
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

      {!isFull && !showForm && !showDelete && (
        <div className="card-bottom-action">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>🏎️ Sumarme</button>
        </div>
      )}
      {isFull && !showForm && !showDelete && (
        <div className="card-bottom-action">
          <button className="btn btn-secondary" disabled>Cupo completo</button>
        </div>
      )}

      {showDelete && (
        <form className="join-form" onSubmit={handleDelete} style={{ marginTop: 10 }}>
          <div className="form-section-label">¿Sos el organizador? Verificá tu identidad</div>
          <label>Tu mail o WhatsApp<input type="text" placeholder="El que usaste al publicar" required value={deleteContact} onChange={e => { setDeleteContact(e.target.value); setError('') }} /></label>
          {error && <p style={{ color: '#be123c', fontSize: 13, margin: 0 }}>⚠️ {error}</p>}
          <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
            <button className="btn btn-danger" type="submit" disabled={loading} style={{ fontSize: 13 }}>{loading ? 'Eliminando...' : 'Confirmar eliminación'}</button>
            <button className="btn btn-secondary" type="button" style={{ fontSize: 13 }} onClick={() => { setShowDelete(false); setError('') }}>Cancelar</button>
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
          <label>Comentario (opcional)<input type="text" placeholder="Ej: Llevo casco propio" value={comment} onChange={e => setComment(e.target.value)} /></label>
          <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Sumando...' : 'Confirmar'}</button>
            <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </article>
  )
}
