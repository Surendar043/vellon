import { logos } from '../data/site'

export function LogoStrip() {
  return (
    <section className="section section--tight" aria-label="Teams using Vellum">
      <div className="container">
        <p
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-5)',
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            color: 'var(--text-dim)',
          }}
        >
          Trusted by product teams at
        </p>
        <div className="logos">
          {logos.map((logo) => (
            <span key={logo} className="logos__item">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
