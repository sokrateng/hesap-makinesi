/**
 * Validates a mathematical expression string before evaluation.
 * Checks for unmatched parentheses, consecutive operators, empty parentheses,
 * and other common syntax issues.
 */

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  type: ValidationErrorType
  message: string
  position?: number
}

export type ValidationErrorType =
  | 'unmatched_open_paren'
  | 'unmatched_close_paren'
  | 'consecutive_operators'
  | 'empty_parentheses'
  | 'trailing_operator'
  | 'leading_operator'
  | 'empty_expression'
  | 'adjacent_dots'

const BINARY_OPERATORS = ['+', '-', '*', '/', '×', '÷', '^']
const OPERATOR_CHARS = new Set(BINARY_OPERATORS)

/**
 * Checks for unmatched parentheses in the expression.
 * Returns errors for each unmatched open or close parenthesis.
 */
export function checkParentheses(expr: string): ValidationError[] {
  const errors: ValidationError[] = []
  const stack: number[] = []

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i]
    if (ch === '(') {
      stack.push(i)
    } else if (ch === ')') {
      if (stack.length === 0) {
        errors.push({
          type: 'unmatched_close_paren',
          message: `Eslesmeyen kapanan parantez (pozisyon ${i + 1})`,
          position: i,
        })
      } else {
        stack.pop()
      }
    }
  }

  for (const pos of stack) {
    errors.push({
      type: 'unmatched_open_paren',
      message: `Eslesmeyen acilan parantez (pozisyon ${pos + 1})`,
      position: pos,
    })
  }

  return errors
}

/**
 * Checks for empty parentheses pairs like "()".
 */
export function checkEmptyParentheses(expr: string): ValidationError[] {
  const errors: ValidationError[] = []
  const regex = /\(\)/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(expr)) !== null) {
    errors.push({
      type: 'empty_parentheses',
      message: `Bos parantez (pozisyon ${match.index + 1})`,
      position: match.index,
    })
  }

  return errors
}

/**
 * Checks for consecutive binary operators like "++", "+-", "**" etc.
 * Allows unary minus after an operator (e.g., "5*-3") and after open paren.
 */
export function checkConsecutiveOperators(expr: string): ValidationError[] {
  const errors: ValidationError[] = []

  for (let i = 1; i < expr.length; i++) {
    const prev = expr[i - 1]
    const curr = expr[i]

    if (!OPERATOR_CHARS.has(prev) || !OPERATOR_CHARS.has(curr)) continue

    // Allow unary minus: operator followed by '-' is okay if next char is digit or '('
    if (curr === '-' && i + 1 < expr.length) {
      const next = expr[i + 1]
      if (/[\d(]/.test(next)) continue
    }

    errors.push({
      type: 'consecutive_operators',
      message: `Ardisik operatorler '${prev}${curr}' (pozisyon ${i})`,
      position: i,
    })
  }

  return errors
}

/**
 * Checks if the expression starts with a non-unary binary operator.
 * Allows leading '-' (unary minus) and '+' (unary plus).
 */
export function checkLeadingOperator(expr: string): ValidationError[] {
  const trimmed = expr.trim()
  if (!trimmed) return []

  const first = trimmed[0]
  if (OPERATOR_CHARS.has(first) && first !== '-' && first !== '+') {
    return [{
      type: 'leading_operator',
      message: `Ifade operatorle baslayamaz: '${first}'`,
      position: 0,
    }]
  }

  return []
}

/**
 * Checks if the expression ends with a binary operator.
 */
export function checkTrailingOperator(expr: string): ValidationError[] {
  const trimmed = expr.trim()
  if (!trimmed) return []

  const last = trimmed[trimmed.length - 1]
  if (OPERATOR_CHARS.has(last)) {
    return [{
      type: 'trailing_operator',
      message: `Ifade operatorle bitemez: '${last}'`,
      position: trimmed.length - 1,
    }]
  }

  return []
}

/**
 * Checks for adjacent decimal dots like ".." in numbers.
 */
export function checkAdjacentDots(expr: string): ValidationError[] {
  const errors: ValidationError[] = []
  const regex = /\.\./g
  let match: RegExpExecArray | null

  while ((match = regex.exec(expr)) !== null) {
    errors.push({
      type: 'adjacent_dots',
      message: `Yanyana ondalik noktalari (pozisyon ${match.index + 1})`,
      position: match.index,
    })
  }

  return errors
}

/**
 * Validates a mathematical expression and returns all found errors.
 * An empty expression is considered invalid.
 */
export function validateExpression(expr: string): ValidationResult {
  const trimmed = expr.trim()

  if (!trimmed) {
    return {
      valid: false,
      errors: [{
        type: 'empty_expression',
        message: 'Ifade bos olamaz',
      }],
    }
  }

  // Replace function names and known identifiers with placeholder digit
  // so structural checks (leading/trailing operator etc.) work correctly
  const stripped = trimmed
    .replace(/\b(sin|cos|tan|log|ln|sqrt|abs|factorial|pi|e|Ans)\b/g, '1')

  const errors: ValidationError[] = [
    ...checkParentheses(trimmed),
    ...checkEmptyParentheses(stripped),
    ...checkConsecutiveOperators(stripped),
    ...checkLeadingOperator(stripped),
    ...checkTrailingOperator(stripped),
    ...checkAdjacentDots(trimmed),
  ]

  return {
    valid: errors.length === 0,
    errors,
  }
}
