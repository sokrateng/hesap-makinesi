import { useEffect } from 'react'

interface KeyboardActions {
  append: (value: string) => void
  clear: () => void
  deleteLast: () => void
  calculate: () => void
  applyPercent: () => void
  applyNegate: () => void
}

const KEY_MAP: Record<string, string> = {
  s: 'sin(',
  c: 'cos(',
  t: 'tan(',
  n: 'ln(',
  g: 'log(',
  r: 'sqrt(',
}

export function useKeyboard(actions: KeyboardActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const key = e.key

      if (/^[0-9.]$/.test(key)) {
        e.preventDefault()
        actions.append(key)
      } else if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault()
        actions.append(key)
      } else if (['(', ')'].includes(key)) {
        e.preventDefault()
        actions.append(key)
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        actions.calculate()
      } else if (key === 'Backspace') {
        e.preventDefault()
        actions.deleteLast()
      } else if (key === 'Escape') {
        e.preventDefault()
        actions.clear()
      } else if (key === '%') {
        e.preventDefault()
        actions.applyPercent()
      } else if (key in KEY_MAP) {
        e.preventDefault()
        actions.append(KEY_MAP[key])
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [actions])
}
