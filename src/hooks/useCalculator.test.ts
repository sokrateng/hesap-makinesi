import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

beforeEach(() => {
  localStorage.clear()
})

describe('useCalculator', () => {
  it('starts with empty state', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.expression).toBe('')
    expect(result.current.result).toBe('')
    expect(result.current.error).toBeNull()
  })

  it('appends characters to expression', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('5'))
    act(() => result.current.append('+'))
    act(() => result.current.append('3'))
    expect(result.current.expression).toBe('5+3')
  })

  it('clears expression', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('123'))
    act(() => result.current.clear())
    expect(result.current.expression).toBe('')
    expect(result.current.result).toBe('')
    expect(result.current.error).toBeNull()
  })

  it('deletes last character', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('123'))
    act(() => result.current.deleteLast())
    expect(result.current.expression).toBe('12')
  })

  it('evaluates expression on calculate', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2+3'))
    act(() => result.current.calculate())
    expect(result.current.result).toBe('5')
    expect(result.current.error).toBeNull()
  })

  it('shows error for invalid expression', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2+*3'))
    act(() => result.current.calculate())
    expect(result.current.error).toBeTruthy()
  })

  it('adds successful calculation to history', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2+3'))
    act(() => result.current.calculate())
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].expression).toBe('2+3')
    expect(result.current.history[0].result).toBe('5')
  })

  it('does not add failed calculation to history', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2+*'))
    act(() => result.current.calculate())
    expect(result.current.history).toHaveLength(0)
  })

  it('loads expression from history', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('2+3'))
    act(() => result.current.calculate())
    act(() => result.current.clear())
    act(() => result.current.loadFromHistory(0))
    expect(result.current.expression).toBe('2+3')
  })

  it('toggles angle mode', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.angleMode).toBe('deg')
    act(() => result.current.toggleAngleMode())
    expect(result.current.angleMode).toBe('rad')
    act(() => result.current.toggleAngleMode())
    expect(result.current.angleMode).toBe('deg')
  })

  it('applies percent', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('50'))
    act(() => result.current.applyPercent())
    expect(result.current.expression).toBe('50 / 100')
  })

  it('applies negate', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.append('42'))
    act(() => result.current.applyNegate())
    expect(result.current.expression).toBe('-(42)')
  })
})
