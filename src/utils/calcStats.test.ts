import { describe, it, expect } from 'vitest'
import { computeCalcStats, type CalcStats } from './calcStats'

describe('computeCalcStats', () => {
  it('returns zero stats for empty history', () => {
    const stats = computeCalcStats([])
    expect(stats.totalCalculations).toBe(0)
    expect(stats.mostUsedOperator).toBeNull()
    expect(stats.averageResult).toBeNull()
    expect(stats.maxResult).toBeNull()
    expect(stats.minResult).toBeNull()
    expect(stats.operatorCounts.addition).toBe(0)
  })

  it('counts total calculations', () => {
    const history = [
      { expression: '1+2', result: '3' },
      { expression: '4×5', result: '20' },
      { expression: '10÷2', result: '5' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.totalCalculations).toBe(3)
  })

  it('counts addition operators', () => {
    const history = [
      { expression: '1+2+3', result: '6' },
      { expression: '4+5', result: '9' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.operatorCounts.addition).toBe(3)
  })

  it('counts multiplication operators (× and *)', () => {
    const history = [
      { expression: '2×3', result: '6' },
      { expression: '4*5', result: '20' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.operatorCounts.multiplication).toBe(2)
  })

  it('counts division operators (÷ and /)', () => {
    const history = [
      { expression: '10÷2', result: '5' },
      { expression: '20/4', result: '5' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.operatorCounts.division).toBe(2)
  })

  it('counts exponentiation operators', () => {
    const history = [
      { expression: '2^3', result: '8' },
      { expression: '5^2^1', result: '25' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.operatorCounts.exponentiation).toBe(3)
  })

  it('finds most used operator', () => {
    const history = [
      { expression: '1+2+3+4', result: '10' },
      { expression: '5×2', result: '10' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.mostUsedOperator).toBe('+')
  })

  it('computes average result', () => {
    const history = [
      { expression: '2+2', result: '4' },
      { expression: '3+3', result: '6' },
      { expression: '5+5', result: '10' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.averageResult).toBeCloseTo(6.667, 2)
  })

  it('computes max and min result', () => {
    const history = [
      { expression: '1+1', result: '2' },
      { expression: '50+50', result: '100' },
      { expression: '0+5', result: '5' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.maxResult).toBe(100)
    expect(stats.minResult).toBe(2)
  })

  it('handles negative results', () => {
    const history = [
      { expression: '1-5', result: '-4' },
      { expression: '3+7', result: '10' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.minResult).toBe(-4)
    expect(stats.maxResult).toBe(10)
    expect(stats.averageResult).toBe(3)
  })

  it('ignores non-numeric results', () => {
    const history = [
      { expression: '2+2', result: '4' },
      { expression: 'abc', result: 'NaN' },
      { expression: '1/0', result: 'Infinity' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.totalCalculations).toBe(3)
    expect(stats.averageResult).toBe(4)
    expect(stats.maxResult).toBe(4)
    expect(stats.minResult).toBe(4)
  })

  it('returns null mostUsedOperator when no operators present', () => {
    const history = [
      { expression: '42', result: '42' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.mostUsedOperator).toBeNull()
  })

  it('handles mixed operators correctly', () => {
    const history = [
      { expression: '1+2×3-4÷2^1', result: '4' },
    ]
    const stats = computeCalcStats(history)
    expect(stats.operatorCounts.addition).toBe(1)
    expect(stats.operatorCounts.multiplication).toBe(1)
    expect(stats.operatorCounts.subtraction).toBe(1)
    expect(stats.operatorCounts.division).toBe(1)
    expect(stats.operatorCounts.exponentiation).toBe(1)
  })

  it('returns immutable stats object', () => {
    const history = [{ expression: '1+1', result: '2' }]
    const stats: CalcStats = computeCalcStats(history)
    // Type system enforces readonly, runtime check that values are correct
    expect(stats.totalCalculations).toBe(1)
    expect(typeof stats.operatorCounts).toBe('object')
  })
})
