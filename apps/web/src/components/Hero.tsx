import { useState } from 'react'
import type { FriendlyMatch } from '../types'
import { getSportIcon, displayMode, statusLabels } from '../data/options'
import { matchesApi } from '../api/client'

interface HeroProps {
  latestMatch?: FriendlyMatch
  onInterest: (id: string, data: { rivalName: string; rivalContact: string; rivalMessage?: string }) => Promise<void>
  onRevert: (id: string, verificationContact: string) => Promise<void>
}

export default function Hero({ latestMatch, onInterest, onRevert }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-card">
        <div className="eyebrow">🏆 Torneos y amistosos internos</div>
        <h1>De la oficina a la cancha.</h1>
        <p>
          Inscribí a tu equipo en un torneo de fútbol o pádel,
          o publicá un partido amistoso para buscar rival.
        </p>
        <div className="hero-actions">
          <a href="#inscripcion-torneo" className="btn btn-primary">🏆 Inscribir equipo</a>
          <a href="#publicar-amistoso" className="btn btn-orange">🤝 Publicar amistoso</a>
          <a href="#canchas-abiertas" className="btn btn-secondary">🎾 Canchas abiertas</a>
        </div>
        <div className="stats">
          <div className="stat"><strong>6</strong><span>Modalidades</span></div>
          <div className="stat"><strong>4</strong><span>Formatos fútbol</span></div>
          <div className="stat"><strong>∞</strong><span>Amistosos posibles</span></div>
        </div>
      </div>
      <aside className="side-card">
        {latestMatch ? (
          <FeaturedMatch match={latestMatch} onInterest={onInterest} onRevert={onRevert} />
        ) : (
          <div>
            <div className="mini-title">Solicitud destacada</div>
            <div className="match-card">
              <span className="pill">Sin solicitudes</span>
              <h3>Todavía no hay amistosos</h3>
              <p>Publicá el primero y buscá rival.</p>
            </div>
          </div>
        )}
        <div>
          <div className="mini-title">Idea de tono</div>
          <h3 style={{ fontSize: 30, lineHeight: 1.1, marginBottom: 6 }}>
            Cero corporativo. Más club, menos intranet.
          </h3>
          <p>Una estética simple, cálida y social para incentivar participación.</p>
        </div>
      </aside>
    </section>
  )
}

function FeaturedMatch({ match, onInterest, onRevert }: {
  match: FriendlyMatch
  onInterest: HeroProps['onInterest']
  onRevert: HeroProps['onRevert']
}) {
  const [showForm, setShowForm] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [showRevert, setShowRevert] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [verifyContact, setVerifyContact] = useState('')
  const [revertContact, setRevertContact] = useState('')
  const [revealedData, setRevealedData] = useState<{ organizerContact: string; rivalContact: string | null } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isBuscando = match.status === 'buscando_rival'
  const isInteresado = match.status === 'rival_interesado'

  const btnStyle = { fontSize: 13, background: 'rgba(255,255,255,.15)', color: 'white', borderColor: 'rgba(255,255,255,.25)' }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onInterest(match.id, { rivalName: name.trim(), rivalContact: contact.trim(), rivalMessage: message.trim() || undefined })
      setShowForm(false); setName(''); setContact(''); setMessage('')
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const result = await matchesApi.verify(match.id, verifyContact.trim())
      setRevealedData(result); setShowVerify(false)
    } catch (err: any) { setError(err.message || 'Contacto no válido') }
    finally { setLoading(false) }
  }

  async function handleRevert(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await onRevert(match.id, revertContact.trim())
      setShowRevert(false); setRevertContact(''); setRevealedData(null)
    } catch (err: any) { setError(err.message || 'No se pudo verificar') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="mini-title">Solicitud destacada</div>
      <div className="match-card">
        <span className={`pill ${isBuscando ? 'orange' : ''}`}>
          {statusLabels[match.status] || match.status}
        </span>
        <h3>{getSportIcon(match.sport)} {match.category} {displayMode(match.mode)} — {match.date} {match.time}</h3>
        <p>{match.organizerName} — {match.message}</p>

        {/* BUSCANDO RIVAL */}
        {isBuscando && !showForm && (
          <button className="btn btn-secondary" style={{ marginTop: 12, ...btnStyle }} onClick={() => setShowForm(true)}>
            Me interesa ser rival
          </button>
        )}

        {isBuscando && showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            <input className="hero-input" type="text" placeholder="Tu nombre o equipo" required value={name} onChange={e => setName(e.target.value)} />
            <input className="hero-input" type="text" placeholder="Tu mail o WhatsApp" required value={contact} onChange={e => setContact(e.target.value)} />
            <input className="hero-input" type="text" placeholder="Mensaje (opcional)" value={message} onChange={e => setMessage(e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontSize: 13 }}>{loading ? 'Enviando...' : 'Confirmar'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)} style={btnStyle}>Cancelar</button>
            </div>
          </form>
        )}

        {/* RIVAL INTERESADO */}
        {isInteresado && (
          <div style={{ marginTop: 12 }}>
            <p style={{ margin: 0 }}>👤 Organizador: {match.organizerName}</p>
            {match.rivalName && <p style={{ margin: '4px 0 0' }}>🤝 Rival: {match.rivalName}</p>}
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', margin: '8px 0 0' }}>🔒 Contactos ocultos. Verificá tu identidad para verlos.</p>

            {revealedData && (
              <div style={{ background: 'rgba(34,160,107,.15)', borderRadius: 12, padding: 12, marginTop: 8 }}>
                <p style={{ margin: 0, fontSize: 14 }}>📱 Organizador: <strong>{revealedData.organizerContact}</strong></p>
                {revealedData.rivalContact && <p style={{ margin: '4px 0 0', fontSize: 14 }}>📱 Rival: <strong>{revealedData.rivalContact}</strong></p>}
              </div>
            )}

            {!revealedData && !showVerify && !showRevert && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowVerify(true)}>🔓 Ver contactos</button>
                <button className="btn btn-secondary" style={btnStyle} onClick={() => setShowRevert(true)}>↩ Deshacer</button>
              </div>
            )}

            {revealedData && !showRevert && (
              <button className="btn btn-secondary" style={{ ...btnStyle, marginTop: 8 }} onClick={() => setShowRevert(true)}>↩ Deshacer / rechazar</button>
            )}

            {showVerify && (
              <form onSubmit={handleVerify} style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', margin: 0 }}>Ingresá tu contacto para verificar</p>
                <input className="hero-input" type="text" placeholder="Tu mail o WhatsApp" required value={verifyContact} onChange={e => { setVerifyContact(e.target.value); setError('') }} />
                {error && <p style={{ color: '#fca5a5', fontSize: 13, margin: 0 }}>⚠️ {error}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontSize: 13 }}>{loading ? 'Verificando...' : 'Verificar'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowVerify(false); setError('') }} style={btnStyle}>Cancelar</button>
                </div>
              </form>
            )}

            {showRevert && (
              <form onSubmit={handleRevert} style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', margin: 0 }}>Ingresá tu contacto para deshacer</p>
                <input className="hero-input" type="text" placeholder="Tu mail o WhatsApp" required value={revertContact} onChange={e => { setRevertContact(e.target.value); setError('') }} />
                {error && <p style={{ color: '#fca5a5', fontSize: 13, margin: 0 }}>⚠️ {error}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontSize: 13 }}>{loading ? 'Verificando...' : 'Confirmar'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowRevert(false); setError('') }} style={btnStyle}>Cancelar</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
