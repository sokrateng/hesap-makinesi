import { describe, it, expect } from 'vitest'
import { normalizeFactorial, normalize, evaluate } from './parser'

describe('normalizeFactorial', () => {
  it('converts simple number factorial: 5! → factorial(5)', () => {
    expect(normalizeFactorial('5!')).toBe('factorial(5)')
  })

  it('converts multi-digit factorial: 12! → factorial(12)', () => {
    expect(normalizeFactorial('12!')).toBe('factorial(12)')
  })

  it('converts grouped factorial: (2+3)! → factorial(2+3)', () => {
    expect(normalizeFactorial('(2+3)!')).toBe('factorial(2+3)')
  })

  it('converts nested group factorial: (1+2)! + (3)!', () => {
    expect(normalizeFactorial('(1+2)! + (3)!')).toBe('factorial(1+2) + factorial(3)')
  })

  it('leaves expressions without ! unchanged', () => {
    expect(normalizeFactorial('2 + 3')).toBe('2 + 3')
  })

  it('handles factorial in larger expression: 5! + 3', () => {
    expect(normalizeFactorial('5! + 3')).toBe('factorial(5) + 3')
  })

  it('handles multiple factorials: 5! + 3!', () => {
    expect(normalizeFactorial('5! + 3!')).toBe('factorial(5) + factorial(3)')
  })
})

describe('normalize with factorial', () => {
  it('normalizes 5! within full normalize pipeline', () => {
    expect(normalize('5!')).toBe('factorial(5)')
  })

  it('normalizes combined expression: 5! × 2', () => {
    expect(normalize('5! × 2')).toBe('factorial(5) * 2')
  })
})

describe('evaluate with factorial', () => {
  it('evaluates 5! = 120', () => {
    expect(evaluate('5!')).toEqual({ result: '120', error: null })
  })

  it('evaluates 0! = 1', () => {
    expect(evaluate('0!')).toEqual({ result: '1', error: null })
  })

  it('evaluates 1! = 1', () => {
    expect(evaluate('1!')).toEqual({ result: '1', error: null })
  })

  it('evaluates 10! = 3628800', () => {
    expect(evaluate('10!')).toEqual({ result: '3628800', error: null })
  })

  it('evaluates (2+3)! = 120', () => {
    expect(evaluate('(2+3)!')).toEqual({ result: '120', error: null })
  })

  it('evaluates 5! + 3! = 126', () => {
    expect(evaluate('5! + 3!')).toEqual({ result: '126', error: null })
  })

  it('evaluates 5! × 2 = 240', () => {
    expect(evaluate('5! × 2')).toEqual({ result: '240', error: null })
  })

  it('evaluates factorial in complex expression: √(5! + 4) = √124', () => {
    const result = evaluate('√(5! + 4)')
    expect(result.error).toBeNull()
    expect(parseFloat(result.result!)).toBeCloseTo(Math.sqrt(124), 5)
  })
})
