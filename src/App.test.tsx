import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('Vellum — the landing page', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.setAttribute('data-theme', 'dark')
  })

  it('renders the hero', () => {
    render(<App />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('One colour in')
    expect(screen.getByText('A tested design system out.')).toBeTruthy()
  })

  it('renders every major section', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /everything between a hex code/i })).toBeTruthy()
    expect(screen.getByRole('heading', { name: /try it with your own colour/i })).toBeTruthy()
    expect(screen.getByRole('heading', { name: /priced per project/i })).toBeTruthy()
    expect(screen.getByRole('heading', { name: /questions people actually ask/i })).toBeTruthy()
  })

  it('generates a palette from the base colour', () => {
    render(<App />)

    // Ten steps, each with a token label.
    expect(screen.getAllByTitle(/^vellum-\d+ — #/)).toHaveLength(10)
  })

  it('recalculates the contrast when the colour changes', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByLabelText('Base colour')
    await user.clear(input)
    await user.type(input, '#ffffff')

    await waitFor(() => {
      expect(screen.getByText('1.00:1')).toBeTruthy()
    })
  })

  it('flags a failing colour for body text', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByLabelText('Base colour')
    await user.clear(input)
    await user.type(input, '#ffffff')

    await waitFor(() => {
      expect(screen.getAllByText('FAIL').length).toBeGreaterThan(0)
    })
  })

  it('rejects an invalid hex colour', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByLabelText('Base colour')
    await user.clear(input)
    await user.type(input, 'zzz')

    expect(screen.getByText(/enter a hex colour/i)).toBeTruthy()
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })

  it('switches the theme', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    await user.click(screen.getByRole('button', { name: /switch to light theme/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('opens and closes an FAQ answer', async () => {
    const user = userEvent.setup()
    render(<App />)

    // The first answer starts open; this one starts closed.
    const trigger = screen.getByRole('button', { name: /how does the contrast checking work/i })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await user.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    await user.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('switches the code sample', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('tokens.css')).toBeTruthy()

    await user.click(screen.getByRole('tab', { name: 'React' }))
    expect(screen.getByText('Button.tsx')).toBeTruthy()
  })

  it('renders the statistics band with the vanilla custom element', () => {
    const { container } = render(<App />)

    const counters = container.querySelectorAll('fd-counter')
    expect(counters.length).toBe(4)
    expect(counters[0]?.getAttribute('value')).toBe('2400')
  })

  it('has a single level-one heading', () => {
    render(<App />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('gives every section a label or a heading', () => {
    render(<App />)

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy()
  })
})
