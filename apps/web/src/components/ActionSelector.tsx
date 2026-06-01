export default function ActionSelector() {
  return (
    <section>
      <div className="section-head">
        <div>
          <h2>¿Qué querés hacer?</h2>
          <p>Elegí una opción para arrancar.</p>
        </div>
      </div>
      <div className="action-selector four-cols">
        <div className="action-card green">
          <span className="action-icon">🏆</span>
          <h3>Inscribir equipo a torneo</h3>
          <p>Cargá los datos de tu equipo y de la persona que lo representa.</p>
          <a href="#inscripcion-torneo" className="btn btn-primary">Inscribir equipo</a>
        </div>
        <div className="action-card orange">
          <span className="action-icon">🤝</span>
          <h3>Publicar amistoso</h3>
          <p>Buscá rival para un partido puntual de fútbol, pádel o tenis.</p>
          <a href="#publicar-amistoso" className="btn btn-orange">Publicar amistoso</a>
        </div>
        <div className="action-card blue">
          <span className="action-icon">🎾</span>
          <h3>Abrir cancha de pádel</h3>
          <p>Publicá una cancha abierta y juntá entre 6 y 8 jugadores.</p>
          <a href="#canchas-abiertas" className="btn btn-blue">Crear cancha abierta</a>
        </div>
        <div className="action-card dark">
          <span className="action-icon">🏎️</span>
          <h3>Armar carrera de karting</h3>
          <p>Organizá una carrera entre compañeros. Cupo máximo 20 pilotos.</p>
          <a href="#karting" className="btn btn-dark">Crear carrera</a>
        </div>
      </div>
    </section>
  )
}
