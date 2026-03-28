import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useCalculator } from './hooks/useCalculator'
import { useKeyboard } from './hooks/useKeyboard'
import { useHistoryNavigation } from './hooks/useHistoryNavigation'
import { useTheme } from './hooks/useTheme'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useCopyToClipboard } from './hooks/useCopyToClipboard'
import { useMemory } from './hooks/useMemory'
import { speechToMath } from './utils/speechToMath'
import { getParamGuide, createGuideState, formatGuideExpression, formatGuideHint, type GuideState } from './utils/functionGuide'
import { Display } from './components/Display'
import { BaseConversionDisplay } from './components/BaseConversionDisplay'
import { ValidationWarnings } from './components/ValidationWarnings'
import { ButtonGrid } from './components/ButtonGrid'
import { MemoryButtons } from './components/MemoryButtons'
import { History } from './components/History'
import { ThemeToggle } from './components/ThemeToggle'
import { MicButton } from './components/MicButton'
import { BackspaceButton } from './components/BackspaceButton'
import { ClearHistoryButton } from './components/ClearHistoryButton'
import './theme.css'
import './App.css'

function App() {
  const calc = useCalculator()
  const { theme, cycleTheme } = useTheme()
  const clipboard = useCopyToClipboard()
  const mem = useMemory()
  const [guide, setGuide] = useState<GuideState | null>(null)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [sciCollapsed, setSciCollapsed] = useState(true)
  const [autoAdvanceRemaining, setAutoAdvanceRemaining] = useState<number | null>(null)
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoAdvanceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const displayRef = useRef<HTMLDivElement>(null)
  const sciAutoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startSciAutoClose = useCallback(() => {
    if (sciAutoCloseRef.current) clearTimeout(sciAutoCloseRef.current)
    sciAutoCloseRef.current = setTimeout(() => {
      setSciCollapsed(true)
      sciAutoCloseRef.current = null
    }, 4000)
  }, [])

  const clearSciAutoClose = useCallback(() => {
    if (sciAutoCloseRef.current) {
      clearTimeout(sciAutoCloseRef.current)
      sciAutoCloseRef.current = null
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const clearAutoAdvanceTimers = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current)
      autoAdvanceTimerRef.current = null
    }
    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current)
      autoAdvanceIntervalRef.current = null
    }
    setAutoAdvanceRemaining(null)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return
    touchStartYRef.current = e.touches[0].clientY
  }, [isMobile])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || touchStartYRef.current === null) return
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current
    touchStartYRef.current = null
    if (Math.abs(deltaY) < 50) return
    if (deltaY > 0) {
      setSciCollapsed(false)
    } else {
      setSciCollapsed(true)
    }
  }, [isMobile])

  const handleHistorySelect = useCallback((expr: string) => {
    calc.clear()
    if (expr) calc.append(expr)
  }, [calc.clear, calc.append])

  useHistoryNavigation({
    history: calc.history,
    onSelect: handleHistorySelect,
  })

  const handleMemoryAdd = useCallback(() => {
    const val = parseFloat(calc.result)
    if (!isNaN(val)) mem.memoryAdd(val)
  }, [calc.result, mem.memoryAdd])

  const handleMemorySubtract = useCallback(() => {
    const val = parseFloat(calc.result)
    if (!isNaN(val)) mem.memorySubtract(val)
  }, [calc.result, mem.memorySubtract])

  const handleMemoryRecall = useCallback(() => {
    const recalled = mem.memoryRecall()
    if (recalled !== null) {
      if (guide) {
        handleGuideInput(String(recalled))
      } else {
        calc.append(String(recalled))
      }
    }
  }, [mem.memoryRecall, calc.append, guide])

  const handleCopyResult = useCallback(() => {
    if (calc.result) {
      clipboard.copy(calc.result)
    }
  }, [calc.result, clipboard.copy])

  const handleSpeechResult = useCallback((transcript: string) => {
    const result = speechToMath(transcript)

    if (result.type === 'command') {
      if (result.value === 'clear') calc.clear()
      else if (result.value === 'equals') {
        calc.calculate({ speak: true })
      }
    } else {
      const expr = result.value.endsWith('=') ? result.value.slice(0, -1) : result.value
      calc.appendAndCalculate(expr, { speak: true })
    }
  }, [calc.clear, calc.calculate, calc.appendAndCalculate])

  const speech = useSpeechRecognition(handleSpeechResult)

  const finishGuide = useCallback((state: GuideState) => {
    const expr = `${state.funcName}(${state.values.join(',')})`
    calc.append(expr)
    setGuide(null)
  }, [calc.append])

  // Auto-advance timer for guide mode: after 3s of non-empty param, advance to next
  useEffect(() => {
    clearAutoAdvanceTimers()

    if (!guide) return
    const currentVal = guide.values[guide.currentParamIndex]
    if (currentVal.trim() === '') return

    setAutoAdvanceRemaining(3)
    autoAdvanceIntervalRef.current = setInterval(() => {
      setAutoAdvanceRemaining(prev => (prev !== null && prev > 1 ? prev - 1 : prev))
    }, 1000)

    autoAdvanceTimerRef.current = setTimeout(() => {
      setGuide(prev => {
        if (!prev) return null
        if (prev.values[prev.currentParamIndex].trim() === '') return prev
        const nextIndex = prev.currentParamIndex + 1
        if (nextIndex >= prev.params.length) {
          finishGuide(prev)
          return null
        }
        return { ...prev, currentParamIndex: nextIndex }
      })
      setAutoAdvanceRemaining(null)
      if (autoAdvanceIntervalRef.current) {
        clearInterval(autoAdvanceIntervalRef.current)
        autoAdvanceIntervalRef.current = null
      }
    }, 3000)

    return () => clearAutoAdvanceTimers()
  }, [guide?.currentParamIndex, guide?.values[guide?.currentParamIndex ?? 0], finishGuide, clearAutoAdvanceTimers])

  const handleGuideInput = useCallback((value: string) => {
    if (!guide) return

    setGuide(prev => {
      if (!prev) return null
      const updated = { ...prev, values: [...prev.values] }
      updated.values[prev.currentParamIndex] = prev.values[prev.currentParamIndex] + value
      return updated
    })
  }, [guide])

  const handleAppend = useCallback((value: string) => {
    if (guide) {
      if (value === ',' || value === ')') {
        clearAutoAdvanceTimers()
        setGuide(prev => {
          if (!prev) return null
          if (prev.values[prev.currentParamIndex].trim() === '') return prev
          const nextIndex = prev.currentParamIndex + 1
          if (nextIndex >= prev.params.length || value === ')') {
            finishGuide(prev)
            return null
          }
          return { ...prev, currentParamIndex: nextIndex }
        })
        return
      }

      handleGuideInput(value)
      return
    }

    const paramGuide = getParamGuide(value)
    if (paramGuide) {
      if (calc.justCalculated) {
        // Function after completed calculation = new calculation
        calc.clear()
      }
      setGuide(createGuideState(paramGuide))
      if (isMobile && !sciCollapsed) startSciAutoClose()
      return
    }

    if (isMobile && !sciCollapsed) startSciAutoClose()
    calc.append(value)
  }, [guide, calc.append, calc.clear, calc.justCalculated, handleGuideInput, finishGuide, isMobile, sciCollapsed, startSciAutoClose])

  const handleClear = useCallback(() => {
    if (guide) {
      clearAutoAdvanceTimers()
      setGuide(null)
      return
    }
    calc.clear()
  }, [guide, calc.clear, clearAutoAdvanceTimers])

  const handleDeleteLast = useCallback(() => {
    if (guide) {
      setGuide(prev => {
        if (!prev) return null
        const currentVal = prev.values[prev.currentParamIndex]
        if (currentVal.length > 0) {
          const updated = { ...prev, values: [...prev.values] }
          updated.values[prev.currentParamIndex] = currentVal.slice(0, -1)
          return updated
        }
        if (prev.currentParamIndex > 0) {
          return { ...prev, currentParamIndex: prev.currentParamIndex - 1 }
        }
        return null
      })
      return
    }
    calc.deleteLast()
  }, [guide, calc.deleteLast])

  const handleCalculate = useCallback(() => {
    if (guide) {
      clearAutoAdvanceTimers()
      if (guide.values[guide.currentParamIndex].trim() !== '') {
        finishGuide(guide)
      }
      return
    }
    calc.calculate()
  }, [guide, calc.calculate, finishGuide, clearAutoAdvanceTimers])

  const keyboardActions = useMemo(() => ({
    append: handleAppend,
    clear: handleClear,
    deleteLast: handleDeleteLast,
    calculate: handleCalculate,
    applyPercent: calc.applyPercent,
    applyNegate: calc.applyNegate,
  }), [handleAppend, handleClear, handleDeleteLast, handleCalculate, calc.applyPercent, calc.applyNegate])

  useKeyboard(keyboardActions)

  const displayExpression = guide
    ? calc.expression + formatGuideExpression(guide)
    : calc.expression

  return (
    <div className="calculator-app">
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Hesap Makinesi</h1>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <MicButton
              status={speech.status}
              onToggle={speech.toggle}
              isSupported={speech.isSupported}
            />
            <ThemeToggle theme={theme} onCycle={cycleTheme} />
            <button className="angle-toggle" onClick={calc.toggleAngleMode}>
              {calc.angleMode.toUpperCase()}
            </button>
          </div>
        </div>
        {speech.interim && (
          <div className="mic-status">
            {speech.interim}...
          </div>
        )}
        {speech.error && (
          <div className="mic-status" style={{ color: 'var(--color-error, #FF453A)' }}>
            {speech.error}
          </div>
        )}
        {guide && (
          <div style={{
            backgroundColor: 'rgba(255, 169, 77, 0.12)',
            border: '1px solid rgba(255, 169, 77, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '8px',
            fontSize: '13px',
            color: '#ffa94d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>{formatGuideHint(guide)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {autoAdvanceRemaining !== null && (
                <span className="auto-advance-indicator" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: '#ffa94d',
                  opacity: 0.9,
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '24px',
                    height: '4px',
                    backgroundColor: 'rgba(255, 169, 77, 0.25)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <span style={{
                      display: 'block',
                      height: '100%',
                      width: `${(autoAdvanceRemaining / 3) * 100}%`,
                      backgroundColor: '#ffa94d',
                      borderRadius: '2px',
                      transition: 'width 0.3s',
                    }} />
                  </span>
                  {autoAdvanceRemaining}s
                </span>
              )}
              <span style={{ fontSize: '11px', opacity: 0.7 }}>
                {guide.params.length > 1 ? ', = sonraki | ' : ''}= veya ) = tamam | ESC = iptal
              </span>
            </span>
          </div>
        )}
        <ValidationWarnings expression={displayExpression} />
        <div
          ref={displayRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Display
            expression={displayExpression}
            result={calc.result}
            previousResult={calc.previousResult}
            error={calc.error}
            justCalculated={calc.justCalculated}
            copyStatus={clipboard.status}
            onCopyResult={handleCopyResult}
          />
        </div>
        <BaseConversionDisplay result={calc.result} error={calc.error} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '6px' }}>
          <MemoryButtons
            hasMemory={mem.hasMemory}
            onMemoryAdd={handleMemoryAdd}
            onMemorySubtract={handleMemorySubtract}
            onMemoryRecall={handleMemoryRecall}
            onMemoryClear={mem.memoryClear}
          />
          <button
            className="btn-scientific"
            onClick={() => handleAppend('Ans')}
            style={{
              backgroundColor: 'var(--bg-scientific)',
              color: 'var(--text-button)',
              border: 'none',
              borderRadius: 'var(--btn-radius)',
              fontSize: 'var(--btn-sci-font-size)',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '10px 8px',
              transition: 'filter 150ms, transform 100ms',
              userSelect: 'none',
            }}
          >
            Ans
          </button>
          <BackspaceButton
            onClick={handleDeleteLast}
            disabled={!calc.expression && !guide}
          />
        </div>
        <ButtonGrid
          onAppend={handleAppend}
          onClear={handleClear}
          onCalculate={handleCalculate}
          onPercent={calc.applyPercent}
          onNegate={calc.applyNegate}
          collapsed={sciCollapsed}
          onToggle={() => { clearSciAutoClose(); setSciCollapsed(prev => !prev) }}
          isMobile={isMobile}
        />
        <History
          entries={calc.history}
          onLoad={calc.loadFromHistory}
        />
        <ClearHistoryButton
          onClear={calc.clearHistory}
          disabled={calc.history.length === 0}
        />
      </div>
    </div>
  )
}

export default App
