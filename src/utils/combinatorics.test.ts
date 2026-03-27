import { describe, it, expect } from 'vitest'
import {
  normalizeNCr,
  normalizeNPr,
  normalizeCombinatorics,
  combinations,
  permutations,
  buildNCrExpression,
  buildNPrExpression,
} from './combinatorics'

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

describe('normalizeNCr', () => {
  it('replaces nCr( with combinations(', () => {
    expect(normalizeNCr('nCr(5, 2)')).toBe('combinations(5, 2)')
  })

  it('handles multiple occurrences', () => {
    expect(normalizeNCr('nCr(5, 2) + nCr(10, 3)')).toBe('combinations(5, 2) + combinations(10, 3)')
  })

  it('leaves strings without nCr unchanged', () => {
    expect(normalizeNCr('sqrt(16)')).toBe('sqrt(16)')
  })
})

describe('normalizeNPr', () => {
  it('replaces nPr( with permutations(', () => {
    expect(normalizeNPr('nPr(5, 2)')).toBe('permutations(5, 2)')
  })

  it('handles multiple occurrences', () => {
    expect(normalizeNPr('nPr(5, 2) + nPr(10, 3)')).toBe('permutations(5, 2) + permutations(10, 3)')
  })

  it('leaves strings without nPr unchanged', () => {
    expect(normalizeNPr('cbrt(27)')).toBe('cbrt(27)')
  })
})

describe('normalizeCombinatorics', () => {
  it('applies both normalizations', () => {
    expect(normalizeCombinatorics('nCr(5, 2) + nPr(5, 2)')).toBe(
      'combinations(5, 2) + permutations(5, 2)'
    )
  })

  it('handles expression with no combinatorics symbols', () => {
    expect(normalizeCombinatorics('2 + 3')).toBe('2 + 3')
  })
})

// ---------------------------------------------------------------------------
// combinations
// ---------------------------------------------------------------------------

describe('combinations', () => {
  it('calculates C(5, 2) = 10', () => {
    const r = combinations(5, 2)
    expect(r.error).toBeNull()
    expect(r.value).toBe(10)
  })

  it('calculates C(10, 3) = 120', () => {
    const r = combinations(10, 3)
    expect(r.error).toBeNull()
    expect(r.value).toBe(120)
  })

  it('calculates C(n, 0) = 1', () => {
    const r = combinations(5, 0)
    expect(r.error).toBeNull()
    expect(r.value).toBe(1)
  })

  it('calculates C(n, n) = 1', () => {
    const r = combinations(7, 7)
    expect(r.error).toBeNull()
    expect(r.value).toBe(1)
  })

  it('calculates C(0, 0) = 1', () => {
    const r = combinations(0, 0)
    expect(r.error).toBeNull()
    expect(r.value).toBe(1)
  })

  it('calculates C(20, 10) = 184756', () => {
    const r = combinations(20, 10)
    expect(r.error).toBeNull()
    expect(r.value).toBe(184756)
  })

  it('returns error when k > n', () => {
    const r = combinations(3, 5)
    expect(r.value).toBeNull()
    expect(r.error).toBe('k degeri n degerinden buyuk olamaz')
  })

  it('returns error for negative values', () => {
    const r = combinations(-1, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Negatif deger kullanilamaz')
  })

  it('returns error for non-integer values', () => {
    const r = combinations(5.5, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Tam sayi gerekli')
  })

  it('returns error for Infinity input', () => {
    const r = combinations(Infinity, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })

  it('returns error for NaN input', () => {
    const r = combinations(NaN, 3)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })
})

// ---------------------------------------------------------------------------
// permutations
// ---------------------------------------------------------------------------

describe('permutations', () => {
  it('calculates P(5, 2) = 20', () => {
    const r = permutations(5, 2)
    expect(r.error).toBeNull()
    expect(r.value).toBe(20)
  })

  it('calculates P(10, 3) = 720', () => {
    const r = permutations(10, 3)
    expect(r.error).toBeNull()
    expect(r.value).toBe(720)
  })

  it('calculates P(n, 0) = 1', () => {
    const r = permutations(5, 0)
    expect(r.error).toBeNull()
    expect(r.value).toBe(1)
  })

  it('calculates P(n, n) = n!', () => {
    const r = permutations(5, 5)
    expect(r.error).toBeNull()
    expect(r.value).toBe(120)
  })

  it('calculates P(0, 0) = 1', () => {
    const r = permutations(0, 0)
    expect(r.error).toBeNull()
    expect(r.value).toBe(1)
  })

  it('returns error when k > n', () => {
    const r = permutations(3, 5)
    expect(r.value).toBeNull()
    expect(r.error).toBe('k degeri n degerinden buyuk olamaz')
  })

  it('returns error for negative values', () => {
    const r = permutations(-1, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Negatif deger kullanilamaz')
  })

  it('returns error for non-integer values', () => {
    const r = permutations(5.5, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Tam sayi gerekli')
  })

  it('returns error for Infinity input', () => {
    const r = permutations(Infinity, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })

  it('returns error for NaN input', () => {
    const r = permutations(NaN, 3)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })
})

// ---------------------------------------------------------------------------
// Expression builders
// ---------------------------------------------------------------------------

describe('buildNCrExpression', () => {
  it('builds nCr expression with n and k', () => {
    expect(buildNCrExpression('5', '2')).toBe('nCr(5, 2)')
  })

  it('handles expression arguments', () => {
    expect(buildNCrExpression('10', '3')).toBe('nCr(10, 3)')
  })
})

describe('buildNPrExpression', () => {
  it('builds nPr expression with n and k', () => {
    expect(buildNPrExpression('5', '2')).toBe('nPr(5, 2)')
  })

  it('handles expression arguments', () => {
    expect(buildNPrExpression('10', '3')).toBe('nPr(10, 3)')
  })
})
