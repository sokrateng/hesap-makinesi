import { useState, useEffect, useCallback } from 'react'

export type Theme = 'ilkokul' | 'lise' | 'universite'

const THEME_KEY = 'hesap-makinesi-theme'
const THEMES: Theme[] = ['ilkokul', 'lise', 'universite']

export const THEME_LABELS: Record<Theme, string> = {
  ilkokul: 'İlkokul',
  lise: 'Lise',
  universite: 'Üniversite',
}

export const THEME_EMOJI: Record<Theme, string> = {
  ilkokul: '🎨',
  lise: '📐',
  universite: '🔬',
}

function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null
    if (stored && THEMES.includes(stored)) return stored
  } catch { /* ignore */ }
  return 'universite'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(loadTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const cycleTheme = useCallback(() => {
    setTheme(prev => {
      const idx = THEMES.indexOf(prev)
      return THEMES[(idx + 1) % THEMES.length]
    })
  }, [])

  return { theme, cycleTheme }
}
