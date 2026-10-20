import { describe, expect, it } from 'vitest'

import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl, normaliseHex } from '../src/lib/color'
import {
  AA_LARGE,
  AA_NORMAL,
  AAA_NORMAL,
  checkContrast,
  contrastRatio,
  contrastRatioHex,
  formatRatio,
  gradeContrast,
  readableTextColor,
  relativeLuminance,
} from '../src/lib/contrast'
import { bestStepFor, generatePalette, paletteToCss } from '../src/lib/palette'

describe('colour conversion', () => {
  it('parses six-digit hex values', () => {
    expect(hexToRgb('#7c5cff')).toEqual({ r: 124, g: 92, b: 255 })
  })

  it('expands three-digit hex values', () => {
    expect(hexToRgb('#f0a')).toEqual({ r: 255, g: 0, b: 170 })
  })

  it('accepts a value without the hash', () => {
    expect(hexToRgb('7C5CFF')).toEqual({ r: 124, g: 92, b: 255 })
  })

  it('returns null for anything that is not a hex colour', () => {
    expect(hexToRgb('rebeccapurple')).toBeNull()
    expect(hexToRgb('#12345')).toBeNull()
    expect(hexToRgb('')).toBeNull()
  })

  it('round-trips through RGB and HSL', () => {
    const original = { r: 124, g: 92, b: 255 }
    const hsl = rgbToHsl(original)
    const back = hslToRgb(hsl)

    expect(back.r).toBeCloseTo(original.r, 0)
    expect(back.g).toBeCloseTo(original.g, 0)
    expect(back.b).toBeCloseTo(original.b, 0)
  })

  it('keeps the hue through an HSL round trip', () => {
    const hsl = rgbToHsl({ r: 124, g: 92, b: 255 })
    expect(hsl.h).toBeCloseTo(251.78, 1)
  })

  it('formats colours as uppercase hex', () => {
    expect(rgbToHex({ r: 124, g: 92, b: 255 })).toBe('#7C5CFF')
    expect(normaliseHex('#7c5cff')).toBe('#7C5CFF')
  })

  it('reports grey as having no saturation', () => {
    expect(rgbToHsl({ r: 128, g: 128, b: 128 }).s).toBe(0)
  })
})

describe('WCAG contrast', () => {
  it('gives black on white the maximum ratio', () => {
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(21, 5)
  })

  it('gives identical colours a ratio of one', () => {
    expect(contrastRatioHex('#ffffff', '#ffffff')).toBeCloseTo(1, 5)
  })

  it('is symmetric', () => {
    expect(contrastRatioHex('#7c5cff', '#ffffff')).toBeCloseTo(
      contrastRatioHex('#ffffff', '#7c5cff') ?? 0,
      10,
    )
  })

  it('matches the published value for #767676 on white', () => {
    // The classic "smallest grey that passes AA on white".
    expect(contrastRatioHex('#767676', '#ffffff')).toBeCloseTo(4.54, 2)
  })

  it('computes the relative luminance of white as one and black as zero', () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5)
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5)
  })

  it('grades a ratio against the WCAG thresholds', () => {
    expect(gradeContrast(21).normal).toBe('AAA')
    expect(gradeContrast(21).large).toBe('AAA')
    expect(gradeContrast(5).normal).toBe('AA')
    expect(gradeContrast(5).large).toBe('AA')
    expect(gradeContrast(3.5).normal).toBe('FAIL')
    expect(gradeContrast(3.5).large).toBe('AA')
    expect(gradeContrast(1).normal).toBe('FAIL')
  })

  it('exposes the thresholds it grades against', () => {
    expect(AA_NORMAL).toBe(4.5)
    expect(AA_LARGE).toBe(3)
    expect(AAA_NORMAL).toBe(7)
  })

  it('formats a ratio to two decimals', () => {
    expect(formatRatio(4.3456)).toBe('4.35:1')
    expect(formatRatio(21)).toBe('21.00:1')
  })

  it('grades a specific pair', () => {
    const verdict = checkContrast('#7c5cff', '#ffffff')
    expect(verdict).not.toBeNull()
    // The brand violet sits just under 4.5 against white.
    expect(verdict?.ratio).toBeCloseTo(4.35, 1)
    expect(verdict?.normal).toBe('FAIL')
    expect(verdict?.large).toBe('AA')
  })

  it('returns null when a colour cannot be parsed', () => {
    expect(checkContrast('nope', '#ffffff')).toBeNull()
  })

  it('picks the more readable of two colours', () => {
    expect(readableTextColor('#ffffff')).toBe('#000000')
    expect(readableTextColor('#000000')).toBe('#FFFFFF')
  })
})

describe('palette generation', () => {
  it('produces ten steps', () => {
    expect(generatePalette('#7c5cff')).toHaveLength(10)
  })

  it('orders the steps from lightest to darkest', () => {
    const palette = generatePalette('#7c5cff')
    const luminances = palette.map((entry) => relativeLuminance(hexToRgb(entry.hex)!))

    for (let index = 1; index < luminances.length; index += 1) {
      expect(luminances[index]).toBeLessThan(luminances[index - 1]!)
    }
  })

  it('names the tokens after the colour family', () => {
    const palette = generatePalette('#7c5cff', 'brand')
    expect(palette[0]?.token).toBe('brand-50')
    expect(palette.at(-1)?.token).toBe('brand-900')
  })

  it('keeps the hue of the base colour across the scale', () => {
    const base = rgbToHsl(hexToRgb('#7c5cff')!)
    const palette = generatePalette('#7c5cff')

    for (const entry of palette) {
      const hue = rgbToHsl(hexToRgb(entry.hex)!).h
      const difference = Math.abs(hue - base.h)
      const wrapped = Math.min(difference, 360 - difference)
      // Eight-bit rounding costs a fraction of a degree at the extremes.
      expect(wrapped).toBeLessThan(3)
    }
  })

  it('gives every step a readable text colour', () => {
    for (const entry of generatePalette('#7c5cff')) {
      const ratio = contrastRatioHex(entry.textColor, entry.hex) ?? 0
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('returns nothing for a colour it cannot parse', () => {
    expect(generatePalette('not-a-colour')).toEqual([])
  })

  it('renders as CSS custom properties', () => {
    const css = paletteToCss(generatePalette('#7c5cff'), 'vellum')
    expect(css.startsWith(':root {')).toBe(true)
    expect(css).toContain('--vellum-500:')
    expect(css.trimEnd().endsWith('}')).toBe(true)
  })

  it('finds the step with the best contrast against a background', () => {
    const palette = generatePalette('#7c5cff')
    const best = bestStepFor(palette, '#ffffff')

    // Against white, the darkest step has the most contrast.
    expect(best).not.toBeNull()
    expect(best?.step).toBe(900)
  })
})
