import { stats } from '../data/site'
import { Counter } from './Counter'

export function Stats() {
  return (
    <section className="section section--tight" aria-label="Vellum in numbers">
      <div className="container">
        <div className="stats">
          {stats.map((stat) => (
            <div key={stat.label} className="stat">
              <span className="stat__value">
                <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </span>
              <span className="stat__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
