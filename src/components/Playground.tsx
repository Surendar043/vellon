import { useMemo, useState } from 'react'

import { playground } from '../data/site'
import { hexToRgb, normaliseHex } from '../lib/color'
import { checkContrast, formatRatio } from '../lib/contrast'
import { generatePalette, paletteToCss } from '../lib/palette'
import { CheckIcon, CopyIcon } from './Icons'

const PRESETS = ['#7c5cff', '#0ea5a4', '#e0457b', '#f59e0b', '#2563eb', '#16a34a', '#111827']

export function Playground() {
  const [colour, setColour] = useState<string>(playground.defaultColour)
  const [draft, setDraft] = useState<string>(playground.defaultColour)
  const [surfaceId, setSurfaceId] = useState<string>(playground.surfaces[0].id)
  const [copied, setCopied] = useState(false)

  const palette = useMemo(() => generatePalette(colour, playground.tokenName), [colour])
  const css = useMemo(() => paletteToCss(palette, playground.tokenName), [palette])

  const surface =
    playground.surfaces.find((entry) => entry.id === surfaceId) ?? playground.surfaces[0]
  const verdict = checkContrast(colour, surface.hex)

  const draftIsValid = hexToRgb(draft) !== null

  const handleDraftChange = (value: string) => {
    setDraft(value)
    if (hexToRgb(value)) setColour(normaliseHex(value))
  }

  const handleCopy = async () => {
    const copiedSuccessfully = (await window.vellumCopy?.(css)) ?? false
    setCopied(copiedSuccessfully)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="section" id="playground" aria-labelledby="playground-heading">
      <div className="container">
        <div className="section__head section__head--center">
          <span className="eyebrow">{playground.eyebrow}</span>
          <h2 className="section__title" id="playground-heading">
            {playground.title}
          </h2>
          <p className="section__lead">{playground.lead}</p>
        </div>

        <div className="playground">
          <div className="playground__controls">
            <div className="field">
              <label className="field__label" htmlFor="playground-colour">
                Base colour
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <input
                  type="color"
                  value={colour}
                  onChange={(event) => {
                    setColour(event.target.value.toUpperCase())
                    setDraft(event.target.value.toUpperCase())
                  }}
                  aria-label="Pick a base colour"
                  style={{
                    width: '48px',
                    height: '40px',
                    padding: 0,
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                />
                <input
                  id="playground-colour"
                  className="input"
                  value={draft}
                  onChange={(event) => handleDraftChange(event.target.value)}
                  aria-invalid={!draftIsValid}
                  aria-describedby="playground-colour-hint"
                  spellCheck={false}
                  style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
                />
              </div>
              <p className="field__hint" id="playground-colour-hint">
                {draftIsValid ? 'A valid hex colour.' : 'Enter a hex colour such as #7C5CFF.'}
              </p>
            </div>

            <div className="field">
              <span className="field__label">Presets</span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="palette__chip"
                    style={{ background: preset, width: '32px', height: '32px' }}
                    onClick={() => {
                      setColour(preset.toUpperCase())
                      setDraft(preset.toUpperCase())
                    }}
                    aria-label={`Use ${preset}`}
                    title={preset}
                  />
                ))}
              </div>
            </div>

            <div className="field">
              <span className="field__label">Check against</span>
              <div className="tabs" role="tablist" aria-label="Surface to check contrast against">
                {playground.surfaces.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    role="tab"
                    className="tabs__tab"
                    aria-selected={entry.id === surfaceId}
                    onClick={() => setSurfaceId(entry.id)}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="readout">
              <div className="readout__item">
                <span className="readout__label">Contrast ratio</span>
                <span className="readout__value">{verdict ? formatRatio(verdict.ratio) : '—'}</span>
              </div>
              <div className="readout__item">
                <span className="readout__label">Body text (AA)</span>
                <span className="readout__value">
                  <span
                    className={
                      verdict?.normal === 'FAIL' ? 'badge badge--danger' : 'badge badge--success'
                    }
                  >
                    {verdict?.normal ?? '—'}
                  </span>
                </span>
              </div>
              <div className="readout__item">
                <span className="readout__label">Large text (AA)</span>
                <span className="readout__value">
                  <span
                    className={
                      verdict?.large === 'FAIL' ? 'badge badge--danger' : 'badge badge--success'
                    }
                  >
                    {verdict?.large ?? '—'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="playground__palette">
            <div className="field__label">Generated palette</div>

            <div className="palette">
              {palette.map((entry) => (
                <div key={entry.step} className="palette__step">
                  <div
                    className="palette__chip"
                    style={{ background: entry.hex, color: entry.textColor }}
                    title={`${entry.token} — ${entry.hex}`}
                  />
                  <span className="palette__name">{entry.step}</span>
                  <span className="palette__name">{entry.hex}</span>
                </div>
              ))}
            </div>

            <div className="code">
              <div className="code__bar">
                <span className="code__dot" />
                <span className="code__dot" />
                <span className="code__dot" />
                <span className="code__filename">{playground.tokenName}.css</span>
                <button
                  type="button"
                  className="btn btn--sm"
                  style={{ marginLeft: 'auto' }}
                  onClick={handleCopy}
                >
                  {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="code__pre">
                <code>{css}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
