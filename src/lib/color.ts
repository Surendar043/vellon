/**
 * Colour conversion helpers.
 *
 * Everything here is pure and works on plain numbers, so it can be unit
 * tested without a browser.
 */

export interface Rgb {
  /** 0 – 255 */
  r: number
  /** 0 – 255 */
  g: number
  /** 0 – 255 */
  b: number
}

export interface Hsl {
  /** 0 – 360 */
  h: number
  /** 0 – 1 */
  s: number
  /** 0 – 1 */
  l: number
}

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

/**
 * @param value a number
 * @param min
 * @param max
 */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

/**
 * Parses `#abc`, `#aabbcc` or `#AABBCC` into its channels.
 *
 * @param value
 * @returns the parsed colour, or `null` when the value is not a hex colour
 */
export function hexToRgb(value: string): Rgb | null {
  const match = HEX_PATTERN.exec(value.trim())
  if (!match) return null

  const digits = match[1] ?? ''
  const full =
    digits.length === 3
      ? digits
          .split('')
          .map((character) => character + character)
          .join('')
      : digits

  const parsed = Number.parseInt(full, 16)
  if (Number.isNaN(parsed)) return null

  return {
    r: (parsed >> 16) & 0xff,
    g: (parsed >> 8) & 0xff,
    b: parsed & 0xff,
  }
}

/**
 * @param rgb
 * @returns an uppercase `#RRGGBB` string
 */
export function rgbToHex({ r, g, b }: Rgb): string {
  const channel = (value: number) =>
    Math.round(clamp(value, 0, 255))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase()
}

/**
 * @param rgb
 * @returns the hue in degrees, the saturation and lightness as 0 – 1
 */
export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const red = r / 255
  const green = g / 255
  const blue = b / 255

  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  const lightness = (max + min) / 2

  let hue = 0
  let saturation = 0

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1))
    if (max === red) {
      hue = ((green - blue) / delta) % 6
    } else if (max === green) {
      hue = (blue - red) / delta + 2
    } else {
      hue = (red - green) / delta + 4
    }
    hue *= 60
    if (hue < 0) hue += 360
  }

  return { h: hue, s: saturation, l: lightness }
}

/**
 * @param hsl
 * @returns the colour's channels
 */
export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hue = ((h % 360) + 360) % 360
  const saturation = clamp(s, 0, 1)

  if (saturation === 0) {
    const value = Math.round(l * 255)
    return { r: value, g: value, b: value }
  }

  const lightness = clamp(l, 0, 1)
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const match = lightness - chroma / 2

  let rgb: [number, number, number]
  if (hue < 60) rgb = [chroma, secondary, 0]
  else if (hue < 120) rgb = [secondary, chroma, 0]
  else if (hue < 180) rgb = [0, chroma, secondary]
  else if (hue < 240) rgb = [0, secondary, chroma]
  else if (hue < 300) rgb = [secondary, 0, chroma]
  else rgb = [chroma, 0, secondary]

  return {
    r: Math.round((rgb[0] + match) * 255),
    g: Math.round((rgb[1] + match) * 255),
    b: Math.round((rgb[2] + match) * 255),
  }
}

/**
 * @param value
 * @returns the colour as `#RRGGBB`, falling back to the input when it cannot
 *   be parsed
 */
export function normaliseHex(value: string): string {
  const rgb = hexToRgb(value)
  return rgb ? rgbToHex(rgb) : value.toUpperCase()
}
