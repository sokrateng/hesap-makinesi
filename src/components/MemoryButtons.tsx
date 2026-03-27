interface MemoryButtonsProps {
  readonly hasMemory: boolean
  readonly onMemoryAdd: () => void
  readonly onMemorySubtract: () => void
  readonly onMemoryRecall: () => void
  readonly onMemoryClear: () => void
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-scientific)',
  color: 'var(--text-button)',
  border: 'none',
  borderRadius: 'var(--btn-radius)',
  fontSize: 'var(--btn-sci-font-size)',
  fontWeight: 500,
  cursor: 'pointer',
  padding: '10px 8px',
  transition: 'filter 150ms, transform 100ms, background-color 300ms',
  userSelect: 'none',
}

const disabledStyle: React.CSSProperties = {
  ...buttonStyle,
  opacity: 0.4,
  cursor: 'default',
}

export function MemoryButtons({
  hasMemory,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryRecall,
  onMemoryClear,
}: MemoryButtonsProps) {
  return (
    <>
      <button
        style={buttonStyle}
        onClick={onMemoryAdd}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        title="Hafizaya ekle (M+)"
      >
        M+
      </button>
      <button
        style={buttonStyle}
        onClick={onMemorySubtract}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        title="Hafizadan cikar (M-)"
      >
        M−
      </button>
      <button
        style={hasMemory ? buttonStyle : disabledStyle}
        onClick={hasMemory ? onMemoryRecall : undefined}
        onMouseEnter={hasMemory ? e => (e.currentTarget.style.filter = 'brightness(1.2)') : undefined}
        onMouseLeave={hasMemory ? e => (e.currentTarget.style.filter = 'brightness(1)') : undefined}
        onMouseDown={hasMemory ? e => (e.currentTarget.style.transform = 'scale(0.95)') : undefined}
        onMouseUp={hasMemory ? e => (e.currentTarget.style.transform = 'scale(1)') : undefined}
        title="Hafizadan geri cagir (MR)"
      >
        MR
      </button>
      <button
        style={hasMemory ? buttonStyle : disabledStyle}
        onClick={hasMemory ? onMemoryClear : undefined}
        onMouseEnter={hasMemory ? e => (e.currentTarget.style.filter = 'brightness(1.2)') : undefined}
        onMouseLeave={hasMemory ? e => (e.currentTarget.style.filter = 'brightness(1)') : undefined}
        onMouseDown={hasMemory ? e => (e.currentTarget.style.transform = 'scale(0.95)') : undefined}
        onMouseUp={hasMemory ? e => (e.currentTarget.style.transform = 'scale(1)') : undefined}
        title="Hafizayi temizle (MC)"
      >
        MC
      </button>
    </>
  )
}
