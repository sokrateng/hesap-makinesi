import { describe, it, expect } from 'vitest'
import { evaluate, normalize } from './parser'

describe('normalize', () => {
  it('replaces × with *', () => {
    expect(normalize('3 × 5')).toBe('3 * 5')
  })

  it('replaces ÷ with /', () => {
    expect(normalize('10 ÷ 2')).toBe('10 / 2')
  })

  it('replaces √( with sqrt(', () => {
    expect(normalize('√(16)')).toBe('sqrt(16)')
  })

  it('replaces π with pi', () => {
    expect(normalize('2 × π')).toBe('2 * pi')
  })

  it('handles combined symbols', () => {
    expect(normalize('√(16) × π ÷ 2')).toBe('sqrt(16) * pi / 2')
  })

  it('auto-closes unclosed parentheses', () => {
    expect(normalize('√(16')).toBe('sqrt(16)')
  })

  it('auto-closes multiple unclosed parentheses', () => {
    expect(normalize('sin(cos(45')).toBe('sin(cos(45))')
  })

  it('does not add extra parens when balanced', () => {
    expect(normalize('sin(90)')).toBe('sin(90)')
  })
})

describe('evaluate', () => {
  it('evaluates basic arithmetic', () => {
    expect(evaluate('2 + 3')).toEqual({ result: '5', error: null })
  })

  it('evaluates multiplication', () => {
    expect(evaluate('4 × 6')).toEqual({ result: '24', error: null })
  })

  it('evaluates sin in degree mode', () => {
    expect(evaluate('sin(90)', 'deg')).toEqual({ result: '1', error: null })
  })

  it('evaluates sin in radian mode', () => {
    const result = evaluate('sin(3.14159265)', 'rad')
    expect(parseFloat(result.result!)).toBeCloseTo(0, 5)
  })

  it('evaluates sqrt', () => {
    expect(evaluate('√(16)')).toEqual({ result: '4', error: null })
  })

  it('evaluates complex expression', () => {
    expect(evaluate('sin(90) + √(16) × 2', 'deg')).toEqual({ result: '9', error: null })
  })

  it('returns specific error for division by zero', () => {
    const result = evaluate('1 ÷ 0')
    expect(result.error).toBe('Sıfıra bölme hatası')
  })

  it('returns specific error for invalid syntax', () => {
    const result = evaluate('2 +* 3')
    expect(result.error).toBe('Geçersiz ifade')
  })

  it('returns specific error for unknown function', () => {
    const result = evaluate('foo(5)')
    expect(result.error).toBe('Bilinmeyen fonksiyon')
  })

  it('formats large numbers in scientific notation', () => {
    const result = evaluate('10^20')
    expect(result.result).toContain('e')
  })

  it('formats decimals to max 10 significant digits', () => {
    const result = evaluate('1 ÷ 3')
    const sigFigs = result.result!.replace(/^-?0\./, '').replace(/[^0-9]/g, '')
    expect(sigFigs.length).toBeLessThanOrEqual(10)
  })

  it('handles nested trig correctly in degree mode', () => {
    const result = evaluate('sin(sin(90))', 'deg')
    expect(result.error).toBeNull()
    expect(parseFloat(result.result!)).toBeCloseTo(Math.sin(Math.PI / 180), 5)
  })

  it('auto-closes parens and evaluates √(16', () => {
    expect(evaluate('√(16')).toEqual({ result: '4', error: null })
  })

  it('auto-closes parens and evaluates sin(90', () => {
    expect(evaluate('sin(90', 'deg')).toEqual({ result: '1', error: null })
  })
})
