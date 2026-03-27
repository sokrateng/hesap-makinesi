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
- **Gecmis navigasyonu** — Yukari/asagi ok tuslariyla onceki hesaplamalara gezinme
- **Aci birimi** — DEG/RAD gecisi
- **Sayi formatlama** — Buyuk sonuclar locale-aware binlik ayirici ile gosterilir
- **Panoya kopyalama** — Sonuca tiklayinca panoya kopyalar, gorsel geri bildirim
- **Faktoriyel** — `5!` seklinde faktoriyel hesaplama destegi
- **Klavye kisayol haritasi** — Tum kisayollari gosteren acilir panel
- **Hafiza islemleri** — M+, M-, MR, MC butonlari
- **Silme butonu** — Dokunmatik kullanicilar icin ekranda ⌫ butonu

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
│   ├── BackspaceButton.tsx      # Ekranda silme butonu
│   ├── Button.tsx               # Tek buton, variant bazli stil
│   ├── ButtonGrid.tsx           # Bilimsel + ana buton gridi
│   ├── Display.tsx              # Ifade + sonuc ekrani (kopyalama destekli)
│   ├── History.tsx              # Gecmis paneli
│   ├── KeyboardShortcutPanel.tsx # Klavye kisayol haritasi paneli
│   ├── MemoryButtons.tsx        # M+, M-, MR, MC butonlari
│   ├── MicButton.tsx            # Mikrofon butonu
│   └── ThemeToggle.tsx          # Tema degistirme butonu
├── hooks/
│   ├── useCalculator.ts         # Hesaplama state yonetimi
│   ├── useCopyToClipboard.ts    # Panoya kopyalama hook
│   ├── useHistoryNavigation.ts  # Ok tuslariyla gecmis gezinme
│   ├── useKeyboard.ts           # Klavye dinleyici
│   ├── useMemory.ts             # Hafiza islemleri (M+/M-/MR/MC)
│   ├── useSpeechRecognition.ts  # Web Speech API hook
│   └── useTheme.ts              # Tema yonetimi
├── utils/
│   ├── clipboard.ts             # Clipboard API wrapper
│   ├── formatNumber.ts          # Locale-aware sayi formatlama
│   ├── keyboardShortcuts.ts     # Kisayol verileri ve yardimcilar
│   ├── parser.ts                # mathjs wrapper, normalizasyon, faktoriyel
│   ├── speakResult.ts           # TTS ile sonuc okuma
│   └── speechToMath.ts          # Turkce konusmayi matematik ifadesine cevirme
├── App.tsx                      # Ana bilesen
├── App.css                      # Global stiller
└── theme.css                    # Tema CSS degiskenleri
```
