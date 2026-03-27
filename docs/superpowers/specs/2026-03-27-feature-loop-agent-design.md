# Feature Loop Agent — Tasarim Dokumani

**Tarih:** 2026-03-27
**Proje:** hesap-makinesi
**Tip:** Otonom Feature Research & Implementation Agent
**Amac:** Ogrenme deneyimi — Claude Code agent, loop, otomasyon

---

## Genel Bakis

Hesap makinesi projesinde periyodik olarak calisan bir otonom agent. Her 2 saatte bir:
1. Web arastirmasi + codebase analizi yaparak yeni feature fikirleri uretir
2. 3 fikri `docs/features.md` backlog'una yazar
3. En uygun 1 feature'i implement eder
4. Test eder ve commit atar

Agent `CronCreate` tool'u ile 2 saatlik cron job olarak baslatilir ve session acik kaldigi surece calisir (max 7 gun, sonra otomatik expire).

---

## Kararlar

| Karar | Secim | Alternatifler |
|-------|-------|---------------|
| Arastirma kaynagi | Web + Codebase | Sadece web, sadece codebase, statik liste |
| Loop mekanizmasi | `CronCreate` (cron: `7 */2 * * *`, her 2 saatte) | CLI script + Task Scheduler, Remote Triggers |
| Otonomi seviyesi | Tam otonom | Yari otonom (onay al), sadece arastirma |
| Branch stratejisi | Master'da direkt | Her loop icin ayri branch |
| Feature sayisi | 3 arastir, 1 implement | 1 per loop, zaman bazli |

---

## Mimari

### Agent Tanimi

Dosya: `.claude/agents/feature-loop.md`

Agent prompt'u su adimlari tanimlar:

1. **Backlog Kontrol** — `docs/features.md` oku, bekleyen feature var mi? (dosya yoksa olustur)
2. **Arastirma** (bekleyen feature sayisi < 3 ise)
   - WebSearch ile benzer hesap makinesi uygulamalarini ara
   - Codebase'i analiz et (eksik test coverage, UX iyilestirme, yeni ozellik firsatlari)
   - 3 yeni fikir uret, features.md'ye yaz
   - Ilk loop'ta dosya yeni olusturulduysa, arastirma sonrasi ayni loop icinde secim adimine devam et
3. **Secim** — Bekleyen listeden en ustteki feature'i sec
4. **Implementasyon** — Kod yaz (React + TypeScript, mevcut stil)
5. **Test** — `npm run test` calistir
6. **Commit** — Conventional commit formatinda commit at
7. **Guncelle** — features.md'de tamamlandi olarak isaretle

### Loop Akisi

```
Loop tetiklendi (her 2 saatte)
    |
    +-- 1. features.md'yi oku (backlog var mi?)
    |
    +-- 2. Bekleyen feature < 3 ise:
    |     +-- WebSearch ile benzer uygulamalari arastir
    |     +-- Codebase'i analiz et
    |     +-- 3 yeni fikir uret -> features.md'ye yaz
    |
    +-- 3. Backlog'dan en ustteki feature'i sec
    |
    +-- 4. Implement et (kod yaz)
    |
    +-- 5. npm run test calistir
    |     +-- PASS -> commit at, features.md guncelle
    |     +-- FAIL -> duzelt, tekrar test (max 3 deneme)
    |
    +-- 6. 3x fail ise: "Ertelendi" isaretle, sonrakine gec
    |
    +-- 7. Sonraki loop'u bekle
```

### Hata Yonetimi

| Durum | Davranis |
|-------|----------|
| Yeni yazilan testler fail (3x) | Feature'i "Ertelendi" isaretle, yazilan dosyalari `git checkout -- <dosya>` ile geri al, sonrakine gec |
| Mevcut testler kirik (agent'in degisikligi oncesi) | Degisiklik yapma, features.md'ye "BLOCKED: mevcut testler kirik" yaz, loop'u bitir |
| Build fail | Yazilan dosyalari `git checkout -- <dosya>` ile geri al (sadece agent'in degistirdigi dosyalar), features.md'ye log yaz |
| Arastirma sonucsuz | Codebase-only analiz ile devam et |
| features.md yok | Olustur, arastirma yap, ayni loop icinde ilk feature'i implement et |

**Test basari kriteri:** `npm run test` exit code 0. Tum test suite gecmeli — sadece yeni testler degil. Agent mevcut testleri kirmamali.

---

## Dosya Yapisi

### Olusturulacak Dosyalar

```
hesap-makinesi/
+-- .claude/
|   +-- agents/
|       +-- feature-loop.md        # Agent tanimi (prompt)
+-- docs/
|   +-- features.md                # Feature backlog (agent gunceller)
+-- src/                           # Agent buraya kod yazar
    +-- components/                # Yeni component'lar
    +-- hooks/                     # Yeni hook'lar
    +-- utils/                     # Yeni utility'ler
```

### features.md Formati

```markdown
# Feature Backlog

## Bekleyen
- [ ] Feature adi — kisa aciklama (kaynak: web/codebase) [tarih]

## Ertelenen
- [ ] Feature adi — neden ertelendi [tarih]

## Tamamlanan
- [x] Feature adi — kisa aciklama [tarih] [commit: abc123]
```

---

## Guvenlik Sinirlari

### YAPMA Listesi

| Kural | Neden |
|-------|-------|
| `package.json`'a yeni dependency ekleme | Guvenlik + kontrol disi buyume |
| Mevcut testleri silme/degistirme | Calisan testler korunmali |
| `vite.config`, `tsconfig` dosyalarina dokunma | Build konfigurasyonu hassas |
| Birden fazla feature'i ayni commit'te birlestirme | Atomik commit'ler |
| 200 satirdan buyuk tek dosya olusturma | Kucuk, odakli dosyalar |
| Mevcut component'larin public API'sini degistirme | Calisan kodu kirabilir |

### YAP Listesi

| Kural | Neden |
|-------|-------|
| Her yeni feature icin test yaz | Kalite garantisi |
| Commit oncesi `npm run test` calistir | Kirik kod commit'lenmesin |
| features.md'yi her loop'ta guncelle | Izlenebilirlik |
| Kucuk, atomik degisiklikler yap | Geri almasi kolay |
| Mevcut kod stilini takip et (React + TypeScript) | Tutarlilik |

### Acil Durdurma

- **`Ctrl+C`** — Session'i sonlandirir, tum cron job'lar silinir
- **`CronDelete <job-id>`** — Sadece feature-loop job'ini siler, session devam eder
- **`CronList`** — Aktif job'lari listeler

Agent commit adimina ulasmadan durdurulursa, yarim kalan degisiklikler working directory'de kalir. Kullanici `git checkout .` ile temizleyebilir.

---

## Ornek Ciktilar

### Ornek Feature Fikirleri

| Kaynak | Feature |
|--------|---------|
| Web arastirmasi | Hesaplama sonucunu kopyalama butonu |
| Web arastirmasi | Birim donusturucu (cm->inch, kg->lb) |
| Codebase analizi | History component'ina "temizle" butonu |
| Codebase analizi | parser.ts'e eksik hata mesajlari |
| Web arastirmasi | Klavye kisayollari gosterge paneli |
| Codebase analizi | useCalculator hook'una undo/redo |

### Ornek Commit

```
feat: add copy-to-clipboard button for calculation results

- New CopyButton component in src/components/CopyButton.tsx
- Integration with Display component
- Unit test in src/components/CopyButton.test.tsx
- Updated docs/features.md backlog
```

---

## Kullanim

### Baslatma

CronCreate tool'u ile baslatilir:

```
CronCreate(
  cron: "7 */2 * * *",       # Her 2 saatte bir (:07'de, yiginlasmayi onlemek icin)
  prompt: ".claude/agents/feature-loop.md agent'ini calistir",
  recurring: true
)
```

### Kontrol Komutlari

```
CronList          # Aktif job'lari gor
CronDelete <id>   # Durdur
```

Session acik kaldigi surece calisir. Max 7 gun sonra otomatik expire olur.
