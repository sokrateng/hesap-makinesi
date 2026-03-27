interface BackspaceButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function BackspaceButton({ onClick, disabled = false }: BackspaceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Son karakteri sil"
      title="Backspace (⌫)"
      style={{
        backgroundColor: 'var(--bg-action)',
        color: 'var(--text-button)',
        border: 'none',
        borderRadius: 'var(--btn-radius)',
        fontSize: 'var(--btn-font-size)',
        fontWeight: 500,
        cursor: disabled ? 'default' : 'pointer',
        padding: '8px 14px',
        transition: 'filter 150ms, transform 100ms, background-color 300ms',
        userSelect: 'none',
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.filter = 'brightness(1.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.filter = 'brightness(1)'
      }}
      onMouseDown={e => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.95)'
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      ⌫
    </button>
  )
}
