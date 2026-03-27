import { describe, it, expect } from 'vitest'
import {
  normalizeCbrt,
  normalizeNthRoot,
  normalizeRoots,
  cubeRoot,
  nthRoot,
  buildCbrtExpression,
  buildNthRootExpression,
} from './rootFunctions'

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

describe('normalizeCbrt', () => {
  it('replaces ∛( with cbrt(', () => {
    expect(normalizeCbrt('∛(27)')).toBe('cbrt(27)')
  })

  it('handles multiple occurrences', () => {
    expect(normalizeCbrt('∛(8) + ∛(27)')).toBe('cbrt(8) + cbrt(27)')
  })

  it('leaves strings without ∛ unchanged', () => {
    expect(normalizeCbrt('sqrt(16)')).toBe('sqrt(16)')
  })
})

describe('normalizeNthRoot', () => {
  it('replaces ⁿ√( with nthRoot(', () => {
    expect(normalizeNthRoot('ⁿ√(16, 4)')).toBe('nthRoot(16, 4)')
  })

  it('leaves strings without ⁿ√ unchanged', () => {
    expect(normalizeNthRoot('cbrt(27)')).toBe('cbrt(27)')
  })
})

describe('normalizeRoots', () => {
  it('applies both normalizations', () => {
    expect(normalizeRoots('∛(27) + ⁿ√(16, 4)')).toBe('cbrt(27) + nthRoot(16, 4)')
  })

  it('handles expression with no root symbols', () => {
    expect(normalizeRoots('2 + 3')).toBe('2 + 3')
  })
})

// ---------------------------------------------------------------------------
// cubeRoot
// ---------------------------------------------------------------------------

describe('cubeRoot', () => {
  it('calculates cube root of 27', () => {
    const r = cubeRoot(27)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(3, 5)
  })

  it('calculates cube root of 8', () => {
    const r = cubeRoot(8)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(2, 5)
  })

  it('calculates cube root of 1', () => {
    const r = cubeRoot(1)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(1, 5)
  })

  it('calculates cube root of 0', () => {
    const r = cubeRoot(0)
    expect(r.error).toBeNull()
    expect(r.value).toBe(0)
  })

  it('calculates cube root of 64', () => {
    const r = cubeRoot(64)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(4, 5)
  })

  it('calculates cube root of a non-perfect cube', () => {
    const r = cubeRoot(10)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(2.15443, 3)
  })

  it('handles negative values', () => {
    const r = cubeRoot(-27)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(-3, 5)
  })
})

// ---------------------------------------------------------------------------
// nthRoot
// ---------------------------------------------------------------------------

describe('nthRoot', () => {
  it('calculates 4th root of 16', () => {
    const r = nthRoot(16, 4)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(2, 5)
  })

  it('calculates 5th root of 32', () => {
    const r = nthRoot(32, 5)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(2, 5)
  })

  it('calculates square root via nthRoot(9, 2)', () => {
    const r = nthRoot(9, 2)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(3, 5)
  })

  it('calculates cube root via nthRoot(27, 3)', () => {
    const r = nthRoot(27, 3)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(3, 5)
  })

  it('returns error for n=0', () => {
    const r = nthRoot(16, 0)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Sifirinci kok tanimli degil')
  })

  it('returns error for Infinity input', () => {
    const r = nthRoot(Infinity, 2)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })

  it('returns error for NaN input', () => {
    const r = nthRoot(NaN, 3)
    expect(r.value).toBeNull()
    expect(r.error).toBe('Gecersiz giris')
  })

  it('handles nthRoot(1, n) = 1 for any n', () => {
    const r = nthRoot(1, 100)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(1, 5)
  })

  it('handles large root index', () => {
    const r = nthRoot(1024, 10)
    expect(r.error).toBeNull()
    expect(r.value).toBeCloseTo(2, 5)
  })
})

// ---------------------------------------------------------------------------
// Expression builders
// ---------------------------------------------------------------------------

describe('buildCbrtExpression', () => {
  it('wraps inner expression in cbrt()', () => {
    expect(buildCbrtExpression('27')).toBe('cbrt(27)')
  })

  it('handles complex inner expression', () => {
    expect(buildCbrtExpression('8 + 19')).toBe('cbrt(8 + 19)')
  })
})

describe('buildNthRootExpression', () => {
  it('builds nthRoot expression with value and n', () => {
    expect(buildNthRootExpression('16', '4')).toBe('nthRoot(16, 4)')
  })

  it('handles expression arguments', () => {
    expect(buildNthRootExpression('2^5', '5')).toBe('nthRoot(2^5, 5)')
  })
})
