import { describe, it, expect } from 'vitest'
import {
  isPlainNumber,
  formatIntegerPart,
  formatResult,
} from './formatNumber'

describe('isPlainNumber', () => {
  it('recognizes positive integers', () => {
    expect(isPlainNumber('42')).toBe(true)
    expect(isPlainNumber('0')).toBe(true)
    expect(isPlainNumber('1234567890')).toBe(true)
  })

  it('recognizes negative integers', () => {
    expect(isPlainNumber('-5')).toBe(true)
    expect(isPlainNumber('-999')).toBe(true)
  })

  it('recognizes decimals', () => {
    expect(isPlainNumber('3.14')).toBe(true)
    expect(isPlainNumber('-0.001')).toBe(true)
    expect(isPlainNumber('100.0')).toBe(true)
  })

  it('recognizes scientific notation', () => {
    expect(isPlainNumber('1.5e+10')).toBe(true)
    expect(isPlainNumber('2.3e-5')).toBe(true)
    expect(isPlainNumber('1e10')).toBe(true)
    expect(isPlainNumber('-3.14e+2')).toBe(true)
  })

  it('rejects non-numeric strings', () => {
    expect(isPlainNumber('')).toBe(false)
    expect(isPlainNumber('abc')).toBe(false)
    expect(isPlainNumber('12a3')).toBe(false)
    expect(isPlainNumber('Infinity')).toBe(false)
    expect(isPlainNumber('NaN')).toBe(false)
    expect(isPlainNumber('[1, 2, 3]')).toBe(false)
  })

  it('handles whitespace', () => {
    expect(isPlainNumber(' 42 ')).toBe(true)
    expect(isPlainNumber(' -3.14 ')).toBe(true)
  })
})

describe('formatIntegerPart', () => {
  it('does not format small numbers', () => {
    expect(formatIntegerPart('0', '.')).toBe('0')
    expect(formatIntegerPart('42', '.')).toBe('42')
    expect(formatIntegerPart('999', '.')).toBe('999')
  })

  it('formats thousands', () => {
    expect(formatIntegerPart('1000', '.')).toBe('1.000')
    expect(formatIntegerPart('12345', '.')).toBe('12.345')
    expect(formatIntegerPart('1234567', '.')).toBe('1.234.567')
    expect(formatIntegerPart('1000000000', '.')).toBe('1.000.000.000')
  })

  it('handles negative numbers', () => {
    expect(formatIntegerPart('-1000', '.')).toBe('-1.000')
    expect(formatIntegerPart('-1234567', '.')).toBe('-1.234.567')
  })

  it('works with custom separators', () => {
    expect(formatIntegerPart('1234567', ',')).toBe('1,234,567')
    expect(formatIntegerPart('1234567', ' ')).toBe('1 234 567')
  })
})

describe('formatResult', () => {
  it('formats integers with Turkish locale by default', () => {
    expect(formatResult('1000')).toBe('1.000')
    expect(formatResult('1234567')).toBe('1.234.567')
    expect(formatResult('-50000')).toBe('-50.000')
  })

  it('formats decimals with comma separator', () => {
    expect(formatResult('3.14')).toBe('3,14')
    expect(formatResult('1234.567')).toBe('1.234,567')
    expect(formatResult('-9999.99')).toBe('-9.999,99')
  })

  it('formats scientific notation', () => {
    expect(formatResult('1.5e+10')).toBe('1,5e+10')
    expect(formatResult('2.345e-5')).toBe('2,345e-5')
  })

  it('does not format small numbers unnecessarily', () => {
    expect(formatResult('0')).toBe('0')
    expect(formatResult('42')).toBe('42')
    expect(formatResult('999')).toBe('999')
  })

  it('returns non-numeric strings unchanged', () => {
    expect(formatResult('')).toBe('')
    expect(formatResult('Gecersiz ifade')).toBe('Gecersiz ifade')
    expect(formatResult('[1, 2]')).toBe('[1, 2]')
  })

  it('supports custom options', () => {
    const opts = {
      groupSeparator: ',',
      decimalSeparator: '.',
    }
    expect(formatResult('1234567', opts)).toBe('1,234,567')
    expect(formatResult('1234.56', opts)).toBe('1,234.56')
  })

  it('handles edge cases', () => {
    expect(formatResult('0.001')).toBe('0,001')
    expect(formatResult('-0.5')).toBe('-0,5')
    expect(formatResult('100')).toBe('100')
    expect(formatResult('1000.0')).toBe('1.000,0')
  })
})
