import { useState, useCallback } from 'react'

export interface UseMemoryReturn {
  /** Current memory value (null if empty) */
  readonly memory: number | null
  /** Whether memory has a stored value */
  readonly hasMemory: boolean
  /** Add value to memory (M+) */
  readonly memoryAdd: (value: number) => void
  /** Subtract value from memory (M-) */
  readonly memorySubtract: (value: number) => void
  /** Recall memory value (MR) — returns stored number or null */
  readonly memoryRecall: () => number | null
  /** Clear memory (MC) */
  readonly memoryClear: () => void
}

export function useMemory(): UseMemoryReturn {
  const [memory, setMemory] = useState<number | null>(null)

  const memoryAdd = useCallback((value: number) => {
    setMemory(prev => (prev ?? 0) + value)
  }, [])

  const memorySubtract = useCallback((value: number) => {
    setMemory(prev => (prev ?? 0) - value)
  }, [])

  const memoryRecall = useCallback((): number | null => {
    return memory
  }, [memory])

  const memoryClear = useCallback(() => {
    setMemory(null)
  }, [])

  return {
    memory,
    hasMemory: memory !== null,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
  }
}
