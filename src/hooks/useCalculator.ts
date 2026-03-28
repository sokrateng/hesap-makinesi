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

const OPERATORS = new Set(['+', '-', '*', '/', '×', '÷', '^', '%'])

function isOperator(value: string): boolean {
  return OPERATORS.has(value)
}

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
  const [justCalculated, setJustCalculated] = useState(false)
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
    setJustCalculated(true)

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
    }, AUTO_CALC_DELAY)
  }, [clearAutoCalcTimer])

  const append = useCallback((value: string) => {
    if (justCalculated && result) {
      if (isOperator(value)) {
        // Operator after result: continue with result (e.g. 30+6)
        setExpression(result + value)
        setPreviousResult('')
        setResult('')
        setError(null)
        setJustCalculated(false)
        startAutoCalcTimer()
        return
      }
      // Number/function after result: start fresh new calculation
      setPreviousResult(result)
      setExpression(value)
      setResult('')
      setError(null)
      setJustCalculated(false)
      startAutoCalcTimer()
      return
    }

    setExpression(prev => prev + value)
    setError(null)
    setJustCalculated(false)
    startAutoCalcTimer()
  }, [startAutoCalcTimer, justCalculated, result])

  const clear = useCallback(() => {
    clearAutoCalcTimer()
    setExpression('')
    setResult('')
    setPreviousResult('')
    setError(null)
    setJustCalculated(false)
  }, [clearAutoCalcTimer])

  const deleteLast = useCallback(() => {
    if (justCalculated) {
      // After calculation, backspace clears expression to start fresh
      setExpression('')
      setJustCalculated(false)
      return
    }
    setExpression(prev => prev.slice(0, -1))
    startAutoCalcTimer()
  }, [startAutoCalcTimer, justCalculated])

  const loadFromHistory = useCallback((index: number) => {
    clearAutoCalcTimer()
    if (index >= 0 && index < history.length) {
      setExpression(history[index].expression)
      setResult('')
      setPreviousResult('')
      setError(null)
      setJustCalculated(false)
    }
  }, [history, clearAutoCalcTimer])

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
    if (justCalculated && result) {
      setExpression(result + ' / 100')
      setResult('')
      setJustCalculated(false)
    } else {
      setExpression(prev => `${prev} / 100`)
    }
    startAutoCalcTimer()
  }, [startAutoCalcTimer, justCalculated, result])

  const applyNegate = useCallback(() => {
    if (justCalculated && result) {
      setExpression(`-(${result})`)
      setResult('')
      setJustCalculated(false)
    } else {
      setExpression(prev => `-(${prev})`)
    }
    startAutoCalcTimer()
  }, [startAutoCalcTimer, justCalculated, result])

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
    expression, result, previousResult, error, history, angleMode, justCalculated,
    append, clear, clearHistory, deleteLast, calculate, appendAndCalculate, loadFromHistory,
    toggleAngleMode, applyPercent, applyNegate,
  }
}
