import { create, all, type MathJsStatic } from 'mathjs'

const math: MathJsStatic = create(all, {})

export type AngleMode = 'deg' | 'rad'

export function normalize(expression: string): string {
  return expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/√\(/g, 'sqrt(')
    .replace(/π/g, 'pi')
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

function autoCloseParens(expr: string): string {
  let open = 0
  for (const ch of expr) {
    if (ch === '(') open++
    else if (ch === ')') open--
  }
  return open > 0 ? expr + ')'.repeat(open) : expr
}

export function evaluate(
  expression: string,
  angleMode: AngleMode = 'deg'
): { result: string | null; error: string | null } {
  try {
    let normalized = normalize(expression)
    normalized = autoCloseParens(normalized)

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
