import { useState } from 'react'
import {
  getShortcutsByCategory,
  getCategoryLabel,
} from '../utils/keyboardShortcuts'
import type { ShortcutCategory, KeyboardShortcut } from '../utils/keyboardShortcuts'

export function KeyboardShortcutPanel() {
  const [open, setOpen] = useState(false)
  const grouped = getShortcutsByCategory()

  return (
    <div style={{ marginTop: '12px' }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Klavye kisayollari"
        style={{
          background: 'var(--bg-history)',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '13px',
          color: 'var(--text-history-label)',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          transition: 'background-color 150ms',
        }}
      >
        ⌨ Klavye Kisayollari {open ? '▴' : '▾'}
      </button>

      {open && (
        <div
          role="region"
          aria-label="Klavye kisayol listesi"
          style={{
            backgroundColor: 'var(--bg-history)',
            borderRadius: '12px',
            padding: '12px',
            marginTop: '6px',
            maxHeight: '260px',
            overflowY: 'auto',
            transition: 'background-color 300ms',
          }}
        >
          {Array.from(grouped.entries()).map(([category, shortcuts]) => (
            <ShortcutGroup
              key={category}
              category={category}
              shortcuts={shortcuts}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ShortcutGroupProps {
  readonly category: ShortcutCategory
  readonly shortcuts: readonly KeyboardShortcut[]
}

function ShortcutGroup({ category, shortcuts }: ShortcutGroupProps) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div
        style={{
          color: 'var(--text-history-label)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '4px',
        }}
      >
        {getCategoryLabel(category)}
      </div>
      {shortcuts.map((s) => (
        <div
          key={s.key}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 6px',
            borderRadius: '6px',
            fontSize: '13px',
          }}
        >
          <kbd
            style={{
              backgroundColor: 'var(--bg-history-hover, rgba(128,128,128,0.15))',
              borderRadius: '4px',
              padding: '2px 7px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: 'var(--text-history-result)',
              minWidth: '60px',
              textAlign: 'center',
              display: 'inline-block',
            }}
          >
            {s.label}
          </kbd>
          <span style={{ color: 'var(--text-history-expr)', marginLeft: '12px', flex: 1 }}>
            {s.description}
          </span>
        </div>
      ))}
    </div>
  )
}
