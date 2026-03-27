/**
 * Rounding utilities (round, ceil, floor).
 * Provides normalization for parser input and standalone calculation.
 * mathjs natively supports round(), ceil(), floor() functions.
 */

import { evaluate } from './parser'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoundingResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Normalization — transforms Turkish aliases into mathjs-compatible expressions
// ---------------------------------------------------------------------------

/**
 * Replaces Turkish rounding aliases with mathjs-compatible function names.
 * - yuvarla( → round(
 * - tavan( → ceil(
 * - taban( → floor(
 */
export function normalizeRounding(expr: string): string {
  let result = expr
  result = result.replace(/yuvarla\(/gi, 'round(')
  result = result.replace(/tavan\(/gi, 'ceil(')
  result = result.replace(/taban\(/gi, 'floor(')
  return result
}

// ---------------------------------------------------------------------------
// Standalone calculation helpers
// ---------------------------------------------------------------------------

/**
 * Rounds a number to the nearest integer (or to n decimal places).
 */
export function roundNumber(value: number, decimals?: number): RoundingResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  const expr = decimals !== undefined
    ? `round(${value}, ${decimals})`
    : `round(${value})`
  const { result, error } = evaluate(expr)
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
 * Returns the smallest integer greater than or equal to the given number.
 */
export function ceilNumber(value: number): RoundingResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  const { result, error } = evaluate(`ceil(${value})`)
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
 * Returns the largest integer less than or equal to the given number.
 */
export function floorNumber(value: number): RoundingResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  const { result, error } = evaluate(`floor(${value})`)
  if (error !== null) {
    return { value: null, error }
  }
  const parsed = parseFloat(result!)
  if (!Number.isFinite(parsed)) {
    return { value: null, error: 'Gecersiz sonuc' }
  }
  return { value: parsed, error: null }
}
