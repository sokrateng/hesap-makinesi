/**
 * Combinatorics utilities: combinations (nCr) and permutations (nPr).
 * Provides normalization for parser input and standalone calculation functions.
 * Relies on mathjs via the existing parser for evaluation.
 */

import { evaluate } from './parser'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CombinatoricsResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Normalization — transforms UI symbols into mathjs-compatible expressions
// ---------------------------------------------------------------------------

/**
 * Replaces nCr(n, k) with combinations(n, k) for parser compatibility.
 * E.g. "nCr(5, 2)" → "combinations(5, 2)"
 */
export function normalizeNCr(expr: string): string {
  return expr.replace(/nCr\(/g, 'combinations(')
}

/**
 * Replaces nPr(n, k) with permutations(n, k) for parser compatibility.
 * E.g. "nPr(5, 2)" → "permutations(5, 2)"
 */
export function normalizeNPr(expr: string): string {
  return expr.replace(/nPr\(/g, 'permutations(')
}

/**
 * Applies all combinatorics-related normalizations to an expression.
 */
export function normalizeCombinatorics(expr: string): string {
  let result = expr
  result = normalizeNCr(result)
  result = normalizeNPr(result)
  return result
}

// ---------------------------------------------------------------------------
// Standalone calculation helpers
// ---------------------------------------------------------------------------

/**
 * Calculates combinations: C(n, k) = n! / (k! * (n-k)!)
 * Uses mathjs via the parser for consistent precision.
 */
export function combinations(n: number, k: number): CombinatoricsResult {
  if (!Number.isFinite(n) || !Number.isFinite(k)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  if (!Number.isInteger(n) || !Number.isInteger(k)) {
    return { value: null, error: 'Tam sayi gerekli' }
  }
  if (n < 0 || k < 0) {
    return { value: null, error: 'Negatif deger kullanilamaz' }
  }
  if (k > n) {
    return { value: null, error: 'k degeri n degerinden buyuk olamaz' }
  }
  const { result, error } = evaluate(`combinations(${n}, ${k})`)
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
 * Calculates permutations: P(n, k) = n! / (n-k)!
 * Uses mathjs via the parser for consistent precision.
 */
export function permutations(n: number, k: number): CombinatoricsResult {
  if (!Number.isFinite(n) || !Number.isFinite(k)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  if (!Number.isInteger(n) || !Number.isInteger(k)) {
    return { value: null, error: 'Tam sayi gerekli' }
  }
  if (n < 0 || k < 0) {
    return { value: null, error: 'Negatif deger kullanilamaz' }
  }
  if (k > n) {
    return { value: null, error: 'k degeri n degerinden buyuk olamaz' }
  }
  const { result, error } = evaluate(`permutations(${n}, ${k})`)
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
 * Builds an nCr() expression string for appending to the calculator input.
 * E.g. buildNCrExpression("5", "2") → "nCr(5, 2)"
 */
export function buildNCrExpression(nExpr: string, kExpr: string): string {
  return `nCr(${nExpr}, ${kExpr})`
}

/**
 * Builds an nPr() expression string for appending to the calculator input.
 * E.g. buildNPrExpression("5", "2") → "nPr(5, 2)"
 */
export function buildNPrExpression(nExpr: string, kExpr: string): string {
  return `nPr(${nExpr}, ${kExpr})`
}
