import { useMemo, useCallback, useRef, useEffect } from 'react'
import { useCalculator } from './hooks/useCalculator'
import { useKeyboard } from './hooks/useKeyboard'
import { useTheme } from './hooks/useTheme'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { speechToMath } from './utils/speechToMath'
import { speakResult } from './utils/speakResult'
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
  const prevResultRef = useRef('')

  useEffect(() => {
    if (speechTriggeredRef.current && calc.result && calc.result !== prevResultRef.current) {
      speakResult(calc.result)
      speechTriggeredRef.current = false
    }
    prevResultRef.current = calc.result
  }, [calc.result])

  useEffect(() => {
    if (speechTriggeredRef.current && calc.error) {
      speakResult(calc.error)
      speechTriggeredRef.current = false
    }
  }, [calc.error])

  const handleSpeechResult = useCallback((transcript: string) => {
    const result = speechToMath(transcript)

    if (result.type === 'command') {
      if (result.value === 'clear') calc.clear()
      else if (result.value === 'equals') {
        speechTriggeredRef.current = true
        calc.calculate()
      }
    } else {
      if (result.value.endsWith('=')) {
        calc.append(result.value.slice(0, -1))
        speechTriggeredRef.current = true
        setTimeout(() => calc.calculate(), 50)
      } else {
        calc.append(result.value)
      }
    }
  }, [calc.append, calc.clear, calc.calculate])

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
