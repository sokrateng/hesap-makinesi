/**
 * Logarithm normalization utilities.
 *
 * The calculator UI sends:
 *   - log(x) → meant as log base 10
 *   - ln(x)  → meant as natural logarithm
 *
 * mathjs treats log(x) as natural log by default and
 * log(x, base) for arbitrary base.
 *
 * This module normalises UI expressions so that:
 *   - log(x) → log(x, 10)
 *   - ln(x)  → log(x)          (mathjs natural log)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LogResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/**
 * Converts `ln(...)` into mathjs-compatible `log(...)` (natural log).
 * Handles nested parentheses correctly by matching balanced parens.
 */
export function normalizeLn(expr: string): string {
  let result = ''
  let i = 0

  while (i < expr.length) {
    if (
      expr[i] === 'l' &&
      expr[i + 1] === 'n' &&
      expr[i + 2] === '('
    ) {
      result += 'log('
      i += 3
    } else {
      result += expr[i]
      i++
    }
  }

  return result
}

/**
 * Converts `log10(x)` into `log(x, 10)` for mathjs.
 * The calculator UI button for base-10 log sends `log10(`.
 *
 * Strategy: find each `log10(`, track balanced parens to find the matching
 * `)`, and rewrite as `log(content, 10)`.
 */
export function normalizeLog10(expr: string): string {
  const result: string[] = []
  let i = 0

  while (i < expr.length) {
    if (
      expr.slice(i, i + 6) === 'log10(' &&
      (i === 0 || !/[a-zA-Z]/.test(expr[i - 1]))
    ) {
      result.push('log(')
      i += 6

      let depth = 1

      while (i < expr.length && depth > 0) {
        const ch = expr[i]
        if (ch === '(') depth++
        if (ch === ')') depth--

        if (depth > 0) {
          result.push(ch)
          i++
        }
      }

      result.push(', 10')

      // Push the closing paren
      if (i < expr.length) {
        result.push(expr[i])
        i++
      }
    } else {
      result.push(expr[i])
      i++
    }
  }

  return result.join('')
}

/**
 * Full logarithm normalization pipeline.
 * Order: log10 → base-10 conversion first, then ln → mathjs log (natural).
 * Plain log() is left as-is (mathjs natural log).
 */
export function normalizeLogarithms(expr: string): string {
  const afterLog10 = normalizeLog10(expr)
  return normalizeLn(afterLog10)
}

// ---------------------------------------------------------------------------
// Standalone helpers
// ---------------------------------------------------------------------------

/**
 * Calculates log base 10 of a number.
 */
export function log10(value: number): LogResult {
  if (value <= 0) {
    return { value: null, error: 'Logaritma icin pozitif sayi gerekli' }
  }
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  return { value: Math.log10(value), error: null }
}

/**
 * Calculates the natural logarithm (ln) of a number.
 */
export function naturalLog(value: number): LogResult {
  if (value <= 0) {
    return { value: null, error: 'Logaritma icin pozitif sayi gerekli' }
  }
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  return { value: Math.log(value), error: null }
}

/**
 * Calculates log with an arbitrary base.
 */
export function logBase(value: number, base: number): LogResult {
  if (value <= 0) {
    return { value: null, error: 'Logaritma icin pozitif sayi gerekli' }
  }
  if (base <= 0 || base === 1) {
    return { value: null, error: 'Gecersiz logaritma tabani' }
  }
  if (!Number.isFinite(value) || !Number.isFinite(base)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  return { value: Math.log(value) / Math.log(base), error: null }
}
