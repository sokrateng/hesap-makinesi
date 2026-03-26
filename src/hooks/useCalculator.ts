import { useState, useCallback } from 'react'
import { evaluate, type AngleMode } from '../utils/parser'

interface HistoryEntry {
  expression: string
  result: string
  timestamp: number
}

const HISTORY_KEY = 'hesap-makinesi-history'
const MAX_HISTORY = 20

function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveHistory(history: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function useCalculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory)
  const [angleMode, setAngleMode] = useState<AngleMode>('deg')

  const append = useCallback((value: string) => {
    setExpression(prev => prev + value)
    setError(null)
  }, [])

  const clear = useCallback(() => {
    setExpression('')
    setResult('')
    setError(null)
  }, [])

  const deleteLast = useCallback(() => {
    setExpression(prev => prev.slice(0, -1))
  }, [])

  const calculate = useCallback(() => {
    if (!expression.trim()) return

    const { result: calcResult, error: calcError } = evaluate(expression, angleMode)

    if (calcError) {
      setError(calcError)
      return
    }

    setResult(calcResult!)
    setError(null)

    const entry: HistoryEntry = {
      expression,
      result: calcResult!,
      timestamp: Date.now(),
    }

    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY)
      saveHistory(updated)
      return updated
    })
  }, [expression, angleMode])

  const loadFromHistory = useCallback((index: number) => {
    if (index >= 0 && index < history.length) {
      setExpression(history[index].expression)
      setResult('')
      setError(null)
    }
  }, [history])

  const toggleAngleMode = useCallback(() => {
    setAngleMode(prev => (prev === 'deg' ? 'rad' : 'deg'))
  }, [])

  const applyPercent = useCallback(() => {
    setExpression(prev => `${prev} / 100`)
  }, [])

  const applyNegate = useCallback(() => {
    setExpression(prev => `-(${prev})`)
  }, [])

  return {
    expression, result, error, history, angleMode,
    append, clear, deleteLast, calculate, loadFromHistory,
    toggleAngleMode, applyPercent, applyNegate,
  }
}
