import { useState } from 'react'

import { code } from '../data/site'

export function CodeShowcase() {
  const [activeId, setActiveId] = useState<string>(code.tabs[0].id)
  const active = code.tabs.find((tab) => tab.id === activeId) ?? code.tabs[0]

  return (
    <section className="section" id="code" aria-labelledby="code-heading">
      <div className="container">
        <div className="section__head section__head--center">
          <span className="eyebrow">{code.eyebrow}</span>
          <h2 className="section__title" id="code-heading">
            {code.title}
          </h2>
          <p className="section__lead">{code.lead}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-5)' }}>
          <div className="tabs" role="tablist" aria-label="Code example">
            {code.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={tab.id === activeId}
                aria-controls={`panel-${tab.id}`}
                className="tabs__tab"
                onClick={() => setActiveId(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="code"
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
        >
          <div className="code__bar">
            <span className="code__dot" />
            <span className="code__dot" />
            <span className="code__dot" />
            <span className="code__filename">{active.filename}</span>
          </div>
          <pre className="code__pre">
            <code>{active.code}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
