import { valueProps } from '../data/site'
import { DownloadIcon, LayersIcon, ShieldIcon } from './Icons'

const ICONS = {
  layers: LayersIcon,
  shield: ShieldIcon,
  download: DownloadIcon,
} as const

export function ValueProps() {
  return (
    <section className="section" aria-labelledby="value-heading">
      <div className="container">
        <div className="section__head section__head--center">
          <span className="eyebrow">Why Vellum</span>
          <h2 className="section__title" id="value-heading">
            Colour that survives contact with production
          </h2>
          <p className="section__lead">
            Design tokens are easy to generate and hard to keep honest. Vellum makes the honest
            version the default one.
          </p>
        </div>

        <div className="grid grid--3">
          {valueProps.map((prop) => {
            const Icon = ICONS[prop.icon]
            return (
              <article key={prop.title} className="card">
                <span className="icon-box">
                  <Icon size={19} />
                </span>
                <h3 className="card__title">{prop.title}</h3>
                <p className="card__body">{prop.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
