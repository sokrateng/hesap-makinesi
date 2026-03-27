import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCopyToClipboard } from './useCopyToClipboard'

beforeEach(() => {
  vi.useFakeTimers()
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
  // Ensure execCommand exists on document for jsdom
  if (!document.execCommand) {
    document.execCommand = vi.fn().mockReturnValue(false)
  }
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useCopyToClipboard', () => {
  it('starts with idle status', () => {
    const { result } = renderHook(() => useCopyToClipboard())
    expect(result.current.status).toBe('idle')
  })

  it('sets status to copied on success', async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('42')
    })

    expect(result.current.status).toBe('copied')
  })

  it('sets status to failed when clipboard returns false', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    vi.spyOn(document, 'execCommand').mockReturnValue(false)

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('42')
    })

    expect(result.current.status).toBe('failed')
  })

  it('resets to idle after timeout', async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('42')
    })

    expect(result.current.status).toBe('copied')

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.status).toBe('idle')
  })

  it('resets previous timer on rapid copies', async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('first')
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.status).toBe('copied')

    await act(async () => {
      await result.current.copy('second')
    })

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    // Should still be 'copied' since second copy restarted the timer
    expect(result.current.status).toBe('copied')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current.status).toBe('idle')
  })

  it('does not set copied for empty string', async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('')
    })

    expect(result.current.status).toBe('failed')
  })
})
