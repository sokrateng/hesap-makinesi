import { describe, it, expect } from 'vitest'
import {
  normalizeSquare,
  normalizeCube,
  normalizePowers,
  square,
  cube,
  power,
  buildSquareExpression,
  buildCubeExpression,
} from './powerFunctions'

describe('normalizeSquare', () => {
  it('converts ² to ^2', () => {
    expect(normalizeSquare('5²')).toBe('5^2')
  })

  it('converts multiple ² symbols', () => {
    expect(normalizeSquare('3² + 4²')).toBe('3^2 + 4^2')
  })

  it('handles parenthesized expressions', () => {
    expect(normalizeSquare('(2+3)²')).toBe('(2+3)^2')
  })

  it('returns unchanged string without ²', () => {
    expect(normalizeSquare('5^2 + 3')).toBe('5^2 + 3')
  })
})

describe('normalizeCube', () => {
  it('converts ³ to ^3', () => {
    expect(normalizeCube('5³')).toBe('5^3')
  })

  it('converts multiple ³ symbols', () => {
    expect(normalizeCube('2³ + 3³')).toBe('2^3 + 3^3')
  })

  it('handles parenthesized expressions', () => {
    expect(normalizeCube('(1+2)³')).toBe('(1+2)^3')
  })

  it('returns unchanged string without ³', () => {
    expect(normalizeCube('5^3 + 1')).toBe('5^3 + 1')
  })
})

describe('normalizePowers', () => {
  it('converts both ² and ³', () => {
    expect(normalizePowers('3² + 2³')).toBe('3^2 + 2^3')
  })

  it('handles expression with no power symbols', () => {
    expect(normalizePowers('sin(45) + 5')).toBe('sin(45) + 5')
  })

  it('handles mixed power and normal expressions', () => {
    expect(normalizePowers('x² + y³ + z')).toBe('x^2 + y^3 + z')
  })
})

describe('square', () => {
  it('calculates square of positive number', () => {
    const result = square(5)
    expect(result.error).toBeNull()
    expect(result.value).toBe(25)
  })

  it('calculates square of negative number', () => {
    const result = square(-3)
    expect(result.error).toBeNull()
    expect(result.value).toBe(9)
  })

  it('calculates square of zero', () => {
    const result = square(0)
    expect(result.error).toBeNull()
    expect(result.value).toBe(0)
  })

  it('calculates square of decimal', () => {
    const result = square(1.5)
    expect(result.error).toBeNull()
    expect(result.value).toBe(2.25)
  })

  it('returns error for Infinity', () => {
    const result = square(Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for NaN', () => {
    const result = square(NaN)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error when result overflows', () => {
    const result = square(Number.MAX_VALUE)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Sonuc cok buyuk')
  })
})

describe('cube', () => {
  it('calculates cube of positive number', () => {
    const result = cube(3)
    expect(result.error).toBeNull()
    expect(result.value).toBe(27)
  })

  it('calculates cube of negative number', () => {
    const result = cube(-2)
    expect(result.error).toBeNull()
    expect(result.value).toBe(-8)
  })

  it('calculates cube of zero', () => {
    const result = cube(0)
    expect(result.error).toBeNull()
    expect(result.value).toBe(0)
  })

  it('calculates cube of decimal', () => {
    const result = cube(0.5)
    expect(result.error).toBeNull()
    expect(result.value).toBe(0.125)
  })

  it('returns error for non-finite input', () => {
    const result = cube(Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error when result overflows', () => {
    const result = cube(Number.MAX_VALUE)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Sonuc cok buyuk')
  })
})

describe('power', () => {
  it('calculates 2^10 = 1024', () => {
    const result = power(2, 10)
    expect(result.error).toBeNull()
    expect(result.value).toBe(1024)
  })

  it('calculates 5^0 = 1', () => {
    const result = power(5, 0)
    expect(result.error).toBeNull()
    expect(result.value).toBe(1)
  })

  it('calculates negative exponent', () => {
    const result = power(2, -1)
    expect(result.error).toBeNull()
    expect(result.value).toBe(0.5)
  })

  it('returns error for non-finite base', () => {
    const result = power(NaN, 2)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error for non-finite exponent', () => {
    const result = power(2, Infinity)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Gecersiz giris')
  })

  it('returns error when result overflows', () => {
    const result = power(10, 400)
    expect(result.value).toBeNull()
    expect(result.error).toBe('Sonuc cok buyuk')
  })
})

describe('buildSquareExpression', () => {
  it('wraps expression with ^2', () => {
    expect(buildSquareExpression('5')).toBe('(5)^2')
  })

  it('wraps complex expression', () => {
    expect(buildSquareExpression('2+3')).toBe('(2+3)^2')
  })
})

describe('buildCubeExpression', () => {
  it('wraps expression with ^3', () => {
    expect(buildCubeExpression('5')).toBe('(5)^3')
  })

  it('wraps complex expression', () => {
    expect(buildCubeExpression('2+3')).toBe('(2+3)^3')
  })
})
