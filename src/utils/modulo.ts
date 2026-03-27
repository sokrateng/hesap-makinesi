/**
 * Modulo (mod) utility.
 * Provides normalization for parser input and standalone calculation.
 * mathjs natively supports mod(a, b) and a mod b syntax.
 */

import { evaluate } from './parser'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModuloResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/**
 * Normalizes modulo-related expressions for parser compatibility.
 * - Converts "%" operator to " mod " when used as modulo (not percent)
 *   NOTE: We intentionally do NOT convert % here because % is used for percent
 *   in the calculator. Instead we rely on the explicit "mod" keyword or "mod(" function.
 */
export function normalizeModulo(expr: string): string {
  // mathjs already understands "mod" keyword and "mod(a,b)" function
  // No transformation needed — this normalizer exists for consistency and
  // potential future Turkish alias support (e.g. "kalan" → "mod")
  return expr
}

// ---------------------------------------------------------------------------
// Standalone calculation
// ---------------------------------------------------------------------------

/**
 * Calculates a mod b.
 * Returns the remainder of a divided by b.
 */
export function modulo(a: number, b: number): ModuloResult {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  if (b === 0) {
    return { value: null, error: 'Sifira bolme hatasi' }
  }
  const { result, error } = evaluate(`mod(${a}, ${b})`)
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
 * Builds a mod() expression string for appending to the calculator input.
 * E.g. buildModExpression("17", "5") → "mod(17, 5)"
 */
export function buildModExpression(aExpr: string, bExpr: string): string {
  return `mod(${aExpr}, ${bExpr})`
}
