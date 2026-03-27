/**
 * Prime number checking utility.
 *
 * Provides isPrime function for checking if a number is prime,
 * and parser normalization to support isPrime() in expressions.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PrimeResult {
  isPrime: boolean
  value: number
  error: string | null
}

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

/**
 * Checks if a given number is a prime number.
 * Returns true for prime numbers, false otherwise.
 * Only positive integers >= 2 can be prime.
 */
export function isPrime(n: number): PrimeResult {
  if (!Number.isFinite(n)) {
    return { isPrime: false, value: n, error: 'Gecersiz giris' }
  }

  if (!Number.isInteger(n)) {
    return { isPrime: false, value: n, error: 'Asal sayi kontrolu icin tam sayi gerekli' }
  }

  if (n < 2) {
    return { isPrime: false, value: n, error: null }
  }

  if (n === 2) {
    return { isPrime: true, value: n, error: null }
  }

  if (n % 2 === 0) {
    return { isPrime: false, value: n, error: null }
  }

  const limit = Math.sqrt(n)
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) {
      return { isPrime: false, value: n, error: null }
    }
  }

  return { isPrime: true, value: n, error: null }
}

// ---------------------------------------------------------------------------
// Parser normalization
// ---------------------------------------------------------------------------

/**
 * Normalizes isPrime(x) in expressions.
 * Replaces isPrime(x) with (isPrime_check_x) where x is evaluated.
 * Since mathjs doesn't have isPrime, we replace isPrime(n) with
 * a ternary-like result: 1 for prime, 0 for not prime.
 *
 * This function finds isPrime(...) calls and replaces them with
 * the computed result (1 or 0).
 */
export function normalizeIsPrime(expr: string): string {
  const token = 'isPrime('
  let result = expr
  let safety = 0

  while (result.includes(token) && safety < 50) {
    safety++
    const startIdx = result.indexOf(token)
    const argStart = startIdx + token.length
    let depth = 1
    let i = argStart

    while (i < result.length && depth > 0) {
      if (result[i] === '(') depth++
      if (result[i] === ')') depth--
      i++
    }

    const inner = result.slice(argStart, i - 1)

    // Try to evaluate the inner expression as a number
    let numValue: number
    try {
      numValue = Number(inner)
    } catch {
      break
    }

    if (isNaN(numValue)) {
      // Can't evaluate statically, leave for runtime error
      break
    }

    const primeResult = isPrime(numValue)
    const replacement = primeResult.isPrime ? '1' : '0'

    result = result.slice(0, startIdx) + replacement + result.slice(i)
  }

  return result
}
