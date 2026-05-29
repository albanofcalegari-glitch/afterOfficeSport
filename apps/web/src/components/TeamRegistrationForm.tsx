import { useState, useEffect } from 'react'
import type { Sport, Mode, Availability } from '../types'
import { footballCategoryOptions, padelCategoryOptions, availabilityOptions } from '../data/options'
import { teamsApi } from '../api/client'

export interface FormPreset {
  sport: Sport
  mode: Mode
  category: string
}

interface Props {
  onSaved: () => void
  preset?: FormPreset | null
}

export default function TeamRegistrationForm({ onSaved, preset }: Props) {
  const [teamName, setTeamName] = useState('')
  const [sport, setSport] = useState<Sport>('futbol')
  const [mode, setMode] = useState<Mode>('masculino')
  const [category, setCategory] = useState('Fútbol 5')
  const [area, setArea] = useState('')
  const [membersCount, setMembersCount] = useState('')
  const [repName, setRepName] = useState('')
  const [repContact, setRepContact] = useState('')
  const [repArea, setRepArea] = useState('')
  const [availability, setAvailability] = useState<Availability[]>([])
  const [comments, setComments] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    if (preset) {
      setSport(preset.sport)
      setMode(preset.mode)
      setCategory(preset.category)
      setHighlight(true)
      setTimeout(() => setHighlight(false), 2000)
    }
  }, [preset])

  const categoryOptions = sport === 'futbol' ? footballCategoryOptions : padelCategoryOptions

  function handleSportChange(s: Sport) {
    setSport(s)
    setCategory(s === 'futbol' ? 'Fútbol 5' : 'Pádel inicial')
  }

  function toggleAvailability(a: Availability) {
    setAvailability(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await teamsApi.create({
        teamName: teamName.trim(),
        sport,
        mode,
        category,
        area: area.trim() || undefined,
        membersCount: parseInt(membersCount) || 1,
        representativeName: repName.trim(),
        representativeContact: repContact.trim(),
        representativeArea: repArea.trim() || undefined,
        availability,
        comments: comments.trim() || undefined,
      })
      onSaved()
      setSuccess(true)
      setTeamName(''); setSport('futbol'); setMode('masculino'); setCategory('Fútbol 5')
      setArea(''); setMembersCount(''); setRepName(''); setRepContact(''); setRepArea('')
      setAvailability([]); setComments('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`form-card${highlight ? ' form-card-highlight' : ''}`}>
      <div className="form-badge green">🏆 Para torneos</div>
      <h3>Inscribir equipo</h3>
      {success && <div className="success-msg">✅ ¡Equipo inscripto con éxito!</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-section-label">Datos del equipo</div>
        <label>
          Nombre del equipo
          <input type="text" placeholder="Ej: Los Cracks de Finanzas" required value={teamName} onChange={e => setTeamName(e.target.value)} />
        </label>
        <div className="two-cols">
          <label>
            Deporte
            <select value={sport} onChange={e => handleSportChange(e.target.value as Sport)}>
              <option value="futbol">Fútbol</option>
              <option value="padel">Pádel</option>
            </select>
          </label>
          <label>
            Modalidad
            <select value={mode} onChange={e => setMode(e.target.value as Mode)}>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="mixto">Mixto</option>
            </select>
          </label>
        </div>
        <div className="two-cols">
          <label>
            Categoría
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categoryOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </label>
          <label>
            Área / sector principal
            <input type="text" placeholder="Ej: Sistemas, Marketing" value={area} onChange={e => setArea(e.target.value)} />
          </label>
        </div>
        <label>
          Cantidad estimada de integrantes
          <input type="number" placeholder="Ej: 7" min="1" max="30" value={membersCount} onChange={e => setMembersCount(e.target.value)} />
        </label>

        <div className="form-section-label">Representante / capitán</div>
        <label>
          Nombre y apellido
          <input type="text" placeholder="Ej: Juan Pérez" required value={repName} onChange={e => setRepName(e.target.value)} />
        </label>
        <div className="two-cols">
          <label>
            Contacto
            <input type="text" placeholder="Mail o WhatsApp" required value={repContact} onChange={e => setRepContact(e.target.value)} />
          </label>
          <label>
            Área / sector
            <input type="text" placeholder="Ej: Finanzas" value={repArea} onChange={e => setRepArea(e.target.value)} />
          </label>
        </div>

        <div className="form-section-label">Disponibilidad</div>
        <div className="availability-grid">
          {availabilityOptions.map(opt => (
            <button key={opt.value} type="button"
              className={`availability-chip${availability.includes(opt.value) ? ' active' : ''}`}
              onClick={() => toggleAvailability(opt.value)}>{opt.label}</button>
          ))}
        </div>

        <label>
          Comentarios (opcional)
          <textarea placeholder="Preferencias, restricciones, etc." value={comments} onChange={e => setComments(e.target.value)} />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Inscribiendo...' : 'Inscribir equipo'}
        </button>
      </form>
    </div>
  )
}
