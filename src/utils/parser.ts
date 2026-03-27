import { create, all, type MathJsStatic } from 'mathjs'
import { normalizeRoots } from './rootFunctions'
import { normalizeLogarithms } from './logarithm'
import { normalizePowers } from './powerFunctions'

const math: MathJsStatic = create(all, {})

export type AngleMode = 'deg' | 'rad'

export function normalizeFactorial(expr: string): string {
  let result = expr

  // Handle (...)! → factorial(...)
  let prev = ''
  while (prev !== result) {
    prev = result
    result = result.replace(/\(([^()]+)\)!/g, 'factorial($1)')
  }

  // Handle number! → factorial(number), e.g. 5! or 12!
  result = result.replace(/(\d+)!/g, 'factorial($1)')

  return result
}

export function normalizeAbsoluteValue(expr: string): string {
  let result = expr
  let prev = ''
  while (prev !== result) {
    prev = result
    result = result.replace(/\|([^|]+)\|/g, 'abs($1)')
  }
  return result
}

export function normalize(expression: string): string {
  let expr = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/√\(/g, 'sqrt(')
    .replace(/π/g, 'pi')
    .replace(/ℯ/g, 'e')

  expr = normalizeAbsoluteValue(expr)
  expr = normalizeFactorial(expr)
  expr = normalizeRoots(expr)
  expr = normalizeLogarithms(expr)
  expr = normalizePowers(expr)

  const open = (expr.match(/\(/g) || []).length
  const close = (expr.match(/\)/g) || []).length
  if (open > close) {
    expr += ')'.repeat(open - close)
  }

  return expr
}

function toRadians(expr: string): string {
  const trigFns = ['sin', 'cos', 'tan']
  let result = expr
  for (const fn of trigFns) {
    const regex = new RegExp(`${fn}\\(`, 'g')
    result = result.replace(regex, `${fn}(pi/180 * `)
  }
  return result
}

export function evaluate(
  expression: string,
  angleMode: AngleMode = 'deg'
): { result: string | null; error: string | null } {
  try {
    let normalized = normalize(expression)

    if (angleMode === 'deg') {
      normalized = toRadians(normalized)
    }

    const raw = math.evaluate(normalized)

    if (raw === Infinity || raw === -Infinity) {
      return { result: null, error: 'Sıfıra bölme hatası' }
    }

    const formatted = math.format(raw, {
      precision: 10,
      upperExp: 15,
      lowerExp: -7,
    })

    return { result: formatted, error: null }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('Undefined function')) {
      return { result: null, error: 'Bilinmeyen fonksiyon' }
    }
    return { result: null, error: 'Geçersiz ifade' }
  }
}
