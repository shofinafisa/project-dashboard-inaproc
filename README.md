# DataPulse Enterprise - Dynamic Analytics & Feature Toggle Dashboard

DataPulse Enterprise adalah platform analitik cerdas berbasis Next.js 14 (App Router), TypeScript, dan Tailwind CSS. Aplikasi ini dirancang dengan arsitektur role-based access control (RBAC) dan **Dynamic Feature Toggle Engine** yang memungkinkan Administrator mengatur visibilitas modul pada dashboard User secara real-time.

---

## 🚀 Fitur Utama

### 1. Unified Authentication & Role-Based Routing
- **Satu Pintu Masuk (Unified Login):** Sistem secara otomatis mengenali peran pengguna (*Admin* atau *User*) tanpa perlu seleksi role manual.
- **Auto-Redirection & Auth Guards:** Halaman dilindungi oleh `AuthGuard`. Admin diarahkan ke `/admin`, sedangkan Standard User diarahkan ke `/dashboard`.
- **Quick Demo Credentials:** Tombol sekali klik di halaman login untuk mengisi kredensial Admin atau User secara instan.
- **Quick Role Switcher:** Tombol pengubah role instan di navigasi atas untuk mempermudah demonstrasi dan pengujian antarmuka.

### 2. Feature Toggle Engine (Feature Management)
- **Kontrol Visibilitas Terpusat:** Admin dapat mengaktifkan atau menonaktifkan 6 modul utama:
  - `kpi_cards` (Ringkasan Metrik KPI)
  - `sales_chart` (Grafik Tren Penjualan & Revenue)
  - `category_distribution` (Distribusi Kategori Produk / Donut Chart)
  - `recent_transactions` (Tabel Riwayat Transaksi)
  - `export_buttons` (Tombol Ekspor CSV & Cetak PDF)
  - `date_range_filter` (Filter Rentang Waktu)
- **Persistensi Lokal:** Konfigurasi feature flags tersimpan di `localStorage` dan tersinkronisasi antar tab/sesi.
- **Batch Actions:** Tombol *Aktifkan Semua*, *Nonaktifkan Semua*, dan *Reset ke Default*.
- **Live User Simulation:** Admin dapat menguji langsung tampilan dashboard dari kacamata User dengan satu klik.

### 3. Smart Dynamic CSS Grid
- Layout chart secara otomatis menyesuaikan kolom (*auto-fill* tanpa celah):
  - Jika kedua chart aktif: Grafik Tren Penjualan mengambil 8 kolom (2/3 lebar), Donut Chart mengambil 4 kolom (1/3 lebar).
  - Jika salah satu chart dinonaktifkan: Chart yang aktif otomatis melebar hingga 12 kolom (100% lebar layar).
- Empty state informatif jika seluruh fitur dinonaktifkan oleh Admin.

### 4. Visualisasi & Interaktivitas Data
- **KPI Summary Cards:** 4 kartu metrik utama (Total Revenue, Orders, Conversion Rate, Growth) dengan indikator tren positif/negatif.
- **Interactive Sales Area Chart:** Grafik area interaktif dengan Recharts, dilengkapi penampil tooltip detail dan selector metrik (*Revenue* vs *Volume Pesanan*).
- **Product Category Donut Chart:** Diagram donat dengan persentase pasar dan rincian portofolio.
- **Advanced Transactions Table:**
  - Pencarian teks instan (berdasarkan nama klien, invoice, produk, atau kategori).
  - Filter status transaksi (*Completed*, *Processing*, *Pending*, *Failed*).
  - Paginasi data dinamis.
- **Export Capabilities:** Ekspor data riwayat transaksi langsung ke format `.csv` serta opsi cetak dokumen PDF resmi.

---

## 🔑 Kredensial Demo

| Peran (Role) | Alamat Email | Kata Sandi | Akses Halaman |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@dashboard.com` | `admin123` | `/admin` (Kontrol Fitur + Data Lengkap) |
| **Standard User** | `user@dashboard.com` | `user123` | `/dashboard` (Tampilan Terkontrol Feature Guard) |

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, React Server & Client Components)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) dengan CSS Variables Design Tokens
- **Komponen & Desain:** Radix UI primitives, Lucide Icons
- **Grafik & Visualisasi:** [Recharts](https://recharts.org/)
- **Format & Utilitas:** `clsx`, `tailwind-merge`, native HTML5 Print & CSV Generator

---

## 💻 Panduan Menjalankan Proyek

### 1. Instalasi Dependensi
Pastikan [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru) telah terpasang:
```bash
npm install
```

### 2. Menjalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui browser di [http://localhost:3000](http://localhost:3000).

### 3. Pengecekan Linting & Tipe
```bash
npm run lint
```

### 4. Build untuk Lingkungan Produksi
```bash
npm run build
```
Menjalankan build statis dan optimasi bundle produksi.

---

## 📂 Struktur Direktori

```
src/
├── app/
│   ├── admin/             # Halaman Konsol Administrator & Feature Flags
│   ├── dashboard/         # Halaman Standard User Dashboard
│   ├── login/             # Halaman Unified Login
│   ├── layout.tsx         # Root Layout dengan Auth & Feature Providers
│   └── page.tsx           # Entry Router (Redirect otomatis berdasarkan status login)
├── components/
│   ├── admin/             # Panel konfigurasi Feature Toggle
│   ├── dashboard/         # Widget KPI, Charts, Tabel Transaksi, & Filter
│   ├── guards/            # AuthGuard & FeatureGuard
│   ├── layout/            # AppHeader & DashboardShell
│   └── ui/                # Reusable UI Atoms (Button, Card, Switch, Badge, Toast, Input)
├── context/
│   ├── auth-context.tsx   # Context penyimpan sesi login & peran pengguna
│   └── feature-context.tsx# Context manajemen feature flags & persistensi
├── lib/
│   ├── export-utils.ts    # Fungsi ekspor data CSV & PDF
│   ├── mock-data.ts       # Data dummy perusahaan (KPI, Tren, Transaksi)
│   └── utils.ts           # Formatter angka, mata uang, & helper kelas Tailwind
└── types/                 # Definisi tipe TypeScript untuk Auth, Dashboard, & Features
```
