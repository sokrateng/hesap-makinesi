interface HistoryEntry {
  expression: string
  result: string
  timestamp: number
}

interface HistoryProps {
  entries: HistoryEntry[]
  onLoad: (index: number) => void
}

export function History({ entries, onLoad }: HistoryProps) {
  if (entries.length === 0) return null

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-history)',
        borderRadius: '12px',
        padding: '12px',
        marginTop: '12px',
        maxHeight: '200px',
        overflowY: 'auto',
        transition: 'background-color 300ms',
      }}
    >
      <div style={{ color: 'var(--text-history-label)', fontSize: '12px', marginBottom: '8px' }}>
        Gecmis
      </div>
      {entries.map((entry, i) => (
        <div
          key={entry.timestamp}
          onClick={() => onLoad(i)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '4px',
            transition: 'background 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-history-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={{ color: 'var(--text-history-expr)', fontSize: '13px' }}>{entry.expression}</div>
          <div style={{ color: 'var(--text-history-result)', fontSize: '16px' }}>= {entry.result}</div>
        </div>
      ))}
    </div>
  )
}
