import { useMemo } from 'react'
import { useCalculator } from './hooks/useCalculator'
import { useKeyboard } from './hooks/useKeyboard'
import { Display } from './components/Display'
import { ButtonGrid } from './components/ButtonGrid'
import { History } from './components/History'
import './App.css'

function App() {
  const calc = useCalculator()

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
          <button className="angle-toggle" onClick={calc.toggleAngleMode}>
            {calc.angleMode.toUpperCase()}
          </button>
        </div>
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
