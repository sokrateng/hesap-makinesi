import { useState, useMemo } from 'react'
import { searchHistory } from '../utils/searchHistory'

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
  const [query, setQuery] = useState('')

  const filteredEntries = useMemo(() => {
    if (query.trim() === '') {
      return entries.map((entry, i) => ({ entry, originalIndex: i }))
    }
    return searchHistory(entries, query)
  }, [entries, query])

  if (entries.length === 0) return null

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-history)',
        borderRadius: '12px',
        padding: '12px',
        marginTop: '12px',
        maxHeight: '240px',
        overflowY: 'auto',
        transition: 'background-color 300ms',
      }}
    >
      <div style={{ color: 'var(--text-history-label)', fontSize: '12px', marginBottom: '8px' }}>
        Gecmis
      </div>
      <input
        type="text"
        placeholder="Gecmiste ara..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 10px',
          marginBottom: '8px',
          border: '1px solid var(--text-history-label)',
          borderRadius: '8px',
          backgroundColor: 'transparent',
          color: 'var(--text-history-expr)',
          fontSize: '13px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {filteredEntries.length === 0 && query.trim() !== '' && (
        <div style={{ color: 'var(--text-history-label)', fontSize: '12px', textAlign: 'center', padding: '8px' }}>
          Sonuc bulunamadi
        </div>
      )}
      {filteredEntries.map(({ entry, originalIndex }) => (
        <div
          key={entry.timestamp}
          onClick={() => onLoad(originalIndex)}
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
