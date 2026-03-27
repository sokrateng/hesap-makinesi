import { useState, useCallback, useRef } from 'react'
import { copyToClipboard } from '../utils/clipboard'

export type CopyStatus = 'idle' | 'copied' | 'failed'

const FEEDBACK_DURATION = 2000

export interface UseCopyToClipboardReturn {
  status: CopyStatus
  copy: (text: string) => Promise<void>
}

/**
 * Hook that copies text to clipboard and provides visual feedback state.
 * Status resets to 'idle' after FEEDBACK_DURATION ms.
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(async (text: string): Promise<void> => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    const success = await copyToClipboard(text)
    setStatus(success ? 'copied' : 'failed')

    timerRef.current = setTimeout(() => {
      setStatus('idle')
      timerRef.current = null
    }, FEEDBACK_DURATION)
  }, [])

  return { status, copy }
}
