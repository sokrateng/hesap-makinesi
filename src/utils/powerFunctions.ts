/**
 * Power utility functions for squaring and cubing.
 *
 * Provides:
 *   - Standalone calculation helpers (square, cube, power)
 *   - Expression builder helpers for appending to calculator input
 *   - Normalization for x² and x³ Unicode symbols
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PowerResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Normalization — transforms Unicode superscripts into mathjs-compatible ^
// ---------------------------------------------------------------------------

/**
 * Replaces Unicode superscript ² with ^2 for parser compatibility.
 * E.g. "5²" → "5^2", "(2+3)²" → "(2+3)^2"
 */
export function normalizeSquare(expr: string): string {
  return expr.replace(/²/g, '^2')
}

/**
 * Replaces Unicode superscript ³ with ^3 for parser compatibility.
 * E.g. "5³" → "5^3", "(2+3)³" → "(2+3)^3"
 */
export function normalizeCube(expr: string): string {
  return expr.replace(/³/g, '^3')
}

/**
 * Applies all power-related normalizations to an expression.
 */
export function normalizePowers(expr: string): string {
  let result = expr
  result = normalizeSquare(result)
  result = normalizeCube(result)
  return result
}

// ---------------------------------------------------------------------------
// Standalone calculation helpers
// ---------------------------------------------------------------------------

/**
 * Calculates the square of a number (x^2).
 */
export function square(value: number): PowerResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  const result = value * value
  if (!Number.isFinite(result)) {
    return { value: null, error: 'Sonuc cok buyuk' }
  }
  return { value: result, error: null }
}

/**
 * Calculates the cube of a number (x^3).
 */
export function cube(value: number): PowerResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  const result = value * value * value
  if (!Number.isFinite(result)) {
    return { value: null, error: 'Sonuc cok buyuk' }
  }
  return { value: result, error: null }
}

/**
 * Calculates x raised to an arbitrary power (x^n).
 */
export function power(base: number, exponent: number): PowerResult {
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  const result = Math.pow(base, exponent)
  if (!Number.isFinite(result)) {
    return { value: null, error: 'Sonuc cok buyuk' }
  }
  return { value: result, error: null }
}

// ---------------------------------------------------------------------------
// Expression builders
// ---------------------------------------------------------------------------

/**
 * Builds a square expression string for appending to calculator input.
 * E.g. buildSquareExpression("5") → "(5)^2"
 */
export function buildSquareExpression(innerExpr: string): string {
  return `(${innerExpr})^2`
}

/**
 * Builds a cube expression string for appending to calculator input.
 * E.g. buildCubeExpression("5") → "(5)^3"
 */
export function buildCubeExpression(innerExpr: string): string {
  return `(${innerExpr})^3`
}
