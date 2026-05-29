export default function Header() {
  return (
    <header>
      <div className="brand">
        <div className="logo">⚽</div>
        <div>After Office Sports</div>
      </div>
      <nav className="top-actions">
        <a href="#torneos" className="btn btn-secondary">Torneos</a>
        <a href="#equipos" className="btn btn-secondary">Equipos inscriptos</a>
        <a href="#amistosos" className="btn btn-secondary">Amistosos</a>
        <a href="#canchas-abiertas" className="btn btn-secondary">Canchas abiertas</a>
        <a href="#inscripcion-torneo" className="btn btn-primary">Inscribir equipo</a>
      </nav>
    </header>
  )
}
