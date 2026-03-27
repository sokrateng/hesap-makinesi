import { useState, useCallback, useEffect, useRef } from 'react'

interface HistoryEntry {
  expression: string
  result: string
  timestamp: number
}

interface UseHistoryNavigationOptions {
  history: HistoryEntry[]
  onSelect: (expression: string) => void
}

export interface HistoryNavigationState {
  /** Currently selected index in history (-1 = not navigating) */
  index: number
  /** Reset navigation state (e.g. when user types manually) */
  reset: () => void
  /** Navigate to previous (older) entry */
  navigateUp: () => void
  /** Navigate to next (newer) entry, or back to empty */
  navigateDown: () => void
}

/**
 * Enables ArrowUp/ArrowDown navigation through expression history.
 * ArrowUp moves to older entries, ArrowDown moves to newer ones.
 * Pressing ArrowDown past the newest entry resets to empty input.
 */
export function useHistoryNavigation({
  history,
  onSelect,
}: UseHistoryNavigationOptions): HistoryNavigationState {
  const [index, setIndex] = useState(-1)
  const historyRef = useRef(history)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    historyRef.current = history
  }, [history])

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  const reset = useCallback(() => {
    setIndex(-1)
  }, [])

  const navigateUp = useCallback(() => {
    const hist = historyRef.current
    if (hist.length === 0) return

    setIndex(prev => {
      const next = prev + 1
      if (next >= hist.length) return prev
      onSelectRef.current(hist[next].expression)
      return next
    })
  }, [])

  const navigateDown = useCallback(() => {
    const hist = historyRef.current

    setIndex(prev => {
      if (prev <= 0) {
        if (prev === 0) {
          onSelectRef.current('')
        }
        return -1
      }
      const next = prev - 1
      onSelectRef.current(hist[next].expression)
      return next
    })
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        navigateUp()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        navigateDown()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigateUp, navigateDown])

  // Reset index when history changes (new calculation added)
  useEffect(() => {
    setIndex(-1)
  }, [history.length])

  return { index, reset, navigateUp, navigateDown }
}
