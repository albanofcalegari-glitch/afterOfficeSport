function BrandLogo() {
  return (
    <div className="logo">
      <svg viewBox="0 0 48 48" width="66" height="66" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Padel racket */}
        <g className="logo-racket" style={{ transformOrigin: '20px 26px' }}>
          <g transform="rotate(-30 20 26)">
            <rect x="17" y="28" width="3.5" height="10" rx="1.5" fill="#2374ab" />
            <ellipse cx="18.75" cy="22" rx="7.5" ry="9.5" fill="#2374ab" />
            <ellipse cx="18.75" cy="22" rx="5.5" ry="7.5" fill="#17211d" />
            <circle cx="16.5" cy="19" r=".9" fill="#2374ab" opacity=".7" />
            <circle cx="18.75" cy="19" r=".9" fill="#2374ab" opacity=".7" />
            <circle cx="21" cy="19" r=".9" fill="#2374ab" opacity=".7" />
            <circle cx="16.5" cy="21.5" r=".9" fill="#2374ab" opacity=".7" />
            <circle cx="18.75" cy="21.5" r=".9" fill="#2374ab" opacity=".7" />
            <circle cx="21" cy="21.5" r=".9" fill="#2374ab" opacity=".7" />
            <circle cx="16.5" cy="24" r=".9" fill="#2374ab" opacity=".7" />
            <circle cx="18.75" cy="24" r=".9" fill="#2374ab" opacity=".7" />
            <circle cx="21" cy="24" r=".9" fill="#2374ab" opacity=".7" />
          </g>
        </g>
        {/* Soccer ball */}
        <g className="logo-soccer" style={{ transformOrigin: '14px 34px' }}>
          <circle cx="14" cy="34" r="6.5" fill="#22a06b" />
          <path d="M14 27.8l1.8 2.5h-3.6l1.8-2.5z" fill="white" opacity=".4" />
          <path d="M14 40.2l-1.8-2.5h3.6l-1.8 2.5z" fill="white" opacity=".4" />
          <path d="M8 31l2.5 1.8v-3.6L8 31z" fill="white" opacity=".35" />
          <path d="M20 37l-2.5-1.8v3.6L20 37z" fill="white" opacity=".35" />
        </g>
        {/* Tennis ball */}
        <g className="logo-tennis" style={{ transformOrigin: '35px 14px' }}>
          <circle cx="35" cy="14" r="6" fill="#ff9f1c" />
          <path d="M30.5 10.5c1.8 1.8 2.8 4 2.8 6.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
          <path d="M33.5 10c-.8 2.5-.3 5 1 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
        </g>
        {/* Sparks */}
        <path className="logo-spark1" d="M38 28l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#ff9f1c" opacity=".6" style={{ transformOrigin: '38px 31px' }} />
        <path className="logo-spark2" d="M6 8l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7L4 10.4l1.7-.7z" fill="#22a06b" opacity=".5" style={{ transformOrigin: '6px 10px' }} />
      </svg>
    </div>
  )
}

export default function Header() {
  return (
    <header>
      <div className="brand">
        <BrandLogo />
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
