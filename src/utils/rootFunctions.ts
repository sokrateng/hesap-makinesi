/**
 * Root-finding utilities: cube root (cbrt) and nth root.
 * Provides normalization for parser input and standalone calculation functions.
 * Relies on mathjs via the existing parser for evaluation.
 */

import { evaluate } from './parser'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RootResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Normalization — transforms UI symbols into mathjs-compatible expressions
// ---------------------------------------------------------------------------

/**
 * Replaces ∛( with cbrt( for parser compatibility.
 * E.g. "∛(27)" → "cbrt(27)"
 */
export function normalizeCbrt(expr: string): string {
  return expr.replace(/∛\(/g, 'cbrt(')
}

/**
 * Replaces ⁿ√( notation with nthRoot( for parser compatibility.
 * E.g. "3ⁿ√(8)" or "ⁿ√(8,3)" patterns
 * We support "nthRoot(value, n)" as-is since mathjs handles it.
 */
export function normalizeNthRoot(expr: string): string {
  return expr.replace(/ⁿ√\(/g, 'nthRoot(')
}

/**
 * Applies all root-related normalizations to an expression.
 */
export function normalizeRoots(expr: string): string {
  let result = expr
  result = normalizeCbrt(result)
  result = normalizeNthRoot(result)
  return result
}

// ---------------------------------------------------------------------------
// Standalone calculation helpers
// ---------------------------------------------------------------------------

/**
 * Calculates the cube root of a number.
 * Uses mathjs via the parser for consistent precision.
 */
export function cubeRoot(value: number): RootResult {
  const { result, error } = evaluate(`cbrt(${value})`)
  if (error !== null) {
    return { value: null, error }
  }
  const parsed = parseFloat(result!)
  if (!Number.isFinite(parsed)) {
    return { value: null, error: 'Gecersiz sonuc' }
  }
  return { value: parsed, error: null }
}

/**
 * Calculates the nth root of a number.
 * nthRoot(value, n) — e.g. nthRoot(16, 4) = 2
 * Uses mathjs via the parser for consistent precision.
 */
export function nthRoot(value: number, n: number): RootResult {
  if (n === 0) {
    return { value: null, error: 'Sifirinci kok tanimli degil' }
  }
  if (!Number.isFinite(value) || !Number.isFinite(n)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  const { result, error } = evaluate(`nthRoot(${value}, ${n})`)
  if (error !== null) {
    return { value: null, error }
  }
  const parsed = parseFloat(result!)
  if (!Number.isFinite(parsed)) {
    return { value: null, error: 'Gecersiz sonuc' }
  }
  return { value: parsed, error: null }
}

/**
 * Builds a cbrt() expression string for appending to the calculator input.
 * E.g. buildCbrtExpression("27") → "cbrt(27)"
 */
export function buildCbrtExpression(innerExpr: string): string {
  return `cbrt(${innerExpr})`
}

/**
 * Builds an nthRoot() expression string for appending to the calculator input.
 * E.g. buildNthRootExpression("16", "4") → "nthRoot(16, 4)"
 */
export function buildNthRootExpression(valueExpr: string, nExpr: string): string {
  return `nthRoot(${valueExpr}, ${nExpr})`
}
