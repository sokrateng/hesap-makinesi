import { describe, it, expect } from 'vitest'
import { normalizeRounding, roundNumber, ceilNumber, floorNumber } from './rounding'
import { evaluate } from './parser'

describe('normalizeRounding', () => {
  it('converts yuvarla to round', () => {
    expect(normalizeRounding('yuvarla(3.7)')).toBe('round(3.7)')
  })

  it('converts tavan to ceil', () => {
    expect(normalizeRounding('tavan(3.2)')).toBe('ceil(3.2)')
  })

  it('converts taban to floor', () => {
    expect(normalizeRounding('taban(3.9)')).toBe('floor(3.9)')
  })

  it('is case insensitive', () => {
    expect(normalizeRounding('YUVARLA(5.5)')).toBe('round(5.5)')
    expect(normalizeRounding('Tavan(2.1)')).toBe('ceil(2.1)')
    expect(normalizeRounding('TABAN(7.8)')).toBe('floor(7.8)')
  })

  it('preserves other content', () => {
    expect(normalizeRounding('2+3')).toBe('2+3')
    expect(normalizeRounding('')).toBe('')
  })

  it('handles multiple occurrences', () => {
    expect(normalizeRounding('yuvarla(3.5) + tavan(2.1)')).toBe('round(3.5) + ceil(2.1)')
  })
})

describe('roundNumber', () => {
  it('rounds to nearest integer', () => {
    expect(roundNumber(3.7)).toEqual({ value: 4, error: null })
    expect(roundNumber(3.2)).toEqual({ value: 3, error: null })
    expect(roundNumber(3.5)).toEqual({ value: 4, error: null })
  })

  it('rounds to specified decimal places', () => {
    expect(roundNumber(3.456, 2)).toEqual({ value: 3.46, error: null })
    expect(roundNumber(3.456, 1)).toEqual({ value: 3.5, error: null })
    expect(roundNumber(3.456, 0)).toEqual({ value: 3, error: null })
  })

  it('handles negative numbers', () => {
    expect(roundNumber(-3.7)).toEqual({ value: -4, error: null })
    expect(roundNumber(-3.2)).toEqual({ value: -3, error: null })
  })

  it('handles integers', () => {
    expect(roundNumber(5)).toEqual({ value: 5, error: null })
  })

  it('returns error for non-finite input', () => {
    expect(roundNumber(Infinity)).toEqual({ value: null, error: 'Gecersiz giris' })
    expect(roundNumber(NaN)).toEqual({ value: null, error: 'Gecersiz giris' })
  })
})

describe('ceilNumber', () => {
  it('returns ceiling of positive numbers', () => {
    expect(ceilNumber(3.2)).toEqual({ value: 4, error: null })
    expect(ceilNumber(3.9)).toEqual({ value: 4, error: null })
    expect(ceilNumber(3.0)).toEqual({ value: 3, error: null })
  })

  it('returns ceiling of negative numbers', () => {
    expect(ceilNumber(-3.2)).toEqual({ value: -3, error: null })
    expect(ceilNumber(-3.9)).toEqual({ value: -3, error: null })
  })

  it('returns error for non-finite input', () => {
    expect(ceilNumber(Infinity)).toEqual({ value: null, error: 'Gecersiz giris' })
  })
})

describe('floorNumber', () => {
  it('returns floor of positive numbers', () => {
    expect(floorNumber(3.2)).toEqual({ value: 3, error: null })
    expect(floorNumber(3.9)).toEqual({ value: 3, error: null })
    expect(floorNumber(3.0)).toEqual({ value: 3, error: null })
  })

  it('returns floor of negative numbers', () => {
    expect(floorNumber(-3.2)).toEqual({ value: -4, error: null })
    expect(floorNumber(-3.9)).toEqual({ value: -4, error: null })
  })

  it('returns error for non-finite input', () => {
    expect(floorNumber(NaN)).toEqual({ value: null, error: 'Gecersiz giris' })
  })
})

describe('rounding via parser evaluate', () => {
  it('evaluates round()', () => {
    const result = evaluate('round(3.7)')
    expect(result.error).toBeNull()
    expect(result.result).toBe('4')
  })

  it('evaluates ceil()', () => {
    const result = evaluate('ceil(3.2)')
    expect(result.error).toBeNull()
    expect(result.result).toBe('4')
  })

  it('evaluates floor()', () => {
    const result = evaluate('floor(3.9)')
    expect(result.error).toBeNull()
    expect(result.result).toBe('3')
  })

  it('evaluates round with decimal places', () => {
    const result = evaluate('round(3.456, 2)')
    expect(result.error).toBeNull()
    expect(result.result).toBe('3.46')
  })

  it('evaluates rounding in complex expression', () => {
    const result = evaluate('round(3.7) + ceil(2.1)')
    expect(result.error).toBeNull()
    expect(result.result).toBe('7')
  })

  it('evaluates Turkish aliases via normalize', () => {
    const result = evaluate('yuvarla(3.7)')
    expect(result.error).toBeNull()
    expect(result.result).toBe('4')
  })
})
