const WORD_MAP: [string, string][] = [
  ['parantez aç', '('],
  ['parantez kapat', ')'],
  ['karekök', '√('],
  ['kare kök', '√('],
  ['artı', '+'],
  ['arti', '+'],
  ['eksi', '-'],
  ['çarpı', '×'],
  ['carpi', '×'],
  ['bölü', '÷'],
  ['bolu', '÷'],
  ['sinüs', 'sin('],
  ['sinus', 'sin('],
  ['kosinüs', 'cos('],
  ['kosinus', 'cos('],
  ['tanjant', 'tan('],
  ['logaritma', 'log('],
  ['üssü', '^'],
  ['üzeri', '^'],
  ['yüzde', '%'],
  ['virgül', '.'],
  ['virgul', '.'],
  ['nokta', '.'],
  ['pi', 'π'],
  ['sıfır', '0'],
  ['sifir', '0'],
  ['bir', '1'],
  ['iki', '2'],
  ['üç', '3'],
  ['uc', '3'],
  ['dört', '4'],
  ['dort', '4'],
  ['beş', '5'],
  ['bes', '5'],
  ['altı', '6'],
  ['alti', '6'],
  ['yedi', '7'],
  ['sekiz', '8'],
  ['dokuz', '9'],
  ['on', '10'],
  ['yüz', '100'],
  ['yuz', '100'],
  ['bin', '1000'],
]

const COMMAND_MAP: Record<string, string> = {
  'eşittir': 'equals',
  'esittir': 'equals',
  'hesapla': 'equals',
  'temizle': 'clear',
  'sil': 'clear',
}

export interface SpeechResult {
  type: 'expression' | 'command'
  value: string
}

export function speechToMath(text: string): SpeechResult {
  const normalized = text.trim().toLowerCase()

  for (const [keyword, command] of Object.entries(COMMAND_MAP)) {
    if (normalized === keyword || normalized.endsWith(keyword)) {
      const before = normalized.slice(0, normalized.length - keyword.length).trim()
      if (before) {
        return { type: 'expression', value: convertWords(before) + (command === 'equals' ? '=' : '') }
      }
      return { type: 'command', value: command }
    }
  }

  return { type: 'expression', value: convertWords(normalized) }
}

function convertWords(text: string): string {
  let result = ' ' + text + ' '

  for (const [word, replacement] of WORD_MAP) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`(?<=\\s|^)${escaped}(?=\\s|$)`, 'gi')
    result = result.replace(pattern, ` ${replacement} `)
  }

  return result.replace(/\s+/g, '').trim()
}
