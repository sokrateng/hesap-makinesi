/**
 * Random number generation utilities.
 *
 * Provides functions for generating random integers and floating-point
 * numbers within specified ranges.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RandomResult {
  value: number | null
  error: string | null
}

// ---------------------------------------------------------------------------
// Random generators
// ---------------------------------------------------------------------------

/**
 * Generates a random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): RandomResult {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    return { value: null, error: 'Tam sayi bekleniyor' }
  }
  if (min > max) {
    return { value: null, error: 'Min deger max degerden buyuk olamaz' }
  }
  if (min === max) {
    return { value: min, error: null }
  }
  const value = Math.floor(Math.random() * (max - min + 1)) + min
  return { value, error: null }
}

/**
 * Generates a random floating-point number between min and max.
 * The result is rounded to the specified number of decimal places (default 4).
 */
export function randomFloat(
  min: number,
  max: number,
  decimals: number = 4
): RandomResult {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { value: null, error: 'Gecersiz giris' }
  }
  if (!Number.isFinite(decimals) || decimals < 0 || !Number.isInteger(decimals)) {
    return { value: null, error: 'Ondalik basamak sayisi gecersiz' }
  }
  if (min > max) {
    return { value: null, error: 'Min deger max degerden buyuk olamaz' }
  }
  if (min === max) {
    return { value: min, error: null }
  }
  const raw = Math.random() * (max - min) + min
  const factor = Math.pow(10, decimals)
  const value = Math.round(raw * factor) / factor
  return { value, error: null }
}

/**
 * Generates a random number between 0 and 1 (exclusive of 1).
 */
export function random01(): RandomResult {
  return { value: Math.random(), error: null }
}

/**
 * Generates a random integer between 1 and the given max (inclusive).
 * Useful for dice-roll style random numbers.
 */
export function randomUpTo(max: number): RandomResult {
  return randomInt(1, max)
}
