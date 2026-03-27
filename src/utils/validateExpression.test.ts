import { describe, it, expect } from 'vitest'
import {
  checkParentheses,
  checkEmptyParentheses,
  checkConsecutiveOperators,
  checkLeadingOperator,
  checkTrailingOperator,
  checkAdjacentDots,
  validateExpression,
} from './validateExpression'

describe('checkParentheses', () => {
  it('returns no errors for balanced parentheses', () => {
    expect(checkParentheses('(1+2)')).toEqual([])
    expect(checkParentheses('((3+4)*(5-6))')).toEqual([])
    expect(checkParentheses('sin(45)')).toEqual([])
  })

  it('detects unmatched open parenthesis', () => {
    const errors = checkParentheses('(1+2')
    expect(errors).toHaveLength(1)
    expect(errors[0].type).toBe('unmatched_open_paren')
    expect(errors[0].position).toBe(0)
  })

  it('detects unmatched close parenthesis', () => {
    const errors = checkParentheses('1+2)')
    expect(errors).toHaveLength(1)
    expect(errors[0].type).toBe('unmatched_close_paren')
    expect(errors[0].position).toBe(3)
  })

  it('detects multiple unmatched parentheses', () => {
    const errors = checkParentheses('((1+2')
    expect(errors).toHaveLength(2)
    expect(errors.every(e => e.type === 'unmatched_open_paren')).toBe(true)
  })

  it('returns no errors for empty string', () => {
    expect(checkParentheses('')).toEqual([])
  })

  it('returns no errors for no parentheses', () => {
    expect(checkParentheses('1+2*3')).toEqual([])
  })
})

describe('checkEmptyParentheses', () => {
  it('detects empty parentheses', () => {
    const errors = checkEmptyParentheses('()')
    expect(errors).toHaveLength(1)
    expect(errors[0].type).toBe('empty_parentheses')
  })

  it('detects multiple empty parentheses', () => {
    const errors = checkEmptyParentheses('()()')
    expect(errors).toHaveLength(2)
  })

  it('returns no errors when parentheses have content', () => {
    expect(checkEmptyParentheses('(1+2)')).toEqual([])
  })
})

describe('checkConsecutiveOperators', () => {
  it('detects consecutive operators', () => {
    const errors = checkConsecutiveOperators('1++2')
    expect(errors).toHaveLength(1)
    expect(errors[0].type).toBe('consecutive_operators')
  })

  it('detects different consecutive operators', () => {
    const errors = checkConsecutiveOperators('1*/2')
    expect(errors).toHaveLength(1)
  })

  it('allows unary minus after operator', () => {
    // "5*-3" should be valid: * followed by - with digit after
    expect(checkConsecutiveOperators('5*-3')).toEqual([])
    expect(checkConsecutiveOperators('5*-(3)')).toEqual([])
  })

  it('returns no errors for single operators', () => {
    expect(checkConsecutiveOperators('1+2*3')).toEqual([])
  })

  it('returns no errors for empty string', () => {
    expect(checkConsecutiveOperators('')).toEqual([])
  })
})

describe('checkLeadingOperator', () => {
  it('detects leading multiplication', () => {
    const errors = checkLeadingOperator('*3')
    expect(errors).toHaveLength(1)
    expect(errors[0].type).toBe('leading_operator')
  })

  it('detects leading division', () => {
    const errors = checkLeadingOperator('/3')
    expect(errors).toHaveLength(1)
  })

  it('allows leading minus (unary)', () => {
    expect(checkLeadingOperator('-3')).toEqual([])
  })

  it('allows leading plus (unary)', () => {
    expect(checkLeadingOperator('+3')).toEqual([])
  })

  it('returns no errors for normal expressions', () => {
    expect(checkLeadingOperator('1+2')).toEqual([])
  })

  it('returns no errors for empty string', () => {
    expect(checkLeadingOperator('')).toEqual([])
  })
})

describe('checkTrailingOperator', () => {
  it('detects trailing plus', () => {
    const errors = checkTrailingOperator('3+')
    expect(errors).toHaveLength(1)
    expect(errors[0].type).toBe('trailing_operator')
  })

  it('detects trailing multiply', () => {
    const errors = checkTrailingOperator('3*')
    expect(errors).toHaveLength(1)
  })

  it('returns no errors for valid expressions', () => {
    expect(checkTrailingOperator('3+2')).toEqual([])
  })

  it('returns no errors for empty string', () => {
    expect(checkTrailingOperator('')).toEqual([])
  })
})

describe('checkAdjacentDots', () => {
  it('detects adjacent dots', () => {
    const errors = checkAdjacentDots('3..14')
    expect(errors).toHaveLength(1)
    expect(errors[0].type).toBe('adjacent_dots')
  })

  it('returns no errors for single dots', () => {
    expect(checkAdjacentDots('3.14')).toEqual([])
  })

  it('returns no errors for dots in different numbers', () => {
    expect(checkAdjacentDots('1.2+3.4')).toEqual([])
  })
})

describe('validateExpression', () => {
  it('returns valid for correct expressions', () => {
    expect(validateExpression('1+2').valid).toBe(true)
    expect(validateExpression('(3+4)*5').valid).toBe(true)
    expect(validateExpression('-5+3').valid).toBe(true)
    expect(validateExpression('sin(45)+cos(30)').valid).toBe(true)
  })

  it('returns invalid for empty expression', () => {
    const result = validateExpression('')
    expect(result.valid).toBe(false)
    expect(result.errors[0].type).toBe('empty_expression')
  })

  it('returns invalid for whitespace-only expression', () => {
    const result = validateExpression('   ')
    expect(result.valid).toBe(false)
    expect(result.errors[0].type).toBe('empty_expression')
  })

  it('detects unmatched parentheses', () => {
    const result = validateExpression('(1+2')
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.type === 'unmatched_open_paren')).toBe(true)
  })

  it('detects consecutive operators', () => {
    const result = validateExpression('1++2')
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.type === 'consecutive_operators')).toBe(true)
  })

  it('detects trailing operator', () => {
    const result = validateExpression('1+2+')
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.type === 'trailing_operator')).toBe(true)
  })

  it('detects leading non-unary operator', () => {
    const result = validateExpression('*3')
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.type === 'leading_operator')).toBe(true)
  })

  it('detects adjacent dots', () => {
    const result = validateExpression('3..14')
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.type === 'adjacent_dots')).toBe(true)
  })

  it('collects multiple errors', () => {
    const result = validateExpression('(1++2')
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(2)
  })

  it('handles function names correctly (does not flag as operators)', () => {
    expect(validateExpression('sin(45)').valid).toBe(true)
    expect(validateExpression('log(100)').valid).toBe(true)
    expect(validateExpression('abs(-5)').valid).toBe(true)
  })

  it('handles pi and e constants', () => {
    expect(validateExpression('pi*2').valid).toBe(true)
    expect(validateExpression('e^2').valid).toBe(true)
  })

  it('handles Ans keyword', () => {
    expect(validateExpression('Ans+5').valid).toBe(true)
  })
})
