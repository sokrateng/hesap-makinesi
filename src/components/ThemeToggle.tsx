import { type Theme, THEME_LABELS, THEME_EMOJI } from '../hooks/useTheme'

interface ThemeToggleProps {
  theme: Theme
  onCycle: () => void
}

export function ThemeToggle({ theme, onCycle }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" onClick={onCycle} title="Tema değiştir">
      <span className="theme-emoji">{THEME_EMOJI[theme]}</span>
      <span className="theme-label">{THEME_LABELS[theme]}</span>
    </button>
  )
}
