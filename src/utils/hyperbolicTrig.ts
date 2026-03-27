/**
 * Hyperbolic trigonometric function normalization and helpers.
 *
 * The calculator UI sends:
 *   - sinh(x) → sinh(x) in mathjs (native support)
 *   - cosh(x) → cosh(x) in mathjs (native support)
 *   - tanh(x) → tanh(x) in mathjs (native support)
 *
 * mathjs natively supports sinh, cosh, tanh so no normalization
 * is strictly required. This module provides standalone helpers
 * and a normalize function for future alias support.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HyperbolicResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/**
 * Normalizes hyperbolic trig aliases to mathjs-compatible names.
 * Currently mathjs supports sinh/cosh/tanh natively, so this is a
 * pass-through. Kept for consistency with other normalizers.
 */
export function normalizeHyperbolicTrig(expr: string): string {
  return expr
}

// ---------------------------------------------------------------------------
// Standalone helpers
// ---------------------------------------------------------------------------

/**
 * Calculates sinh(x) — hyperbolic sine.
 */
export function sinhFn(value: number): HyperbolicResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  return { value: Math.sinh(value), error: null }
}

/**
 * Calculates cosh(x) — hyperbolic cosine.
 */
export function coshFn(value: number): HyperbolicResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  return { value: Math.cosh(value), error: null }
}

/**
 * Calculates tanh(x) — hyperbolic tangent.
 */
export function tanhFn(value: number): HyperbolicResult {
  if (!Number.isFinite(value)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  return { value: Math.tanh(value), error: null }
}
