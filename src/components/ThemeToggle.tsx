import type { ThemePreference } from '../hooks/useTheme'

interface ThemeToggleProps {
  preference: ThemePreference
  onToggle: () => void
}

const ICONS: Record<ThemePreference, string> = {
  dark: '🌙',
  light: '☀️',
  system: '💻',
}

const LABELS: Record<ThemePreference, string> = {
  dark: 'Koyu',
  light: 'Açık',
  system: 'Sistem',
}

export function ThemeToggle({ preference, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={`Tema: ${LABELS[preference]}`}
      style={{
        background: 'var(--bg-scientific)',
        color: 'var(--color-accent)',
        border: 'none',
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'filter 150ms',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.3)')}
      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
    >
      <span>{ICONS[preference]}</span>
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px' }}>
        {LABELS[preference].toUpperCase()}
      </span>
    </button>
  )
}
