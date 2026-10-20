import { pricing } from '../data/site'
import { CheckIcon } from './Icons'

export function Pricing() {
  return (
    <section className="section" id="pricing" aria-labelledby="pricing-heading">
      <div className="container">
        <div className="section__head section__head--center">
          <span className="eyebrow">{pricing.eyebrow}</span>
          <h2 className="section__title" id="pricing-heading">
            {pricing.title}
          </h2>
          <p className="section__lead">{pricing.lead}</p>
        </div>

        <div className="grid grid--3">
          {pricing.plans.map((plan) => (
            <article key={plan.name} className={`price${plan.featured ? ' price--featured' : ''}`}>
              {plan.featured ? <span className="price__tag">Most popular</span> : null}

              <h3 className="price__name">{plan.name}</h3>
              <p className="price__amount">
                {plan.price}
                <span className="price__period">{plan.period}</span>
              </p>
              <p className="card__body">{plan.description}</p>

              <a
                className={`btn ${plan.featured ? 'btn--primary' : 'btn--outline'} btn--block`}
                href="#playground"
              >
                {plan.cta}
              </a>

              <ul className="price__features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon size={15} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
