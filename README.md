# INAPROC Dashboard - Pengadaan Barang dan Jasa Pemerintah (LKPP)

Dashboard analitik data pengadaan barang dan jasa pemerintah berbasis Next.js 14 (App Router), TypeScript, dan Tailwind CSS dengan **Dynamic Feature Toggle Engine** untuk 12 Metode Pengadaan INAPROC / LKPP.

---

## 🚀 Fitur Utama

### 1. Unified Authentication & Role-Based Routing
- **Satu Pintu Masuk (Unified Login):** Sistem mengenali peran pengguna (*Admin LKPP* atau *User / PPK Satker*).
- **Auto-Redirection & Auth Guards:** Halaman dilindungi oleh `AuthGuard`. Admin diarahkan ke `/admin`, sedangkan Standard User diarahkan ke `/dashboard`.
- **Quick Demo Credentials:** Tombol sekali klik di halaman login untuk mengisi kredensial Admin atau User secara instan.
- **Quick Role Switcher:** Tombol pengubah role instan di navigasi atas untuk mempermudah demonstrasi dan pengujian antarmuka.

### 2. Feature Toggle Engine: 12 Metode Pengadaan LKPP / INAPROC
Admin dapat mengaktifkan atau menonaktifkan 12 metode pengadaan secara instan via tombol On/Off (Switch):
1. **Penunjukan Langsung**
2. **Pengadaan Langsung**
3. **E-Purchasing**
4. **Swakelola**
5. **Sayembara**
6. **Kontes**
7. **Tender**
8. **Tender Cepat**
9. **Tender Internasional**
10. **Pengadaan Darurat**
11. **Seleksi**
12. **Dikecualikan**

### 3. Dampak Real-Time Pada Dashboard User
Setiap kali metode pengadaan diaktifkan atau dinonaktifkan:
- **Tabel Paket Pengadaan (Transactions Table):** Hanya menampilkan paket dari metode yang aktif.
- **KPI Summary Cards:** Nilai Realisasi Pengadaan, Total Paket, Efisiensi Pengadaan, dan Rata-rata Nilai Paket dihitung ulang secara dinamis mengikuti metode aktif.
- **Tren Realisasi Bulanan:** Grafik tren bulanan menyesuaikan dengan akumulasi metode yang aktif.
- **Distribusi Metode Pengadaan:** Donut chart Recharts secara dinamis menampilkan proporsi persentase realisasi anggaran dari metode-metode yang aktif.
- **Quick Method Pills pada Dashboard User:** Menampilkan status metode aktif dengan chip interaktif.
- **Empty State:** Memberikan notifikasi informatif dan tombol pemulihan jika seluruh metode dinonaktifkan.

### 4. Cascading Filter Bar & Dual Range Slider
- **Dual Range Slider Rentang Tahun:** Memilih rentang tahun pengadaan (2020 — 2026) secara interaktif dengan visual slider ganda (*dual range slider*), *clickable tick marks*, dan pilihan cepat (*presets*).
- **Hierarki Filter Cascading:** Filter bertingkat berdasarkan Jenis Instansi, Instansi, Eselon, dan Satker dengan *multiple choice* yang terintegrasi secara real-time ke seluruh visualisasi data.

---

## 🔑 Kredensial Demo

| Peran (Role) | Alamat Email | Kata Sandi | Akses Halaman |
| :--- | :--- | :--- | :--- |
| **Administrator LKPP** | `admin@dashboard.com` | `admin123` | `/admin` (Kontrol 12 Metode + Data Lengkap) |
| **PPK Satker (User)** | `user@dashboard.com` | `user123` | `/dashboard` (Tampilan Terfilter Metode Pengadaan) |

---

## 🛠️ Menjalankan Aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000` di browser Anda.
