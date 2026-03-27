import { describe, it, expect } from 'vitest'
import {
  normalizeLn,
  normalizeLog10,
  normalizeLogarithms,
  log10,
  naturalLog,
  logBase,
} from './logarithm'

describe('normalizeLn', () => {
  it('converts ln( to log(', () => {
    expect(normalizeLn('ln(5)')).toBe('log(5)')
  })

  it('converts multiple ln calls', () => {
    expect(normalizeLn('ln(2) + ln(3)')).toBe('log(2) + log(3)')
  })

  it('does not touch log(', () => {
    expect(normalizeLn('log(10)')).toBe('log(10)')
  })

  it('handles nested expressions', () => {
    expect(normalizeLn('ln(2+3)')).toBe('log(2+3)')
  })

  it('returns unchanged string when no ln present', () => {
    expect(normalizeLn('sin(45) + 5')).toBe('sin(45) + 5')
  })
})

describe('normalizeLog10', () => {
  it('converts log10( to log(x, 10)', () => {
    expect(normalizeLog10('log10(100)')).toBe('log(100, 10)')
  })

  it('handles nested parens inside log10', () => {
    expect(normalizeLog10('log10((2+3))')).toBe('log((2+3), 10)')
  })

  it('handles multiple log10 calls', () => {
    expect(normalizeLog10('log10(10) + log10(100)')).toBe(
      'log(10, 10) + log(100, 10)'
    )
  })

  it('does not affect plain log(', () => {
    expect(normalizeLog10('log(5)')).toBe('log(5)')
  })

  it('does not affect words ending with log10', () => {
    expect(normalizeLog10('catalog10(5)')).toBe('catalog10(5)')
  })
})

describe('normalizeLogarithms', () => {
  it('converts ln to natural log and log10 to base-10', () => {
    const result = normalizeLogarithms('ln(5) + log10(100)')
    // ln(5) → log(5) (natural), log10(100) → log(100, 10) (base-10)
    expect(result).toBe('log(5) + log(100, 10)')
  })

  it('handles complex expression', () => {
    const result = normalizeLogarithms('2 * ln(e) + log10(1000)')
    expect(result).toBe('2 * log(e) + log(1000, 10)')
  })

  it('preserves plain log() as mathjs natural log', () => {
    expect(normalizeLogarithms('log(e)')).toBe('log(e)')
  })

  it('preserves expressions without log/ln/log10', () => {
    expect(normalizeLogarithms('sin(45) + 3')).toBe('sin(45) + 3')
  })
})

describe('log10', () => {
  it('calculates log base 10 of 100', () => {
    const result = log10(100)
    expect(result.error).toBeNull()
    expect(result.value).toBe(2)
  })

  it('calculates log base 10 of 1000', () => {
    const result = log10(1000)
    expect(result.error).toBeNull()
    expect(result.value).toBe(3)
  })

  it('calculates log base 10 of 1', () => {
    const result = log10(1)
    expect(result.error).toBeNull()
    expect(result.value).toBe(0)
  })

  it('returns error for zero', () => {
    const result = log10(0)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Logaritma icin pozitif sayi gerekli')
  })

  it('returns error for negative number', () => {
    const result = log10(-5)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Logaritma icin pozitif sayi gerekli')
  })

  it('returns error for Infinity', () => {
    const result = log10(Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })
})

describe('naturalLog', () => {
  it('calculates ln(1) = 0', () => {
    const result = naturalLog(1)
    expect(result.error).toBeNull()
    expect(result.value).toBe(0)
  })

  it('calculates ln(e) ≈ 1', () => {
    const result = naturalLog(Math.E)
    expect(result.error).toBeNull()
    expect(result.value).toBeCloseTo(1, 10)
  })

  it('returns error for zero', () => {
    const result = naturalLog(0)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Logaritma icin pozitif sayi gerekli')
  })

  it('returns error for negative number', () => {
    const result = naturalLog(-3)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Logaritma icin pozitif sayi gerekli')
  })
})

describe('logBase', () => {
  it('calculates log base 2 of 8 = 3', () => {
    const result = logBase(8, 2)
    expect(result.error).toBeNull()
    expect(result.value).toBeCloseTo(3, 10)
  })

  it('calculates log base 3 of 27 = 3', () => {
    const result = logBase(27, 3)
    expect(result.error).toBeNull()
    expect(result.value).toBeCloseTo(3, 10)
  })

  it('returns error for value <= 0', () => {
    const result = logBase(0, 2)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Logaritma icin pozitif sayi gerekli')
  })

  it('returns error for base <= 0', () => {
    const result = logBase(10, 0)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz logaritma tabani')
  })

  it('returns error for base = 1', () => {
    const result = logBase(10, 1)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz logaritma tabani')
  })

  it('returns error for non-finite inputs', () => {
    const result = logBase(Infinity, 2)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })
})
