/** Hesaplama istatistikleri — toplam, operator dagilimi, ortalama sonuc */

export interface OperatorCounts {
  readonly addition: number
  readonly subtraction: number
  readonly multiplication: number
  readonly division: number
  readonly exponentiation: number
  readonly other: number
}

export interface CalcStats {
  readonly totalCalculations: number
  readonly operatorCounts: OperatorCounts
  readonly mostUsedOperator: string | null
  readonly averageResult: number | null
  readonly maxResult: number | null
  readonly minResult: number | null
}

interface HistoryEntry {
  readonly expression: string
  readonly result: string
}

const OPERATOR_PATTERNS: ReadonlyArray<{ readonly key: keyof OperatorCounts; readonly pattern: RegExp }> = [
  { key: 'addition', pattern: /\+/g },
  { key: 'subtraction', pattern: /(?<!\()-/g },
  { key: 'multiplication', pattern: /[×*]/g },
  { key: 'division', pattern: /[÷/]/g },
  { key: 'exponentiation', pattern: /\^/g },
]

const OPERATOR_LABELS: Readonly<Record<keyof OperatorCounts, string>> = {
  addition: '+',
  subtraction: '-',
  multiplication: '×',
  division: '÷',
  exponentiation: '^',
  other: 'diğer',
}

function countOperators(expressions: readonly string[]): OperatorCounts {
  const counts: Record<keyof OperatorCounts, number> = {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0,
    exponentiation: 0,
    other: 0,
  }

  for (const expr of expressions) {
    for (const { key, pattern } of OPERATOR_PATTERNS) {
      const matches = expr.match(pattern)
      if (matches) {
        counts[key] += matches.length
      }
    }
  }

  return { ...counts }
}

function findMostUsed(counts: OperatorCounts): string | null {
  const entries = Object.entries(counts) as Array<[keyof OperatorCounts, number]>
  const sorted = entries
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])

  if (sorted.length === 0) return null
  return OPERATOR_LABELS[sorted[0][0]]
}

function computeNumericStats(results: readonly string[]): {
  average: number | null
  max: number | null
  min: number | null
} {
  const nums = results
    .map(r => parseFloat(r))
    .filter(n => !isNaN(n) && isFinite(n))

  if (nums.length === 0) {
    return { average: null, max: null, min: null }
  }

  const sum = nums.reduce((acc, n) => acc + n, 0)
  return {
    average: sum / nums.length,
    max: Math.max(...nums),
    min: Math.min(...nums),
  }
}

export function computeCalcStats(history: readonly HistoryEntry[]): CalcStats {
  if (history.length === 0) {
    return {
      totalCalculations: 0,
      operatorCounts: {
        addition: 0,
        subtraction: 0,
        multiplication: 0,
        division: 0,
        exponentiation: 0,
        other: 0,
      },
      mostUsedOperator: null,
      averageResult: null,
      maxResult: null,
      minResult: null,
    }
  }

  const expressions = history.map(h => h.expression)
  const results = history.map(h => h.result)

  const operatorCounts = countOperators(expressions)
  const mostUsedOperator = findMostUsed(operatorCounts)
  const { average, max, min } = computeNumericStats(results)

  return {
    totalCalculations: history.length,
    operatorCounts,
    mostUsedOperator,
    averageResult: average,
    maxResult: max,
    minResult: min,
  }
}
