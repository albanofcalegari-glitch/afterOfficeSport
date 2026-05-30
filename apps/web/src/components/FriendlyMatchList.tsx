import { useState } from 'react'
import type { FriendlyMatch } from '../types'
import { getSportIcon, displayMode, statusLabels } from '../data/options'
import { matchesApi } from '../api/client'

interface Props {
  matches: FriendlyMatch[]
  onInterest: (id: string, data: { rivalName: string; rivalContact: string; rivalMessage?: string }) => Promise<void>
  onRevert: (id: string, verificationContact: string) => Promise<void>
  onDelete: (id: string, contact: string) => Promise<void>
}

export default function FriendlyMatchList({ matches, onInterest, onRevert, onDelete }: Props) {
  return (
    <div>
      <div className="info-banner">
        ⚠️ Estos no son torneos. Son partidos puntuales publicados por personas o equipos que buscan rival.
      </div>
      {matches.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">🤝</div>
          <p>Todavía no hay amistosos publicados. ¡Sé el primero!</p>
        </div>
      ) : (
        <div className="requests">
          {matches.map(match => (
            <FriendlyMatchCard key={match.id} match={match} onInterest={onInterest} onRevert={onRevert} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

function FriendlyMatchCard({ match, onInterest, onRevert, onDelete }: {
  match: FriendlyMatch
  onInterest: Props['onInterest']
  onRevert: Props['onRevert']
  onDelete: Props['onDelete']
}) {
  const [showInterestForm, setShowInterestForm] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [showRevert, setShowRevert] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [verifyContact, setVerifyContact] = useState('')
  const [revertContact, setRevertContact] = useState('')
  const [deleteContact, setDeleteContact] = useState('')
  const [revealedData, setRevealedData] = useState<{ role: string; organizerContact: string; rivalContact: string | null } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleInterest(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onInterest(match.id, {
        rivalName: name.trim(),
        rivalContact: contact.trim(),
        rivalMessage: message.trim() || undefined,
      })
      setShowInterestForm(false)
      setName(''); setContact(''); setMessage('')
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await matchesApi.verify(match.id, verifyContact.trim())
      setRevealedData(result)
      setShowVerify(false)
    } catch (err: any) {
      setError(err.message || 'Contacto no válido')
    } finally { setLoading(false) }
  }

  async function handleRevert(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onRevert(match.id, revertContact.trim())
      setShowRevert(false); setRevertContact('')
      setRevealedData(null)
    } catch (err: any) {
      setError(err.message || 'No se pudo verificar')
    } finally { setLoading(false) }
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
        <span className={`status${match.status === 'rival_interesado' ? ' status-interested' : ''}`}>
          {statusLabels[match.status] || match.status}
        </span>
        <span>{getSportIcon(match.sport)}</span>
      </div>
      <div className="card-name-row">
        <strong>{match.organizerName}</strong>
        {match.status === 'buscando_rival' && !showInterestForm && !showDelete && (
          <button className="btn-delete-subtle" onClick={() => { setShowDelete(true); setError('') }}>🗑 Eliminar</button>
        )}
      </div>
      <p>{match.category} {displayMode(match.mode)} · {match.date} {match.time}</p>
      {match.location && <p>📍 {match.location}</p>}
      {match.message && <p>{match.message}</p>}

      {/* BUSCANDO RIVAL */}
      {match.status === 'buscando_rival' && !showInterestForm && !showDelete && (
        <div className="card-bottom-action">
          <button className="btn btn-primary" onClick={() => setShowInterestForm(true)}>Me interesa</button>
        </div>
      )}

      {match.status === 'buscando_rival' && showDelete && (
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

      {match.status === 'buscando_rival' && showInterestForm && (
        <form className="join-form" onSubmit={handleInterest}>
          <div className="form-section-label">Tus datos</div>
          <div className="two-cols">
            <label>Tu nombre<input type="text" placeholder="Nombre o equipo" required value={name} onChange={e => setName(e.target.value)} /></label>
            <label>Tu mail o WhatsApp<input type="text" placeholder="ejemplo@mail.com" required value={contact} onChange={e => setContact(e.target.value)} /></label>
          </div>
          <label>Mensaje (opcional)<input type="text" placeholder="Ej: Somos 5" value={message} onChange={e => setMessage(e.target.value)} /></label>
          <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Confirmar interés'}</button>
            <button className="btn btn-secondary" type="button" onClick={() => setShowInterestForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {/* RIVAL INTERESADO */}
      {match.status === 'rival_interesado' && (
        <div className="rival-info">
          <p style={{ margin: '8px 0 0' }}>👤 Organizador: <strong>{match.organizerName}</strong></p>
          {match.rivalName && <p>🤝 Rival: <strong>{match.rivalName}</strong></p>}
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 4px' }}>🔒 Los contactos están ocultos. Verificá tu identidad para verlos.</p>

          {/* CONTACTOS REVELADOS */}
          {revealedData && (
            <div className="revealed-contacts">
              <div className="form-section-label">Contactos verificados</div>
              <p>📱 Organizador: <strong>{revealedData.organizerContact}</strong></p>
              {revealedData.rivalContact && <p>📱 Rival: <strong>{revealedData.rivalContact}</strong></p>}
            </div>
          )}

          {/* BOTONES */}
          {!revealedData && !showVerify && !showRevert && (
            <div className="top-actions" style={{ justifyContent: 'flex-start', marginTop: 10 }}>
              <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowVerify(true)}>🔓 Ver contactos</button>
              <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => setShowRevert(true)}>↩ Deshacer</button>
            </div>
          )}

          {revealedData && !showRevert && (
            <button className="btn btn-secondary" style={{ fontSize: 13, marginTop: 10 }} onClick={() => setShowRevert(true)}>↩ Deshacer / rechazar rival</button>
          )}

          {/* FORM VERIFICAR */}
          {showVerify && (
            <form className="join-form" onSubmit={handleVerify} style={{ marginTop: 10 }}>
              <label>Tu mail o WhatsApp<input type="text" placeholder="El que usaste al publicar o responder" required value={verifyContact} onChange={e => { setVerifyContact(e.target.value); setError('') }} /></label>
              {error && <p style={{ color: '#be123c', fontSize: 13, margin: 0 }}>⚠️ {error}</p>}
              <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ fontSize: 13 }}>{loading ? 'Verificando...' : 'Verificar'}</button>
                <button className="btn btn-secondary" type="button" style={{ fontSize: 13 }} onClick={() => { setShowVerify(false); setError('') }}>Cancelar</button>
              </div>
            </form>
          )}

          {/* FORM DESHACER */}
          {showRevert && (
            <form className="join-form" onSubmit={handleRevert} style={{ marginTop: 10 }}>
              <div className="form-section-label">Verificá para deshacer</div>
              <label>Tu mail o WhatsApp<input type="text" placeholder="El que usaste al publicar o responder" required value={revertContact} onChange={e => { setRevertContact(e.target.value); setError('') }} /></label>
              {error && <p style={{ color: '#be123c', fontSize: 13, margin: 0 }}>⚠️ {error}</p>}
              <div className="top-actions" style={{ justifyContent: 'flex-start' }}>
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ fontSize: 13 }}>{loading ? 'Verificando...' : 'Confirmar'}</button>
                <button className="btn btn-secondary" type="button" style={{ fontSize: 13 }} onClick={() => { setShowRevert(false); setError('') }}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      )}
    </article>
  )
}
