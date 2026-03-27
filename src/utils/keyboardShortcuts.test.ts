import { describe, it, expect } from 'vitest'
import {
  getShortcuts,
  getShortcutsByCategory,
  getCategoryLabel,
  findShortcutByKey,
} from './keyboardShortcuts'
import type { ShortcutCategory } from './keyboardShortcuts'

describe('keyboardShortcuts', () => {
  describe('getShortcuts', () => {
    it('returns a non-empty array of shortcuts', () => {
      const shortcuts = getShortcuts()
      expect(shortcuts.length).toBeGreaterThan(0)
    })

    it('each shortcut has required fields', () => {
      const shortcuts = getShortcuts()
      for (const s of shortcuts) {
        expect(s.key).toBeTruthy()
        expect(s.label).toBeTruthy()
        expect(s.description).toBeTruthy()
        expect(s.category).toBeTruthy()
      }
    })

    it('includes all expected categories', () => {
      const shortcuts = getShortcuts()
      const categories = new Set(shortcuts.map((s) => s.category))
      expect(categories.has('digits')).toBe(true)
      expect(categories.has('operators')).toBe(true)
      expect(categories.has('functions')).toBe(true)
      expect(categories.has('actions')).toBe(true)
    })

    it('returns the same reference on repeated calls (immutable)', () => {
      const a = getShortcuts()
      const b = getShortcuts()
      expect(a).toBe(b)
    })
  })

  describe('getShortcutsByCategory', () => {
    it('groups shortcuts into 4 categories', () => {
      const grouped = getShortcutsByCategory()
      expect(grouped.size).toBe(4)
    })

    it('total count matches getShortcuts length', () => {
      const grouped = getShortcutsByCategory()
      let total = 0
      for (const items of grouped.values()) {
        total += items.length
      }
      expect(total).toBe(getShortcuts().length)
    })

    it('each group only contains shortcuts of that category', () => {
      const grouped = getShortcutsByCategory()
      for (const [category, items] of grouped.entries()) {
        for (const item of items) {
          expect(item.category).toBe(category)
        }
      }
    })
  })

  describe('getCategoryLabel', () => {
    it('returns Turkish label for each category', () => {
      const cases: Array<[ShortcutCategory, string]> = [
        ['digits', 'Rakamlar'],
        ['operators', 'Operatorler'],
        ['functions', 'Fonksiyonlar'],
        ['actions', 'Islemler'],
      ]
      for (const [cat, label] of cases) {
        expect(getCategoryLabel(cat)).toBe(label)
      }
    })
  })

  describe('findShortcutByKey', () => {
    it('finds existing shortcut by key', () => {
      const result = findShortcutByKey('s')
      expect(result).toBeDefined()
      expect(result?.description).toBe('sin(')
    })

    it('finds Enter shortcut', () => {
      const result = findShortcutByKey('Enter')
      expect(result).toBeDefined()
      expect(result?.category).toBe('actions')
    })

    it('returns undefined for unknown key', () => {
      const result = findShortcutByKey('z')
      expect(result).toBeUndefined()
    })
  })
})
