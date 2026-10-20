/**
 * Tonal palette generation.
 *
 * A single brand colour in, a tested scale out. The scale keeps the hue and
 * the saturation of the base colour, and moves the lightness through fixed
 * stops. Saturation is nudged at the extremes — pulling it back at the light
 * end stops the tints from looking chalky, and pushing it up at the dark
 * end stops the shades from looking muddy.
 */

import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from './color'
import { contrastRatioHex, readableTextColor } from './contrast'

export interface PaletteStep {
  /** The step number: 50, 100, 200 … 900. */
  step: number
  /** The generated token name, for example `vellum-500`. */
  token: string
  /** The colour in `#RRGGBB`. */
  hex: string
  /** The text colour that reads best on this swatch. */
  textColor: string
}

interface StepDefinition {
  step: number
  /** Target lightness, 0 – 1. */
  lightness: number
  /** How much to scale the saturation by. */
  saturationScale: number
}

const STEP_DEFINITIONS: readonly StepDefinition[] = [
  { step: 50, lightness: 0.97, saturationScale: 0.55 },
  { step: 100, lightness: 0.94, saturationScale: 0.62 },
  { step: 200, lightness: 0.88, saturationScale: 0.72 },
  { step: 300, lightness: 0.79, saturationScale: 0.84 },
  { step: 400, lightness: 0.68, saturationScale: 0.96 },
  { step: 500, lightness: 0.56, saturationScale: 1 },
  { step: 600, lightness: 0.45, saturationScale: 1.04 },
  { step: 700, lightness: 0.35, saturationScale: 1.08 },
  { step: 800, lightness: 0.26, saturationScale: 1.1 },
  { step: 900, lightness: 0.18, saturationScale: 1.12 },
]

/**
 * Builds a tonal scale from a base colour.
 *
 * @param baseHex the brand colour
 * @param name the token family name, for example `vellum`
 */
export function generatePalette(baseHex: string, name = 'vellum'): PaletteStep[] {
  const rgb = hexToRgb(baseHex)
  if (!rgb) return []

  const hsl = rgbToHsl(rgb)

  return STEP_DEFINITIONS.map((definition) => {
    const saturation = Math.min(1, Math.max(0, hsl.s * definition.saturationScale))
    const hex = rgbToHex(hslToRgb({ h: hsl.h, s: saturation, l: definition.lightness }))

    return {
      step: definition.step,
      token: `${name}-${definition.step}`,
      hex,
      textColor: readableTextColor(hex),
    }
  })
}

/**
 * Renders a palette as a block of CSS custom properties.
 *
 * @param palette
 * @param name
 */
export function paletteToCss(palette: readonly PaletteStep[], name = 'vellum'): string {
  if (palette.length === 0) return ''

  const lines = palette.map((entry) => `  --${name}-${entry.step}: ${entry.hex.toLowerCase()};`)

  return [`:root {`, ...lines, `}`].join('\n')
}

/**
 * Finds the palette step whose colour has the highest contrast against the
 * given background — the "on colour" a designer would reach for.
 *
 * @param palette
 * @param background
 */
export function bestStepFor(
  palette: readonly PaletteStep[],
  background: string,
): PaletteStep | null {
  let best: PaletteStep | null = null
  let bestRatio = 0

  for (const entry of palette) {
    const ratio = contrastRatioHex(entry.hex, background) ?? 0
    if (ratio > bestRatio) {
      bestRatio = ratio
      best = entry
    }
  }

  return best
}
