import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { HOTSPOTS as spots, AERIAL } from './data'
import './genplan.css'

const PHASES = ['Site & Groundwork', 'Landscaping', 'Structures', 'Lighting & Finishing']
const PHASE_AT = [0, 2600, 5000, 8200] // ms, must match genplan.css delays
const DONE_AT = 11000

export function GenPlanHome() {
  const go = useNavigate()
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [run, setRun] = useState(0)          // bump to replay
  const [done, setDone] = useState(reduce)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (done) return
    setPhase(0)
    const t = [
      ...PHASE_AT.map((ms, i) => setTimeout(() => setPhase(i), ms)),
      setTimeout(() => setDone(true), DONE_AT),
    ]
    return () => t.forEach(clearTimeout)
  }, [run, done])

  const replay = () => { setPhase(0); setDone(false); setRun(r => r + 1) }

  return (
    <div className="gp gp-home">
      {/* SVG filters used to isolate greenery and lights from the render */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="gp-green" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -2.4 4.8 -2.4 0 -0.15" />
        </filter>
        <filter id="gp-glow" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1.6 0 0 0 0  0 1.35 0 0 0  0 0 1 0 0  5 0 -5 0 -2.3" result="lit" />
          <feGaussianBlur in="lit" stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="lit" /></feMerge>
        </filter>
      </svg>

      <div key={run} className={`gp-imgbox ${done ? 'gp-done' : 'gp-building'}`}>
        <img className="gp-l gp-l-site" src={AERIAL} alt="" />
        <div className="gp-l gp-l-grid" />
        <div className="gp-l gp-scan" />
        <img className="gp-l gp-l-green" src={AERIAL} alt="" />
        <img className="gp-l gp-l-struct" src={AERIAL} alt="" />
        <img className="gp-l gp-l-base" src={AERIAL} alt="Master plan aerial view" />
        <img className="gp-l gp-l-glow" src={AERIAL} alt="" />
        <div className="gp-l gp-l-warm" />

        {done && spots.map((s, i) => (
          <button key={s.slug} className="gp-dot gp-pop" style={{ left: `${s.x}%`, top: `${s.y}%`, '--d': `${i * 0.25}s` }}
                  onClick={() => go(`/genplan/${s.slug}`)} aria-label={s.title}>
            <span className="gp-pulse" /><span className="gp-core" />
            <span className="gp-label">{s.title}</span>
          </button>
        ))}
      </div>
      <div className="gp-shade" />

      <header className="gp-head">
        <Link to="/" className="gp-back-site">← ARRK Studio</Link>
        <span className="gp-brand">XYZ <i>Residences</i></span>
        {done
          ? <span className="gp-hint">Tap a point to explore</span>
          : <button className="gp-hint gp-skip" onClick={() => setDone(true)}>Skip ▸</button>}
      </header>

      {!done && (
        <div className="gp-hud" key={'h' + run}>
          <div className="gp-hud-title"><b>{String(phase + 1).padStart(2, '0')}</b> {PHASES[phase]}</div>
          <div className="gp-steps">
            {PHASES.map((p, i) => <i key={p} className={i < phase ? 'ok' : i === phase ? 'now' : ''} />)}
          </div>
        </div>
      )}

      {done && (
        <nav className="gp-dock gp-fadein">
          {spots.map(s => <Link key={s.slug} to={`/genplan/${s.slug}`}>{s.title}</Link>)}
          <button onClick={replay} title="Replay construction">↻ Replay</button>
        </nav>
      )}
    </div>
  )
}

export function GenPlanPlace() {
  const { slug } = useParams()
  const i = spots.findIndex(s => s.slug === slug)
  const s = spots[i]
  if (!s) return <div className="gp gp-page"><Link className="gp-back" to="/genplan">← Master plan</Link></div>
  const next = spots[(i + 1) % spots.length]

  return (
    <div className="gp gp-page">
      <section className="gp-stage">
        <Link className="gp-back" to="/genplan">← Master plan</Link>
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
            <Link key={o.slug} to={`/genplan/${o.slug}`} className={o.slug === slug ? 'on' : ''}>
              <span>{o.title}</span><em>{o.tag}</em>
            </Link>
          ))}
        </div>
        <Link className="gp-cta" to={`/genplan/${next.slug}`}>Next: {next.title} →</Link>
      </aside>
    </div>
  )
}