export interface FunctionTooltip {
  readonly name: string
  readonly description: string
  readonly examples: readonly string[]
}

const TOOLTIPS: Record<string, FunctionTooltip> = {
  'sin(': {
    name: 'Sinus',
    description: 'Bir acinin sinusunu hesaplar.',
    examples: ['sin(90) = 1', 'sin(30) = 0.5'],
  },
  'cos(': {
    name: 'Kosinus',
    description: 'Bir acinin kosinusunu hesaplar.',
    examples: ['cos(0) = 1', 'cos(60) = 0.5'],
  },
  'tan(': {
    name: 'Tanjant',
    description: 'Bir acinin tanjantini hesaplar.',
    examples: ['tan(45) = 1', 'tan(0) = 0'],
  },
  'arcsin(': {
    name: 'Ters Sinus (asin)',
    description: 'Sinusu verilen degerin acisini bulur.',
    examples: ['asin(1) = 90°', 'asin(0.5) = 30°'],
  },
  'arccos(': {
    name: 'Ters Kosinus (acos)',
    description: 'Kosinusu verilen degerin acisini bulur.',
    examples: ['acos(1) = 0°', 'acos(0.5) = 60°'],
  },
  'arctan(': {
    name: 'Ters Tanjant (atan)',
    description: 'Tanjanti verilen degerin acisini bulur.',
    examples: ['atan(1) = 45°', 'atan(0) = 0°'],
  },
  'log10(': {
    name: 'Logaritma (taban 10)',
    description: '10 tabaninda logaritma hesaplar.',
    examples: ['log(100) = 2', 'log(1000) = 3'],
  },
  'ln(': {
    name: 'Dogal Logaritma',
    description: 'e tabaninda (dogal) logaritma hesaplar.',
    examples: ['ln(1) = 0', 'ln(e) = 1'],
  },
  '√(': {
    name: 'Karekok',
    description: 'Bir sayinin karekok degerini hesaplar.',
    examples: ['√(16) = 4', '√(2) ≈ 1.414'],
  },
  '∛(': {
    name: 'Kupkok',
    description: 'Bir sayinin kupkok degerini hesaplar.',
    examples: ['∛(27) = 3', '∛(8) = 2'],
  },
  'abs(': {
    name: 'Mutlak Deger',
    description: 'Bir sayinin mutlak (pozitif) degerini verir.',
    examples: ['|−5| = 5', '|3| = 3'],
  },
  'nCr(': {
    name: 'Kombinasyon (nCr)',
    description: "n elemandan r tanesini secmenin yol sayisi. Iki sayi virgul ile ayrilir.",
    examples: ['nCr(5,2) = 10', 'nCr(10,3) = 120'],
  },
  'nPr(': {
    name: 'Permutasyon (nPr)',
    description: "n elemandan r tanesini sirali dizmenin yol sayisi. Iki sayi virgul ile ayrilir.",
    examples: ['nPr(5,2) = 20', 'nPr(4,4) = 24'],
  },
  'gcd(': {
    name: 'OBEB (En Buyuk Ortak Bolen)',
    description: 'Iki sayinin en buyuk ortak bolenini bulur. Virgul ile ayirin.',
    examples: ['gcd(12,8) = 4', 'gcd(15,25) = 5'],
  },
  'lcm(': {
    name: 'OKEK (En Kucuk Ortak Kat)',
    description: 'Iki sayinin en kucuk ortak katini bulur. Virgul ile ayirin.',
    examples: ['lcm(4,6) = 12', 'lcm(3,7) = 21'],
  },
  'isPrime(': {
    name: 'Asal Sayi Kontrolu',
    description: 'Sayi asal ise 1, degilse 0 doner.',
    examples: ['isPrime(7) = 1', 'isPrime(10) = 0'],
  },
  'mod(': {
    name: 'Modulo (Kalan)',
    description: 'Bolme isleminden kalani verir. Virgul ile ayirin.',
    examples: ['mod(17,5) = 2', 'mod(10,3) = 1'],
  },
  'round(': {
    name: 'Yuvarlama',
    description: 'En yakin tam sayiya yuvarlar.',
    examples: ['round(3.7) = 4', 'round(3.2) = 3'],
  },
  'ceil(': {
    name: 'Tavan (Yukari Yuvarlama)',
    description: 'Bir ust tam sayiya yuvarlar.',
    examples: ['ceil(3.1) = 4', 'ceil(−2.3) = −2'],
  },
  'floor(': {
    name: 'Taban (Asagi Yuvarlama)',
    description: 'Bir alt tam sayiya yuvarlar.',
    examples: ['floor(3.9) = 3', 'floor(−2.3) = −3'],
  },
  'sinh(': {
    name: 'Hiperbolik Sinus',
    description: 'Hiperbolik sinus fonksiyonu.',
    examples: ['sinh(0) = 0', 'sinh(1) ≈ 1.175'],
  },
  'cosh(': {
    name: 'Hiperbolik Kosinus',
    description: 'Hiperbolik kosinus fonksiyonu.',
    examples: ['cosh(0) = 1', 'cosh(1) ≈ 1.543'],
  },
  'tanh(': {
    name: 'Hiperbolik Tanjant',
    description: 'Hiperbolik tanjant fonksiyonu.',
    examples: ['tanh(0) = 0', 'tanh(1) ≈ 0.762'],
  },
  '^': {
    name: 'Us Alma',
    description: 'Bir sayiyi baska bir sayinin kuvvetine yukselttir.',
    examples: ['2^3 = 8', '5^2 = 25'],
  },
  '²': {
    name: 'Kare (x²)',
    description: 'Ifadenin karesini alir.',
    examples: ['5² = 25', '(2+3)² = 25'],
  },
  '³': {
    name: 'Kup (x³)',
    description: 'Ifadenin kupunu alir.',
    examples: ['3³ = 27', '2³ = 8'],
  },
  '!': {
    name: 'Faktoriyel',
    description: 'n! = 1×2×3×...×n seklinde hesaplar.',
    examples: ['5! = 120', '3! = 6'],
  },
}

export function getTooltip(value: string): FunctionTooltip | undefined {
  return TOOLTIPS[value]
}
