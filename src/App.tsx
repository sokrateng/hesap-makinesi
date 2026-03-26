import { useMemo, useCallback, useEffect, useRef } from 'react'
import { useCalculator } from './hooks/useCalculator'
import { useKeyboard } from './hooks/useKeyboard'
import { useTheme } from './hooks/useTheme'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { speechToMath } from './utils/speechToMath'
import { speakResult } from './utils/speak'
import { Display } from './components/Display'
import { ButtonGrid } from './components/ButtonGrid'
import { History } from './components/History'
import { ThemeToggle } from './components/ThemeToggle'
import { MicButton } from './components/MicButton'
import './App.css'

function App() {
  const calc = useCalculator()
  const theme = useTheme()
  const speechTriggeredRef = useRef(false)
  const autoCalcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSpeechCalculate = useCallback(() => {
    speechTriggeredRef.current = true
    calc.calculate()
  }, [calc.calculate])

  const handleSpeechResult = useCallback((transcript: string) => {
    if (autoCalcTimerRef.current) {
      clearTimeout(autoCalcTimerRef.current)
      autoCalcTimerRef.current = null
    }

    const result = speechToMath(transcript)

    if (result.type === 'command') {
      if (result.value === 'clear') calc.clear()
      else if (result.value === 'equals') doSpeechCalculate()
    } else {
      calc.append(result.value)

      if (result.autoCalculate) {
        setTimeout(doSpeechCalculate, 100)
      } else {
        autoCalcTimerRef.current = setTimeout(doSpeechCalculate, 1500)
      }
    }
  }, [calc.append, calc.clear, doSpeechCalculate])

  useEffect(() => {
    if (speechTriggeredRef.current && calc.result && !calc.error) {
      speechTriggeredRef.current = false
      speakResult(calc.expression, calc.result)
    }
  }, [calc.result, calc.error, calc.expression])

  useEffect(() => {
    return () => {
      if (autoCalcTimerRef.current) clearTimeout(autoCalcTimerRef.current)
    }
  }, [])

  const speech = useSpeechRecognition(handleSpeechResult)

  const keyboardActions = useMemo(() => ({
    append: calc.append,
    clear: calc.clear,
    deleteLast: calc.deleteLast,
    calculate: calc.calculate,
    applyPercent: calc.applyPercent,
    applyNegate: calc.applyNegate,
  }), [calc.append, calc.clear, calc.deleteLast, calc.calculate, calc.applyPercent, calc.applyNegate])

  useKeyboard(keyboardActions)

  return (
    <div className="calculator-app">
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Hesap Makinesi</h1>
          <div className="header-controls">
            <button className="angle-toggle" onClick={calc.toggleAngleMode}>
              {calc.angleMode.toUpperCase()}
            </button>
            <MicButton
              status={speech.status}
              onToggle={speech.toggle}
              isSupported={speech.isSupported}
            />
            <ThemeToggle
              preference={theme.preference}
              onToggle={theme.cycleTheme}
            />
          </div>
        </div>
        {speech.interim && (
          <div className="mic-status">
            {speech.interim}...
          </div>
        )}
        <Display
          expression={calc.expression}
          result={calc.result}
          error={calc.error}
        />
        <ButtonGrid
          onAppend={calc.append}
          onClear={calc.clear}
          onCalculate={calc.calculate}
          onPercent={calc.applyPercent}
          onNegate={calc.applyNegate}
        />
        <History
          entries={calc.history}
          onLoad={calc.loadFromHistory}
        />
      </div>
    </div>
  )
}

export default App
