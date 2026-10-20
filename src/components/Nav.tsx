import { useState } from 'react'

import { nav, site } from '../data/site'
import { useScrolled } from '../hooks/useScrolled'
import type { ThemeMode } from '../hooks/useTheme'
import { ArrowRightIcon, CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons'

export interface NavProps {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function Nav({ theme, onToggleTheme }: NavProps) {
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const isDark = theme === 'dark'

  return (
    <header className={`nav${scrolled ? ' nav--pinned' : ''}`}>
      <div className="container nav__inner">
        <a className="nav__brand" href="#top">
          <span className="nav__mark" aria-hidden="true">
            V
          </span>
          <span>{site.brand}</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {nav.map((link) => (
            <a key={link.href} className="nav__link" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            type="button"
            className="btn btn--icon"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            title="Switch theme"
          >
            {isDark ? <SunIcon size={17} /> : <MoonIcon size={17} />}
          </button>

          <a className="btn btn--ghost btn--sm nav__signin" href="#pricing">
            Sign in
          </a>
          <a className="btn btn--primary btn--sm" href="#playground">
            Start free
          </a>

          <button
            type="button"
            className="btn btn--icon nav__toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="nav__panel" id="mobile-menu">
          <nav className="nav__panel-links" aria-label="Primary, mobile">
            {nav.map((link) => (
              <a
                key={link.href}
                className="nav__panel-link"
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                <ArrowRightIcon size={15} />
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
