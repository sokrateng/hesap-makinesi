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
