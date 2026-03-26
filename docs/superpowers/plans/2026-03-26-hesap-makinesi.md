# Bilimsel Hesap Makinesi Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dark mode, ifade tabanlı bilimsel hesap makinesi web uygulaması.

**Architecture:** React + Vite + TypeScript. Kullanıcı tam matematik ifadesi yazar (`sin(45) + √(16)`), `=` ile mathjs hesaplar. Sembol normalizasyonu, açı birimi toggle, localStorage geçmiş paneli dahil.

**Tech Stack:** React 18, Vite 5, TypeScript 5, mathjs 13, Vitest (test)

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/utils/parser.ts` | mathjs wrapper: normalize → evaluate → format |
| `src/utils/parser.test.ts` | parser unit tests |
| `src/hooks/useCalculator.ts` | State management: expression, result, error, history |
| `src/hooks/useCalculator.test.ts` | Hook unit tests |
| `src/hooks/useKeyboard.ts` | Global keyboard listener → useCalculator dispatch |
| `src/components/Button.tsx` | Single button with type-based styling |
| `src/components/ButtonGrid.tsx` | Button layout definition + grid render |
| `src/components/Display.tsx` | Expression + result + error display |
| `src/components/History.tsx` | History panel with click-to-load |
| `src/App.tsx` | Root component wiring everything |
| `src/App.css` | Global dark mode styles |
| `src/main.tsx` | Vite entry point |
| `index.html` | HTML shell |
| `vite.config.ts` | Vite config |
| `tsconfig.json` | TypeScript config |
| `package.json` | Dependencies |

---

## Chunk 1: Project Setup & Parser

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.css`

- [ ] **Step 1: Initialize project with Vite**

```bash
npm create vite@latest . -- --template react-ts
```

If the directory is not empty, confirm overwrite. This creates the standard Vite React-TS scaffold.

- [ ] **Step 2: Install dependencies**

```bash
npm install mathjs
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vitest**

Add to `vite.config.ts`:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
```

Create `src/test-setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts on `http://localhost:5173`, default React page renders.

- [ ] **Step 5: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold vite + react-ts project with vitest"
```

---

### Task 2: Implement `parser.ts` with TDD

**Files:**
- Create: `src/utils/parser.ts`
- Create: `src/utils/parser.test.ts`

- [ ] **Step 1: Write failing tests for parser**

Create `src/utils/parser.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { evaluate, normalize } from './parser'

describe('normalize', () => {
  it('replaces × with *', () => {
    expect(normalize('3 × 5')).toBe('3 * 5')
  })

  it('replaces ÷ with /', () => {
    expect(normalize('10 ÷ 2')).toBe('10 / 2')
  })

  it('replaces √( with sqrt(', () => {
    expect(normalize('√(16)')).toBe('sqrt(16)')
  })

  it('replaces π with pi', () => {
    expect(normalize('2 × π')).toBe('2 * pi')
  })

  it('handles combined symbols', () => {
    expect(normalize('√(16) × π ÷ 2')).toBe('sqrt(16) * pi / 2')
  })
})

describe('evaluate', () => {
  it('evaluates basic arithmetic', () => {
    expect(evaluate('2 + 3')).toEqual({ result: '5', error: null })
  })

  it('evaluates multiplication', () => {
    expect(evaluate('4 × 6')).toEqual({ result: '24', error: null })
  })

  it('evaluates sin in degree mode', () => {
    expect(evaluate('sin(90)', 'deg')).toEqual({ result: '1', error: null })
  })

  it('evaluates sin in radian mode', () => {
    const result = evaluate('sin(3.14159265)', 'rad')
    expect(parseFloat(result.result!)).toBeCloseTo(0, 5)
  })

  it('evaluates sqrt', () => {
    expect(evaluate('√(16)')).toEqual({ result: '4', error: null })
  })

  it('evaluates complex expression', () => {
    expect(evaluate('sin(90) + √(16) × 2', 'deg')).toEqual({ result: '9', error: null })
  })

  it('returns error for division by zero', () => {
    const result = evaluate('1 ÷ 0')
    expect(result.error).toBeTruthy()
  })

  it('returns error for invalid expression', () => {
    const result = evaluate('2 ++ 3')
    expect(result.error).toBeTruthy()
  })

  it('returns specific error for unknown function', () => {
    const result = evaluate('foo(5)')
    expect(result.error).toBe('Bilinmeyen fonksiyon')
  })

  it('returns specific error for division by zero', () => {
    const result = evaluate('1 ÷ 0')
    expect(result.error).toBe('Sıfıra bölme hatası')
  })

  it('returns specific error for invalid syntax', () => {
    const result = evaluate('2 ++ 3')
    expect(result.error).toBe('Geçersiz ifade')
  })

  it('formats large numbers in scientific notation', () => {
    const result = evaluate('10^20')
    expect(result.result).toContain('e')
  })

  it('formats decimals to max 10 significant digits', () => {
    const result = evaluate('1 ÷ 3')
    const sigFigs = result.result!.replace(/^-?0\./, '').replace(/[^0-9]/g, '')
    expect(sigFigs.length).toBeLessThanOrEqual(10)
  })

  it('handles nested trig correctly in degree mode', () => {
    const result = evaluate('sin(sin(90))', 'deg')
    expect(result.error).toBeNull()
    expect(parseFloat(result.result!)).toBeCloseTo(Math.sin(Math.PI / 180), 5)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/utils/parser.test.ts
```

Expected: All tests FAIL (module not found).

- [ ] **Step 3: Implement `parser.ts`**

Create `src/utils/parser.ts`:

```typescript
import { create, all, type MathJsStatic } from 'mathjs'

const math: MathJsStatic = create(all, {})

export type AngleMode = 'deg' | 'rad'

export function normalize(expression: string): string {
  return expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/√\(/g, 'sqrt(')
    .replace(/π/g, 'pi')
}

function toRadians(expr: string): string {
  const trigFns = ['sin', 'cos', 'tan']
  let result = expr
  for (const fn of trigFns) {
    const regex = new RegExp(`${fn}\\(`, 'g')
    result = result.replace(regex, `${fn}(pi/180 * `)
  }
  return result
}

export function evaluate(
  expression: string,
  angleMode: AngleMode = 'deg'
): { result: string | null; error: string | null } {
  try {
    let normalized = normalize(expression)

    if (angleMode === 'deg') {
      normalized = toRadians(normalized)
    }

    const raw = math.evaluate(normalized)

    if (raw === Infinity || raw === -Infinity) {
      return { result: null, error: 'Sıfıra bölme hatası' }
    }

    const formatted = math.format(raw, {
      precision: 10,
      upperExp: 15,
      lowerExp: -7,
    })

    return { result: formatted, error: null }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('Undefined function')) {
      return { result: null, error: 'Bilinmeyen fonksiyon' }
    }
    return { result: null, error: 'Geçersiz ifade' }
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/utils/parser.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/parser.ts src/utils/parser.test.ts
git commit -m "feat: add expression parser with mathjs, normalization, and degree/radian support"
```

---

## Chunk 2: Calculator Hook & Keyboard

### Task 3: Implement `useCalculator` hook with TDD

**Files:**
- Create: `src/hooks/useCalculator.ts`
- Create: `src/hooks/useCalculator.test.ts`

- [ ] **Step 1: Write failing tests for useCalculator**

Create `src/hooks/useCalculator.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

beforeEach(() => {
  localStorage.clear()
})

describe('useCalculator', () => {
  it('starts with empty state', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.expression).toBe('')
    expect(result.current.result).toBe('')
    expect(result.current.error).toBeNull()
  })

  it('appends characters to expression', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('5'))
    act(() => result.current.append('+'))
    act(() => result.current.append('3'))
    expect(result.current.expression).toBe('5+3')
  })

  it('clears expression', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('123'))
    act(() => result.current.clear())
    expect(result.current.expression).toBe('')
    expect(result.current.result).toBe('')
    expect(result.current.error).toBeNull()
  })

  it('deletes last character', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('123'))
    act(() => result.current.deleteLast())
    expect(result.current.expression).toBe('12')
  })

  it('evaluates expression on calculate', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2+3'))
    act(() => result.current.calculate())
    expect(result.current.result).toBe('5')
    expect(result.current.error).toBeNull()
  })

  it('shows error for invalid expression', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2++3'))
    act(() => result.current.calculate())
    expect(result.current.error).toBeTruthy()
  })

  it('adds successful calculation to history', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2+3'))
    act(() => result.current.calculate())
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].expression).toBe('2+3')
    expect(result.current.history[0].result).toBe('5')
  })

  it('does not add failed calculation to history', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2++'))
    act(() => result.current.calculate())
    expect(result.current.history).toHaveLength(0)
  })

  it('loads expression from history', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2+3'))
    act(() => result.current.calculate())
    act(() => result.current.clear())
    act(() => result.current.loadFromHistory(0))
    expect(result.current.expression).toBe('2+3')
  })

  it('toggles angle mode', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.angleMode).toBe('deg')
    act(() => result.current.toggleAngleMode())
    expect(result.current.angleMode).toBe('rad')
    act(() => result.current.toggleAngleMode())
    expect(result.current.angleMode).toBe('deg')
  })

  it('applies percent', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('50'))
    act(() => result.current.applyPercent())
    expect(result.current.expression).toBe('50 / 100')
  })

  it('applies negate', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('42'))
    act(() => result.current.applyNegate())
    expect(result.current.expression).toBe('-(42)')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/hooks/useCalculator.test.ts
```

Expected: All tests FAIL.

- [ ] **Step 3: Implement `useCalculator.ts`**

Create `src/hooks/useCalculator.ts`:

```typescript
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
    expression,
    result,
    error,
    history,
    angleMode,
    append,
    clear,
    deleteLast,
    calculate,
    loadFromHistory,
    toggleAngleMode,
    applyPercent,
    applyNegate,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/hooks/useCalculator.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCalculator.ts src/hooks/useCalculator.test.ts
git commit -m "feat: add useCalculator hook with state management, history, and angle mode"
```

---

### Task 4: Implement `useKeyboard` hook

**Files:**
- Create: `src/hooks/useKeyboard.ts`

- [ ] **Step 1: Implement `useKeyboard.ts`**

Create `src/hooks/useKeyboard.ts`:

```typescript
import { useEffect } from 'react'

interface KeyboardActions {
  append: (value: string) => void
  clear: () => void
  deleteLast: () => void
  calculate: () => void
  applyPercent: () => void
  applyNegate: () => void
}

const KEY_MAP: Record<string, string> = {
  s: 'sin(',
  c: 'cos(',
  t: 'tan(',
  n: 'ln(',
  g: 'log(',
  r: 'sqrt(',
}

export function useKeyboard(actions: KeyboardActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const key = e.key

      if (/^[0-9.]$/.test(key)) {
        e.preventDefault()
        actions.append(key)
      } else if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault()
        actions.append(key)
      } else if (['(', ')'].includes(key)) {
        e.preventDefault()
        actions.append(key)
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        actions.calculate()
      } else if (key === 'Backspace') {
        e.preventDefault()
        actions.deleteLast()
      } else if (key === 'Escape') {
        e.preventDefault()
        actions.clear()
      } else if (key === '%') {
        e.preventDefault()
        actions.applyPercent()
      } else if (key in KEY_MAP) {
        e.preventDefault()
        actions.append(KEY_MAP[key])
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [actions])
}
```

- [ ] **Step 2: Verify no build errors**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useKeyboard.ts
git commit -m "feat: add keyboard support hook with function shortcuts"
```

---

## Chunk 3: UI Components

### Task 5: Implement `Button.tsx`

**Files:**
- Create: `src/components/Button.tsx`

- [ ] **Step 1: Implement Button component**

Create `src/components/Button.tsx`:

```tsx
import { type ReactNode } from 'react'

export type ButtonVariant = 'number' | 'operator' | 'scientific' | 'action' | 'equals'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  variant?: ButtonVariant
  wide?: boolean
}

const VARIANT_COLORS: Record<ButtonVariant, string> = {
  number: '#2C2C2E',
  operator: '#3A3A3C',
  scientific: '#2C2C3E',
  action: '#FF453A',
  equals: '#FF9F0A',
}

export function Button({ children, onClick, variant = 'number', wide = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: VARIANT_COLORS[variant],
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontSize: variant === 'scientific' ? '14px' : '20px',
        fontWeight: 500,
        cursor: 'pointer',
        padding: '16px',
        gridColumn: wide ? 'span 2' : 'span 1',
        transition: 'filter 150ms, transform 100ms',
        userSelect: 'none',
      }}
      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Button.tsx
git commit -m "feat: add Button component with variant-based styling"
```

---

### Task 6: Implement `Display.tsx`

**Files:**
- Create: `src/components/Display.tsx`

- [ ] **Step 1: Implement Display component**

Create `src/components/Display.tsx`:

```tsx
interface DisplayProps {
  expression: string
  result: string
  error: string | null
}

export function Display({ expression, result, error }: DisplayProps) {
  return (
    <div
      style={{
        backgroundColor: '#1C1C1E',
        padding: '20px 24px',
        borderRadius: '16px',
        marginBottom: '12px',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      }}
    >
      <div
        style={{
          color: '#EBEBF580',
          fontSize: '18px',
          wordBreak: 'break-all',
          textAlign: 'right',
          width: '100%',
          minHeight: '24px',
        }}
      >
        {expression || '\u00A0'}
      </div>
      <div
        style={{
          color: error ? '#FF453A' : '#FFFFFF',
          fontSize: error ? '18px' : '36px',
          fontWeight: 700,
          textAlign: 'right',
          width: '100%',
          marginTop: '8px',
          animation: error ? 'shake 300ms' : 'fadeIn 200ms',
        }}
      >
        {error || result || '0'}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Display.tsx
git commit -m "feat: add Display component for expression and result"
```

---

### Task 7: Implement `ButtonGrid.tsx`

**Files:**
- Create: `src/components/ButtonGrid.tsx`

- [ ] **Step 1: Implement ButtonGrid**

Create `src/components/ButtonGrid.tsx`:

```tsx
import { Button, type ButtonVariant } from './Button'

interface ButtonDef {
  label: string
  value: string
  variant: ButtonVariant
  wide?: boolean
}

const SCIENTIFIC_ROW: ButtonDef[] = [
  { label: 'sin', value: 'sin(', variant: 'scientific' },
  { label: 'cos', value: 'cos(', variant: 'scientific' },
  { label: 'tan', value: 'tan(', variant: 'scientific' },
  { label: 'log', value: 'log(', variant: 'scientific' },
  { label: 'ln', value: 'ln(', variant: 'scientific' },
  { label: '√', value: '√(', variant: 'scientific' },
  { label: '^', value: '^', variant: 'scientific' },
  { label: '(', value: '(', variant: 'scientific' },
  { label: ')', value: ')', variant: 'scientific' },
  { label: 'π', value: 'π', variant: 'scientific' },
]

const MAIN_GRID: ButtonDef[] = [
  { label: 'C', value: 'clear', variant: 'action' },
  { label: '±', value: 'negate', variant: 'operator' },
  { label: '%', value: 'percent', variant: 'operator' },
  { label: '÷', value: '÷', variant: 'operator' },
  { label: '7', value: '7', variant: 'number' },
  { label: '8', value: '8', variant: 'number' },
  { label: '9', value: '9', variant: 'number' },
  { label: '×', value: '×', variant: 'operator' },
  { label: '4', value: '4', variant: 'number' },
  { label: '5', value: '5', variant: 'number' },
  { label: '6', value: '6', variant: 'number' },
  { label: '−', value: '-', variant: 'operator' },
  { label: '1', value: '1', variant: 'number' },
  { label: '2', value: '2', variant: 'number' },
  { label: '3', value: '3', variant: 'number' },
  { label: '+', value: '+', variant: 'operator' },
  { label: '0', value: '0', variant: 'number', wide: true },
  { label: '.', value: '.', variant: 'number' },
  { label: '=', value: 'equals', variant: 'equals' },
]

interface ButtonGridProps {
  onAppend: (value: string) => void
  onClear: () => void
  onCalculate: () => void
  onPercent: () => void
  onNegate: () => void
}

export function ButtonGrid({ onAppend, onClear, onCalculate, onPercent, onNegate }: ButtonGridProps) {
  const handleClick = (value: string) => {
    switch (value) {
      case 'clear': onClear(); break
      case 'equals': onCalculate(); break
      case 'percent': onPercent(); break
      case 'negate': onNegate(); break
      default: onAppend(value)
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '6px',
          marginBottom: '6px',
        }}
      >
        {SCIENTIFIC_ROW.map(btn => (
          <Button key={btn.label} variant={btn.variant} onClick={() => handleClick(btn.value)}>
            {btn.label}
          </Button>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {MAIN_GRID.map(btn => (
          <Button
            key={btn.label}
            variant={btn.variant}
            wide={btn.wide}
            onClick={() => handleClick(btn.value)}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ButtonGrid.tsx
git commit -m "feat: add ButtonGrid with scientific and main button layouts"
```

---

### Task 8: Implement `History.tsx`

**Files:**
- Create: `src/components/History.tsx`

- [ ] **Step 1: Implement History component**

Create `src/components/History.tsx`:

```tsx
interface HistoryEntry {
  expression: string
  result: string
  timestamp: number
}

interface HistoryProps {
  entries: HistoryEntry[]
  onLoad: (index: number) => void
}

export function History({ entries, onLoad }: HistoryProps) {
  if (entries.length === 0) return null

  return (
    <div
      style={{
        backgroundColor: '#2C2C2E',
        borderRadius: '12px',
        padding: '12px',
        marginTop: '12px',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      <div style={{ color: '#EBEBF580', fontSize: '12px', marginBottom: '8px' }}>
        Geçmiş
      </div>
      {entries.map((entry, i) => (
        <div
          key={entry.timestamp}
          onClick={() => onLoad(i)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '4px',
            transition: 'background 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3A3A3C')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={{ color: '#EBEBF580', fontSize: '13px' }}>{entry.expression}</div>
          <div style={{ color: '#FFFFFF', fontSize: '16px' }}>= {entry.result}</div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/History.tsx
git commit -m "feat: add History panel with click-to-load"
```

---

## Chunk 4: Wiring & Styles

### Task 9: Wire everything in `App.tsx` + global styles

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Implement App.tsx**

Replace `src/App.tsx` with:

```tsx
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
```

- [ ] **Step 2: Implement App.css**

Replace `src/App.css` with:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #000000;
  color: #ffffff;
}

.calculator-app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
}

.calculator-container {
  background-color: #1C1C1E;
  border-radius: 24px;
  padding: 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.calculator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calculator-header h1 {
  font-size: 18px;
  font-weight: 600;
  color: #EBEBF580;
}

.angle-toggle {
  background: #2C2C3E;
  color: #FF9F0A;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 150ms;
  letter-spacing: 1px;
}

.angle-toggle:hover {
  filter: brightness(1.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

- [ ] **Step 3: Clean up unused default files**

Delete `src/index.css` (if exists) and remove its import from `src/main.tsx`. Ensure `src/main.tsx` only imports `App`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 4: Verify app runs**

```bash
npm run dev
```

Expected: App renders with dark calculator UI, buttons are clickable, expressions appear in display, `=` calculates result.

- [ ] **Step 5: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: wire calculator app with dark mode UI, keyboard support, and history"
```

---

### Task 10: Final verification

- [ ] **Step 1: Type check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Test suite**

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 3: Manual test checklist**

Open `http://localhost:5173` and verify:

1. Type `sin(90)` using keyboard → press Enter → result is `1`
2. Click `√` then `1 6 )` then `=` → result is `4`
3. Click `C` → expression clears
4. Type invalid expression `2++3` → press Enter → error message appears in red
5. Toggle DEG/RAD → verify `sin(90)` gives different results
6. Previous calculations appear in history panel
7. Click a history entry → expression loads into display
8. Backspace deletes last character
9. Escape clears everything
10. All buttons have hover/press animations

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final verification pass"
```
