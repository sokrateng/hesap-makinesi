export interface KeyboardShortcut {
  readonly key: string
  readonly label: string
  readonly description: string
  readonly category: ShortcutCategory
}

export type ShortcutCategory = 'digits' | 'operators' | 'functions' | 'actions'

const CATEGORY_LABELS: Readonly<Record<ShortcutCategory, string>> = {
  digits: 'Rakamlar',
  operators: 'Operatorler',
  functions: 'Fonksiyonlar',
  actions: 'Islemler',
}

const SHORTCUTS: readonly KeyboardShortcut[] = [
  { key: '0-9', label: '0–9', description: 'Rakam gir', category: 'digits' },
  { key: '.', label: '.', description: 'Ondalik ayirici', category: 'digits' },
  { key: '+', label: '+', description: 'Toplama', category: 'operators' },
  { key: '-', label: '−', description: 'Cikarma', category: 'operators' },
  { key: '*', label: '×', description: 'Carpma', category: 'operators' },
  { key: '/', label: '÷', description: 'Bolme', category: 'operators' },
  { key: '%', label: '%', description: 'Yuzde', category: 'operators' },
  { key: '(', label: '(', description: 'Parantez ac', category: 'operators' },
  { key: ')', label: ')', description: 'Parantez kapa', category: 'operators' },
  { key: 's', label: 's', description: 'sin(', category: 'functions' },
  { key: 'c', label: 'c', description: 'cos(', category: 'functions' },
  { key: 't', label: 't', description: 'tan(', category: 'functions' },
  { key: 'n', label: 'n', description: 'ln(', category: 'functions' },
  { key: 'g', label: 'g', description: 'log(', category: 'functions' },
  { key: 'r', label: 'r', description: 'sqrt(', category: 'functions' },
  { key: 'Enter', label: 'Enter / =', description: 'Hesapla', category: 'actions' },
  { key: 'Backspace', label: '⌫ Backspace', description: 'Son karakteri sil', category: 'actions' },
  { key: 'Escape', label: 'Esc', description: 'Temizle', category: 'actions' },
]

export function getShortcuts(): readonly KeyboardShortcut[] {
  return SHORTCUTS
}

export function getShortcutsByCategory(): ReadonlyMap<ShortcutCategory, readonly KeyboardShortcut[]> {
  const grouped = new Map<ShortcutCategory, KeyboardShortcut[]>()

  for (const shortcut of SHORTCUTS) {
    const existing = grouped.get(shortcut.category) ?? []
    grouped.set(shortcut.category, [...existing, shortcut])
  }

  return grouped
}

export function getCategoryLabel(category: ShortcutCategory): string {
  return CATEGORY_LABELS[category]
}

export function findShortcutByKey(key: string): KeyboardShortcut | undefined {
  return SHORTCUTS.find((s) => s.key === key)
}
