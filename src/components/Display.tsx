import { formatResult } from '../utils/formatNumber'
import type { CopyStatus } from '../hooks/useCopyToClipboard'

interface DisplayProps {
  expression: string
  result: string
  previousResult?: string
  error: string | null
  justCalculated?: boolean
  copyStatus?: CopyStatus
  onCopyResult?: () => void
}

const COPY_LABEL: Record<CopyStatus, string> = {
  idle: '',
  copied: 'Kopyalandı!',
  failed: 'Kopyalanamadı',
}

export function Display({ expression, result, previousResult, error, justCalculated, copyStatus, onCopyResult }: DisplayProps) {
  const displayResult = result ? formatResult(result) : ''
  const displayPrevResult = previousResult ? formatResult(previousResult) : ''
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
      {displayPrevResult && (
        <div
          style={{
            color: 'var(--text-expression)',
            fontSize: '13px',
            opacity: 0.4,
            textAlign: 'right',
            width: '100%',
            marginBottom: '4px',
          }}
        >
          onceki = {displayPrevResult}
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
          color: error ? 'var(--text-error)' : readyForNew ? 'var(--text-result)' : 'var(--text-result)',
          fontSize: error ? '18px' : '36px',
          fontWeight: 700,
          textAlign: 'right',
          width: '100%',
          marginTop: '8px',
          animation: error ? 'shake 300ms' : result ? 'fadeIn 200ms' : 'none',
          cursor: canCopy ? 'pointer' : 'default',
          opacity: 1,
          transition: 'opacity 500ms',
        }}
      >
        {error || displayResult || '0'}
      </div>
      {justCalculated && !error && result && (
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-expression)',
            opacity: 0.4,
            marginTop: '4px',
            textAlign: 'right',
            width: '100%',
          }}
        >
          rakam = yeni hesap | operator = devam
        </div>
      )}
    </div>
  )
}
