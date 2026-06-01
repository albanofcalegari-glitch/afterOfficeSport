import { useState, useEffect, useCallback } from 'react'
import type { Sport, Mode, FriendlyMatch, RegisteredTeam } from './types'
import Header from './components/Header'
import Hero from './components/Hero'
import ActionSelector from './components/ActionSelector'
import SportTabs from './components/SportTabs'
import CategoryGrid from './components/CategoryGrid'
import TeamRegistrationForm from './components/TeamRegistrationForm'
import type { FormPreset } from './components/TeamRegistrationForm'
import RegisteredTeamsList from './components/RegisteredTeamsList'
import FriendlyMatchForm from './components/FriendlyMatchForm'
import FriendlyMatchList from './components/FriendlyMatchList'
import OpenCourtList from './components/OpenCourtList'
import KartingSection from './components/KartingSection'
import RecruitingSection from './components/RecruitingSection'
import Footer from './components/Footer'
import { teamsApi, matchesApi } from './api/client'

export default function App() {
  const [activeSport, setActiveSport] = useState<Sport>('futbol')
  const [activeMode, setActiveMode] = useState('masculino')
  const [teams, setTeams] = useState<RegisteredTeam[]>([])
  const [matches, setMatches] = useState<FriendlyMatch[]>([])
  const [formPreset, setFormPreset] = useState<FormPreset | null>(null)

  const refreshTeams = useCallback(() => {
    teamsApi.list().then(setTeams).catch(console.error)
  }, [])

  const refreshMatches = useCallback(() => {
    matchesApi.list().then(setMatches).catch(console.error)
  }, [])

  useEffect(() => { refreshTeams() }, [refreshTeams])
  useEffect(() => { refreshMatches() }, [refreshMatches])

  async function handleInterest(id: string, data: { rivalName: string; rivalContact: string; rivalMessage?: string }) {
    await matchesApi.updateStatus(id, { status: 'rival_interesado', ...data })
    refreshMatches()
  }

  async function handleRevert(id: string, verificationContact: string) {
    await matchesApi.updateStatus(id, { status: 'buscando_rival', verificationContact })
    refreshMatches()
  }

  async function handleDeleteMatch(id: string, contact: string) {
    await matchesApi.delete(id, contact)
    refreshMatches()
  }

  async function handleCreateCourt(data: import('./api/client').CreateMatchDto) {
    await matchesApi.create(data)
    refreshMatches()
  }

  async function handleJoinCourt(matchId: string, data: { name: string; contact: string; comment?: string }) {
    try {
      await matchesApi.addParticipant(matchId, data)
      refreshMatches()
    } catch (e) { console.error(e) }
  }

  function handleSelectCategory(sport: Sport, mode: string, category: string) {
    setFormPreset({ sport, mode: mode as Mode, category })
    setTimeout(() => {
      document.getElementById('inscripcion-torneo')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const featuredMatch = matches.find(m => m.matchType !== 'open_court' && m.matchType !== 'recruiting' && m.sport !== 'karting' && m.status !== 'cancelado')
  const regularMatches = matches.filter(m => m.matchType !== 'open_court' && m.matchType !== 'recruiting' && m.sport !== 'karting')
  const recruitingMatches = matches.filter(m => m.matchType === 'recruiting')
  const openCourtMatches = matches.filter(m => m.matchType === 'open_court' && m.sport !== 'karting')
  const kartingMatches = matches.filter(m => m.sport === 'karting')

  return (
    <>
      <Header />
      <main>
        <Hero latestMatch={featuredMatch} onInterest={handleInterest} onRevert={handleRevert} />
        <ActionSelector />

        <section id="torneos">
          <div className="section-head">
            <div>
              <h2>Elegí dónde querés jugar</h2>
              <p>Menú principal por deporte y modalidad. Tocá una categoría para inscribir tu equipo.</p>
            </div>
          </div>
          <SportTabs
            activeSport={activeSport}
            activeMode={activeMode}
            onSelect={(sport, mode) => { setActiveSport(sport); setActiveMode(mode) }}
          />
          <CategoryGrid sport={activeSport} mode={activeMode} onSelectCategory={handleSelectCategory} />
        </section>

        <hr className="section-divider" />

        <section id="inscripcion-torneo">
          <div className="section-head">
            <div>
              <h2>🏆 Inscripción de equipo</h2>
              <p>Para torneos, la inscripción la hace un representante por equipo. Después se organizan categorías, fixture y cruces.</p>
            </div>
          </div>
          <TeamRegistrationForm onSaved={refreshTeams} preset={formPreset} />
        </section>

        <section id="equipos">
          <div className="section-head">
            <div>
              <h2>Equipos inscriptos</h2>
              <p>Equipos registrados para los torneos. Filtrá por deporte, modalidad o categoría.</p>
            </div>
          </div>
          <RegisteredTeamsList teams={teams} />
        </section>

        <hr className="section-divider" />

        <section id="publicar-amistoso">
          <div className="section-head">
            <div>
              <h2>🤝 Publicar partido amistoso</h2>
              <p>Usá este formulario para coordinar un partido puntual y buscar rival. Puede ser persona, dupla o equipo.</p>
            </div>
          </div>
          <FriendlyMatchForm onSaved={refreshMatches} />
        </section>

        <section id="amistosos">
          <div className="section-head">
            <div>
              <h2>Amistosos abiertos</h2>
              <p>Solicitudes esperando confirmación de un rival.</p>
            </div>
          </div>
          <FriendlyMatchList matches={regularMatches} onInterest={handleInterest} onRevert={handleRevert} onDelete={handleDeleteMatch} />
        </section>

        <hr className="section-divider" />

        <section id="armar-equipo">
          <div className="section-head">
            <div>
              <h2>🙋 Armar equipo</h2>
              <p>Tenés partido pero te faltan jugadores. Sumate al equipo de alguien o publicá tu búsqueda.</p>
            </div>
          </div>
          <RecruitingSection matches={recruitingMatches} onCreated={refreshMatches} onJoin={handleJoinCourt} onDelete={handleDeleteMatch} />
        </section>

        <hr className="section-divider" />

        <section id="canchas-abiertas">
          <div className="section-head">
            <div>
              <h2>🎾 Canchas abiertas</h2>
              <p>Canchas de pádel buscando jugadores sueltos. Sumate.</p>
            </div>
          </div>
          <OpenCourtList matches={openCourtMatches} onJoin={handleJoinCourt} onCreateCourt={handleCreateCourt} />
        </section>

        <hr className="section-divider" />

        <section id="karting">
          <div className="section-head">
            <div>
              <h2>🏎️ Carreras de Karting</h2>
              <p>Carreras abiertas entre compañeros de trabajo. Cupo máximo 20 pilotos. Sumate a una o armá la tuya.</p>
            </div>
          </div>
          <KartingSection matches={kartingMatches} onCreated={refreshMatches} onJoin={handleJoinCourt} onDelete={handleDeleteMatch} />
        </section>

        <Footer />
      </main>
    </>
  )
}
