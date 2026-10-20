import { createElement } from 'react'

export interface CounterProps {
  /** The number to count up to. */
  value: number
  /** How many decimal places to show. */
  decimals?: number
  /** Appended after the number. */
  suffix?: string
}

/**
 * Renders the `<fd-counter>` custom element from the vanilla layer.
 *
 * It is written with `createElement` rather than JSX because React's
 * intrinsic element types do not know about custom elements, and because
 * spelling the element out makes it obvious that this one is not React.
 *
 * The prop names deliberately avoid `prefix`, which is a read-only property
 * on every DOM element — React assigns to properties when the name exists on
 * the element, and that would throw.
 */
export function Counter({ value, decimals = 0, suffix = '' }: CounterProps) {
  return createElement('fd-counter', { value, decimals, suffix })
}
