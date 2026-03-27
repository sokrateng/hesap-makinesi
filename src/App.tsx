import { useMemo, useCallback } from 'react'
import { useCalculator } from './hooks/useCalculator'
import { useKeyboard } from './hooks/useKeyboard'
import { useHistoryNavigation } from './hooks/useHistoryNavigation'
import { useTheme } from './hooks/useTheme'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useCopyToClipboard } from './hooks/useCopyToClipboard'
import { useMemory } from './hooks/useMemory'
import { speechToMath } from './utils/speechToMath'
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
    if (recalled !== null) calc.append(String(recalled))
  }, [mem.memoryRecall, calc.append])

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

  const keyboardActions = useMemo(() => ({
    append: calc.append,
    clear: calc.clear,
    deleteLast: calc.deleteLast,
    calculate: () => calc.calculate(),
    applyPercent: calc.applyPercent,
    applyNegate: calc.applyNegate,
  }), [calc.append, calc.clear, calc.deleteLast, calc.calculate, calc.applyPercent, calc.applyNegate])

  useKeyboard(keyboardActions)

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
        <ValidationWarnings expression={calc.expression} />
        <Display
          expression={calc.expression}
          result={calc.result}
          error={calc.error}
          copyStatus={clipboard.status}
          onCopyResult={handleCopyResult}
        />
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
            onClick={() => calc.append('Ans')}
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
            onClick={calc.deleteLast}
            disabled={!calc.expression}
          />
        </div>
        <ButtonGrid
          onAppend={calc.append}
          onClear={calc.clear}
          onCalculate={() => calc.calculate()}
          onPercent={calc.applyPercent}
          onNegate={calc.applyNegate}
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
