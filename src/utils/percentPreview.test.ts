import { describe, it, expect } from 'vitest'
import { computePercentPreview, formatPercentPreview } from './percentPreview'
import type { PercentPreviewResult } from './percentPreview'

describe('percentPreview', () => {
  describe('computePercentPreview', () => {
    it('returns empty result for empty expression', () => {
      const preview = computePercentPreview('')
      expect(preview.originalExpression).toBe('')
      expect(preview.percentExpression).toBe('')
      expect(preview.result).toBeNull()
      expect(preview.error).toBeNull()
    })

    it('returns empty result for whitespace-only expression', () => {
      const preview = computePercentPreview('   ')
      expect(preview.originalExpression).toBe('')
      expect(preview.result).toBeNull()
    })

    it('computes percent of a simple number', () => {
      const preview = computePercentPreview('50')
      expect(preview.originalExpression).toBe('50')
      expect(preview.percentExpression).toBe('50 / 100')
      expect(preview.result).toBe('0.5')
      expect(preview.error).toBeNull()
    })

    it('computes percent of zero', () => {
      const preview = computePercentPreview('0')
      expect(preview.result).toBe('0')
      expect(preview.error).toBeNull()
    })

    it('computes percent of a large number', () => {
      const preview = computePercentPreview('10000')
      expect(preview.result).toBe('100')
    })

    it('computes percent of an arithmetic expression', () => {
      const preview = computePercentPreview('200+50')
      expect(preview.percentExpression).toBe('200+50 / 100')
      // 200 + 50/100 = 200.5 (operator precedence)
      expect(preview.result).toBe('200.5')
    })

    it('computes percent of a parenthesized expression', () => {
      const preview = computePercentPreview('(200+50)')
      expect(preview.percentExpression).toBe('(200+50) / 100')
      expect(preview.result).toBe('2.5')
    })

    it('computes percent of a decimal number', () => {
      const preview = computePercentPreview('33.3')
      expect(preview.result).toBe('0.333')
    })

    it('computes percent of a negative number', () => {
      const preview = computePercentPreview('-75')
      expect(preview.result).toBe('-0.75')
    })

    it('returns error for invalid expression', () => {
      const preview = computePercentPreview('2+*3')
      expect(preview.error).toBeTruthy()
      expect(preview.result).toBeNull()
    })

    it('handles trigonometric functions with deg mode', () => {
      const preview = computePercentPreview('sin(90)', 'deg')
      expect(preview.error).toBeNull()
      expect(preview.result).not.toBeNull()
      // sin(90 deg) = 1, 1/100 = 0.01
      expect(parseFloat(preview.result!)).toBeCloseTo(0.01, 2)
    })

    it('handles trigonometric functions with rad mode', () => {
      const preview = computePercentPreview('sin(3.14159265)', 'rad')
      expect(preview.error).toBeNull()
      expect(preview.result).not.toBeNull()
    })

    it('preserves original expression without mutation', () => {
      const expr = '42'
      const preview = computePercentPreview(expr)
      expect(preview.originalExpression).toBe('42')
      expect(expr).toBe('42')
    })

    it('handles expression with special symbols (pi)', () => {
      const preview = computePercentPreview('π')
      expect(preview.error).toBeNull()
      expect(preview.result).not.toBeNull()
      expect(parseFloat(preview.result!)).toBeCloseTo(0.031415926, 5)
    })

    it('handles expression with euler constant', () => {
      const preview = computePercentPreview('ℯ')
      expect(preview.error).toBeNull()
      expect(preview.result).not.toBeNull()
      expect(parseFloat(preview.result!)).toBeCloseTo(0.0271828, 4)
    })

    it('handles factorial expression', () => {
      const preview = computePercentPreview('5!')
      expect(preview.error).toBeNull()
      // 120 / 100 = 1.2
      expect(preview.result).toBe('1.2')
    })
  })

  describe('formatPercentPreview', () => {
    it('returns empty string for empty expression', () => {
      const preview: PercentPreviewResult = {
        originalExpression: '',
        percentExpression: '',
        result: null,
        error: null,
      }
      expect(formatPercentPreview(preview)).toBe('')
    })

    it('formats a successful preview', () => {
      const preview: PercentPreviewResult = {
        originalExpression: '50',
        percentExpression: '50 / 100',
        result: '0.5',
        error: null,
      }
      expect(formatPercentPreview(preview)).toBe('50% = 0.5')
    })

    it('formats an error preview with question mark', () => {
      const preview: PercentPreviewResult = {
        originalExpression: '2+*3',
        percentExpression: '2+*3 / 100',
        result: null,
        error: 'Geçersiz ifade',
      }
      expect(formatPercentPreview(preview)).toBe('2+*3% = ?')
    })

    it('formats large number result', () => {
      const preview: PercentPreviewResult = {
        originalExpression: '10000',
        percentExpression: '10000 / 100',
        result: '100',
        error: null,
      }
      expect(formatPercentPreview(preview)).toBe('10000% = 100')
    })

    it('formats negative result', () => {
      const preview: PercentPreviewResult = {
        originalExpression: '-75',
        percentExpression: '-75 / 100',
        result: '-0.75',
        error: null,
      }
      expect(formatPercentPreview(preview)).toBe('-75% = -0.75')
    })
  })
})
