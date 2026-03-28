import { type ReactNode, useState, useRef, useCallback } from 'react'
import { type FunctionTooltip } from '../utils/functionTooltips'

export type ButtonVariant = 'number' | 'operator' | 'scientific' | 'action' | 'equals'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  variant?: ButtonVariant
  wide?: boolean
  tooltip?: FunctionTooltip
}

const VARIANT_CSS_VAR: Record<ButtonVariant, string> = {
  number: 'var(--bg-number)',
  operator: 'var(--bg-operator)',
  scientific: 'var(--bg-scientific)',
  action: 'var(--bg-action)',
  equals: 'var(--bg-equals)',
}

const HOVER_DELAY_MS = 2000

export function Button({ children, onClick, variant = 'number', wide = false, tooltip }: ButtonProps) {
  const isEquals = variant === 'equals'
  const [showTooltip, setShowTooltip] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.filter = 'brightness(1.2)'
    if (tooltip) {
      timerRef.current = setTimeout(() => setShowTooltip(true), HOVER_DELAY_MS)
    }
  }, [tooltip])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.filter = 'brightness(1)'
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setShowTooltip(false)
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        onClick={onClick}
        style={{
          backgroundColor: VARIANT_CSS_VAR[variant],
          color: isEquals ? 'var(--text-equals)' : 'var(--text-button)',
          border: 'none',
          borderRadius: 'var(--btn-radius)',
          fontSize: variant === 'scientific' ? 'var(--btn-sci-font-size)' : 'var(--btn-font-size)',
          fontWeight: 500,
          cursor: 'pointer',
          padding: '16px',
          width: '100%',
          gridColumn: wide ? 'span 2' : 'span 1',
          transition: 'filter 150ms, transform 100ms, background-color 300ms',
          userSelect: 'none',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {children}
      </button>
      {showTooltip && tooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(30, 30, 40, 0.97)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '10px 14px',
            zIndex: 1000,
            minWidth: '200px',
            maxWidth: '280px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
          role="tooltip"
        >
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#ffa94d',
            marginBottom: '4px',
          }}>
            {tooltip.name}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '8px',
            lineHeight: '1.4',
          }}>
            {tooltip.description}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '4px',
            fontWeight: 500,
          }}>
            Ornekler:
          </div>
          {tooltip.examples.map((ex, i) => (
            <div
              key={i}
              style={{
                fontSize: '12px',
                color: '#69db7c',
                fontFamily: 'monospace',
                padding: '2px 0',
              }}
            >
              {ex}
            </div>
          ))}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '12px',
            height: '12px',
            backgroundColor: 'rgba(30, 30, 40, 0.97)',
            borderRight: '1px solid rgba(255,255,255,0.15)',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }} />
        </div>
      )}
    </div>
  )
}
