import { useState, useEffect, useCallback } from 'react'

export type ThemePreference = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

const THEME_KEY = 'hesap-makinesi-theme'

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme
}

function loadPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  } catch { /* ignore */ }
  return 'dark'
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(loadPreference)
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(loadPreference()))

  useEffect(() => {
    const theme = resolveTheme(preference)
    setResolved(theme)
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, preference)
  }, [preference])

  useEffect(() => {
    if (preference !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const theme = getSystemTheme()
      setResolved(theme)
      applyTheme(theme)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [preference])

  const cycleTheme = useCallback(() => {
    setPreference(prev => {
      const order: ThemePreference[] = ['dark', 'light', 'system']
      const idx = order.indexOf(prev)
      return order[(idx + 1) % order.length]
    })
  }, [])

  return { preference, resolved, cycleTheme }
}
