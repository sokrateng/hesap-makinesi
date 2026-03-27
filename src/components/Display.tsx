import { formatResult } from '../utils/formatNumber'
import type { CopyStatus } from '../hooks/useCopyToClipboard'

interface DisplayProps {
  expression: string
  result: string
  error: string | null
  copyStatus?: CopyStatus
  onCopyResult?: () => void
}

const COPY_LABEL: Record<CopyStatus, string> = {
  idle: '',
  copied: 'Kopyalandı!',
  failed: 'Kopyalanamadı',
}

export function Display({ expression, result, error, copyStatus, onCopyResult }: DisplayProps) {
  const displayResult = result ? formatResult(result) : ''
  const canCopy = !!result && !error && !!onCopyResult

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
        position: 'relative',
      }}
    >
      {copyStatus && copyStatus !== 'idle' && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            fontSize: '12px',
            color: copyStatus === 'copied'
              ? 'var(--text-result, #30D158)'
              : 'var(--text-error, #FF453A)',
            animation: 'fadeIn 200ms',
          }}
        >
          {COPY_LABEL[copyStatus]}
        </div>
      )}
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
        role={canCopy ? 'button' : undefined}
        tabIndex={canCopy ? 0 : undefined}
        onClick={canCopy ? onCopyResult : undefined}
        onKeyDown={canCopy ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onCopyResult!()
          }
        } : undefined}
        title={canCopy ? 'Sonucu kopyala' : undefined}
        style={{
          color: error ? 'var(--text-error)' : 'var(--text-result)',
          fontSize: error ? '18px' : '36px',
          fontWeight: 700,
          textAlign: 'right',
          width: '100%',
          marginTop: '8px',
          animation: error ? 'shake 300ms' : result ? 'fadeIn 200ms' : 'none',
          cursor: canCopy ? 'pointer' : 'default',
        }}
      >
        {error || displayResult || '0'}
      </div>
    </div>
  )
}
