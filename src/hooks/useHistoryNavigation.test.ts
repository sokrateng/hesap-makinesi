import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHistoryNavigation } from './useHistoryNavigation'

function makeHistory(expressions: string[]) {
  return expressions.map((expr, i) => ({
    expression: expr,
    result: String(i),
    timestamp: Date.now() - i * 1000,
  }))
}

describe('useHistoryNavigation', () => {
  let onSelect: Mock<(expression: string) => void>

  beforeEach(() => {
    onSelect = vi.fn<(expression: string) => void>()
  })

  it('starts with index -1 (not navigating)', () => {
    const history = makeHistory(['1+1', '2+2'])
    const { result } = renderHook(() =>
      useHistoryNavigation({ history, onSelect }),
    )
    expect(result.current.index).toBe(-1)
  })

  it('navigateUp selects first history entry', () => {
    const history = makeHistory(['1+1', '2+2', '3+3'])
    const { result } = renderHook(() =>
      useHistoryNavigation({ history, onSelect }),
    )

    act(() => result.current.navigateUp())
    expect(result.current.index).toBe(0)
    expect(onSelect).toHaveBeenCalledWith('1+1')
  })

  it('navigateUp multiple times moves through history', () => {
    const history = makeHistory(['1+1', '2+2', '3+3'])
    const { result } = renderHook(() =>
      useHistoryNavigation({ history, onSelect }),
    )

    act(() => result.current.navigateUp())
    act(() => result.current.navigateUp())
    expect(result.current.index).toBe(1)
    expect(onSelect).toHaveBeenLastCalledWith('2+2')

    act(() => result.current.navigateUp())
    expect(result.current.index).toBe(2)
    expect(onSelect).toHaveBeenLastCalledWith('3+3')
  })

  it('navigateUp does not go past end of history', () => {
    const history = makeHistory(['1+1'])
    const { result } = renderHook(() =>
      useHistoryNavigation({ history, onSelect }),
    )

    act(() => result.current.navigateUp())
    act(() => result.current.navigateUp())
    expect(result.current.index).toBe(0)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('navigateDown returns to newer entries', () => {
    const history = makeHistory(['1+1', '2+2', '3+3'])
    const { result } = renderHook(() =>
      useHistoryNavigation({ history, onSelect }),
    )

    act(() => result.current.navigateUp())
    act(() => result.current.navigateUp())
    act(() => result.current.navigateUp())
    expect(result.current.index).toBe(2)

    act(() => result.current.navigateDown())
    expect(result.current.index).toBe(1)
    expect(onSelect).toHaveBeenLastCalledWith('2+2')
  })

  it('navigateDown past newest entry resets to empty', () => {
    const history = makeHistory(['1+1'])
    const { result } = renderHook(() =>
      useHistoryNavigation({ history, onSelect }),
    )

    act(() => result.current.navigateUp())
    expect(result.current.index).toBe(0)

    act(() => result.current.navigateDown())
    expect(result.current.index).toBe(-1)
    expect(onSelect).toHaveBeenLastCalledWith('')
  })

  it('navigateDown does nothing when already at -1', () => {
    const history = makeHistory(['1+1'])
    const { result } = renderHook(() =>
      useHistoryNavigation({ history, onSelect }),
    )

    act(() => result.current.navigateDown())
    expect(result.current.index).toBe(-1)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('navigateUp does nothing with empty history', () => {
    const { result } = renderHook(() =>
      useHistoryNavigation({ history: [], onSelect }),
    )

    act(() => result.current.navigateUp())
    expect(result.current.index).toBe(-1)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('reset sets index back to -1', () => {
    const history = makeHistory(['1+1', '2+2'])
    const { result } = renderHook(() =>
      useHistoryNavigation({ history, onSelect }),
    )

    act(() => result.current.navigateUp())
    act(() => result.current.navigateUp())
    expect(result.current.index).toBe(1)

    act(() => result.current.reset())
    expect(result.current.index).toBe(-1)
  })

  it('resets index when history length changes', () => {
    const history = makeHistory(['1+1'])
    const { result, rerender } = renderHook(
      ({ hist }) => useHistoryNavigation({ history: hist, onSelect }),
      { initialProps: { hist: history } },
    )

    act(() => result.current.navigateUp())
    expect(result.current.index).toBe(0)

    const newHistory = makeHistory(['5+5', '1+1'])
    rerender({ hist: newHistory })
    expect(result.current.index).toBe(-1)
  })

  it('responds to ArrowUp keydown event', () => {
    const history = makeHistory(['1+1'])
    renderHook(() => useHistoryNavigation({ history, onSelect }))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
      )
    })

    expect(onSelect).toHaveBeenCalledWith('1+1')
  })

  it('responds to ArrowDown keydown event', () => {
    const history = makeHistory(['1+1'])
    const { result } = renderHook(() =>
      useHistoryNavigation({ history, onSelect }),
    )

    act(() => result.current.navigateUp())

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      )
    })

    expect(onSelect).toHaveBeenLastCalledWith('')
    expect(result.current.index).toBe(-1)
  })

  it('ignores arrow keys when target is an input element', () => {
    const history = makeHistory(['1+1'])
    renderHook(() => useHistoryNavigation({ history, onSelect }))

    const input = document.createElement('input')
    document.body.appendChild(input)

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
      )
    })

    expect(onSelect).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })
})
