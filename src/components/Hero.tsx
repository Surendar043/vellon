import { useMemo } from 'react'

import { hero, playground } from '../data/site'
import { generatePalette } from '../lib/palette'
import { checkContrast, formatRatio } from '../lib/contrast'
import { ArrowRightIcon, CheckIcon, SparkleIcon, ZapIcon } from './Icons'

const MOCK_STEPS = [100, 200, 300, 500, 700, 900]

export function Hero() {
  const palette = useMemo(() => generatePalette(playground.defaultColour), [])
  const steps = MOCK_STEPS.map(
    (step) => palette.find((entry) => entry.step === step) ?? palette[palette.length - 1],
  )

  const onAccent = checkContrast('#FFFFFF', playground.defaultColour)
  const onTint = checkContrast('#101119', steps[0]?.hex ?? '#ffffff')

  return (
    <section className="hero" id="top">
      <div className="hero__backdrop" aria-hidden="true">
        <span className="hero__orb hero__orb--1" />
        <span className="hero__orb hero__orb--2" />
        <span className="hero__orb hero__orb--3" />
        <span className="hero__grid" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="chip chip--accent">
            <SparkleIcon size={13} />
            {hero.badge}
          </span>

          <h1 className="hero__title">
            One colour in. <span className="gradient-text">A tested design system out.</span>
          </h1>

          <p className="hero__lead">{hero.lead}</p>

          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRightIcon size={17} />
            </a>
            <a className="btn btn--outline btn--lg" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
          </div>

          <p className="hero__note">
            <CheckIcon size={15} />
            {hero.note}
          </p>
        </div>

        <div className="mock" aria-hidden="true">
          <div className="mock__bar">
            <span className="mock__dot" />
            <span className="mock__dot" />
            <span className="mock__dot" />
            <span className="mock__title">vellum — brand palette</span>
          </div>

          <div className="mock__body">
            <div className="mock__label">
              <span>Palette</span>
              <span>10 steps</span>
            </div>

            <div className="mock__swatches">
              {steps.map((entry) => (
                <span key={entry.step} className="mock__swatch" style={{ background: entry.hex }} />
              ))}
            </div>

            <div className="mock__label">
              <span>Contrast</span>
              <span>WCAG 2.2</span>
            </div>

            <div className="mock__rows">
              <div className="mock__row">
                <span className="mock__key">text / vellum-500</span>
                <span className="mock__value">
                  {onAccent ? formatRatio(onAccent.ratio) : '—'}{' '}
                  <span className={onAccent?.normal === 'FAIL' ? 'mock__fail' : 'mock__pass'}>
                    {onAccent?.normal === 'FAIL' ? 'FAIL' : 'AA'}
                  </span>
                </span>
              </div>
              <div className="mock__row">
                <span className="mock__key">text / vellum-100</span>
                <span className="mock__value">
                  {onTint ? formatRatio(onTint.ratio) : '—'}{' '}
                  <span className={onTint?.normal === 'FAIL' ? 'mock__fail' : 'mock__pass'}>
                    {onTint?.normal === 'FAIL' ? 'FAIL' : 'AA'}
                  </span>
                </span>
              </div>
              <div className="mock__row">
                <span className="mock__key">accent / vellum-500</span>
                <span className="mock__value">
                  <ZapIcon size={13} /> ready to ship
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
