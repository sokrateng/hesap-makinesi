import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { KeyboardShortcutPanel } from './KeyboardShortcutPanel'

afterEach(() => {
  cleanup()
})

describe('KeyboardShortcutPanel', () => {
  it('renders the toggle button', () => {
    render(<KeyboardShortcutPanel />)
    const btn = screen.getByRole('button', { name: /klavye kisayollari/i })
    expect(btn).toBeDefined()
  })

  it('panel is closed by default', () => {
    render(<KeyboardShortcutPanel />)
    const region = screen.queryByRole('region')
    expect(region).toBeNull()
  })

  it('opens panel on click', () => {
    render(<KeyboardShortcutPanel />)
    const btn = screen.getByRole('button', { name: /klavye kisayollari/i })
    fireEvent.click(btn)
    const region = screen.getByRole('region')
    expect(region).toBeDefined()
  })

  it('closes panel on second click', () => {
    render(<KeyboardShortcutPanel />)
    const btn = screen.getByRole('button', { name: /klavye kisayollari/i })
    fireEvent.click(btn)
    fireEvent.click(btn)
    const region = screen.queryByRole('region')
    expect(region).toBeNull()
  })

  it('shows category labels when open', () => {
    render(<KeyboardShortcutPanel />)
    fireEvent.click(screen.getByRole('button', { name: /klavye kisayollari/i }))
    expect(screen.getByText('Rakamlar')).toBeDefined()
    expect(screen.getByText('Operatorler')).toBeDefined()
    expect(screen.getByText('Fonksiyonlar')).toBeDefined()
    expect(screen.getByText('Islemler')).toBeDefined()
  })

  it('shows shortcut descriptions when open', () => {
    render(<KeyboardShortcutPanel />)
    fireEvent.click(screen.getByRole('button', { name: /klavye kisayollari/i }))
    expect(screen.getByText('Hesapla')).toBeDefined()
    expect(screen.getByText('Temizle')).toBeDefined()
    expect(screen.getByText('sin(')).toBeDefined()
  })

  it('has aria-expanded attribute on button', () => {
    render(<KeyboardShortcutPanel />)
    const btn = screen.getByRole('button', { name: /klavye kisayollari/i })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true')
  })
})
