# Hesap Makinesi

Sesli komut destekli, tema secenekli bilimsel hesap makinesi.

**Canli Demo:** [sokrateng.github.io/hesap-makinesi](https://sokrateng.github.io/hesap-makinesi/)

## Ozellikler

- **Bilimsel hesaplama** — sin, cos, tan, asin, acos, atan, log, ln, karekok, kupkok, us alma, pi, e
- **Faktoriyel** — `5!` seklinde faktoriyel hesaplama destegi
- **Mutlak deger** — `|x|` pipe notasyonu ile abs hesaplama
- **Kare/kup alma** — x², x³ butonlari ile hizli us alma
- **Kok bulma** — √ ve ∛ butonlari, n'inci kok destegi
- **Logaritma** — log10 ve ln fonksiyonlari
- **Ters trigonometri** — asin, acos, atan butonlari (derece modunda otomatik donusum)
- **Kombinatorik** — nCr (kombinasyon) ve nPr (permutasyon) fonksiyonlari
- **OBEB/OKEK** — gcd ve lcm fonksiyonlari (Turkce: obeb/okek alias)
- **Rastgele sayi** — rand butonu ile rastgele sayi uretme
- **Euler sabiti** — ℯ butonu ile Euler sayisi
- **Ans (Son sonuc)** — Onceki hesaplama sonucunu yeni ifadede kullanma
- **Hafiza islemleri** — M+, M-, MR, MC butonlari
- **Sayi formatlama** — Buyuk sonuclar locale-aware binlik ayirici ile gosterilir
- **Sayi tabani donusumu** — Tam sayi sonuclari BIN/OCT/HEX olarak gosterilir
- **Ifade dogrulama** — Yazarken canli uyarilar (eslesmemis parantez, ardisik operator)
- **Panoya kopyalama** — Sonuca tiklayinca panoya kopyalar, gorsel geri bildirim
- **Birim donusturucu** — Uzunluk, agirlik, sicaklik donusum utility'si
- **Sesle hesaplama** — Turkce konusarak islem yaptirma ("bes carpi bes kac eder")
- **Sonucu sesle okuma** — Sesle sorulan hesaplamalarin sonucu TTS ile okunur
- **3 tema** — Ilkokul (renkli, eglenceli), Lise (modern, dengeli), Universite (koyu, profesyonel)
- **Otomatik hesaplama** — 1.5 saniye bos kalinca sonuc otomatik hesaplanir
- **Otomatik parantez kapatma** — `sin(90` veya `√(16` yazip esittire basinca parantez otomatik kapanir
- **Klavye destegi** — Tum islemler klavyeden yapilabilir
- **Gecmis paneli** — Son 20 hesaplama localStorage'da saklanir, arama destekli
- **Gecmis navigasyonu** — Yukari/asagi ok tuslariyla onceki hesaplamalara gezinme
- **Gecmis temizleme** — Tek tusla gecmisi sil (onay ile)
- **Aci birimi** — DEG/RAD gecisi
- **Klavye kisayol haritasi** — Tum kisayollari gosteren acilir panel
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
│   ├── BackspaceButton.tsx        # Ekranda silme butonu
│   ├── BaseConversionDisplay.tsx  # BIN/OCT/HEX sonuc gosterimi
│   ├── Button.tsx                 # Tek buton, variant bazli stil
│   ├── ButtonGrid.tsx             # 4 satir bilimsel + ana buton gridi
│   ├── ClearHistoryButton.tsx     # Gecmis temizleme (onay ile)
│   ├── Display.tsx                # Ifade + sonuc ekrani (kopyalama destekli)
│   ├── History.tsx                # Gecmis paneli (arama destekli)
│   ├── KeyboardShortcutPanel.tsx  # Klavye kisayol haritasi paneli
│   ├── MemoryButtons.tsx          # M+, M-, MR, MC butonlari
│   ├── MicButton.tsx              # Mikrofon butonu
│   ├── ThemeToggle.tsx            # Tema degistirme butonu
│   └── ValidationWarnings.tsx     # Canli ifade dogrulama uyarilari
├── hooks/
│   ├── useCalculator.ts           # Hesaplama state yonetimi
│   ├── useCopyToClipboard.ts      # Panoya kopyalama hook
│   ├── useHistoryNavigation.ts    # Ok tuslariyla gecmis gezinme
│   ├── useKeyboard.ts             # Klavye dinleyici
│   ├── useMemory.ts               # Hafiza islemleri (M+/M-/MR/MC)
│   ├── useSpeechRecognition.ts    # Web Speech API hook
│   └── useTheme.ts                # Tema yonetimi
├── utils/
│   ├── ansStore.ts                # Ans (son sonuc) deposu
│   ├── baseConverter.ts           # Sayi tabani donusumu (bin/oct/hex)
│   ├── calcStats.ts               # Hesaplama istatistikleri
│   ├── clipboard.ts               # Clipboard API wrapper
│   ├── combinatorics.ts           # nCr/nPr kombinatorik fonksiyonlar
│   ├── formatNumber.ts            # Locale-aware sayi formatlama
│   ├── gcdLcm.ts                  # OBEB/OKEK (gcd/lcm) hesaplama
│   ├── inverseTrig.ts             # Ters trigonometrik fonksiyonlar
│   ├── keyboardShortcuts.ts       # Kisayol verileri ve yardimcilar
│   ├── logarithm.ts               # log10/ln normalizasyon
│   ├── parser.ts                  # mathjs wrapper, normalizasyon pipeline
│   ├── percentPreview.ts          # Yuzde onizleme
│   ├── powerFunctions.ts          # x²/x³ us alma
│   ├── randomNumber.ts            # Rastgele sayi ureteci
│   ├── rootFunctions.ts           # Kupkok, n'inci kok
│   ├── searchHistory.ts           # Gecmis arama
│   ├── speakResult.ts             # TTS ile sonuc okuma
│   ├── speechToMath.ts            # Turkce konusmayi matematik ifadesine cevirme
│   ├── unitConverter.ts           # Birim donusturucu
│   └── validateExpression.ts      # Ifade dogrulama
├── App.tsx                        # Ana bilesen
├── App.css                        # Global stiller
└── theme.css                      # Tema CSS degiskenleri
```
