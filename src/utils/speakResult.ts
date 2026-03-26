export function speakResult(expression: string, result: string): void {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()

  const text = humanize(expression, result)
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'tr-TR'
  utterance.rate = 1.0
  utterance.pitch = 1.0

  const voices = window.speechSynthesis.getVoices()
  const turkish = voices.find(v => v.lang.startsWith('tr'))
  if (turkish) utterance.voice = turkish

  window.speechSynthesis.speak(utterance)
}

function humanize(expression: string, result: string): string {
  let spoken = expression
    .replace(/\*/g, ' çarpı ')
    .replace(/\//g, ' bölü ')
    .replace(/\+/g, ' artı ')
    .replace(/-/g, ' eksi ')
    .replace(/×/g, ' çarpı ')
    .replace(/÷/g, ' bölü ')
    .replace(/−/g, ' eksi ')
    .replace(/√\(/g, 'karekök ')
    .replace(/π/g, 'pi')
    .replace(/\^/g, ' üssü ')
    .replace(/sin\(/g, 'sinüs ')
    .replace(/cos\(/g, 'kosinüs ')
    .replace(/tan\(/g, 'tanjant ')
    .replace(/log\(/g, 'logaritma ')
    .replace(/ln\(/g, 'doğal logaritma ')
    .replace(/[()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return `${spoken} eşittir ${result}`
}
