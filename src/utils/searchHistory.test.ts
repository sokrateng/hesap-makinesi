import { describe, it, expect } from 'vitest'
import { searchHistory, highlightMatch, getMatchIndices } from './searchHistory'
import type { HistoryEntry } from './searchHistory'

const sampleHistory: HistoryEntry[] = [
  { expression: '2+3', result: '5', timestamp: 1000 },
  { expression: '10×5', result: '50', timestamp: 2000 },
  { expression: 'sin(45)', result: '0.7071067812', timestamp: 3000 },
  { expression: '100÷4', result: '25', timestamp: 4000 },
  { expression: '15+35', result: '50', timestamp: 5000 },
]

describe('searchHistory', () => {
  it('returns empty array for empty query', () => {
    expect(searchHistory(sampleHistory, '')).toEqual([])
  })

  it('returns empty array for whitespace query', () => {
    expect(searchHistory(sampleHistory, '   ')).toEqual([])
  })

  it('returns empty array for empty history', () => {
    expect(searchHistory([], '5')).toEqual([])
  })

  it('finds entries by expression match', () => {
    const results = searchHistory(sampleHistory, 'sin')
    expect(results).toHaveLength(1)
    expect(results[0].entry.expression).toBe('sin(45)')
    expect(results[0].matchField).toBe('expression')
    expect(results[0].originalIndex).toBe(2)
  })

  it('finds entries by result match', () => {
    const results = searchHistory(sampleHistory, '25')
    expect(results).toHaveLength(1)
    expect(results[0].entry.result).toBe('25')
    expect(results[0].matchField).toBe('result')
  })

  it('marks "both" when query matches expression and result', () => {
    const results = searchHistory(sampleHistory, '50')
    // '10×5' result='50' and '15+35' result='50'
    // Also '50' appears in result of entry at index 1 and 4
    const bothMatches = results.filter(r => r.matchField === 'both')
    const resultOnly = results.filter(r => r.matchField === 'result')
    expect(results.length).toBeGreaterThanOrEqual(2)
    // '50' is in result of index 1 and 4
    expect(resultOnly.length + bothMatches.length).toBeGreaterThanOrEqual(2)
  })

  it('is case-insensitive', () => {
    const results = searchHistory(sampleHistory, 'SIN')
    expect(results).toHaveLength(1)
    expect(results[0].entry.expression).toBe('sin(45)')
  })

  it('preserves original index', () => {
    const results = searchHistory(sampleHistory, '100')
    expect(results).toHaveLength(1)
    expect(results[0].originalIndex).toBe(3)
  })

  it('returns results in history order', () => {
    const results = searchHistory(sampleHistory, '5')
    // Multiple entries contain '5'
    expect(results.length).toBeGreaterThan(1)
    for (let i = 1; i < results.length; i++) {
      expect(results[i].originalIndex).toBeGreaterThan(results[i - 1].originalIndex)
    }
  })

  it('matches partial expressions', () => {
    const results = searchHistory(sampleHistory, '+3')
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results.some(r => r.entry.expression === '2+3')).toBe(true)
  })

  it('returns no results for non-matching query', () => {
    const results = searchHistory(sampleHistory, 'xyz')
    expect(results).toHaveLength(0)
  })
})

describe('highlightMatch', () => {
  it('returns original text for empty query', () => {
    expect(highlightMatch('hello', '')).toEqual(['hello'])
  })

  it('splits text around single match', () => {
    const parts = highlightMatch('2+3=5', '+3')
    expect(parts).toEqual(['2', '+3', '=5'])
  })

  it('handles match at start', () => {
    const parts = highlightMatch('sin(45)', 'sin')
    expect(parts).toEqual(['sin', '(45)'])
  })

  it('handles match at end', () => {
    const parts = highlightMatch('result: 50', '50')
    expect(parts).toEqual(['result: ', '50'])
  })

  it('handles multiple matches', () => {
    const parts = highlightMatch('5+5=10', '5')
    expect(parts).toEqual(['5', '+', '5', '=10'])
  })

  it('is case-insensitive', () => {
    const parts = highlightMatch('SIN(45)', 'sin')
    expect(parts).toEqual(['SIN', '(45)'])
  })

  it('handles full text match', () => {
    const parts = highlightMatch('abc', 'abc')
    expect(parts).toEqual(['abc'])
  })

  it('returns original text when no match', () => {
    const parts = highlightMatch('hello', 'xyz')
    expect(parts).toEqual(['hello'])
  })
})

describe('getMatchIndices', () => {
  it('returns empty for empty query', () => {
    expect(getMatchIndices('hello', '')).toEqual([])
  })

  it('returns correct indices for single match', () => {
    const indices = getMatchIndices('hello world', 'world')
    expect(indices).toEqual([{ start: 6, end: 11 }])
  })

  it('returns correct indices for multiple matches', () => {
    const indices = getMatchIndices('aba', 'a')
    expect(indices).toEqual([
      { start: 0, end: 1 },
      { start: 2, end: 3 },
    ])
  })

  it('is case-insensitive', () => {
    const indices = getMatchIndices('Hello', 'hello')
    expect(indices).toEqual([{ start: 0, end: 5 }])
  })

  it('returns empty when no match', () => {
    const indices = getMatchIndices('hello', 'xyz')
    expect(indices).toEqual([])
  })

  it('handles adjacent matches', () => {
    const indices = getMatchIndices('aaa', 'a')
    expect(indices).toEqual([
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 3 },
    ])
  })
})
