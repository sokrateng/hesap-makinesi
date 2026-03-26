# Hesap Makinesi — Tasarım Dokümanı

**Tarih:** 2026-03-26  
**Proje:** hesap-makinesi  
**Tip:** Bilimsel Hesap Makinesi (İfade Editörü)  
**Teknoloji:** React + Vite + TypeScript  

---

## Genel Bakış

Tarayıcıda çalışan, dark mode tasarımlı, bilimsel işlemleri destekleyen bir hesap makinesi web uygulaması. Klasik "şu anki sayı" yaklaşımı yerine tam matematiksel ifade editörü mimarisi benimsenmiştir. Kullanıcı `sin(45) + √(16) / 2` gibi ifadeleri yazarak `=` ile sonucu görebilir. Hem fare hem klavye ile kullanılabilir.

---

## Mimari

### Yaklaşım: İfade Tabanlı Editör

Kullanıcı tüm ifadeyi ekranda görür, `=` ile `mathjs` kütüphanesi aracılığıyla hesaplanır. Bu yaklaşım:
- Hata düzeltmeyi kolaylaştırır (Backspace ile istenen karakter silinebilir)
- Karmaşık zincirleme ifadeleri destekler
- Parser mantığını tamamen `mathjs`'e devreder, özel parser gerektirmez

### Bileşen Yapısı

```
hesap-makinesi/
├── src/
│   ├── components/
│   │   ├── Display.tsx        # İfade + sonuç ekranı
│   │   ├── ButtonGrid.tsx     # Buton ızgarası
│   │   ├── Button.tsx         # Tek buton bileşeni
│   │   └── History.tsx        # Geçmiş hesaplamalar paneli
│   ├── hooks/
│   │   ├── useCalculator.ts   # Ana hesap makinesi state & mantık
│   │   └── useKeyboard.ts     # Klavye event yönetimi
│   ├── utils/
│   │   └── parser.ts          # mathjs wrapper & hata yönetimi
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
└── package.json
```

### Sorumluluk Sınırları

| Birim | Sorumluluk | Bağımlılık |
|-------|-----------|-----------|
| `parser.ts` | Matematiksel ifade hesaplama, hata yakalama | `mathjs` |
| `useCalculator.ts` | State yönetimi, buton aksiyonları | `parser.ts` |
| `useKeyboard.ts` | Klavye event listener yönetimi | `useCalculator.ts` |
| `Display.tsx` | İfade ve sonucu gösterme | State props |
| `ButtonGrid.tsx` | Buton layout ve tanımları | `Button.tsx` |
| `Button.tsx` | Tek buton render + tıklama | Props |

---

## Veri Akışı

### State Yapısı

```typescript
interface CalculatorState {
  expression: string       // Ekranda görünen ifade
  result: string           // Hesaplanan sonuç (boş ise henüz hesaplanmadı)
  error: string | null     // Hata mesajı
  history: HistoryEntry[]  // Geçmiş hesaplamalar
}

interface HistoryEntry {
  expression: string
  result: string
  timestamp: number
}
```

### Eylem Akışı

```
Buton tıkla / Klavye girişi
        ↓
useCalculator.dispatch(action)
        ↓
expression string güncellenir → Display anlık gösterir
        ↓
"=" tetiklenince → parser.evaluate(expression)
        ↓
Başarılı → result set, history'ye eklenir
Hatalı   → error set, expression korunur (düzeltme yapılabilir)
```

### Hata Yönetimi

- Sıfıra bölme: `"Sıfıra bölme hatası"`
- Geçersiz ifade: `"Geçersiz ifade"`
- Tanımsız fonksiyon: `"Bilinmeyen fonksiyon"`
- Hata mesajı ekranın alt satırında kırmızı gösterilir
- Hata sonrası expression korunur, kullanıcı düzeltebilir

---

## UI Tasarımı

### Ekran Düzeni

```
┌─────────────────────────────────────────┐
│  sin(45) + √(16) / 2          ← ifade  │
│                             6  ← sonuç │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  sin   cos   tan   log   ln    √    ^  (│  ← bilimsel satır
├─────────────────────────────────────────┤
│   C     ±     %     ÷                  │
│   7     8     9     ×                  │
│   4     5     6     −                  │
│   1     2     3     +                  │
│   0           .     =                  │
└─────────────────────────────────────────┘
```

### Renk Paleti (Dark Mode)

| Eleman | Renk |
|--------|------|
| Sayfa arka planı | `#1C1C1E` |
| Sayı butonları | `#2C2C2E` |
| Operatör butonları | `#3A3A3C` |
| Bilimsel butonlar | `#2C2C3E` |
| `=` butonu | `#FF9F0A` |
| `C` butonu | `#FF453A` |
| Birincil metin | `#FFFFFF` |
| İkincil metin (ifade) | `#EBEBF580` |
| Hata metni | `#FF453A` |

### Animasyonlar

- **Buton hover:** `brightness(1.2)` — 150ms
- **Buton press:** `scale(0.95)` — 100ms, ease-out
- **Sonuç görünümü:** `fadeIn` — 200ms
- **Hata görünümü:** hafif `shake` — 300ms

---

## Klavye Desteği

Klavye kısayolları **global** olarak dinlenir (textarea/input odağı yokken). Tüm giriş `expression` string'ine eklenir, imleç yönetimi yoktur (string'in sonuna eklenir).

| Tuş | Eklenen / Tetiklenen |
|-----|----------------------|
| `0–9`, `.` | Karakteri ifadeye ekle |
| `+`, `-`, `*`, `/` | Operatörü ifadeye ekle |
| `(`, `)` | Parantezi ifadeye ekle |
| `Enter` veya `=` | İfadeyi hesapla |
| `Backspace` | Son karakteri sil |
| `Escape` | İfadeyi temizle |
| `s` | `sin(` ekle |
| `c` | `cos(` ekle |
| `t` | `tan(` ekle |
| `n` | `ln(` ekle (natural log) |
| `g` | `log(` ekle (log base 10) |
| `r` | `sqrt(` ekle |

---

## Açı Birimi

Varsayılan açı birimi **derece (degree)**. `mathjs` konfigürasyonunda `angleMode: 'deg'` olarak ayarlanır. UI'da sağ üstte küçük bir **DEG / RAD** toggle butonu bulunur. Toggle değiştiğinde `parser.ts` mathjs instance'ını yeniden yapılandırır.

Örnek: `sin(90)` → `1` (derece modunda)

---

## Sembol Normalizasyonu (`parser.ts`)

Kullanıcı arayüzünde görünen semboller ile mathjs'e gönderilen string farklıdır. `parser.ts` aşağıdaki dönüşümleri uygular:

| Görünen (expression) | mathjs'e gönderilen |
|----------------------|----------------------|
| `×` | `*` |
| `÷` | `/` |
| `√(` | `sqrt(` |
| `^` | `^` (aynı) |
| `π` | `pi` |
| `e` (sabit) | `e` |

Dönüşüm `evaluate()` çağrısından önce `expression.replace()` zinciriyle yapılır.

---

## `%` ve `±` Semantiği

- **`%`** — ifadenin sonuna `/ 100` ekler. Örn: `50%` → `50 / 100` → `0.5`
- **`±`** — ifadenin tamamını `-(...)` ile sarar. Örn: `sin(45)` → `-(sin(45))`

---

## Geçmiş Paneli (`History.tsx`)

```typescript
interface HistoryEntry {
  expression: string   // Orijinal ifade (görünen sembollerle)
  result: string       // Hesaplanan sonuç string'i
  timestamp: number    // Unix ms
}
```

- Son 20 giriş saklanır
- Her satıra tıklanınca o ifade `expression`'a yüklenir
- Geçmiş yalnızca başarılı hesaplamalar sonrası eklenir (hata durumunda eklenmez)
- `localStorage`'da kalıcı tutulur

---

## Sonuç Biçimlendirme

`mathjs.format()` ile biçimlendirilir:
- Tamsayı sonuçlar tam gösterilir: `6`
- Ondalık: maksimum 10 anlamlı basamak
- Çok büyük/küçük sayılar (mutlak değer `1e15` üzeri veya `1e-7` altı): bilimsel gösterim (`1.23e+20`)

---

## Bağımlılıklar

| Paket | Versiyon | Amaç |
|-------|----------|------|
| `react` | ^18 | UI framework |
| `react-dom` | ^18 | DOM render |
| `mathjs` | ^13 | İfade hesaplama |
| `vite` | ^5 | Build tool |
| `typescript` | ^5 | Tip güvenliği |

---

## Test Stratejisi

- **`parser.ts`** — unit test: geçerli ifadeler, hata durumları, edge case'ler
- **`useCalculator.ts`** — hook testi: state geçişleri
- **Entegrasyon:** buton tıklaması → ekran güncellemesi
- **Manuel:** klavye kısayolları, mobil görünüm

---

## Kapsam Dışı (YAGNI)

- Grafik çizimi
- Değişken tanımlama / programlama modu
- Tema seçici (light/dark toggle)
- PWA / offline destek
- Backend / sunucu

---

## Başarı Kriterleri

- `sin(45) + sqrt(16) * 2` gibi ifadeler doğru hesaplanır
- Geçersiz ifade yazıldığında kullanıcı dostu hata mesajı görünür
- Tüm klavye kısayolları çalışır
- Uygulama mobil ekranda da kullanılabilir düzeyde görünür
