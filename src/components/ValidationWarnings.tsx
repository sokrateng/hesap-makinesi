import { validateExpression, type ValidationError } from '../utils/validateExpression'

interface ValidationWarningsProps {
  expression: string
}

/**
 * Shows real-time validation warnings for the current expression.
 * Displays issues like unmatched parentheses, consecutive operators, etc.
 * Only shows when there are actual validation errors and the expression is non-empty.
 */
export function ValidationWarnings({ expression }: ValidationWarningsProps) {
  if (!expression.trim()) return null

  const { valid, errors } = validateExpression(expression)

  if (valid || errors.length === 0) return null

  // Filter out trailing operator warnings while user is still typing
  // (trailing operator is expected mid-input)
  const meaningfulErrors = errors.filter(
    (e: ValidationError) => e.type !== 'trailing_operator'
  )

  if (meaningfulErrors.length === 0) return null

  return (
    <div
      data-testid="validation-warnings"
      style={{
        padding: '6px 12px',
        marginBottom: '6px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-display)',
        border: '1px solid var(--text-error, #FF453A)',
        fontSize: '11px',
        color: 'var(--text-error, #FF453A)',
        lineHeight: '1.5',
        transition: 'background-color 300ms',
        animation: 'fadeIn 200ms',
      }}
    >
      {meaningfulErrors.map((err: ValidationError, i: number) => (
        <div key={`${err.type}-${err.position ?? i}`}>
          ⚠ {err.message}
        </div>
      ))}
    </div>
  )
}
