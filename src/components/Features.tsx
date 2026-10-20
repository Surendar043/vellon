import { features } from '../data/site'
import { CodeIcon, ContrastIcon, LinkIcon, MoonIcon, PaletteIcon, ShapesIcon } from './Icons'

const ICONS = {
  palette: PaletteIcon,
  contrast: ContrastIcon,
  code: CodeIcon,
  figma: ShapesIcon,
  alias: LinkIcon,
  moon: MoonIcon,
} as const

export function Features() {
  return (
    <section className="section" id="features" aria-labelledby="features-heading">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Features</span>
          <h2 className="section__title" id="features-heading">
            Everything between a hex code and a shipped interface
          </h2>
          <p className="section__lead">
            Vellum does the unglamorous work that usually gets skipped: generating the scale,
            checking the contrast, and keeping every platform on the same numbers.
          </p>
        </div>

        <div className="grid grid--3">
          {features.map((feature) => {
            const Icon = ICONS[feature.icon]
            return (
              <article key={feature.title} className="feature">
                <span className="icon-box">
                  <Icon size={19} />
                </span>
                <h3 className="feature__title">{feature.title}</h3>
                <p className="feature__body">{feature.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
