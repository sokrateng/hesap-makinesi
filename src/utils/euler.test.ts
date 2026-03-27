import { describe, it, expect } from 'vitest'
import { evaluate, normalize } from './parser'

describe('Euler constant (ℯ) support', () => {
  describe('normalize', () => {
    it('replaces ℯ with e', () => {
      expect(normalize('ℯ')).toBe('e')
    })

    it('replaces ℯ in expression', () => {
      expect(normalize('2 × ℯ')).toBe('2 * e')
    })

    it('replaces multiple ℯ occurrences', () => {
      expect(normalize('ℯ + ℯ')).toBe('e + e')
    })

    it('handles ℯ with power operator', () => {
      expect(normalize('ℯ^2')).toBe('e^2')
    })

    it('handles ℯ combined with π', () => {
      expect(normalize('ℯ × π')).toBe('e * pi')
    })
  })

  describe('evaluate with ℯ', () => {
    it('evaluates ℯ alone to Euler number', () => {
      const result = evaluate('ℯ')
      expect(result.error).toBeNull()
      expect(parseFloat(result.result!)).toBeCloseTo(Math.E, 5)
    })

    it('evaluates ℯ^1 to Euler number', () => {
      const result = evaluate('ℯ^1')
      expect(result.error).toBeNull()
      expect(parseFloat(result.result!)).toBeCloseTo(Math.E, 5)
    })

    it('evaluates ℯ^2 correctly', () => {
      const result = evaluate('ℯ^2')
      expect(result.error).toBeNull()
      expect(parseFloat(result.result!)).toBeCloseTo(Math.E ** 2, 5)
    })

    it('evaluates 2 × ℯ correctly', () => {
      const result = evaluate('2 × ℯ')
      expect(result.error).toBeNull()
      expect(parseFloat(result.result!)).toBeCloseTo(2 * Math.E, 5)
    })

    it('evaluates log(ℯ) to 1 (natural log)', () => {
      const result = evaluate('log(ℯ)')
      expect(result.error).toBeNull()
      expect(parseFloat(result.result!)).toBeCloseTo(1, 5)
    })

    it('evaluates ℯ × π correctly', () => {
      const result = evaluate('ℯ × π')
      expect(result.error).toBeNull()
      expect(parseFloat(result.result!)).toBeCloseTo(Math.E * Math.PI, 5)
    })

    it('evaluates ℯ + 1 correctly', () => {
      const result = evaluate('ℯ + 1')
      expect(result.error).toBeNull()
      expect(parseFloat(result.result!)).toBeCloseTo(Math.E + 1, 5)
    })
  })
})
