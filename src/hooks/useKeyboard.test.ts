import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { act } from '@testing-library/react'
import { useKeyboard } from './useKeyboard'

function createActions() {
  return {
    append: vi.fn(),
    clear: vi.fn(),
    deleteLast: vi.fn(),
    calculate: vi.fn(),
    applyPercent: vi.fn(),
    applyNegate: vi.fn(),
  }
}

function fireKey(key: string, options?: Partial<KeyboardEvent>) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    ...options,
  })
  window.dispatchEvent(event)
}

describe('useKeyboard', () => {
  let actions: ReturnType<typeof createActions>

  beforeEach(() => {
    actions = createActions()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('digit keys', () => {
    it('appends digit 0-9', () => {
      renderHook(() => useKeyboard(actions))

      for (let d = 0; d <= 9; d++) {
        act(() => fireKey(String(d)))
      }

      expect(actions.append).toHaveBeenCalledTimes(10)
      expect(actions.append).toHaveBeenCalledWith('0')
      expect(actions.append).toHaveBeenCalledWith('5')
      expect(actions.append).toHaveBeenCalledWith('9')
    })

    it('appends decimal point', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('.'))
      expect(actions.append).toHaveBeenCalledWith('.')
    })
  })

  describe('operator keys', () => {
    it('appends + operator', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('+'))
      expect(actions.append).toHaveBeenCalledWith('+')
    })

    it('appends - operator', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('-'))
      expect(actions.append).toHaveBeenCalledWith('-')
    })

    it('appends * operator', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('*'))
      expect(actions.append).toHaveBeenCalledWith('*')
    })

    it('appends / operator', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('/'))
      expect(actions.append).toHaveBeenCalledWith('/')
    })
  })

  describe('parenthesis keys', () => {
    it('appends open parenthesis', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('('))
      expect(actions.append).toHaveBeenCalledWith('(')
    })

    it('appends close parenthesis', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey(')'))
      expect(actions.append).toHaveBeenCalledWith(')')
    })
  })

  describe('action keys', () => {
    it('Enter triggers calculate', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('Enter'))
      expect(actions.calculate).toHaveBeenCalledTimes(1)
      expect(actions.append).not.toHaveBeenCalled()
    })

    it('= triggers calculate', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('='))
      expect(actions.calculate).toHaveBeenCalledTimes(1)
    })

    it('Backspace triggers deleteLast', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('Backspace'))
      expect(actions.deleteLast).toHaveBeenCalledTimes(1)
    })

    it('Escape triggers clear', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('Escape'))
      expect(actions.clear).toHaveBeenCalledTimes(1)
    })

    it('% triggers applyPercent', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('%'))
      expect(actions.applyPercent).toHaveBeenCalledTimes(1)
    })

    it('! appends !', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('!'))
      expect(actions.append).toHaveBeenCalledWith('!')
    })

    it('^ appends ^', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('^'))
      expect(actions.append).toHaveBeenCalledWith('^')
    })

    it(', appends comma', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey(','))
      expect(actions.append).toHaveBeenCalledWith(',')
    })
  })

  describe('function name typing (buffer system)', () => {
    it('typing "sin" appends sin(', () => {
      renderHook(() => useKeyboard(actions))

      act(() => fireKey('s'))
      act(() => fireKey('i'))
      act(() => fireKey('n'))

      expect(actions.append).toHaveBeenCalledWith('sin(')
    })

    it('typing "ln" appends ln(', () => {
      renderHook(() => useKeyboard(actions))

      act(() => fireKey('l'))
      act(() => fireKey('n'))

      expect(actions.append).toHaveBeenCalledWith('ln(')
    })

    it('typing "pi" appends π', () => {
      renderHook(() => useKeyboard(actions))

      act(() => fireKey('p'))
      act(() => fireKey('i'))

      expect(actions.append).toHaveBeenCalledWith('π')
    })

    it('typing "gcd" appends gcd(', () => {
      renderHook(() => useKeyboard(actions))

      act(() => fireKey('g'))
      act(() => fireKey('c'))
      act(() => fireKey('d'))

      expect(actions.append).toHaveBeenCalledWith('gcd(')
    })

    it('typing "lcm" appends lcm(', () => {
      renderHook(() => useKeyboard(actions))

      act(() => fireKey('l'))
      act(() => fireKey('c'))
      act(() => fireKey('m'))

      expect(actions.append).toHaveBeenCalledWith('lcm(')
    })

    it('unmatched letters flush immediately as individual characters', () => {
      renderHook(() => useKeyboard(actions))

      act(() => fireKey('x'))

      // x is not a prefix of any function name, so it flushes immediately
      expect(actions.append).toHaveBeenCalledWith('x')
    })

    it('partial match flushes after timeout if no completion', () => {
      renderHook(() => useKeyboard(actions))

      act(() => fireKey('s'))
      act(() => fireKey('q'))
      // "sq" is prefix of "sqrt" so it waits

      act(() => { vi.advanceTimersByTime(900) })

      expect(actions.append).toHaveBeenCalledWith('s')
      expect(actions.append).toHaveBeenCalledWith('q')
    })
  })

  describe('ignored keys', () => {
    it('ignores F-keys', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('F1'))
      act(() => fireKey('F5'))
      expect(actions.append).not.toHaveBeenCalled()
    })

    it('ignores Tab key', () => {
      renderHook(() => useKeyboard(actions))
      act(() => fireKey('Tab'))
      expect(actions.append).not.toHaveBeenCalled()
    })
  })

  describe('input element filtering', () => {
    it('ignores keydown events from input elements', () => {
      renderHook(() => useKeyboard(actions))

      const input = document.createElement('input')
      document.body.appendChild(input)

      act(() => {
        input.dispatchEvent(
          new KeyboardEvent('keydown', { key: '5', bubbles: true })
        )
      })

      expect(actions.append).not.toHaveBeenCalled()
      document.body.removeChild(input)
    })

    it('ignores keydown events from textarea elements', () => {
      renderHook(() => useKeyboard(actions))

      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)

      act(() => {
        textarea.dispatchEvent(
          new KeyboardEvent('keydown', { key: '3', bubbles: true })
        )
      })

      expect(actions.append).not.toHaveBeenCalled()
      document.body.removeChild(textarea)
    })
  })

  describe('cleanup', () => {
    it('removes event listener on unmount', () => {
      const { unmount } = renderHook(() => useKeyboard(actions))

      unmount()

      act(() => fireKey('5'))
      expect(actions.append).not.toHaveBeenCalled()
    })
  })

  describe('multiple rapid key presses', () => {
    it('handles rapid sequential digit input', () => {
      renderHook(() => useKeyboard(actions))

      act(() => {
        fireKey('1')
        fireKey('2')
        fireKey('3')
      })

      expect(actions.append).toHaveBeenCalledTimes(3)
      expect(actions.append).toHaveBeenNthCalledWith(1, '1')
      expect(actions.append).toHaveBeenNthCalledWith(2, '2')
      expect(actions.append).toHaveBeenNthCalledWith(3, '3')
    })

    it('handles mixed key types in sequence', () => {
      renderHook(() => useKeyboard(actions))

      act(() => {
        fireKey('5')
        fireKey('+')
        fireKey('3')
        fireKey('Enter')
      })

      expect(actions.append).toHaveBeenCalledTimes(3)
      expect(actions.calculate).toHaveBeenCalledTimes(1)
    })
  })
})
