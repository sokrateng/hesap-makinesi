import { describe, it, expect } from 'vitest'
import {
  isConvertibleInteger,
  convertToBase,
  convertBases,
  formatBaseConversions,
  type BaseConversionResult,
} from './baseConverter'

describe('isConvertibleInteger', () => {
  it('returns true for positive integers', () => {
    expect(isConvertibleInteger('0')).toBe(true)
    expect(isConvertibleInteger('42')).toBe(true)
    expect(isConvertibleInteger('1000000')).toBe(true)
  })

  it('returns true for negative integers', () => {
    expect(isConvertibleInteger('-1')).toBe(true)
    expect(isConvertibleInteger('-255')).toBe(true)
  })

  it('returns false for decimals', () => {
    expect(isConvertibleInteger('3.14')).toBe(false)
    expect(isConvertibleInteger('-0.5')).toBe(false)
  })

  it('returns false for non-numeric strings', () => {
    expect(isConvertibleInteger('')).toBe(false)
    expect(isConvertibleInteger('abc')).toBe(false)
    expect(isConvertibleInteger('12e5')).toBe(false)
  })

  it('trims whitespace', () => {
    expect(isConvertibleInteger('  42  ')).toBe(true)
  })
})

describe('convertToBase', () => {
  describe('binary (base 2)', () => {
    it('converts 0 to 0', () => {
      expect(convertToBase('0', 2)).toBe('0')
    })

    it('converts positive integers', () => {
      expect(convertToBase('1', 2)).toBe('1')
      expect(convertToBase('10', 2)).toBe('1010')
      expect(convertToBase('255', 2)).toBe('11111111')
    })

    it('converts negative integers with prefix', () => {
      expect(convertToBase('-10', 2)).toBe('-1010')
    })
  })

  describe('octal (base 8)', () => {
    it('converts positive integers', () => {
      expect(convertToBase('0', 8)).toBe('0')
      expect(convertToBase('8', 8)).toBe('10')
      expect(convertToBase('255', 8)).toBe('377')
      expect(convertToBase('64', 8)).toBe('100')
    })

    it('converts negative integers', () => {
      expect(convertToBase('-64', 8)).toBe('-100')
    })
  })

  describe('hexadecimal (base 16)', () => {
    it('converts positive integers', () => {
      expect(convertToBase('0', 16)).toBe('0')
      expect(convertToBase('255', 16)).toBe('FF')
      expect(convertToBase('16', 16)).toBe('10')
      expect(convertToBase('256', 16)).toBe('100')
      expect(convertToBase('4095', 16)).toBe('FFF')
    })

    it('converts negative integers', () => {
      expect(convertToBase('-255', 16)).toBe('-FF')
    })
  })

  it('returns null for non-integer input', () => {
    expect(convertToBase('3.14', 2)).toBeNull()
    expect(convertToBase('abc', 8)).toBeNull()
    expect(convertToBase('', 16)).toBeNull()
  })

  it('handles large numbers via BigInt', () => {
    const large = '9007199254740993' // > Number.MAX_SAFE_INTEGER
    const result = convertToBase(large, 16)
    expect(result).toBe('20000000000001')
  })
})

describe('convertBases', () => {
  it('converts an integer to all bases', () => {
    const result = convertBases('255')
    expect(result).toEqual({
      decimal: '255',
      binary: '11111111',
      octal: '377',
      hexadecimal: 'FF',
    })
  })

  it('returns null bases for decimals', () => {
    const result = convertBases('3.14')
    expect(result).toEqual({
      decimal: '3.14',
      binary: null,
      octal: null,
      hexadecimal: null,
    })
  })

  it('returns null bases for non-numeric input', () => {
    const result = convertBases('hello')
    expect(result).toEqual({
      decimal: 'hello',
      binary: null,
      octal: null,
      hexadecimal: null,
    })
  })

  it('handles zero', () => {
    const result = convertBases('0')
    expect(result).toEqual({
      decimal: '0',
      binary: '0',
      octal: '0',
      hexadecimal: '0',
    })
  })

  it('handles negative integers', () => {
    const result = convertBases('-16')
    expect(result).toEqual({
      decimal: '-16',
      binary: '-10000',
      octal: '-20',
      hexadecimal: '-10',
    })
  })
})

describe('formatBaseConversions', () => {
  it('formats all bases when available', () => {
    const result: BaseConversionResult = {
      decimal: '255',
      binary: '11111111',
      octal: '377',
      hexadecimal: 'FF',
    }
    const formatted = formatBaseConversions(result)
    expect(formatted).toBe('DEC: 255\nBIN: 11111111\nOCT: 377\nHEX: FF')
  })

  it('omits null bases', () => {
    const result: BaseConversionResult = {
      decimal: '3.14',
      binary: null,
      octal: null,
      hexadecimal: null,
    }
    const formatted = formatBaseConversions(result)
    expect(formatted).toBe('DEC: 3.14')
  })

  it('includes only available bases', () => {
    const result: BaseConversionResult = {
      decimal: '10',
      binary: '1010',
      octal: null,
      hexadecimal: 'A',
    }
    const formatted = formatBaseConversions(result)
    expect(formatted).toBe('DEC: 10\nBIN: 1010\nHEX: A')
  })
})
