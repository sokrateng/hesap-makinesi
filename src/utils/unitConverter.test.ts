import { describe, it, expect } from 'vitest'
import {
  convertUnit,
  convertAndRound,
  formatConversion,
  getCategory,
  getUnitsForCategory,
  getAllCategories,
} from './unitConverter'

// ---------------------------------------------------------------------------
// getCategory
// ---------------------------------------------------------------------------

describe('getCategory', () => {
  it('returns "length" for length units', () => {
    expect(getCategory('m')).toBe('length')
    expect(getCategory('km')).toBe('length')
    expect(getCategory('ft')).toBe('length')
    expect(getCategory('mi')).toBe('length')
  })

  it('returns "weight" for weight units', () => {
    expect(getCategory('g')).toBe('weight')
    expect(getCategory('kg')).toBe('weight')
    expect(getCategory('lb')).toBe('weight')
  })

  it('returns "temperature" for temperature units', () => {
    expect(getCategory('c')).toBe('temperature')
    expect(getCategory('f')).toBe('temperature')
    expect(getCategory('k')).toBe('temperature')
  })

  it('is case-insensitive', () => {
    expect(getCategory('KM')).toBe('length')
    expect(getCategory('KG')).toBe('weight')
    expect(getCategory('F')).toBe('temperature')
  })

  it('returns null for unknown units', () => {
    expect(getCategory('xyz')).toBeNull()
    expect(getCategory('')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// getUnitsForCategory / getAllCategories
// ---------------------------------------------------------------------------

describe('getUnitsForCategory', () => {
  it('returns length units', () => {
    const units = getUnitsForCategory('length')
    expect(units).toContain('m')
    expect(units).toContain('km')
    expect(units).toContain('ft')
  })

  it('returns weight units', () => {
    const units = getUnitsForCategory('weight')
    expect(units).toContain('kg')
    expect(units).toContain('lb')
  })

  it('returns temperature units', () => {
    const units = getUnitsForCategory('temperature')
    expect(units).toContain('c')
    expect(units).toContain('f')
    expect(units).toContain('k')
  })
})

describe('getAllCategories', () => {
  it('returns all three categories', () => {
    const cats = getAllCategories()
    expect(cats).toEqual(['length', 'weight', 'temperature'])
  })
})

// ---------------------------------------------------------------------------
// convertUnit — Length
// ---------------------------------------------------------------------------

describe('convertUnit — length', () => {
  it('converts meters to kilometers', () => {
    const r = convertUnit(1000, 'm', 'km')
    expect(r).not.toBeNull()
    expect(r!.outputValue).toBeCloseTo(1, 5)
    expect(r!.category).toBe('length')
  })

  it('converts centimeters to meters', () => {
    const r = convertUnit(100, 'cm', 'm')
    expect(r!.outputValue).toBeCloseTo(1, 5)
  })

  it('converts miles to kilometers', () => {
    const r = convertUnit(1, 'mi', 'km')
    expect(r!.outputValue).toBeCloseTo(1.609344, 4)
  })

  it('converts inches to centimeters', () => {
    const r = convertUnit(1, 'in', 'cm')
    expect(r!.outputValue).toBeCloseTo(2.54, 5)
  })

  it('converts feet to meters', () => {
    const r = convertUnit(1, 'ft', 'm')
    expect(r!.outputValue).toBeCloseTo(0.3048, 4)
  })

  it('converts yards to meters', () => {
    const r = convertUnit(1, 'yd', 'm')
    expect(r!.outputValue).toBeCloseTo(0.9144, 4)
  })

  it('converts same unit to itself', () => {
    const r = convertUnit(42, 'm', 'm')
    expect(r!.outputValue).toBeCloseTo(42, 5)
  })

  it('handles zero', () => {
    const r = convertUnit(0, 'km', 'm')
    expect(r!.outputValue).toBe(0)
  })

  it('handles negative values', () => {
    const r = convertUnit(-5, 'km', 'm')
    expect(r!.outputValue).toBeCloseTo(-5000, 5)
  })
})

// ---------------------------------------------------------------------------
// convertUnit — Weight
// ---------------------------------------------------------------------------

describe('convertUnit — weight', () => {
  it('converts grams to kilograms', () => {
    const r = convertUnit(1000, 'g', 'kg')
    expect(r!.outputValue).toBeCloseTo(1, 5)
  })

  it('converts kilograms to pounds', () => {
    const r = convertUnit(1, 'kg', 'lb')
    expect(r!.outputValue).toBeCloseTo(2.20462, 3)
  })

  it('converts ounces to grams', () => {
    const r = convertUnit(1, 'oz', 'g')
    expect(r!.outputValue).toBeCloseTo(28.34952, 3)
  })

  it('converts tonnes to kilograms', () => {
    const r = convertUnit(1, 't', 'kg')
    expect(r!.outputValue).toBeCloseTo(1000, 5)
  })

  it('converts milligrams to grams', () => {
    const r = convertUnit(1000, 'mg', 'g')
    expect(r!.outputValue).toBeCloseTo(1, 5)
  })
})

// ---------------------------------------------------------------------------
// convertUnit — Temperature
// ---------------------------------------------------------------------------

describe('convertUnit — temperature', () => {
  it('converts Celsius to Fahrenheit', () => {
    const r = convertUnit(0, 'c', 'f')
    expect(r!.outputValue).toBeCloseTo(32, 5)
  })

  it('converts Celsius to Kelvin', () => {
    const r = convertUnit(0, 'c', 'k')
    expect(r!.outputValue).toBeCloseTo(273.15, 5)
  })

  it('converts Fahrenheit to Celsius', () => {
    const r = convertUnit(212, 'f', 'c')
    expect(r!.outputValue).toBeCloseTo(100, 5)
  })

  it('converts Kelvin to Celsius', () => {
    const r = convertUnit(273.15, 'k', 'c')
    expect(r!.outputValue).toBeCloseTo(0, 5)
  })

  it('converts Fahrenheit to Kelvin', () => {
    const r = convertUnit(32, 'f', 'k')
    expect(r!.outputValue).toBeCloseTo(273.15, 3)
  })

  it('handles body temperature F to C', () => {
    const r = convertUnit(98.6, 'f', 'c')
    expect(r!.outputValue).toBeCloseTo(37, 1)
  })

  it('converts same temperature unit to itself', () => {
    const r = convertUnit(25, 'c', 'c')
    expect(r!.outputValue).toBeCloseTo(25, 5)
  })
})

// ---------------------------------------------------------------------------
// convertUnit — Error cases
// ---------------------------------------------------------------------------

describe('convertUnit — errors', () => {
  it('returns null for incompatible categories', () => {
    expect(convertUnit(1, 'm', 'kg')).toBeNull()
    expect(convertUnit(1, 'c', 'km')).toBeNull()
  })

  it('returns null for unknown units', () => {
    expect(convertUnit(1, 'xyz', 'm')).toBeNull()
    expect(convertUnit(1, 'm', 'xyz')).toBeNull()
  })

  it('returns null for Infinity', () => {
    expect(convertUnit(Infinity, 'm', 'km')).toBeNull()
  })

  it('returns null for NaN', () => {
    expect(convertUnit(NaN, 'm', 'km')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// convertAndRound
// ---------------------------------------------------------------------------

describe('convertAndRound', () => {
  it('rounds output to specified decimals', () => {
    const r = convertAndRound(1, 'mi', 'km', 2)
    expect(r).not.toBeNull()
    expect(r!.outputValue).toBe(1.61)
  })

  it('defaults to 6 decimal places', () => {
    const r = convertAndRound(1, 'in', 'cm')
    expect(r!.outputValue).toBe(2.54)
  })

  it('returns null for invalid input', () => {
    expect(convertAndRound(1, 'xyz', 'm')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// formatConversion
// ---------------------------------------------------------------------------

describe('formatConversion', () => {
  it('formats a result as readable string', () => {
    const r = convertUnit(100, 'cm', 'm')!
    const str = formatConversion(r)
    expect(str).toContain('100')
    expect(str).toContain('cm')
    expect(str).toContain('m')
    expect(str).toContain('=')
  })
})
