import { describe, it, expect } from 'vitest'
import { isPrime, normalizeIsPrime } from './isPrime'

describe('isPrime', () => {
  it('returns false for 0', () => {
    const result = isPrime(0)
    expect(result.isPrime).toBe(false)
    expect(result.error).toBeNull()
  })

  it('returns false for 1', () => {
    const result = isPrime(1)
    expect(result.isPrime).toBe(false)
    expect(result.error).toBeNull()
  })

  it('returns true for 2', () => {
    const result = isPrime(2)
    expect(result.isPrime).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns true for 3', () => {
    const result = isPrime(3)
    expect(result.isPrime).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns false for 4', () => {
    const result = isPrime(4)
    expect(result.isPrime).toBe(false)
    expect(result.error).toBeNull()
  })

  it('returns true for 5', () => {
    const result = isPrime(5)
    expect(result.isPrime).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns true for 7', () => {
    const result = isPrime(7)
    expect(result.isPrime).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns false for 9', () => {
    const result = isPrime(9)
    expect(result.isPrime).toBe(false)
    expect(result.error).toBeNull()
  })

  it('returns true for 11', () => {
    const result = isPrime(11)
    expect(result.isPrime).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns true for 97 (large prime)', () => {
    const result = isPrime(97)
    expect(result.isPrime).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns false for 100', () => {
    const result = isPrime(100)
    expect(result.isPrime).toBe(false)
    expect(result.error).toBeNull()
  })

  it('returns false for negative numbers', () => {
    const result = isPrime(-7)
    expect(result.isPrime).toBe(false)
    expect(result.error).toBeNull()
  })

  it('returns error for non-integer', () => {
    const result = isPrime(3.5)
    expect(result.isPrime).toBe(false)
    expect(result.error).toBe('Asal sayi kontrolu icin tam sayi gerekli')
  })

  it('returns error for NaN', () => {
    const result = isPrime(NaN)
    expect(result.isPrime).toBe(false)
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for Infinity', () => {
    const result = isPrime(Infinity)
    expect(result.isPrime).toBe(false)
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns true for 13', () => {
    const result = isPrime(13)
    expect(result.isPrime).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns false for even numbers > 2', () => {
    expect(isPrime(4).isPrime).toBe(false)
    expect(isPrime(6).isPrime).toBe(false)
    expect(isPrime(8).isPrime).toBe(false)
    expect(isPrime(10).isPrime).toBe(false)
  })
})

describe('normalizeIsPrime', () => {
  it('replaces isPrime(7) with 1', () => {
    expect(normalizeIsPrime('isPrime(7)')).toBe('1')
  })

  it('replaces isPrime(4) with 0', () => {
    expect(normalizeIsPrime('isPrime(4)')).toBe('0')
  })

  it('replaces isPrime(2) with 1', () => {
    expect(normalizeIsPrime('isPrime(2)')).toBe('1')
  })

  it('replaces isPrime(1) with 0', () => {
    expect(normalizeIsPrime('isPrime(1)')).toBe('0')
  })

  it('handles isPrime in larger expression', () => {
    expect(normalizeIsPrime('isPrime(7)+isPrime(4)')).toBe('1+0')
  })

  it('leaves non-isPrime expressions unchanged', () => {
    expect(normalizeIsPrime('2+3*4')).toBe('2+3*4')
  })

  it('handles isPrime(97) correctly', () => {
    expect(normalizeIsPrime('isPrime(97)')).toBe('1')
  })

  it('handles isPrime(100) correctly', () => {
    expect(normalizeIsPrime('isPrime(100)')).toBe('0')
  })
})
