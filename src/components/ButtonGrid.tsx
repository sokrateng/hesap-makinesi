import { Button, type ButtonVariant } from './Button'

interface ButtonDef {
  label: string
  value: string
  variant: ButtonVariant
  wide?: boolean
}

const SCIENTIFIC_ROWS: ButtonDef[][] = [
  [
    { label: 'sin', value: 'sin(', variant: 'scientific' },
    { label: 'cos', value: 'cos(', variant: 'scientific' },
    { label: 'tan', value: 'tan(', variant: 'scientific' },
    { label: 'asin', value: 'arcsin(', variant: 'scientific' },
    { label: 'acos', value: 'arccos(', variant: 'scientific' },
    { label: 'atan', value: 'arctan(', variant: 'scientific' },
  ],
  [
    { label: 'log', value: 'log10(', variant: 'scientific' },
    { label: 'ln', value: 'ln(', variant: 'scientific' },
    { label: '√', value: '√(', variant: 'scientific' },
    { label: '∛', value: '∛(', variant: 'scientific' },
    { label: '^', value: '^', variant: 'scientific' },
    { label: '|x|', value: 'abs(', variant: 'scientific' },
  ],
  [
    { label: 'π', value: 'π', variant: 'scientific' },
    { label: 'ℯ', value: 'ℯ', variant: 'scientific' },
    { label: 'x²', value: '²', variant: 'scientific' },
    { label: 'x³', value: '³', variant: 'scientific' },
    { label: '(', value: '(', variant: 'scientific' },
    { label: ')', value: ')', variant: 'scientific' },
  ],
  [
    { label: 'sinh', value: 'sinh(', variant: 'scientific' },
    { label: 'cosh', value: 'cosh(', variant: 'scientific' },
    { label: 'tanh', value: 'tanh(', variant: 'scientific' },
    { label: 'nCr', value: 'nCr(', variant: 'scientific' },
    { label: 'nPr', value: 'nPr(', variant: 'scientific' },
    { label: '!', value: '!', variant: 'scientific' },
  ],
  [
    { label: 'gcd', value: 'gcd(', variant: 'scientific' },
    { label: 'lcm', value: 'lcm(', variant: 'scientific' },
    { label: 'rand', value: 'rand', variant: 'scientific' },
    { label: 'prime?', value: 'isPrime(', variant: 'scientific' },
    { label: 'mod', value: 'mod(', variant: 'scientific' },
  ],
  [
    { label: 'round', value: 'round(', variant: 'scientific' },
    { label: '⌈x⌉', value: 'ceil(', variant: 'scientific' },
    { label: '⌊x⌋', value: 'floor(', variant: 'scientific' },
  ],
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
      case 'rand': {
        const r = Math.random().toFixed(4)
        onAppend(r)
        break
      }
      default: onAppend(value)
    }
  }

  return (
    <div>
      {SCIENTIFIC_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '6px',
            marginBottom: '6px',
          }}
        >
          {row.map(btn => (
            <Button key={btn.label} variant={btn.variant} onClick={() => handleClick(btn.value)}>
              {btn.label}
            </Button>
          ))}
        </div>
      ))}
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
