import { Link, useNavigate, useParams } from 'react-router-dom'
import { HOTSPOTS as spots, AERIAL } from './data'
import './genplan.css'

// fade the current page out, then navigate (the next page fades in via CSS)
function useFadeNav() {
  const go = useNavigate()
  return (to) => {
    const root = document.querySelector('.gp')
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!root || reduce) return go(to)
    root.classList.add('gp-leaving')
    setTimeout(() => go(to), 300)
  }
}

function FadeLink({ to, children, ...rest }) {
  const fade = useFadeNav()
  return (
    <Link to={to} {...rest} onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      fade(to)
    }}>{children}</Link>
  )
}

export function GenPlanHome() {
  const fade = useFadeNav()
  return (
    <div className="gp gp-home">
      <div className="gp-imgbox">
        <img className="gp-bg" src={AERIAL} alt="Master plan aerial view" />
        {spots.map((s, i) => (
          <button key={s.slug} className="gp-dot" style={{ left: `${s.x}%`, top: `${s.y}%`, '--d': `${i * 0.25}s` }}
                  onClick={() => fade(`/genplan/${s.slug}`)} aria-label={s.title}>
            <span className="gp-pulse" /><span className="gp-core" />
            <span className="gp-label">{s.title}</span>
          </button>
        ))}
      </div>
      <div className="gp-shade" />
      <header className="gp-head">
        <FadeLink to="/" className="gp-back-site">← ARRK Studio</FadeLink>
        <span className="gp-brand">XYZ <i>Residences</i></span>
        <span className="gp-hint">Tap a point to explore</span>
      </header>
      <nav className="gp-dock">
        {spots.map(s => <FadeLink key={s.slug} to={`/genplan/${s.slug}`}>{s.title}</FadeLink>)}
      </nav>
    </div>
  )
}

export function GenPlanPlace() {
  const { slug } = useParams()
  const i = spots.findIndex(s => s.slug === slug)
  const s = spots[i]
  if (!s) return <div className="gp gp-page"><FadeLink className="gp-back" to="/genplan">← Master plan</FadeLink></div>
  const next = spots[(i + 1) % spots.length]

  return (
    <div className="gp gp-page" key={slug}>
      <section className="gp-stage">
        <FadeLink className="gp-back" to="/genplan">← Master plan</FadeLink>
        {s.video ? (
          <>
            <video className="gp-blur" key={s.video + 'b'} src={s.video} autoPlay muted loop playsInline />
            <video className="gp-main" key={s.video} src={s.video} autoPlay loop controls playsInline />
          </>
        ) : (
          <>
            <img className="gp-blur" src={AERIAL} alt="" />
            <div className="gp-soon">Video coming soon</div>
          </>
        )}
      </section>

      <aside className="gp-side">
        <span className="gp-brand sm">XYZ <i>Residences</i></span>
        <div className="gp-box">
          <small>{s.tag}</small>
          <h1>{s.title}</h1>
          <p>{s.blurb}</p>
        </div>
        <div className="gp-box gp-list">
          <small>Explore more</small>
          {spots.map(o => (
            <FadeLink key={o.slug} to={`/genplan/${o.slug}`} className={o.slug === slug ? 'on' : ''}>
              <span>{o.title}</span><em>{o.tag}</em>
            </FadeLink>
          ))}
        </div>
        <FadeLink className="gp-cta" to={`/genplan/${next.slug}`}>Next: {next.title} →</FadeLink>
      </aside>
    </div>
  )
}