# Feature Backlog

## Bekleyen
- [ ] Birim donusturucu — Uzunluk, agirlik, sicaklik gibi temel birimleri donusturen utility fonksiyonu (kaynak: web) [2026-03-27]
- [ ] Kok bulma (cbrt/nthroot) — Kupkok ve n'inci kok hesaplama destegi, parser'a cbrt() ve nthRoot() ekle (kaynak: codebase) [2026-03-27]

## Ertelenen

## Tamamlanan
- [x] Sayi tabani donusumu (bin/oct/hex) — Hesap sonucunu ikilik, sekizlik ve onaltilik tabanlarda gosterme utility fonksiyonu (kaynak: web) [2026-03-27] [commit: fe679fd]
- [x] Ifade dogrulama — Girdinin gecerli matematiksel ifade olup olmadigini kontrol eden validate fonksiyonu, eslesmemis parantez ve ardisik operator tespiti (kaynak: web) [2026-03-27] [commit: 7090834]
- [x] Yuzde hesaplama gostergesi — Yuzde butonuna basildiginda ara sonucu canli onizleme ile gosterme, ifade ve sonuc ayri goruntulenir (kaynak: codebase) [2026-03-27] [commit: acb3f69]
- [x] useKeyboard hook testleri — Klavye kisayollarinin dogru calismasi icin unit testler, KEY_MAP ve ozel tuslar dahil (kaynak: codebase) [2026-03-27] [commit: 589e37d]
- [x] Son sonucu kullanma (Ans) — Onceki hesap sonucunu yeni ifadede kullanmak icin Ans butonu ve degiskeni [2026-03-27] [commit: a042b45]
- [x] Mutlak deger (abs) fonksiyonu — Bilimsel satirda |x| butonu, abs() parser destegi ile negatif sonuclari pozitife cevirme [2026-03-27] [commit: e28b9d3]
- [x] Gecmisi temizle butonu — Hesap gecmisini tek tusla tamamen silme, localStorage dahil (kaynak: web) [2026-03-27] [commit: 26be85d]
- [x] Euler sabiti (e) destegi — Bilimsel satirda e sabiti butonu ekle, parser'da ℯ->e donusumu [2026-03-27] [commit: 951cd6e]
- [x] Silme (backspace) butonu — UI uzerinde ⌫ butonu ile son karakteri silme, klavyesiz kullanim icin (kaynak: codebase) [2026-03-27] [commit: 4a02bf2]
- [x] Ifade gecmisi navigasyonu — Yon tuslariyla (ArrowUp/Down) gecmis ifadeler arasinda gezinme (kaynak: codebase) [2026-03-27] [commit: 5b46667]
- [x] Klavye kisayol haritasi — useKeyboard mappinglerini disa acar, kisayol referans listesi olusturur (kaynak: codebase) [2026-03-27] [commit: 1c60b5a]
- [x] Faktoriyel destegi — Parser'a ! faktoriyel operatoru ekle (kaynak: codebase) [2026-03-27] [commit: fe89c39]
- [x] Panoya kopyalama — Sonuca tiklayinca panoya kopyala, gorsel geri bildirim goster [2026-03-27] [commit: c0e20f8]
- [x] Sayi formatlama — Buyuk sonuclari locale-aware binlik ayirici ile goster [2026-03-27] [commit: 3310be3]
- [x] Hafiza (memory) islemleri — M+, M-, MR, MC ile sonucu hafizaya al/geri cagir (kaynak: web) [2026-03-27] [commit: 82dc37d]
- [x] useTheme hook testleri — Tema degistirme hook'u icin unit testler, localStorage persistence dahil (kaynak: codebase) [2026-03-27] [commit: 78193a6]
- [x] Hesaplama istatistikleri — Toplam hesaplama sayisi, en cok kullanilan operator ve ortalama sonuc gibi istatistikleri tutan utility fonksiyonu (kaynak: codebase) [2026-03-27] [commit: dc65ac6]
- [x] Ifade gecmisi arama — Gecmis hesaplamalar arasinda metin bazli arama yapan utility fonksiyonu (kaynak: web) [2026-03-27] [commit: 643a0b4]
