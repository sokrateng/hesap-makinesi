const MULTI_WORD_MAP: [string, string][] = [
  ['parantez aç', '('],
  ['parantez kapat', ')'],
  ['kare kök', '√('],
]

const SINGLE_WORD_MAP: Record<string, string> = {
  'karekök': '√(',
  'artı': '+',
  'arti': '+',
  'eksi': '-',
  'çarpı': '×',
  'carpi': '×',
  'carpı': '×',
  'bölü': '÷',
  'bolu': '÷',
  'sinüs': 'sin(',
  'sinus': 'sin(',
  'kosinüs': 'cos(',
  'kosinus': 'cos(',
  'tanjant': 'tan(',
  'logaritma': 'log(',
  'üssü': '^',
  'üzeri': '^',
  'yüzde': '%',
  'virgül': '.',
  'virgul': '.',
  'nokta': '.',
  'pi': 'π',
  'sıfır': '0',
  'sifir': '0',
  'bir': '1',
  'iki': '2',
  'üç': '3',
  'uc': '3',
  'dört': '4',
  'dort': '4',
  'beş': '5',
  'bes': '5',
  'altı': '6',
  'alti': '6',
  'yedi': '7',
  'sekiz': '8',
  'dokuz': '9',
  'on': '10',
  'yüz': '100',
  'yuz': '100',
  'bin': '1000',
  'x': '×',
}

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
  let processed = text

  for (const [phrase, replacement] of MULTI_WORD_MAP) {
    processed = processed.split(phrase).join(replacement)
  }

  const tokens = processed.split(/\s+/)
  const converted: string[] = []

  for (const token of tokens) {
    if (/^\d+([.,]\d+)?$/.test(token)) {
      converted.push(token.replace(',', '.'))
    } else if (token in SINGLE_WORD_MAP) {
      converted.push(SINGLE_WORD_MAP[token])
    } else if (/^[+\-×÷^√π().*/%=]$/.test(token)) {
      converted.push(token)
    } else {
      converted.push(token)
    }
  }

  return converted.join('')
}
