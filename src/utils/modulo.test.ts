import { describe, it, expect } from 'vitest'
import { normalizeModulo, modulo, buildModExpression } from './modulo'
import { evaluate } from './parser'

describe('normalizeModulo', () => {
  it('returns expression unchanged (mathjs handles mod natively)', () => {
    expect(normalizeModulo('5 mod 3')).toBe('5 mod 3')
    expect(normalizeModulo('mod(17, 5)')).toBe('mod(17, 5)')
  })

  it('preserves other content', () => {
    expect(normalizeModulo('2+3')).toBe('2+3')
    expect(normalizeModulo('')).toBe('')
  })
})

describe('modulo', () => {
  it('calculates basic modulo', () => {
    expect(modulo(5, 3)).toEqual({ value: 2, error: null })
    expect(modulo(17, 5)).toEqual({ value: 2, error: null })
    expect(modulo(10, 2)).toEqual({ value: 0, error: null })
  })

  it('handles negative numbers', () => {
    const result = modulo(-7, 3)
    expect(result.error).toBeNull()
    expect(result.value).toBeDefined()
  })

  it('handles decimal numbers', () => {
    const result = modulo(5.5, 2)
    expect(result.error).toBeNull()
    expect(result.value).toBeCloseTo(1.5)
  })

  it('returns error for division by zero', () => {
    expect(modulo(5, 0)).toEqual({ value: null, error: 'Sifira bolme hatasi' })
  })

  it('returns error for non-finite input', () => {
    expect(modulo(Infinity, 3)).toEqual({ value: null, error: 'Gecersiz giris' })
    expect(modulo(5, NaN)).toEqual({ value: null, error: 'Gecersiz giris' })
  })
})

describe('buildModExpression', () => {
  it('builds correct mod expression', () => {
    expect(buildModExpression('17', '5')).toBe('mod(17, 5)')
    expect(buildModExpression('100', '7')).toBe('mod(100, 7)')
  })
})

describe('mod via parser evaluate', () => {
  it('evaluates mod() function syntax', () => {
    const result = evaluate('mod(17, 5)')
    expect(result.error).toBeNull()
    expect(result.result).toBe('2')
  })

  it('evaluates infix mod syntax', () => {
    const result = evaluate('17 mod 5')
    expect(result.error).toBeNull()
    expect(result.result).toBe('2')
  })

  it('evaluates mod in complex expression', () => {
    const result = evaluate('mod(10, 3) + 1')
    expect(result.error).toBeNull()
    expect(result.result).toBe('2')
  })
})
