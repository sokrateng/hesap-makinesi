/**
 * Inverse trigonometric function normalization and helpers.
 *
 * The calculator UI sends:
 *   - arcsin(x) → asin(x) in mathjs
 *   - arccos(x) → acos(x) in mathjs
 *   - arctan(x) → atan(x) in mathjs
 *
 * In degree mode, the result of inverse trig functions needs to be
 * converted from radians to degrees: multiply by (180/pi).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InverseTrigResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/**
 * Normalizes arcsin/arccos/arctan aliases to mathjs-compatible asin/acos/atan.
 */
export function normalizeInverseTrig(expr: string): string {
  return expr
    .replace(/arcsin\(/g, 'asin(')
    .replace(/arccos\(/g, 'acos(')
    .replace(/arctan\(/g, 'atan(')
}

/**
 * Wraps asin/acos/atan calls with degree conversion: (180/pi) * asin(...)
 *
 * This finds each `asin(`, `acos(`, or `atan(` call, matches balanced
 * parentheses, and wraps the entire call with `(180/pi) * `.
 */
export function inverseTrigToDegrees(expr: string): string {
  const fns = ['asin', 'acos', 'atan']
  let result = expr

  for (const fn of fns) {
    const token = `${fn}(`
    let out = ''
    let i = 0

    while (i < result.length) {
      if (
        result.slice(i, i + token.length) === token &&
        (i === 0 || !/[a-zA-Z]/.test(result[i - 1]))
      ) {
        out += `(180/pi*${fn}(`
        i += token.length

        let depth = 1
        while (i < result.length && depth > 0) {
          if (result[i] === '(') depth++
          if (result[i] === ')') depth--
          out += result[i]
          i++
        }
        // Close the extra wrapping paren
        out += ')'
      } else {
        out += result[i]
        i++
      }
    }

    result = out
  }

  return result
}

// ---------------------------------------------------------------------------
// Standalone helpers
// ---------------------------------------------------------------------------

/**
 * Calculates arcsin(x) in radians. Input must be in [-1, 1].
 */
export function arcsin(value: number): InverseTrigResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  if (value < -1 || value > 1) {
    return { value: null, error: 'arcsin icin deger -1 ile 1 arasinda olmali' }
  }
  return { value: Math.asin(value), error: null }
}

/**
 * Calculates arccos(x) in radians. Input must be in [-1, 1].
 */
export function arccos(value: number): InverseTrigResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  if (value < -1 || value > 1) {
    return { value: null, error: 'arccos icin deger -1 ile 1 arasinda olmali' }
  }
  return { value: Math.acos(value), error: null }
}

/**
 * Calculates arctan(x) in radians.
 */
export function arctan(value: number): InverseTrigResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  return { value: Math.atan(value), error: null }
}

/**
 * Converts radians to degrees.
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}
