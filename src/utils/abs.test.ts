import { describe, it, expect } from 'vitest'
import { evaluate, normalize, normalizeAbsoluteValue } from './parser'

describe('Absolute value (abs) support', () => {
  describe('normalizeAbsoluteValue', () => {
    it('converts |x| to abs(x)', () => {
      expect(normalizeAbsoluteValue('|5|')).toBe('abs(5)')
    })

    it('converts |-3| to abs(-3)', () => {
      expect(normalizeAbsoluteValue('|-3|')).toBe('abs(-3)')
    })

    it('converts expression with |x| to abs(x)', () => {
      expect(normalizeAbsoluteValue('1 + |5|')).toBe('1 + abs(5)')
    })

    it('handles nested absolute values', () => {
      expect(normalizeAbsoluteValue('||5||')).toBe('abs(abs(5))')
    })

    it('returns expression unchanged when no pipes', () => {
      expect(normalizeAbsoluteValue('3 + 5')).toBe('3 + 5')
    })
  })

  describe('normalize with absolute value', () => {
    it('converts |x| in a full expression', () => {
      expect(normalize('|5| + 3')).toBe('abs(5) + 3')
    })

    it('combines absolute value with other normalizations', () => {
      expect(normalize('|5| × π')).toBe('abs(5) * pi')
    })
  })

  describe('evaluate with abs', () => {
    it('evaluates abs(5) to 5', () => {
      expect(evaluate('abs(5)')).toEqual({ result: '5', error: null })
    })

    it('evaluates abs(-7) to 7', () => {
      expect(evaluate('abs(-7)')).toEqual({ result: '7', error: null })
    })

    it('evaluates |−3| pipe notation to 3', () => {
      expect(evaluate('|-3|')).toEqual({ result: '3', error: null })
    })

    it('evaluates |0| to 0', () => {
      expect(evaluate('|0|')).toEqual({ result: '0', error: null })
    })

    it('evaluates expression with abs: 1 + |-5|', () => {
      expect(evaluate('1 + |-5|')).toEqual({ result: '6', error: null })
    })

    it('evaluates abs of expression: |3 - 10|', () => {
      expect(evaluate('|3 - 10|')).toEqual({ result: '7', error: null })
    })

    it('evaluates nested abs: abs(abs(-2))', () => {
      expect(evaluate('abs(abs(-2))')).toEqual({ result: '2', error: null })
    })

    it('evaluates abs with multiplication: |−4| × 3', () => {
      expect(evaluate('|-4| × 3')).toEqual({ result: '12', error: null })
    })

    it('evaluates abs with decimal: abs(-3.14)', () => {
      const result = evaluate('abs(-3.14)')
      expect(result.error).toBeNull()
      expect(parseFloat(result.result!)).toBeCloseTo(3.14, 5)
    })
  })
})
