import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme, THEME_LABELS, THEME_EMOJI, type Theme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('useTheme', () => {
  it('defaults to universite when no stored theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('universite')
  })

  it('sets data-theme attribute on document', () => {
    renderHook(() => useTheme())
    expect(document.documentElement.getAttribute('data-theme')).toBe('universite')
  })

  it('persists theme to localStorage', () => {
    renderHook(() => useTheme())
    expect(localStorage.getItem('hesap-makinesi-theme')).toBe('universite')
  })

  it('loads stored theme from localStorage', () => {
    localStorage.setItem('hesap-makinesi-theme', 'ilkokul')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('ilkokul')
  })

  it('loads lise theme from localStorage', () => {
    localStorage.setItem('hesap-makinesi-theme', 'lise')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('lise')
  })

  it('falls back to universite for invalid stored theme', () => {
    localStorage.setItem('hesap-makinesi-theme', 'gecersiz-tema')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('universite')
  })

  it('falls back to universite when localStorage throws', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage disabled')
    })
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('universite')
    getItemSpy.mockRestore()
  })

  it('cycleTheme goes universite -> ilkokul', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('universite')
    act(() => result.current.cycleTheme())
    expect(result.current.theme).toBe('ilkokul')
  })

  it('cycleTheme goes ilkokul -> lise', () => {
    localStorage.setItem('hesap-makinesi-theme', 'ilkokul')
    const { result } = renderHook(() => useTheme())
    act(() => result.current.cycleTheme())
    expect(result.current.theme).toBe('lise')
  })

  it('cycleTheme goes lise -> universite', () => {
    localStorage.setItem('hesap-makinesi-theme', 'lise')
    const { result } = renderHook(() => useTheme())
    act(() => result.current.cycleTheme())
    expect(result.current.theme).toBe('universite')
  })

  it('cycleTheme wraps around full cycle', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('universite')
    act(() => result.current.cycleTheme())
    expect(result.current.theme).toBe('ilkokul')
    act(() => result.current.cycleTheme())
    expect(result.current.theme).toBe('lise')
    act(() => result.current.cycleTheme())
    expect(result.current.theme).toBe('universite')
  })

  it('updates data-theme on cycle', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.cycleTheme())
    expect(document.documentElement.getAttribute('data-theme')).toBe('ilkokul')
  })

  it('updates localStorage on cycle', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.cycleTheme())
    expect(localStorage.getItem('hesap-makinesi-theme')).toBe('ilkokul')
  })

  it('cycleTheme identity is stable across renders', () => {
    const { result, rerender } = renderHook(() => useTheme())
    const firstRef = result.current.cycleTheme
    rerender()
    expect(result.current.cycleTheme).toBe(firstRef)
  })
})

describe('THEME_LABELS', () => {
  it('has labels for all themes', () => {
    const themes: Theme[] = ['ilkokul', 'lise', 'universite']
    for (const t of themes) {
      expect(THEME_LABELS[t]).toBeDefined()
      expect(typeof THEME_LABELS[t]).toBe('string')
    }
  })

  it('returns correct Turkish labels', () => {
    expect(THEME_LABELS.ilkokul).toBe('İlkokul')
    expect(THEME_LABELS.lise).toBe('Lise')
    expect(THEME_LABELS.universite).toBe('Üniversite')
  })
})

describe('THEME_EMOJI', () => {
  it('has emoji for all themes', () => {
    const themes: Theme[] = ['ilkokul', 'lise', 'universite']
    for (const t of themes) {
      expect(THEME_EMOJI[t]).toBeDefined()
      expect(typeof THEME_EMOJI[t]).toBe('string')
    }
  })

  it('returns correct emoji', () => {
    expect(THEME_EMOJI.ilkokul).toBe('🎨')
    expect(THEME_EMOJI.lise).toBe('📐')
    expect(THEME_EMOJI.universite).toBe('🔬')
  })
})
