import { useState, useCallback, useRef } from 'react'

export type SpeechStatus = 'idle' | 'listening' | 'processing'

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Mikrofon izni verilmedi',
  'audio-capture': 'Mikrofon bulunamadı',
  'network': 'Ağ bağlantısı hatası',
  'no-speech': 'Ses algılanamadı',
  'service-not-allowed': 'Ses tanıma servisi kullanılamıyor',
  'language-not-supported': 'Dil desteklenmiyor',
}

export function isSpeechSupported(): boolean {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function useSpeechRecognition(onResult: (transcript: string) => void) {
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported] = useState(() => isSpeechSupported())
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const start = useCallback(() => {
    if (!isSupported) return

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionCtor) return

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'tr-TR'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (interimTranscript) {
        setInterim(interimTranscript)
      }

      if (finalTranscript) {
        setStatus('processing')
        setInterim('')
        setError(null)
        onResult(finalTranscript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setStatus('idle')
      setInterim('')
      setError(ERROR_MESSAGES[event.error] ?? 'Ses tanıma hatası')
    }

    recognition.onend = () => {
      setStatus('idle')
      setInterim('')
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    setStatus('listening')
    setError(null)
    recognition.start()
  }, [isSupported, onResult])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const toggle = useCallback(() => {
    if (status === 'listening') {
      stop()
    } else {
      start()
    }
  }, [status, start, stop])

  return { status, interim, error, toggle, isSupported }
}
