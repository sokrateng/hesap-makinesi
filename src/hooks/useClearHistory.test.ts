import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

const HISTORY_KEY = 'hesap-makinesi-history'

describe('useCalculator.clearHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('clears history state after calculations', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.append('2+2')
    })
    act(() => {
      result.current.calculate()
    })

    expect(result.current.history.length).toBeGreaterThan(0)

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.history).toEqual([])
  })

  it('removes history from localStorage', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.append('3+3')
    })
    act(() => {
      result.current.calculate()
    })

    expect(localStorage.getItem(HISTORY_KEY)).not.toBeNull()

    act(() => {
      result.current.clearHistory()
    })

    expect(localStorage.getItem(HISTORY_KEY)).toBeNull()
  })

  it('works when history is already empty', () => {
    const { result } = renderHook(() => useCalculator())

    expect(result.current.history).toEqual([])

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.history).toEqual([])
    expect(localStorage.getItem(HISTORY_KEY)).toBeNull()
  })
})
