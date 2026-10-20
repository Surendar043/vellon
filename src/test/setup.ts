/**
 * Test environment shims.
 *
 * jsdom does not implement `matchMedia`, `IntersectionObserver` or
 * `requestAnimationFrame` in the way the app expects. Rather than guarding
 * the app with feature checks that would never run in a real browser, the
 * gaps are filled here.
 */

import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Vitest does not expose globals by default, so Testing Library cannot
// register its own automatic cleanup.
afterEach(() => {
  cleanup()
})

if (typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

/**
 * Reports every observed element as immediately visible, so anything that
 * waits for an intersection is revealed without scrolling.
 */
class MockIntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: readonly number[] = []

  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(): void {
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }

  unobserve(): void {}

  disconnect(): void {}

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

const scope = globalThis as unknown as Record<string, unknown>

if (typeof scope.IntersectionObserver === 'undefined') {
  scope.IntersectionObserver = MockIntersectionObserver
}

if (typeof window.requestAnimationFrame !== 'function') {
  window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(Date.now()), 16)) as typeof window.requestAnimationFrame
  window.cancelAnimationFrame = ((handle: number) =>
    window.clearTimeout(handle)) as typeof window.cancelAnimationFrame
}
