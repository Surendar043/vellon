import { testimonial } from '../data/site'

export function Testimonial() {
  return (
    <section className="section section--tight" aria-label="What a customer says">
      <div className="container container--narrow">
        <figure className="quote">
          <blockquote className="quote__text">“{testimonial.quote}”</blockquote>
          <figcaption className="quote__author">
            <span className="quote__avatar" aria-hidden="true">
              {testimonial.initials}
            </span>
            <span>
              <span className="quote__name">{testimonial.name}</span>
              <br />
              <span className="quote__role">{testimonial.role}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
