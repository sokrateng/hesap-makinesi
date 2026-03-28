import { useEffect, useRef, useCallback } from 'react'

interface KeyboardActions {
  append: (value: string) => void
  clear: () => void
  deleteLast: () => void
  calculate: () => void
  applyPercent: () => void
  applyNegate: () => void
}

const FUNCTION_NAMES: Record<string, string> = {
  sin: 'sin(',
  cos: 'cos(',
  tan: 'tan(',
  asin: 'arcsin(',
  acos: 'arccos(',
  atan: 'arctan(',
  sinh: 'sinh(',
  cosh: 'cosh(',
  tanh: 'tanh(',
  log: 'log10(',
  ln: 'ln(',
  sqrt: '√(',
  cbrt: '∛(',
  abs: 'abs(',
  ncr: 'nCr(',
  npr: 'nPr(',
  gcd: 'gcd(',
  lcm: 'lcm(',
  obeb: 'gcd(',
  okek: 'lcm(',
  mod: 'mod(',
  round: 'round(',
  ceil: 'ceil(',
  floor: 'floor(',
  prime: 'isPrime(',
  ans: 'Ans',
  pi: 'π',
  rand: 'rand',
}

const BUFFER_TIMEOUT_MS = 800

export function useKeyboard(actions: KeyboardActions) {
  const bufferRef = useRef('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearBuffer = useCallback(() => {
    bufferRef.current = ''
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const flushBuffer = useCallback(() => {
    const buf = bufferRef.current
    if (buf) {
      for (const ch of buf) {
        actions.append(ch)
      }
      bufferRef.current = ''
    }
  }, [actions])

  const resetBufferTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      flushBuffer()
    }, BUFFER_TIMEOUT_MS)
  }, [flushBuffer])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const key = e.key

      if (/^[0-9.]$/.test(key)) {
        e.preventDefault()
        flushBuffer()
        actions.append(key)
        return
      }

      if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault()
        flushBuffer()
        actions.append(key)
        return
      }

      if (['(', ')'].includes(key)) {
        e.preventDefault()
        flushBuffer()
        actions.append(key)
        return
      }

      if (key === ',') {
        e.preventDefault()
        flushBuffer()
        actions.append(',')
        return
      }

      if (key === 'Enter' || key === '=') {
        e.preventDefault()
        clearBuffer()
        actions.calculate()
        return
      }

      if (key === 'Backspace') {
        e.preventDefault()
        if (bufferRef.current.length > 0) {
          bufferRef.current = bufferRef.current.slice(0, -1)
          if (bufferRef.current.length === 0) clearBuffer()
          else resetBufferTimer()
        } else {
          actions.deleteLast()
        }
        return
      }

      if (key === 'Escape') {
        e.preventDefault()
        clearBuffer()
        actions.clear()
        return
      }

      if (key === '%') {
        e.preventDefault()
        flushBuffer()
        actions.applyPercent()
        return
      }

      if (key === '!') {
        e.preventDefault()
        flushBuffer()
        actions.append('!')
        return
      }

      if (key === '^') {
        e.preventDefault()
        flushBuffer()
        actions.append('^')
        return
      }

      if (/^[a-zA-Z]$/.test(key)) {
        e.preventDefault()
        const newBuffer = bufferRef.current + key.toLowerCase()
        bufferRef.current = newBuffer

        const exactMatch = FUNCTION_NAMES[newBuffer]
        if (exactMatch) {
          clearBuffer()
          actions.append(exactMatch)
          return
        }

        const hasPrefix = Object.keys(FUNCTION_NAMES).some(fn => fn.startsWith(newBuffer))
        if (hasPrefix) {
          resetBufferTimer()
        } else {
          flushBuffer()
        }
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [actions, clearBuffer, flushBuffer, resetBufferTimer])
}
