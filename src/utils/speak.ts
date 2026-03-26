export function speak(text: string, lang = 'tr-TR') {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 1.0
  utterance.pitch = 1.0

  window.speechSynthesis.speak(utterance)
}

export function speakResult(expression: string, result: string) {
  const readable = expression
    .replace(/×/g, ' çarpı ')
    .replace(/÷/g, ' bölü ')
    .replace(/\+/g, ' artı ')
    .replace(/-/g, ' eksi ')
    .replace(/sqrt\(/g, 'karekök ')
    .replace(/√\(/g, 'karekök ')
    .replace(/sin\(/g, 'sinüs ')
    .replace(/cos\(/g, 'kosinüs ')
    .replace(/tan\(/g, 'tanjant ')
    .replace(/log\(/g, 'logaritma ')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/π/g, 'pi')
    .replace(/\^/g, ' üssü ')
    .replace(/\./g, ' virgül ')

  speak(`${readable} eşittir ${result.replace('.', ' virgül ')}`)
}
