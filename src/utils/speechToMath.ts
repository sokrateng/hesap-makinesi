const MULTI_WORD_MAP: [string, string][] = [
  ['on bir', '11'], ['on iki', '12'], ['on üç', '13'],
  ['on dört', '14'], ['on beş', '15'], ['on altı', '16'],
  ['on yedi', '17'], ['on sekiz', '18'], ['on dokuz', '19'],
  ['on uc', '13'], ['on dort', '14'], ['on bes', '15'],
  ['on alti', '16'],
  ['ne eder', ''], ['ne yapar', ''], ['kaç eder', ''], ['kaç yapar', ''],
  ['kaç eder', ''], ['kac eder', ''], ['kac yapar', ''],
  ['sonucu nedir', ''], ['sonucu ne', ''],
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
  'yirmi': '20',
  'otuz': '30',
  'kırk': '40',
  'kirk': '40',
  'elli': '50',
  'altmış': '60',
  'altmis': '60',
  'yetmiş': '70',
  'yetmis': '70',
  'seksen': '80',
  'doksan': '90',
  'yüz': '100',
  'yuz': '100',
  'bin': '1000',
  'x': '×',
}

const NOISE_WORDS = new Set([
  'kaç', 'kac', 'kaçtır', 'kactir', 'kaçtir', 'kactır',
  'eder', 'yapar', 'nedir', 'ne', 'dir', 'dır',
  'sonucu', 'sonuç', 'sonuc',
  'bul', 'söyle', 'soyle', 'de',
  'lütfen', 'lutfen', 'acaba',
  'bu', 'şu', 'su', 'o',
  'işlemin', 'islemin', 'işlemi', 'islemi',
  'hesabın', 'hesabin', 'hesabı', 'hesabi',
])

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
  let normalized = text.trim().toLowerCase()

  for (const [keyword, command] of Object.entries(COMMAND_MAP)) {
    if (normalized === keyword || normalized.endsWith(' ' + keyword)) {
      const before = normalized.slice(0, normalized.length - keyword.length).trim()
      if (before) {
        return { type: 'expression', value: convertWords(before) + (command === 'equals' ? '=' : '') }
      }
      return { type: 'command', value: command }
    }
  }

  const converted = convertWords(normalized)
  return { type: 'expression', value: converted }
}

function convertWords(text: string): string {
  let processed = text

  for (const [phrase, replacement] of MULTI_WORD_MAP) {
    processed = processed.split(phrase).join(replacement)
  }

  const tokens = processed.split(/\s+/)
  const converted: string[] = []

  for (const token of tokens) {
    if (!token) continue
    if (/^\d+([.,]\d+)?$/.test(token)) {
      converted.push(token.replace(',', '.'))
    } else if (token in SINGLE_WORD_MAP) {
      converted.push(SINGLE_WORD_MAP[token])
    } else if (/^[+\-×÷^√π().*/%=]$/.test(token)) {
      converted.push(token)
    } else if (NOISE_WORDS.has(token)) {
      continue
    } else {
      converted.push(token)
    }
  }

  return converted.join('')
}
