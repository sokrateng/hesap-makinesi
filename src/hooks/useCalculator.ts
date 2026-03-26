import { useState, useCallback, useRef, useEffect } from 'react'
import { evaluate, type AngleMode } from '../utils/parser'
import { speakResult } from '../utils/speakResult'

interface HistoryEntry {
  expression: string
  result: string
  timestamp: number
}

export interface CalculateOptions {
  speak?: boolean
}

const HISTORY_KEY = 'hesap-makinesi-history'
const MAX_HISTORY = 20
const AUTO_CALC_DELAY = 1500

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
  const autoCalcTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const expressionRef = useRef(expression)

  useEffect(() => {
    expressionRef.current = expression
  }, [expression])

  const clearAutoCalcTimer = useCallback(() => {
    if (autoCalcTimer.current) {
      clearTimeout(autoCalcTimer.current)
      autoCalcTimer.current = null
    }
  }, [])

  const doCalculate = useCallback((expr: string, mode: AngleMode, speak: boolean) => {
    if (!expr.trim()) return

    const { result: calcResult, error: calcError } = evaluate(expr, mode)

    if (calcError) {
      setError(calcError)
      return
    }

    setResult(calcResult!)
    setError(null)

    if (speak) {
      speakResult(expr, calcResult!)
    }

    const entry: HistoryEntry = {
      expression: expr,
      result: calcResult!,
      timestamp: Date.now(),
    }

    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY)
      saveHistory(updated)
      return updated
    })
  }, [])

  const calculate = useCallback((options?: CalculateOptions) => {
    clearAutoCalcTimer()
    doCalculate(expressionRef.current, angleMode, options?.speak ?? false)
  }, [angleMode, doCalculate, clearAutoCalcTimer])

  const angleModeRef = useRef(angleMode)
  useEffect(() => {
    angleModeRef.current = angleMode
  }, [angleMode])

  const startAutoCalcTimer = useCallback(() => {
    clearAutoCalcTimer()
    autoCalcTimer.current = setTimeout(() => {
      const expr = expressionRef.current
      if (!expr.trim()) return
      const { result: calcResult, error: calcError } = evaluate(expr, angleModeRef.current)
      if (calcError || calcResult === null) return
      setResult(calcResult)
      setError(null)
      const entry: HistoryEntry = { expression: expr, result: calcResult, timestamp: Date.now() }
      setHistory(prev => {
        const updated = [entry, ...prev].slice(0, MAX_HISTORY)
        saveHistory(updated)
        return updated
      })
    }, AUTO_CALC_DELAY)
  }, [clearAutoCalcTimer])

  const append = useCallback((value: string) => {
    setExpression(prev => prev + value)
    setError(null)
    startAutoCalcTimer()
  }, [startAutoCalcTimer])

  const clear = useCallback(() => {
    clearAutoCalcTimer()
    setExpression('')
    setResult('')
    setError(null)
  }, [clearAutoCalcTimer])

  const deleteLast = useCallback(() => {
    setExpression(prev => prev.slice(0, -1))
    startAutoCalcTimer()
  }, [startAutoCalcTimer])

  const loadFromHistory = useCallback((index: number) => {
    clearAutoCalcTimer()
    if (index >= 0 && index < history.length) {
      setExpression(history[index].expression)
      setResult('')
      setError(null)
    }
  }, [history, clearAutoCalcTimer])

  const toggleAngleMode = useCallback(() => {
    setAngleMode(prev => (prev === 'deg' ? 'rad' : 'deg'))
  }, [])

  const applyPercent = useCallback(() => {
    setExpression(prev => `${prev} / 100`)
    startAutoCalcTimer()
  }, [startAutoCalcTimer])

  const applyNegate = useCallback(() => {
    setExpression(prev => `-(${prev})`)
    startAutoCalcTimer()
  }, [startAutoCalcTimer])

  const appendAndCalculate = useCallback((value: string, options?: CalculateOptions) => {
    clearAutoCalcTimer()
    const newExpr = expressionRef.current + value
    setExpression(newExpr)
    setError(null)
    doCalculate(newExpr, angleMode, options?.speak ?? false)
  }, [angleMode, doCalculate, clearAutoCalcTimer])

  useEffect(() => {
    return () => clearAutoCalcTimer()
  }, [clearAutoCalcTimer])

  return {
    expression, result, error, history, angleMode,
    append, clear, deleteLast, calculate, appendAndCalculate, loadFromHistory,
    toggleAngleMode, applyPercent, applyNegate,
  }
}
