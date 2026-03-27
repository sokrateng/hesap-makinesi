import { describe, it, expect } from 'vitest'
import {
  normalizeObeb,
  normalizeOkek,
  normalizeGcdLcm,
  gcd,
  lcm,
  buildGcdExpression,
  buildLcmExpression,
} from './gcdLcm'

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

describe('normalizeObeb', () => {
  it('replaces obeb( with gcd(', () => {
    expect(normalizeObeb('obeb(12, 8)')).toBe('gcd(12, 8)')
  })

  it('handles multiple occurrences', () => {
    expect(normalizeObeb('obeb(12, 8) + obeb(9, 6)')).toBe('gcd(12, 8) + gcd(9, 6)')
  })

  it('is case insensitive', () => {
    expect(normalizeObeb('OBEB(12, 8)')).toBe('gcd(12, 8)')
  })

  it('leaves strings without obeb unchanged', () => {
    expect(normalizeObeb('sqrt(16)')).toBe('sqrt(16)')
  })
})

describe('normalizeOkek', () => {
  it('replaces okek( with lcm(', () => {
    expect(normalizeOkek('okek(4, 6)')).toBe('lcm(4, 6)')
  })

  it('handles multiple occurrences', () => {
    expect(normalizeOkek('okek(4, 6) + okek(3, 5)')).toBe('lcm(4, 6) + lcm(3, 5)')
  })

  it('is case insensitive', () => {
    expect(normalizeOkek('OKEK(4, 6)')).toBe('lcm(4, 6)')
  })

  it('leaves strings without okek unchanged', () => {
    expect(normalizeOkek('cbrt(27)')).toBe('cbrt(27)')
  })
})

describe('normalizeGcdLcm', () => {
  it('applies both normalizations', () => {
    expect(normalizeGcdLcm('obeb(12, 8) + okek(4, 6)')).toBe('gcd(12, 8) + lcm(4, 6)')
  })

  it('handles expression with no gcd/lcm symbols', () => {
    expect(normalizeGcdLcm('2 + 3')).toBe('2 + 3')
  })
})

// ---------------------------------------------------------------------------
// gcd
// ---------------------------------------------------------------------------

describe('gcd', () => {
  it('calculates gcd(12, 8) = 4', () => {
    const r = gcd(12, 8)
    expect(r.error).toBeNull()
    expect(r.value).toBe(4)
  })

  it('calculates gcd(15, 10) = 5', () => {
    const r = gcd(15, 10)
    expect(r.error).toBeNull()
    expect(r.value).toBe(5)
  })

  it('calculates gcd(7, 13) = 1 for coprime numbers', () => {
    const r = gcd(7, 13)
    expect(r.error).toBeNull()
    expect(r.value).toBe(1)
  })

  it('calculates gcd(0, 5) = 5', () => {
    const r = gcd(0, 5)
    expect(r.error).toBeNull()
    expect(r.value).toBe(5)
  })

  it('calculates gcd(100, 75) = 25', () => {
    const r = gcd(100, 75)
    expect(r.error).toBeNull()
    expect(r.value).toBe(25)
  })

  it('handles negative values', () => {
    const r = gcd(-12, 8)
    expect(r.error).toBeNull()
    expect(r.value).toBe(4)
  })

  it('returns error for non-integer values', () => {
    const r = gcd(5.5, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Tam sayi gerekli')
  })

  it('returns error for Infinity input', () => {
    const r = gcd(Infinity, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })

  it('returns error for NaN input', () => {
    const r = gcd(NaN, 3)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })
})

// ---------------------------------------------------------------------------
// lcm
// ---------------------------------------------------------------------------

describe('lcm', () => {
  it('calculates lcm(4, 6) = 12', () => {
    const r = lcm(4, 6)
    expect(r.error).toBeNull()
    expect(r.value).toBe(12)
  })

  it('calculates lcm(3, 5) = 15', () => {
    const r = lcm(3, 5)
    expect(r.error).toBeNull()
    expect(r.value).toBe(15)
  })

  it('calculates lcm(12, 18) = 36', () => {
    const r = lcm(12, 18)
    expect(r.error).toBeNull()
    expect(r.value).toBe(36)
  })

  it('calculates lcm(7, 7) = 7 for same numbers', () => {
    const r = lcm(7, 7)
    expect(r.error).toBeNull()
    expect(r.value).toBe(7)
  })

  it('calculates lcm(1, n) = n', () => {
    const r = lcm(1, 42)
    expect(r.error).toBeNull()
    expect(r.value).toBe(42)
  })

  it('handles negative values', () => {
    const r = lcm(-4, 6)
    expect(r.error).toBeNull()
    expect(r.value).toBe(12)
  })

  it('returns error for non-integer values', () => {
    const r = lcm(5.5, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Tam sayi gerekli')
  })

  it('returns error for Infinity input', () => {
    const r = lcm(Infinity, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })

  it('returns error for NaN input', () => {
    const r = lcm(NaN, 3)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })
})

// ---------------------------------------------------------------------------
// Expression builders
// ---------------------------------------------------------------------------

describe('buildGcdExpression', () => {
  it('builds gcd expression', () => {
    expect(buildGcdExpression('12', '8')).toBe('gcd(12, 8)')
  })

  it('handles expression arguments', () => {
    expect(buildGcdExpression('24', '36')).toBe('gcd(24, 36)')
  })
})

describe('buildLcmExpression', () => {
  it('builds lcm expression', () => {
    expect(buildLcmExpression('4', '6')).toBe('lcm(4, 6)')
  })

  it('handles expression arguments', () => {
    expect(buildLcmExpression('12', '18')).toBe('lcm(12, 18)')
  })
})
