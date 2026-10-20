import { useState } from 'react'

import { faq } from '../data/site'
import { ChevronDownIcon } from './Icons'

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="section" id="faq" aria-labelledby="faq-heading">
      <div className="container container--narrow">
        <div className="section__head section__head--center">
          <span className="eyebrow">{faq.eyebrow}</span>
          <h2 className="section__title" id="faq-heading">
            {faq.title}
          </h2>
          <p className="section__lead">{faq.lead}</p>
        </div>

        <div className="accordion">
          {faq.items.map((entry, index) => {
            const isOpen = openIndex === index
            return (
              <div key={entry.question} className="accordion__item">
                <h3>
                  <button
                    type="button"
                    className="accordion__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{entry.question}</span>
                    <ChevronDownIcon size={18} className="accordion__chevron" />
                  </button>
                </h3>
                <div
                  className="accordion__panel"
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  hidden={!isOpen}
                >
                  {entry.answer}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
