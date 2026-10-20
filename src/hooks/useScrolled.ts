import { useEffect, useState } from 'react'

/**
 * Tracks whether the page has been scrolled past a threshold, so the
 * navigation bar can change its appearance.
 */
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}
