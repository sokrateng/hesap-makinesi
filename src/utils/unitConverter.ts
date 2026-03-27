/**
 * Converts between common measurement units.
 * Supports length, weight/mass, and temperature conversions.
 * No external dependencies — pure math only.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UnitCategory = 'length' | 'weight' | 'temperature'

export interface ConversionResult {
  from: string
  to: string
  inputValue: number
  outputValue: number
  category: UnitCategory
}

// ---------------------------------------------------------------------------
// Length units (base: meter)
// ---------------------------------------------------------------------------

const LENGTH_TO_METER: Readonly<Record<string, number>> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
}

// ---------------------------------------------------------------------------
// Weight units (base: kilogram)
// ---------------------------------------------------------------------------

const WEIGHT_TO_KG: Readonly<Record<string, number>> = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  t: 1000,
  oz: 0.02834952,
  lb: 0.45359237,
}

// ---------------------------------------------------------------------------
// Temperature helpers
// ---------------------------------------------------------------------------

type TempUnit = 'c' | 'f' | 'k'

function celsiusTo(value: number, to: TempUnit): number {
  switch (to) {
    case 'c':
      return value
    case 'f':
      return value * 9 / 5 + 32
    case 'k':
      return value + 273.15
  }
}

function toCelsius(value: number, from: TempUnit): number {
  switch (from) {
    case 'c':
      return value
    case 'f':
      return (value - 32) * 5 / 9
    case 'k':
      return value - 273.15
  }
}

const TEMP_UNITS: ReadonlySet<string> = new Set(['c', 'f', 'k'])

// ---------------------------------------------------------------------------
// Category detection
// ---------------------------------------------------------------------------

export function getCategory(unit: string): UnitCategory | null {
  const u = unit.toLowerCase()
  if (u in LENGTH_TO_METER) return 'length'
  if (u in WEIGHT_TO_KG) return 'weight'
  if (TEMP_UNITS.has(u)) return 'temperature'
  return null
}

// ---------------------------------------------------------------------------
// Available units per category
// ---------------------------------------------------------------------------

export function getUnitsForCategory(category: UnitCategory): readonly string[] {
  switch (category) {
    case 'length':
      return Object.keys(LENGTH_TO_METER)
    case 'weight':
      return Object.keys(WEIGHT_TO_KG)
    case 'temperature':
      return [...TEMP_UNITS]
  }
}

export function getAllCategories(): readonly UnitCategory[] {
  return ['length', 'weight', 'temperature'] as const
}

// ---------------------------------------------------------------------------
// Core conversion
// ---------------------------------------------------------------------------

/**
 * Converts a numeric value between two units in the same category.
 * Returns null if the units are incompatible or unrecognized.
 */
export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
): ConversionResult | null {
  const from = fromUnit.toLowerCase()
  const to = toUnit.toLowerCase()

  const catFrom = getCategory(from)
  const catTo = getCategory(to)

  if (catFrom === null || catTo === null || catFrom !== catTo) {
    return null
  }

  if (!Number.isFinite(value)) {
    return null
  }

  const category = catFrom

  let outputValue: number

  if (category === 'temperature') {
    const celsius = toCelsius(value, from as TempUnit)
    outputValue = celsiusTo(celsius, to as TempUnit)
  } else if (category === 'length') {
    const meters = value * LENGTH_TO_METER[from]
    outputValue = meters / LENGTH_TO_METER[to]
  } else {
    // weight
    const kg = value * WEIGHT_TO_KG[from]
    outputValue = kg / WEIGHT_TO_KG[to]
  }

  return {
    from,
    to,
    inputValue: value,
    outputValue,
    category,
  }
}

/**
 * Rounds the converted value to a specified number of decimal places.
 * Useful for display purposes.
 */
export function convertAndRound(
  value: number,
  fromUnit: string,
  toUnit: string,
  decimals: number = 6,
): ConversionResult | null {
  const result = convertUnit(value, fromUnit, toUnit)
  if (result === null) return null

  const factor = Math.pow(10, decimals)
  return {
    ...result,
    outputValue: Math.round(result.outputValue * factor) / factor,
  }
}

/**
 * Formats a conversion result as a human-readable string.
 * E.g. "100 cm = 1 m"
 */
export function formatConversion(result: ConversionResult): string {
  return `${result.inputValue} ${result.from} = ${result.outputValue} ${result.to}`
}
