/**
 * Formats a calculator result string with locale-aware thousand separators.
 * Handles integers, decimals, negative numbers, and scientific notation.
 * Does not format if the value is not a plain number (e.g. matrix, error).
 */

export interface FormatOptions {
  locale?: string
  groupSeparator?: string
  decimalSeparator?: string
}

const DEFAULT_OPTIONS: Required<FormatOptions> = {
  locale: 'tr-TR',
  groupSeparator: '.',
  decimalSeparator: ',',
}

/**
 * Returns true if the string represents a plain number
 * (integer, decimal, negative, or scientific notation).
 */
export function isPlainNumber(value: string): boolean {
  return /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(value.trim())
}

/**
 * Formats integer part of a number string with thousand separators.
 * E.g. "1234567" → "1.234.567" (with '.' separator)
 */
export function formatIntegerPart(
  intStr: string,
  separator: string
): string {
  const isNegative = intStr.startsWith('-')
  const digits = isNegative ? intStr.slice(1) : intStr

  if (digits.length <= 3) return intStr

  const groups: string[] = []
  let i = digits.length

  while (i > 0) {
    const start = Math.max(0, i - 3)
    groups.unshift(digits.slice(start, i))
    i = start
  }

  const formatted = groups.join(separator)
  return isNegative ? `-${formatted}` : formatted
}

/**
 * Formats a calculator result for display.
 * - Plain numbers get thousand separators and localized decimal point
 * - Scientific notation: coefficient gets formatted, exponent stays as-is
 * - Non-numeric strings are returned unchanged
 */
export function formatResult(
  value: string,
  options?: FormatOptions
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const trimmed = value.trim()

  if (!trimmed || !isPlainNumber(trimmed)) {
    return value
  }

  // Handle scientific notation: e.g. "1.23456e+15"
  const sciMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)(e[+-]?\d+)$/i)
  if (sciMatch) {
    const [, coefficient, exponent] = sciMatch
    const formatted = formatPlainNumber(coefficient, opts)
    return `${formatted}${exponent}`
  }

  return formatPlainNumber(trimmed, opts)
}

function formatPlainNumber(
  value: string,
  opts: Required<FormatOptions>
): string {
  const dotIndex = value.indexOf('.')

  if (dotIndex === -1) {
    // Integer
    return formatIntegerPart(value, opts.groupSeparator)
  }

  const intPart = value.slice(0, dotIndex)
  const decPart = value.slice(dotIndex + 1)

  const formattedInt = formatIntegerPart(intPart, opts.groupSeparator)
  return `${formattedInt}${opts.decimalSeparator}${decPart}`
}
