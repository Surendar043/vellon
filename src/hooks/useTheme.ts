import { useCallback, useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'vellum:theme'

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/**
 * Owns the `data-theme` attribute and persists the choice.
 *
 * The theme is also applied by a small inline script in `index.html` before
 * the first paint, so the page never flashes. This hook only has to keep the
 * two in sync once React takes over.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
