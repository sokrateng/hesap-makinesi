import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMemory } from './useMemory'

describe('useMemory', () => {
  it('starts with null memory', () => {
    const { result } = renderHook(() => useMemory())
    expect(result.current.memory).toBeNull()
    expect(result.current.hasMemory).toBe(false)
  })

  it('M+ adds value to empty memory (treats null as 0)', () => {
    const { result } = renderHook(() => useMemory())
    act(() => result.current.memoryAdd(42))
    expect(result.current.memory).toBe(42)
    expect(result.current.hasMemory).toBe(true)
  })

  it('M+ accumulates values', () => {
    const { result } = renderHook(() => useMemory())
    act(() => result.current.memoryAdd(10))
    act(() => result.current.memoryAdd(5))
    expect(result.current.memory).toBe(15)
  })

  it('M- subtracts value from empty memory', () => {
    const { result } = renderHook(() => useMemory())
    act(() => result.current.memorySubtract(7))
    expect(result.current.memory).toBe(-7)
  })

  it('M- subtracts from existing memory', () => {
    const { result } = renderHook(() => useMemory())
    act(() => result.current.memoryAdd(20))
    act(() => result.current.memorySubtract(8))
    expect(result.current.memory).toBe(12)
  })

  it('MR returns current memory value', () => {
    const { result } = renderHook(() => useMemory())
    expect(result.current.memoryRecall()).toBeNull()
    act(() => result.current.memoryAdd(99))
    expect(result.current.memoryRecall()).toBe(99)
  })

  it('MC clears memory back to null', () => {
    const { result } = renderHook(() => useMemory())
    act(() => result.current.memoryAdd(50))
    expect(result.current.hasMemory).toBe(true)
    act(() => result.current.memoryClear())
    expect(result.current.memory).toBeNull()
    expect(result.current.hasMemory).toBe(false)
  })

  it('handles M+ with negative values', () => {
    const { result } = renderHook(() => useMemory())
    act(() => result.current.memoryAdd(-10))
    expect(result.current.memory).toBe(-10)
  })

  it('handles M+ with decimal values', () => {
    const { result } = renderHook(() => useMemory())
    act(() => result.current.memoryAdd(3.14))
    act(() => result.current.memoryAdd(2.86))
    expect(result.current.memory).toBe(6)
  })

  it('M+ then MC then M+ starts fresh', () => {
    const { result } = renderHook(() => useMemory())
    act(() => result.current.memoryAdd(100))
    act(() => result.current.memoryClear())
    act(() => result.current.memoryAdd(5))
    expect(result.current.memory).toBe(5)
  })

  it('handles zero value operations', () => {
    const { result } = renderHook(() => useMemory())
    act(() => result.current.memoryAdd(0))
    expect(result.current.memory).toBe(0)
    expect(result.current.hasMemory).toBe(true)
  })
})
