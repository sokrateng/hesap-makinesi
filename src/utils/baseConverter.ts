/**
 * Converts a decimal number result to binary, octal, and hexadecimal representations.
 * Only works with integer values; non-integer or non-numeric inputs return null for all bases.
 */

export interface BaseConversionResult {
  decimal: string
  binary: string | null
  octal: string | null
  hexadecimal: string | null
}

/**
 * Returns true if the string represents an integer (possibly negative).
 */
export function isConvertibleInteger(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  return /^-?\d+$/.test(trimmed)
}

/**
 * Converts a decimal integer string to the specified base (2, 8, or 16).
 * Returns null for non-integer or empty inputs.
 * Handles negative numbers with a leading '-' prefix.
 */
export function convertToBase(value: string, base: 2 | 8 | 16): string | null {
  const trimmed = value.trim()
  if (!isConvertibleInteger(trimmed)) return null

  const isNegative = trimmed.startsWith('-')
  const absStr = isNegative ? trimmed.slice(1) : trimmed

  // Use BigInt for arbitrarily large integers
  try {
    const num = BigInt(absStr)
    const converted = num.toString(base).toUpperCase()
    return isNegative ? `-${converted}` : converted
  } catch {
    return null
  }
}

/**
 * Converts a calculator result to binary, octal, and hexadecimal.
 * For non-integer results (decimals, scientific notation, errors), base fields are null.
 */
export function convertBases(value: string): BaseConversionResult {
  const trimmed = value.trim()

  return {
    decimal: trimmed,
    binary: convertToBase(trimmed, 2),
    octal: convertToBase(trimmed, 8),
    hexadecimal: convertToBase(trimmed, 16),
  }
}

/**
 * Formats a base conversion result as a human-readable multi-line string.
 * Only includes bases that have a valid conversion.
 */
export function formatBaseConversions(result: BaseConversionResult): string {
  const lines: string[] = [`DEC: ${result.decimal}`]

  if (result.binary !== null) {
    lines.push(`BIN: ${result.binary}`)
  }
  if (result.octal !== null) {
    lines.push(`OCT: ${result.octal}`)
  }
  if (result.hexadecimal !== null) {
    lines.push(`HEX: ${result.hexadecimal}`)
  }

  return lines.join('\n')
}
