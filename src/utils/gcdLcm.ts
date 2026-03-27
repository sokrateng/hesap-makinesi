/**
 * GCD (OBEB) and LCM (OKEK) utilities.
 * Provides normalization for parser input and standalone calculation functions.
 * Relies on mathjs via the existing parser for evaluation.
 */

import { evaluate } from './parser'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GcdLcmResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Normalization — transforms Turkish aliases into mathjs-compatible expressions
// ---------------------------------------------------------------------------

/**
 * Replaces obeb( with gcd( for parser compatibility.
 * E.g. "obeb(12, 8)" → "gcd(12, 8)"
 */
export function normalizeObeb(expr: string): string {
  return expr.replace(/obeb\(/gi, 'gcd(')
}

/**
 * Replaces okek( with lcm( for parser compatibility.
 * E.g. "okek(4, 6)" → "lcm(4, 6)"
 */
export function normalizeOkek(expr: string): string {
  return expr.replace(/okek\(/gi, 'lcm(')
}

/**
 * Applies all GCD/LCM-related normalizations to an expression.
 */
export function normalizeGcdLcm(expr: string): string {
  let result = expr
  result = normalizeObeb(result)
  result = normalizeOkek(result)
  return result
}

// ---------------------------------------------------------------------------
// Standalone calculation helpers
// ---------------------------------------------------------------------------

/**
 * Calculates the greatest common divisor (GCD / OBEB) of two numbers.
 * Uses mathjs via the parser for consistent precision.
 */
export function gcd(a: number, b: number): GcdLcmResult {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    return { value: null, error: 'Tam sayi gerekli' }
  }
  const { result, error } = evaluate(`gcd(${a}, ${b})`)
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
 * Calculates the least common multiple (LCM / OKEK) of two numbers.
 * Uses mathjs via the parser for consistent precision.
 */
export function lcm(a: number, b: number): GcdLcmResult {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    return { value: null, error: 'Tam sayi gerekli' }
  }
  const { result, error } = evaluate(`lcm(${a}, ${b})`)
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
 * Builds a gcd() expression string for appending to the calculator input.
 * E.g. buildGcdExpression("12", "8") → "gcd(12, 8)"
 */
export function buildGcdExpression(aExpr: string, bExpr: string): string {
  return `gcd(${aExpr}, ${bExpr})`
}

/**
 * Builds an lcm() expression string for appending to the calculator input.
 * E.g. buildLcmExpression("4", "6") → "lcm(4, 6)"
 */
export function buildLcmExpression(aExpr: string, bExpr: string): string {
  return `lcm(${aExpr}, ${bExpr})`
}
