# VISA — BashApp Redesign Plan

> Branch: `development` | Stack: Next.js 14, shadcn/ui, Tailwind, next-themes

## Tujuan
1. Halaman baru: **Edukasi** & **Promosi** (terpisah)
2. Redesign tampilan depan — pertahankan globe 3D + animasi, layout lebih baik, efek **glossy** di semua halaman
3. Fitur **light & dark mode**

## Keputusan Desain
- Homepage **tetap gelap selalu** (globe luar angkasa). Light/dark berlaku di halaman lain.
- Edukasi & Promosi = **2 halaman terpisah**.
- Glossy (glassmorphism) diterapkan ke **semua halaman** (publik + dashboard).
- Buat **navbar publik + footer lengkap**.

## Catatan Teknis
- `next-themes` sudah ada di dependencies, `globals.css` sudah punya CSS variables light+dark, tapi `layout.js` masih paksa `dark bg-black` → perlu diganti.
- `/edukasi` & `/promosi` otomatis publik (tidak masuk matcher middleware).
- Animasi globe (`useGlobe` + `globeScene.jsx`) dipertahankan utuh.

---

## FASE A — Fondasi Theme (Light/Dark)
- A.1 Buat `src/app/providers.jsx` — `ThemeProvider` (next-themes, `attribute="class"`, `enableSystem`)
- A.2 Update `layout.js` — hapus paksaan `dark bg-black`, bungkus dengan Providers
- A.3 Buat `src/components/themeToggle.jsx` — tombol matahari/bulan
- A.4 Rapikan palet warna di `globals.css` — tema hijau eco untuk light & dark
- A.5 Homepage dipaksa gelap — wrapper class `dark` di root homepage

## FASE B — Design System Glossy
- B.1 Tambah utility class glassmorphism di `globals.css`: `.glass`, `.glass-card`, `.glass-nav` (backdrop-blur, bg semi-transparan adaptif, border halus, shadow)

## FASE C — Navbar Publik + Footer
- C.1 `src/components/public/publicNavbar.jsx` — navbar glossy sticky: logo, menu (Home, Edukasi, Promosi), tombol Login, theme toggle, responsive (mobile sheet)
- C.2 `src/components/public/publicFooter.jsx` — footer: kontak, sosial media, quick links

## FASE D — Halaman Edukasi
- D.1 `src/app/edukasi/page.jsx` — hero + section: jenis sampah, cara memilah, tips daur ulang (glossy cards)

## FASE E — Halaman Promosi
- E.1 `src/app/promosi/page.jsx` — hero CTA, manfaat gabung, cara daftar (bank sampah & nasabah), tombol CTA

## FASE F — Redesign Homepage
- F.1 Pertahankan globe + TypeAnimation, tambah navbar publik
- F.2 Perbaiki layout hero, tambah section preview fitur + CTA ke edukasi/promosi, footer, paksa dark

## FASE G — Terapkan Glossy ke Dashboard
- G.1 Update `header.jsx` — glass nav + theme toggle
- G.2 Dashboard cards, dialog, popover → glass class + warna adaptif theme

---

## Progress Tracker

| Fase | Item | Status |
|------|------|--------|
| A.1 | Providers (ThemeProvider) | ✅ Done |
| A.2 | Update layout.js | ✅ Done |
| A.3 | Theme toggle component | ✅ Done |
| A.4 | Palet warna eco light/dark | ✅ Done |
| A.5 | Homepage dipaksa gelap | ✅ Done |
| B.1 | Utility class glossy | ✅ Done |
| — | Login page adaptif light/dark | ✅ Done |
| C.1 | Navbar publik | ✅ Done |
| C.2 | Footer publik | ✅ Done |
| D.1 | Halaman Edukasi | ✅ Done |
| E.1 | Halaman Promosi | ✅ Done |
| F.1 | Homepage: navbar + globe | ✅ Done |
| F.2 | Homepage: layout + section | ✅ Done |
| G.1 | Dashboard header glossy | ✅ Done |
| G.2 | Dashboard cards/dialog glossy | ✅ Done |
| G.3 | Dashboard redesign: recharts (stat + tren + donut) | ✅ Done |

---

# PENJUALAN KE PENGEPUL — Stok, Susut & Profit/Loss

> Fitur: jual stok sampah bank → pengepul, lengkap dengan pencatatan susut (penyusutan berat) dan keuntungan/kerugian bank sampah.

## Tujuan
Mencatat penjualan stok ke pengepul beserta **susut berat** dan **profit/loss** bank sampah, tanpa membebani saldo nasabah.

## Prinsip Desain (final)
1. **Dua ledger terpisah.** Nasabah→bank tetap sederhana di `Transaction` (`deposit`/`withdraw`, `failed`=batal). Bank→pengepul di `StockSale` yang memegang seluruh kompleksitas.
2. **Susut = beban bank (profit/loss jujur).** Tidak ada transfer ke nasabah: tanpa koreksi saldo, tanpa pro-rata, tanpa piutang. **Simetris**: kerugian susut 100% ditanggung bank; kelebihan berat (pengepul nimbang lebih) 100% jadi keuntungan bank. `shrinkWeight > 0` = susut (loss), `< 0` = kelebihan (gain); keduanya otomatis masuk `profit = revenue − cogs`.
3. **FIFO hanya untuk hitung COGS & tandai status deposit** ("Sudah Dijual"), tidak mengubah saldo nasabah.
4. **WAC** (weighted-average cost): `avgCost = totalCostBasis / currentWeight`; `cogs = avgCost × stockOutWeight`.
5. **Default harga jual = harga jual master** (`trash.trashSellPrice`), bisa di-override per penjualan. Harga beli nasabah (`trash.trashPrice`) tampil sebagai referensi. Harga aktual tiap penjualan tersimpan di `StockSale.sellPricePerKg` (histori/tren).

## Model Data
- **`Trash` (master sampah)**: `+trashSellPrice` (harga jual ke pengepul, default 0). `trashPrice` = harga beli ke nasabah (di-relabel di UI jadi "Harga Beli"). Margin standar/kg = `trashSellPrice − trashPrice`.
- **`StockSale`**: `bankSampah`, `trash`, `trashNameSnapshot`, `soldWeight` (ditimbang pengepul = basis revenue), `stockOutWeight` (keluar stok), `shrinkWeight` (= stockOutWeight − soldWeight, bisa negatif), `sellPricePerKg`, `masterSellPriceSnapshot` (harga master saat jual), `priceChanged` (Boolean, harga jual beda dari master), `revenue`, `cogs`, `profit`, `shrinkReason`, `status` (completed|cancelled), `buyer`.
- **`InventoryStock`**: `+totalShrinkWeight` (sudah ada `totalSalesRevenue`, `totalProfit`).
- **`Transaction`**: tidak diubah.
- Invarian rekonsiliasi: `totalWeightIn = currentWeight + totalWeightSold + totalShrinkWeight`.

## Tahap 0 — Selesai (lolos build)
Tombol Jual/Jual Semua, `StockSale` terpisah, kurangi stok + FIFO auto-tag deposit "Sudah Dijual", halaman `/sales`, kartu untung di `/inventory`, nav "Penjualan".

## Tahap 1 — Harga & Susut
0. **Dua harga di master sampah**: `trashModel.js` `+trashSellPrice`; form [addTrash.jsx](src/app/trashes/_components/addTrash.jsx) & [updateTrash.jsx](src/app/trashes/[id]/_components/updateTrash.jsx) tambah input "Harga Jual (pengepul)" + relabel "Harga" → "Harga Beli (nasabah)"; [trash route POST/PUT](src/app/api/users/trash/route.js) handle `trashSellPrice`; [tableTrash.jsx](src/app/trashes/_components/tableTrash.jsx) tampilkan 2 harga + margin.
1. `inventoryStockModel.js` — `+totalShrinkWeight`.
2. `stockSaleModel.js` — rename `weightSold→soldWeight`, `saleAmount→revenue`, `costBasis→cogs`; `+stockOutWeight`, `+shrinkWeight`, `+shrinkReason`, `+status`.
3. `sales/route.js` POST — hitung `cogs=WAC×stockOutWeight`, `profit=revenue−cogs`, `shrinkWeight`; update stok; FIFO-tag sebesar `stockOutWeight`.
4. `sales/route.js` GET + `inventory/route.js` GET — sesuaikan nama field + `totalShrinkWeight`.
5. `sellStockDialog.jsx` — prefill harga = `trash.trashSellPrice` (referensi harga beli nasabah + margin); toggle "Habiskan stok" (OFF→input berat keluar stok); select alasan susut bila `shrinkWeight>0`; **bila harga ≠ master → tampilkan catatan "harga beda" + checkbox "Perbarui harga jual master"**; preview stockOut/sold/shrink(kg,%)/revenue/cogs/profit-loss.
6. `/sales` page — kolom susut + alasan.

## Tahap 2 — Penjualan lebih rapi (status & batal)
7. `sales/[id]/route.js` (baru) PATCH — batalkan penjualan: reverse `$inc` stok, `status=cancelled`.
8. `/sales` — badge status + aksi "Batalkan" + profit/loss per item.

## Tahap 3 — Halaman bank / operasional (tanpa receivable)
9. `/inventory` & `/sales` — kartu ringkasan: total susut, revenue, COGS, profit/loss bank.

## Tahap 4 — Laporan rekonsiliasi
10. `api/users/reports/reconciliation` (baru) — per jenis sampah: masuk, stok, terjual, susut, revenue, COGS, profit/loss, **rasio susut %**.
11. `/reports` page (baru) + nav.

## Dihapus dari roadmap
Transaksi adjustment ke nasabah, koreksi saldo pro-rata, piutang nasabah, auto-lunas, write-off, halaman receivable.

## Progress Tracker

| Tahap | Item | Status |
|-------|------|--------|
| 0 | Jual stok + StockSale + FIFO tag + /sales + nav | ✅ Done |
| 1.0 | Trash: trashSellPrice (2 harga) + form + API + tabel | ✅ Done |
| 1.1 | inventoryStockModel: totalShrinkWeight | ✅ Done |
| 1.2 | stockSaleModel: rename + stockOutWeight/shrinkWeight/shrinkReason/status/masterSellPriceSnapshot/priceChanged | ✅ Done |
| 1.3 | sales POST: hitung cogs/profit/shrink + updateMasterPrice + update stok | ✅ Done |
| 1.4 | sales GET + inventory GET: field & totalShrinkWeight | ✅ Done |
| 1.5 | sellStockDialog: prefill master, toggle, susut, price-diff + update-master, preview | ✅ Done |
| 1.6 | /sales: kolom susut + alasan + ringkasan | ✅ Done |
| 2.7 | sales/[id] PATCH: batalkan (reverse) | ✅ Done |
| 2.8 | /sales: badge status + aksi batal | ✅ Done |
| 3.9 | /inventory & /sales: kartu ringkasan susut & profit/loss | ✅ Done |
| 4.10 | API reconciliation report | ✅ Done |
| 4.11 | /reports page + nav | ✅ Done |

## Verifikasi
1. `npm run build` lolos.
2. /inventory → Jual (habiskan stok): soldWeight < stok → cek shrinkWeight, profit = revenue − COGS(stockOut), stok → 0.
3. Modal jual → harga prefill = `trash.trashSellPrice`; bila harga diubah & beda master → checkbox "Perbarui harga jual master" muncul & ikut update master saat dicentang.
4. Mode sebagian (toggle OFF): input berat keluar stok → susut & stok benar.
5. /sales → baris + susut + profit/loss; batalkan penjualan → stok & angka kembali.
6. /transactions → deposit terkait jadi "Sudah Dijual"; **saldo nasabah TIDAK berubah**.
7. Laporan rekonsiliasi: `masuk = stok + terjual + susut`.
