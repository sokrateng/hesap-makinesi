import { describe, it, expect } from 'vitest'
import {
  normalizeHyperbolicTrig,
  sinhFn,
  coshFn,
  tanhFn,
} from './hyperbolicTrig'

describe('normalizeHyperbolicTrig', () => {
  it('passes sinh through unchanged', () => {
    expect(normalizeHyperbolicTrig('sinh(1)')).toBe('sinh(1)')
  })

  it('passes cosh through unchanged', () => {
    expect(normalizeHyperbolicTrig('cosh(1)')).toBe('cosh(1)')
  })

  it('passes tanh through unchanged', () => {
    expect(normalizeHyperbolicTrig('tanh(1)')).toBe('tanh(1)')
  })

  it('leaves non-hyperbolic expressions unchanged', () => {
    expect(normalizeHyperbolicTrig('2+3*4')).toBe('2+3*4')
  })

  it('handles multiple hyperbolic functions', () => {
    expect(normalizeHyperbolicTrig('sinh(1)+cosh(2)')).toBe('sinh(1)+cosh(2)')
  })
})

describe('sinhFn', () => {
  it('returns 0 for sinh(0)', () => {
    const result = sinhFn(0)
    expect(result.value).toBe(0)
    expect(result.error).toBeNull()
  })

  it('returns correct value for sinh(1)', () => {
    const result = sinhFn(1)
    expect(result.value).toBeCloseTo(Math.sinh(1), 10)
    expect(result.error).toBeNull()
  })

  it('handles negative values', () => {
    const result = sinhFn(-1)
    expect(result.value).toBeCloseTo(Math.sinh(-1), 10)
    expect(result.error).toBeNull()
  })

  it('handles large values', () => {
    const result = sinhFn(10)
    expect(result.value).toBeCloseTo(Math.sinh(10), 5)
    expect(result.error).toBeNull()
  })

  it('returns error for NaN', () => {
    const result = sinhFn(NaN)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for Infinity', () => {
    const result = sinhFn(Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })
})

describe('coshFn', () => {
  it('returns 1 for cosh(0)', () => {
    const result = coshFn(0)
    expect(result.value).toBe(1)
    expect(result.error).toBeNull()
  })

  it('returns correct value for cosh(1)', () => {
    const result = coshFn(1)
    expect(result.value).toBeCloseTo(Math.cosh(1), 10)
    expect(result.error).toBeNull()
  })

  it('handles negative values (cosh is even)', () => {
    const result = coshFn(-1)
    expect(result.value).toBeCloseTo(Math.cosh(1), 10)
    expect(result.error).toBeNull()
  })

  it('handles large values', () => {
    const result = coshFn(10)
    expect(result.value).toBeCloseTo(Math.cosh(10), 5)
    expect(result.error).toBeNull()
  })

  it('returns error for NaN', () => {
    const result = coshFn(NaN)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for Infinity', () => {
    const result = coshFn(Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })
})

describe('tanhFn', () => {
  it('returns 0 for tanh(0)', () => {
    const result = tanhFn(0)
    expect(result.value).toBe(0)
    expect(result.error).toBeNull()
  })

  it('returns correct value for tanh(1)', () => {
    const result = tanhFn(1)
    expect(result.value).toBeCloseTo(Math.tanh(1), 10)
    expect(result.error).toBeNull()
  })

  it('approaches 1 for large values', () => {
    const result = tanhFn(100)
    expect(result.value).toBeCloseTo(1, 10)
    expect(result.error).toBeNull()
  })

  it('approaches -1 for large negative values', () => {
    const result = tanhFn(-100)
    expect(result.value).toBeCloseTo(-1, 10)
    expect(result.error).toBeNull()
  })

  it('handles negative values', () => {
    const result = tanhFn(-1)
    expect(result.value).toBeCloseTo(Math.tanh(-1), 10)
    expect(result.error).toBeNull()
  })

  it('returns error for NaN', () => {
    const result = tanhFn(NaN)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for Infinity', () => {
    const result = tanhFn(Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })
})
