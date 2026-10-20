import { cta } from '../data/site'
import { ArrowRightIcon } from './Icons'

export function Cta() {
  return (
    <section className="section section--tight" aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta">
          <div className="cta__inner">
            <span className="eyebrow">Get started</span>
            <h2 className="cta__title" id="cta-heading">
              {cta.title}
            </h2>
            <p className="cta__lead">{cta.lead}</p>
            <div className="hero__actions" style={{ justifyContent: 'center' }}>
              <a className="btn btn--primary btn--lg" href={cta.primary.href}>
                {cta.primary.label}
                <ArrowRightIcon size={17} />
              </a>
              <a className="btn btn--outline btn--lg" href={cta.secondary.href}>
                {cta.secondary.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
