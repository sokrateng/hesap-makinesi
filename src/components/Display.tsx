interface DisplayProps {
  expression: string
  result: string
  error: string | null
}

export function Display({ expression, result, error }: DisplayProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-display)',
        padding: '20px 24px',
        borderRadius: '16px',
        marginBottom: '12px',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        transition: 'background-color 300ms',
      }}
    >
      <div
        style={{
          color: 'var(--text-expression)',
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
          color: error ? 'var(--text-error)' : 'var(--text-result)',
          fontSize: error ? '18px' : '36px',
          fontWeight: 700,
          textAlign: 'right',
          width: '100%',
          marginTop: '8px',
          animation: error ? 'shake 300ms' : result ? 'fadeIn 200ms' : 'none',
        }}
      >
        {error || result || '0'}
      </div>
    </div>
  )
}
