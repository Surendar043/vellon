/**
 * WCAG 2.2 contrast maths.
 *
 * The relative-luminance definition is the one from WCAG 2.1 and later
 * (`0.04045` threshold). The wording in WCAG 2.0 used `0.03928`; the two
 * differ only for a handful of very dark values and produce identical
 * results for every colour used in practice.
 */

import { hexToRgb, rgbToHex } from './color'
import type { Rgb } from './color'

/** The threshold at which a channel is treated as linear. */
const LINEAR_THRESHOLD = 0.04045

/** The ratio at which two colours are indistinguishable. */
export const CONTRAST_MINIMUM = 1

/**
 * Converts one sRGB channel to linear light.
 *
 * @param channel a value between 0 and 1
 */
function linearise(channel: number): number {
  return channel <= LINEAR_THRESHOLD ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
}

/**
 * The relative luminance of a colour, between 0 and 1.
 *
 * @param rgb
 */
export function relativeLuminance(rgb: Rgb): number {
  const red = linearise(rgb.r / 255)
  const green = linearise(rgb.g / 255)
  const blue = linearise(rgb.b / 255)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

/**
 * The contrast ratio between two colours, from 1 to 21.
 *
 * @param first
 * @param second
 */
export function contrastRatio(first: Rgb, second: Rgb): number {
  const a = relativeLuminance(first)
  const b = relativeLuminance(second)
  const lighter = Math.max(a, b)
  const darker = Math.min(a, b)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * The contrast ratio between two hex colours.
 *
 * @param first
 * @param second
 * @returns the ratio, or `null` when a colour cannot be parsed
 */
export function contrastRatioHex(first: string, second: string): number | null {
  const a = hexToRgb(first)
  const b = hexToRgb(second)
  if (!a || !b) return null
  return contrastRatio(a, b)
}

/**
 * Formats a ratio the way contrast checkers do, always to two decimals.
 *
 * @param ratio
 */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`
}

export type Conformance = 'AAA' | 'AA' | 'FAIL'

export interface ContrastVerdict {
  /** The conformance level for normal-sized body text. */
  normal: Conformance
  /** The conformance level for large text (24px, or 18.66px bold). */
  large: Conformance
  /** The raw ratio. */
  ratio: number
}

/** The ratio required for AA at normal text sizes. */
export const AA_NORMAL = 4.5
/** The ratio required for AA at large text sizes. */
export const AA_LARGE = 3
/** The ratio required for AAA at normal text sizes. */
export const AAA_NORMAL = 7

/**
 * Works out which WCAG levels a colour pair meets.
 *
 * @param ratio the contrast ratio between the two colours
 */
export function gradeContrast(ratio: number): ContrastVerdict {
  const normal: Conformance = ratio >= AAA_NORMAL ? 'AAA' : ratio >= AA_NORMAL ? 'AA' : 'FAIL'
  const large: Conformance = ratio >= AAA_NORMAL ? 'AAA' : ratio >= AA_LARGE ? 'AA' : 'FAIL'
  return { normal, large, ratio }
}

/**
 * Convenience wrapper that parses two hex colours and grades them.
 *
 * @param foreground
 * @param background
 */
export function checkContrast(foreground: string, background: string): ContrastVerdict | null {
  const ratio = contrastRatioHex(foreground, background)
  if (ratio === null) return null
  return gradeContrast(ratio)
}

/**
 * Picks whichever of two colours reads better on the given background.
 *
 * The defaults are pure black and pure white, because those are the two
 * extremes of luminance — between them they always achieve at least 4.58:1
 * against any background, which is the best guarantee available.
 *
 * @param background
 * @param options the two candidate colours, best first
 */
export function readableTextColor(
  background: string,
  options: readonly [string, string] = ['#000000', '#FFFFFF'],
): string {
  const backgroundRgb = hexToRgb(background)
  if (!backgroundRgb) return options[0]

  let best = options[0]
  let bestRatio = 0

  for (const option of options) {
    const ratio = contrastRatioHex(option, background) ?? 0
    if (ratio > bestRatio) {
      bestRatio = ratio
      best = option
    }
  }

  return rgbToHex(hexToRgb(best) ?? { r: 0, g: 0, b: 0 })
}
