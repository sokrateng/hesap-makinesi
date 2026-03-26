import type { SpeechStatus } from '../hooks/useSpeechRecognition'

interface MicButtonProps {
  status: SpeechStatus
  onToggle: () => void
  isSupported: boolean
}

export function MicButton({ status, onToggle, isSupported }: MicButtonProps) {
  if (!isSupported) return null

  const isListening = status === 'listening'

  return (
    <button
      className={`mic-button${isListening ? ' listening' : ''}`}
      onClick={onToggle}
      title={isListening ? 'Dinlemeyi durdur' : 'Sesle komut ver'}
    >
      {isListening ? '⏹' : '🎤'}
    </button>
  )
}
