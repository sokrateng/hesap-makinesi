/**
 * ansStore — Stores the last calculation result for use as "Ans" in expressions.
 *
 * Usage:
 *   setAns("42")       // store last result
 *   getAns()           // "42"
 *   resolveAns("Ans+1") // "42+1"
 */

let lastAnswer: string | null = null

/** Store a calculation result as the current Ans value. */
export function setAns(value: string): void {
  lastAnswer = value
}

/** Retrieve the current Ans value, or null if none stored. */
export function getAns(): string | null {
  return lastAnswer
}

/** Clear the stored Ans value. */
export function clearAns(): void {
  lastAnswer = null
}

/**
 * Replace all occurrences of "Ans" (case-sensitive) in an expression
 * with the stored last answer wrapped in parentheses.
 * If no Ans value is stored, returns the expression unchanged.
 */
export function resolveAns(expression: string): string {
  if (lastAnswer === null) {
    return expression
  }
  return expression.replace(/Ans/g, `(${lastAnswer})`)
}
