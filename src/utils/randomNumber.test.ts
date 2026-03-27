import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  randomInt,
  randomFloat,
  random01,
  randomUpTo,
} from './randomNumber'

describe('randomInt', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a value within the range (inclusive)', () => {
    for (let i = 0; i < 50; i++) {
      const result = randomInt(1, 10)
      expect(result.error).toBeNull()
      expect(result.value).toBeGreaterThanOrEqual(1)
      expect(result.value).toBeLessThanOrEqual(10)
      expect(Number.isInteger(result.value)).toBe(true)
    }
  })

  it('returns min when min equals max', () => {
    const result = randomInt(5, 5)
    expect(result.value).toBe(5)
    expect(result.error).toBeNull()
  })

  it('handles negative ranges', () => {
    for (let i = 0; i < 20; i++) {
      const result = randomInt(-10, -1)
      expect(result.error).toBeNull()
      expect(result.value).toBeGreaterThanOrEqual(-10)
      expect(result.value).toBeLessThanOrEqual(-1)
    }
  })

  it('returns error when min > max', () => {
    const result = randomInt(10, 1)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Min deger max degerden buyuk olamaz')
  })

  it('returns error for non-integer min', () => {
    const result = randomInt(1.5, 10)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Tam sayi bekleniyor')
  })

  it('returns error for non-integer max', () => {
    const result = randomInt(1, 10.5)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Tam sayi bekleniyor')
  })

  it('returns error for NaN', () => {
    const result = randomInt(NaN, 10)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for Infinity', () => {
    const result = randomInt(1, Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns correct boundary values with mocked Math.random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(randomInt(1, 6).value).toBe(1)

    vi.spyOn(Math, 'random').mockReturnValue(0.9999)
    expect(randomInt(1, 6).value).toBe(6)
  })
})

describe('randomFloat', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a value within the range', () => {
    for (let i = 0; i < 50; i++) {
      const result = randomFloat(0, 1)
      expect(result.error).toBeNull()
      expect(result.value).toBeGreaterThanOrEqual(0)
      expect(result.value).toBeLessThanOrEqual(1)
    }
  })

  it('returns min when min equals max', () => {
    const result = randomFloat(3.5, 3.5)
    expect(result.value).toBe(3.5)
    expect(result.error).toBeNull()
  })

  it('respects decimal places parameter', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.123456789)
    const result = randomFloat(0, 1, 2)
    expect(result.error).toBeNull()
    const str = String(result.value!)
    const decimalPart = str.split('.')[1] || ''
    expect(decimalPart.length).toBeLessThanOrEqual(2)
  })

  it('returns error when min > max', () => {
    const result = randomFloat(10, 1)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Min deger max degerden buyuk olamaz')
  })

  it('returns error for NaN inputs', () => {
    const result = randomFloat(NaN, 10)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for negative decimals', () => {
    const result = randomFloat(0, 1, -1)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Ondalik basamak sayisi gecersiz')
  })

  it('returns error for non-integer decimals', () => {
    const result = randomFloat(0, 1, 2.5)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Ondalik basamak sayisi gecersiz')
  })

  it('handles large ranges', () => {
    for (let i = 0; i < 20; i++) {
      const result = randomFloat(-1000, 1000)
      expect(result.error).toBeNull()
      expect(result.value).toBeGreaterThanOrEqual(-1000)
      expect(result.value).toBeLessThanOrEqual(1000)
    }
  })
})

describe('random01', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a value between 0 and 1', () => {
    for (let i = 0; i < 20; i++) {
      const result = random01()
      expect(result.error).toBeNull()
      expect(result.value).toBeGreaterThanOrEqual(0)
      expect(result.value).toBeLessThan(1)
    }
  })

  it('returns mocked value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42)
    const result = random01()
    expect(result.value).toBe(0.42)
    expect(result.error).toBeNull()
  })
})

describe('randomUpTo', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a value between 1 and max', () => {
    for (let i = 0; i < 50; i++) {
      const result = randomUpTo(6)
      expect(result.error).toBeNull()
      expect(result.value).toBeGreaterThanOrEqual(1)
      expect(result.value).toBeLessThanOrEqual(6)
    }
  })

  it('returns 1 when max is 1', () => {
    const result = randomUpTo(1)
    expect(result.value).toBe(1)
    expect(result.error).toBeNull()
  })

  it('returns error when max is less than 1', () => {
    const result = randomUpTo(0)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Min deger max degerden buyuk olamaz')
  })
})
