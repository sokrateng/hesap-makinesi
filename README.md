# Hesap Makinesi

Sesli komut destekli, tema secenekli bilimsel hesap makinesi.

**Canli Demo:** [sokrateng.github.io/hesap-makinesi](https://sokrateng.github.io/hesap-makinesi/)

## Ozellikler

- **Bilimsel hesaplama** — sin, cos, tan, log, ln, karekok, us alma, pi
- **Sesle hesaplama** — Turkce konusarak islem yaptirma ("bes carpi bes kac eder")
- **Sonucu sesle okuma** — Sesle sorulan hesaplamalarin sonucu TTS ile okunur
- **3 tema** — Ilkokul (renkli, eglenceli), Lise (modern, dengeli), Universite (koyu, profesyonel)
- **Otomatik hesaplama** — 1.5 saniye bos kalinca sonuc otomatik hesaplanir
- **Otomatik parantez kapatma** — `sin(90` veya `√(16` yazip esittire basinca parantez otomatik kapanir
- **Klavye destegi** — Tum islemler klavyeden yapilabilir
- **Gecmis paneli** — Son 20 hesaplama localStorage'da saklanir
- **Aci birimi** — DEG/RAD gecisi

## Klavye Kisayollari

| Tus | Islem |
|-----|-------|
| `0-9`, `.` | Rakam girisi |
| `+`, `-`, `*`, `/` | Aritmetik islemler |
| `(`, `)` | Parantez |
| `Enter` veya `=` | Hesapla |
| `Backspace` | Son karakteri sil |
| `Escape` | Temizle |
| `%` | Yuzde |
| `s` | sin( |
| `c` | cos( |
| `t` | tan( |
| `g` | log( |
| `n` | ln( |
| `r` | sqrt( |

## Sesli Komutlar

Mikrofon butonuna basip Turkce konusabilirsiniz:

- "bes carpi bes" → `5×5 = 25`
- "karekok on alti" → `√(16) = 4`
- "sinus doksan" → `sin(90) = 1`
- "temizle" veya "sil" → Ekrani temizler
- Soru cumleleri otomatik filtrelenir: "kac eder", "nedir", "sonucu ne", "bul" vb.

## Teknoloji

- React 19 + TypeScript + Vite
- [mathjs](https://mathjs.org/) — Matematik hesaplama motoru
- Web Speech API — Ses tanima ve TTS
- Vitest — Test framework
- GitHub Actions — CI/CD
- GitHub Pages — Hosting

## Kurulum

```bash
git clone https://github.com/sokrateng/hesap-makinesi.git
cd hesap-makinesi
npm install
npm run dev
```

## Testler

```bash
npm test
```

## Proje Yapisi

```
src/
├── components/
│   ├── Button.tsx          # Tek buton, variant bazli stil
│   ├── ButtonGrid.tsx      # Bilimsel + ana buton gridi
│   ├── Display.tsx         # Ifade + sonuc ekrani
│   ├── History.tsx         # Gecmis paneli
│   ├── MicButton.tsx       # Mikrofon butonu
│   └── ThemeToggle.tsx     # Tema degistirme butonu
├── hooks/
│   ├── useCalculator.ts    # Hesaplama state yonetimi
│   ├── useKeyboard.ts      # Klavye dinleyici
│   ├── useSpeechRecognition.ts  # Web Speech API hook
│   └── useTheme.ts         # Tema yonetimi
├── utils/
│   ├── parser.ts           # mathjs wrapper, normalizasyon
│   ├── speakResult.ts      # TTS ile sonuc okuma
│   └── speechToMath.ts     # Turkce konusmayi matematik ifadesine cevirme
├── App.tsx                 # Ana bilesen
├── App.css                 # Global stiller
└── theme.css               # Tema CSS degiskenleri
```
