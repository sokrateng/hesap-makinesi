import { describe, it, expect } from 'vitest'
import {
  normalizeInverseTrig,
  inverseTrigToDegrees,
  arcsin,
  arccos,
  arctan,
  radToDeg,
} from './inverseTrig'

describe('normalizeInverseTrig', () => {
  it('converts arcsin( to asin(', () => {
    expect(normalizeInverseTrig('arcsin(0.5)')).toBe('asin(0.5)')
  })

  it('converts arccos( to acos(', () => {
    expect(normalizeInverseTrig('arccos(0.5)')).toBe('acos(0.5)')
  })

  it('converts arctan( to atan(', () => {
    expect(normalizeInverseTrig('arctan(1)')).toBe('atan(1)')
  })

  it('converts multiple inverse trig functions', () => {
    expect(normalizeInverseTrig('arcsin(0.5)+arccos(0.5)')).toBe('asin(0.5)+acos(0.5)')
  })

  it('leaves asin/acos/atan unchanged', () => {
    expect(normalizeInverseTrig('asin(0.5)')).toBe('asin(0.5)')
  })

  it('leaves non-trig expressions unchanged', () => {
    expect(normalizeInverseTrig('2+3*4')).toBe('2+3*4')
  })
})

describe('inverseTrigToDegrees', () => {
  it('wraps asin with degree conversion', () => {
    expect(inverseTrigToDegrees('asin(0.5)')).toBe('(180/pi*asin(0.5))')
  })

  it('wraps acos with degree conversion', () => {
    expect(inverseTrigToDegrees('acos(0.5)')).toBe('(180/pi*acos(0.5))')
  })

  it('wraps atan with degree conversion', () => {
    expect(inverseTrigToDegrees('atan(1)')).toBe('(180/pi*atan(1))')
  })

  it('wraps multiple inverse trig calls', () => {
    expect(inverseTrigToDegrees('asin(0.5)+acos(0.5)')).toBe(
      '(180/pi*asin(0.5))+(180/pi*acos(0.5))'
    )
  })

  it('handles nested expressions', () => {
    expect(inverseTrigToDegrees('asin(1/2)')).toBe('(180/pi*asin(1/2))')
  })

  it('does not wrap sin/cos/tan (only inverse)', () => {
    expect(inverseTrigToDegrees('sin(0.5)')).toBe('sin(0.5)')
  })

  it('leaves non-trig expressions unchanged', () => {
    expect(inverseTrigToDegrees('2+3')).toBe('2+3')
  })
})

describe('arcsin', () => {
  it('returns correct value for valid input', () => {
    const result = arcsin(0)
    expect(result.value).toBe(0)
    expect(result.error).toBeNull()
  })

  it('returns PI/6 for 0.5', () => {
    const result = arcsin(0.5)
    expect(result.value).toBeCloseTo(Math.PI / 6, 10)
    expect(result.error).toBeNull()
  })

  it('returns PI/2 for 1', () => {
    const result = arcsin(1)
    expect(result.value).toBeCloseTo(Math.PI / 2, 10)
    expect(result.error).toBeNull()
  })

  it('returns error for value > 1', () => {
    const result = arcsin(2)
    expect(result.value).toBeNull()
    expect(result.error).toBe('arcsin icin deger -1 ile 1 arasinda olmali')
  })

  it('returns error for value < -1', () => {
    const result = arcsin(-1.5)
    expect(result.value).toBeNull()
    expect(result.error).toBe('arcsin icin deger -1 ile 1 arasinda olmali')
  })

  it('returns error for NaN', () => {
    const result = arcsin(NaN)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for Infinity', () => {
    const result = arcsin(Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })
})

describe('arccos', () => {
  it('returns correct value for valid input', () => {
    const result = arccos(1)
    expect(result.value).toBe(0)
    expect(result.error).toBeNull()
  })

  it('returns PI/3 for 0.5', () => {
    const result = arccos(0.5)
    expect(result.value).toBeCloseTo(Math.PI / 3, 10)
    expect(result.error).toBeNull()
  })

  it('returns PI for -1', () => {
    const result = arccos(-1)
    expect(result.value).toBeCloseTo(Math.PI, 10)
    expect(result.error).toBeNull()
  })

  it('returns error for value > 1', () => {
    const result = arccos(2)
    expect(result.value).toBeNull()
    expect(result.error).toBe('arccos icin deger -1 ile 1 arasinda olmali')
  })

  it('returns error for value < -1', () => {
    const result = arccos(-1.5)
    expect(result.value).toBeNull()
    expect(result.error).toBe('arccos icin deger -1 ile 1 arasinda olmali')
  })

  it('returns error for NaN', () => {
    const result = arccos(NaN)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })
})

describe('arctan', () => {
  it('returns 0 for 0', () => {
    const result = arctan(0)
    expect(result.value).toBe(0)
    expect(result.error).toBeNull()
  })

  it('returns PI/4 for 1', () => {
    const result = arctan(1)
    expect(result.value).toBeCloseTo(Math.PI / 4, 10)
    expect(result.error).toBeNull()
  })

  it('handles negative values', () => {
    const result = arctan(-1)
    expect(result.value).toBeCloseTo(-Math.PI / 4, 10)
    expect(result.error).toBeNull()
  })

  it('handles large values', () => {
    const result = arctan(1000)
    expect(result.value).toBeCloseTo(Math.PI / 2, 2)
    expect(result.error).toBeNull()
  })

  it('returns error for NaN', () => {
    const result = arctan(NaN)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for Infinity', () => {
    const result = arctan(Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })
})

describe('radToDeg', () => {
  it('converts 0 radians to 0 degrees', () => {
    expect(radToDeg(0)).toBe(0)
  })

  it('converts PI to 180 degrees', () => {
    expect(radToDeg(Math.PI)).toBeCloseTo(180, 10)
  })

  it('converts PI/2 to 90 degrees', () => {
    expect(radToDeg(Math.PI / 2)).toBeCloseTo(90, 10)
  })

  it('converts negative radians', () => {
    expect(radToDeg(-Math.PI / 4)).toBeCloseTo(-45, 10)
  })
})
