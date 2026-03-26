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

const TAIL_TRIGGERS: RegExp[] = [
  /\s*kaç\s*(eder|yapar|olur)?\s*\??\s*$/,
  /\s*sonuc(u|ü)?\s*(nedir|ne|kaç)?\s*\??\s*$/,
  /\s*ne\s*(eder|yapar|olur)\s*\??\s*$/,
  /\s*eşittir\s*$/,
  /\s*esittir\s*$/,
  /\s*hesapla\s*$/,
]

const COMMAND_KEYWORDS = ['temizle', 'sil']

const NOISE_WORDS = new Set([
  'kaç', 'eder', 'yapar', 'olur', 'nedir', 'ne', 'sonucu', 'sonuç',
  'bu', 'şu', 'o', 'de', 'da', 'mi', 'mı', 'mu', 'mü',
  'ile', 've', 'bir', 'the', 'is', 'what',
])

export interface SpeechResult {
  type: 'expression' | 'command' | 'expression_auto'
  value: string
}

export function speechToMath(text: string): SpeechResult {
  const normalized = text.trim().toLowerCase()

  for (const keyword of COMMAND_KEYWORDS) {
    if (normalized === keyword || normalized.endsWith(keyword)) {
      return { type: 'command', value: 'clear' }
    }
  }

  for (const pattern of TAIL_TRIGGERS) {
    if (pattern.test(normalized)) {
      const cleaned = normalized.replace(pattern, '').trim()
      if (cleaned) {
        return { type: 'expression_auto', value: convertWords(cleaned) }
      }
      return { type: 'command', value: 'equals' }
    }
  }

  if (normalized === 'eşittir' || normalized === 'esittir' || normalized === 'hesapla') {
    return { type: 'command', value: 'equals' }
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
    } else if (NOISE_WORDS.has(token)) {
      // skip
    } else {
      converted.push(token)
    }
  }

  return converted.join('')
}
