export function speakResult(text: string) {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(formatForSpeech(text))
  utterance.lang = 'tr-TR'
  utterance.rate = 1.0
  utterance.pitch = 1.0

  window.speechSynthesis.speak(utterance)
}

function formatForSpeech(text: string): string {
  let result = text
    .replace(/\./g, ' nokta ')
    .replace(/-/g, 'eksi ')
    .replace(/e\+/gi, ' çarpı 10 üzeri ')
    .replace(/e-/gi, ' çarpı 10 üzeri eksi ')
    .replace(/Infinity/gi, 'sonsuz')
    .replace(/NaN/gi, 'tanımsız')

  result = `Sonuç: ${result}`

  return result.replace(/\s+/g, ' ').trim()
}
