import { useState, useCallback } from 'react'

interface ClearHistoryButtonProps {
  onClear: () => void
  disabled?: boolean
}

export function ClearHistoryButton({ onClear, disabled = false }: ClearHistoryButtonProps): JSX.Element | null {
  const [confirming, setConfirming] = useState(false)

  const handleClick = useCallback(() => {
    if (confirming) {
      onClear()
      setConfirming(false)
    } else {
      setConfirming(true)
    }
  }, [confirming, onClear])

  const handleCancel = useCallback(() => {
    setConfirming(false)
  }, [])

  if (disabled) return null

  return (
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '8px' }}>
      {confirming && (
        <button
          onClick={handleCancel}
          aria-label="Gecmisi silmeyi iptal et"
          style={{
            background: 'transparent',
            border: '1px solid var(--text-history-label, #888)',
            color: 'var(--text-history-label, #888)',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'opacity 150ms',
          }}
        >
          Iptal
        </button>
      )}
      <button
        onClick={handleClick}
        aria-label={confirming ? 'Gecmisi silmeyi onayla' : 'Gecmisi temizle'}
        style={{
          background: confirming ? 'var(--color-error, #FF453A)' : 'transparent',
          border: confirming ? 'none' : '1px solid var(--text-history-label, #888)',
          color: confirming ? '#fff' : 'var(--text-history-label, #888)',
          borderRadius: '8px',
          padding: '4px 10px',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'background 150ms, color 150ms',
        }}
      >
        {confirming ? 'Emin misin?' : 'Gecmisi Temizle'}
      </button>
    </div>
  )
}
