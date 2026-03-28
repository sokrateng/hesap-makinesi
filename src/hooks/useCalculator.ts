import { useState, useCallback, useRef, useEffect } from 'react'
import { evaluate, type AngleMode } from '../utils/parser'
import { speakResult } from '../utils/speakResult'
import { resolveAns, setAns } from '../utils/ansStore'

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
const NEW_CALC_IDLE_DELAY = 6000

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
  const [previousResult, setPreviousResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory)
  const [angleMode, setAngleMode] = useState<AngleMode>('deg')
  const [readyForNew, setReadyForNew] = useState(false)
  const autoCalcTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
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

  const clearIdleTimer = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current)
      idleTimer.current = null
    }
  }, [])

  const startIdleTimer = useCallback(() => {
    clearIdleTimer()
    idleTimer.current = setTimeout(() => {
      setReadyForNew(true)
      idleTimer.current = null
    }, NEW_CALC_IDLE_DELAY)
  }, [clearIdleTimer])

  const doCalculate = useCallback((expr: string, mode: AngleMode, speak: boolean) => {
    if (!expr.trim()) return

    const resolved = resolveAns(expr)
    const { result: calcResult, error: calcError } = evaluate(resolved, mode)

    if (calcError) {
      setError(calcError)
      return
    }

    setResult(calcResult!)
    setPreviousResult('')
    setError(null)
    setAns(calcResult!)
    setReadyForNew(false)

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

    startIdleTimer()
  }, [startIdleTimer])

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
      const resolved = resolveAns(expr)
      const { result: calcResult, error: calcError } = evaluate(resolved, angleModeRef.current)
      if (calcError || calcResult === null) return
      setResult(calcResult)
      setError(null)
      setAns(calcResult)
      const entry: HistoryEntry = { expression: expr, result: calcResult, timestamp: Date.now() }
      setHistory(prev => {
        const updated = [entry, ...prev].slice(0, MAX_HISTORY)
        saveHistory(updated)
        return updated
      })
      startIdleTimer()
    }, AUTO_CALC_DELAY)
  }, [clearAutoCalcTimer, startIdleTimer])

  const beginNewCalcIfNeeded = useCallback(() => {
    if (readyForNew && result) {
      setPreviousResult(result)
      setExpression('')
      setResult('')
      setError(null)
      setReadyForNew(false)
      clearIdleTimer()
    }
  }, [readyForNew, result, clearIdleTimer])

  const append = useCallback((value: string) => {
    beginNewCalcIfNeeded()
    setExpression(prev => prev + value)
    setError(null)
    startAutoCalcTimer()
  }, [startAutoCalcTimer, beginNewCalcIfNeeded])

  const clear = useCallback(() => {
    clearAutoCalcTimer()
    clearIdleTimer()
    setExpression('')
    setResult('')
    setPreviousResult('')
    setError(null)
    setReadyForNew(false)
  }, [clearAutoCalcTimer, clearIdleTimer])

  const deleteLast = useCallback(() => {
    setExpression(prev => prev.slice(0, -1))
    startAutoCalcTimer()
  }, [startAutoCalcTimer])

  const loadFromHistory = useCallback((index: number) => {
    clearAutoCalcTimer()
    clearIdleTimer()
    if (index >= 0 && index < history.length) {
      setExpression(history[index].expression)
      setResult('')
      setPreviousResult('')
      setError(null)
      setReadyForNew(false)
    }
  }, [history, clearAutoCalcTimer, clearIdleTimer])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      // localStorage may be unavailable
    }
  }, [])

  const toggleAngleMode = useCallback(() => {
    setAngleMode(prev => (prev === 'deg' ? 'rad' : 'deg'))
  }, [])

  const applyPercent = useCallback(() => {
    beginNewCalcIfNeeded()
    setExpression(prev => `${prev} / 100`)
    startAutoCalcTimer()
  }, [startAutoCalcTimer, beginNewCalcIfNeeded])

  const applyNegate = useCallback(() => {
    beginNewCalcIfNeeded()
    setExpression(prev => `-(${prev})`)
    startAutoCalcTimer()
  }, [startAutoCalcTimer, beginNewCalcIfNeeded])

  const appendAndCalculate = useCallback((value: string, options?: CalculateOptions) => {
    clearAutoCalcTimer()
    clearIdleTimer()
    const newExpr = expressionRef.current + value
    setExpression(newExpr)
    setError(null)
    setReadyForNew(false)
    doCalculate(newExpr, angleMode, options?.speak ?? false)
  }, [angleMode, doCalculate, clearAutoCalcTimer, clearIdleTimer])

  useEffect(() => {
    return () => {
      clearAutoCalcTimer()
      clearIdleTimer()
    }
  }, [clearAutoCalcTimer, clearIdleTimer])

  return {
    expression, result, previousResult, error, history, angleMode, readyForNew,
    append, clear, clearHistory, deleteLast, calculate, appendAndCalculate, loadFromHistory,
    toggleAngleMode, applyPercent, applyNegate,
  }
}
