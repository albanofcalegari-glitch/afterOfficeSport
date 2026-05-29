import { useState } from 'react'
import type { Sport, Mode, MatchType } from '../types'
import { footballCategoryOptions, padelCategoryOptions } from '../data/options'
import { matchesApi } from '../api/client'

interface Props {
  onSaved: () => void
}

export default function FriendlyMatchForm({ onSaved }: Props) {
  const [sport, setSport] = useState<Sport>('futbol')
  const [mode, setMode] = useState<Mode>('masculino')
  const [category, setCategory] = useState('Fútbol 5')
  const [organizerName, setOrganizerName] = useState('')
  const [organizerContact, setOrganizerContact] = useState('')
  const [organizerType, setOrganizerType] = useState<string>('persona')
  const [matchType, setMatchType] = useState<MatchType>('team_vs_team')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')
  const [organizerPlays, setOrganizerPlays] = useState(true)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const categoryOptions = sport === 'futbol' ? footballCategoryOptions : padelCategoryOptions
  const isOpenCourt = sport === 'padel' && matchType === 'open_court'

  function handleSportChange(s: Sport) {
    setSport(s)
    setCategory(s === 'futbol' ? 'Fútbol 5' : 'Pádel inicial')
    if (s === 'futbol') setMatchType('team_vs_team')
    else setMatchType('closed_match')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await matchesApi.create({
        sport,
        mode,
        category,
        organizerName: organizerName.trim(),
        organizerContact: organizerContact.trim(),
        organizerType,
        matchType,
        date: date.trim(),
        time: time.trim(),
        location: location.trim() || undefined,
        message: message.trim() || undefined,
        ...(isOpenCourt ? { minPlayers: 6, maxPlayers: 8, organizerPlays } : {}),
      })
      onSaved()
      setSuccess(true)
      setOrganizerName(''); setOrganizerContact(''); setOrganizerType('persona')
      setSport('futbol'); setMode('masculino'); setCategory('Fútbol 5')
      setMatchType('team_vs_team'); setDate(''); setTime(''); setLocation('')
      setMessage(''); setOrganizerPlays(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card" id="amistoso">
      <div className="form-badge orange">🤝 Para amistosos</div>
      <h3>Publicar partido amistoso</h3>
      {success && <div className="success-msg">✅ ¡Solicitud publicada!</div>}
      <form onSubmit={handleSubmit}>
        <div className="two-cols">
          <label>
            Nombre del organizador
            <input type="text" placeholder="Ej: Juan o Equipo de Marketing" required value={organizerName} onChange={e => setOrganizerName(e.target.value)} />
          </label>
          <label>
            Contacto
            <input type="text" placeholder="Mail o WhatsApp" required value={organizerContact} onChange={e => setOrganizerContact(e.target.value)} />
          </label>
        </div>
        <div className="two-cols">
          <label>
            ¿Quién organiza?
            <select value={organizerType} onChange={e => setOrganizerType(e.target.value)}>
              <option value="persona">Persona</option>
              <option value="dupla">Dupla</option>
              <option value="equipo">Equipo</option>
            </select>
          </label>
          <label>
            Deporte
            <select value={sport} onChange={e => handleSportChange(e.target.value as Sport)}>
              <option value="futbol">Fútbol</option>
              <option value="padel">Pádel</option>
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
            Categoría
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categoryOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </label>
        </div>

        {sport === 'padel' && (
          <label>
            Tipo de amistoso
            <select value={matchType} onChange={e => setMatchType(e.target.value as MatchType)}>
              <option value="closed_match">Partido cerrado</option>
              <option value="open_court">Cancha abierta (6–8 jugadores)</option>
            </select>
          </label>
        )}

        <div className="two-cols">
          <label>
            Día
            <input type="text" placeholder="Ej: Jueves" required value={date} onChange={e => setDate(e.target.value)} />
          </label>
          <label>
            Horario
            <input type="text" placeholder="Ej: 19:30" required value={time} onChange={e => setTime(e.target.value)} />
          </label>
        </div>
        <label>
          Lugar / club / zona
          <input type="text" placeholder="Ej: Club Palermo, zona Norte" value={location} onChange={e => setLocation(e.target.value)} />
        </label>

        {isOpenCourt && (
          <div className="open-court-info">
            <p>📋 Cupo: <strong>6 mínimo / 8 máximo</strong></p>
            <label style={{ flexDirection: 'row', alignItems: 'center', gap: 10, display: 'flex', cursor: 'pointer' }}>
              <input type="checkbox" checked={organizerPlays} onChange={e => setOrganizerPlays(e.target.checked)}
                style={{ width: 'auto', marginRight: 4 }} />
              El organizador juega
            </label>
          </div>
        )}

        <label>
          Mensaje para el rival
          <textarea placeholder="Ej: Buscamos rival para partido tranqui, cancha a confirmar." value={message} onChange={e => setMessage(e.target.value)} />
        </label>
        <button className="btn btn-dark" type="submit" disabled={loading}>
          {loading ? 'Publicando...' : isOpenCourt ? 'Crear cancha abierta' : 'Publicar solicitud'}
        </button>
      </form>
    </div>
  )
}
