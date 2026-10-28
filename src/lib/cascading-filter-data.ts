export interface CascadingFilterState {
  yearRange: [number, number];
  jenisInstansi: string[];
  instansi: string[];
  eselon: string[];
  satker: string[];
}

export const INITIAL_CASCADING_FILTER: CascadingFilterState = {
  yearRange: [2020, 2026],
  jenisInstansi: [],
  instansi: [],
  eselon: [],
  satker: [],
};

export const AVAILABLE_YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
export const TAHUN_LIST = AVAILABLE_YEARS;

export const JENIS_INSTANSI_LIST = [
  "Kementerian",
  "Lembaga",
  "Pemerintah Daerah Provinsi",
  "Pemerintah Daerah Kab/Kota",
];

export const INSTANSI_BY_JENIS: Record<string, string[]> = {
  Kementerian: [
    "Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR)",
    "Kementerian Kesehatan",
    "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi",
    "Kementerian Perhubungan",
    "Kementerian Komunikasi dan Informatika",
    "Kementerian Kelautan dan Perikanan",
    "Kementerian Pertahanan",
    "Kementerian Keuangan",
  ],
  Lembaga: [
    "Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP)",
    "Badan Perencanaan Pembangunan Nasional (Bappenas)",
    "Badan Nasional Penanggulangan Bencana (BNPB)",
    "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)",
    "Badan Pengawasan Keuangan dan Pembangunan (BPKP)",
  ],
  "Pemerintah Daerah Provinsi": [
    "Pemerintah Provinsi DKI Jakarta",
    "Pemerintah Provinsi Jawa Timur",
    "Pemerintah Provinsi Jawa Barat",
    "Pemerintah Provinsi Jawa Tengah",
  ],
  "Pemerintah Daerah Kab/Kota": [
    "Pemerintah Kota Surabaya",
    "Pemerintah Kota Bandung",
    "Pemerintah Kota Medan",
  ],
};

export const ESELON_BY_INSTANSI: Record<string, string[]> = {
  "Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR)": [
    "Direktorat Jenderal Bina Marga",
    "Direktorat Jenderal Cipta Karya",
    "Direktorat Jenderal Sumber Daya Air",
  ],
  "Kementerian Kesehatan": [
    "Direktorat Jenderal Pelayanan Kesehatan",
    "Direktorat Jenderal Kefarmasian dan Alat Kesehatan",
  ],
  "Pemerintah Provinsi DKI Jakarta": [
    "Dinas Pendidikan Provinsi DKI Jakarta",
    "Dinas Bina Marga Provinsi DKI Jakarta",
  ],
  "Badan Nasional Penanggulangan Bencana (BNPB)": [
    "Kedeputian Bidang Logistik dan Peralatan",
    "Kedeputian Bidang Penanganan Darurat",
  ],
  "Kementerian Komunikasi dan Informatika": [
    "Badan Aksesibilitas Telekomunikasi dan Informasi (BAKTI)",
    "Direktorat Jenderal Aplikasi Informatika",
  ],
  "Pemerintah Provinsi Jawa Timur": [
    "Dinas Pertanian dan Ketahanan Pangan",
    "Dinas Pekerjaan Umum Bina Marga",
  ],
  "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi": [
    "Direktorat Jenderal Kebudayaan",
    "Direktorat Jenderal Pendidikan Tinggi",
  ],
  "Kementerian Perhubungan": [
    "Direktorat Jenderal Perhubungan Laut",
    "Direktorat Jenderal Perhubungan Darat",
  ],
  "Badan Perencanaan Pembangunan Nasional (Bappenas)": [
    "Kedeputian Bidang Ekonomi",
    "Kedeputian Bidang Sarana dan Prasarana",
  ],
  "Pemerintah Kota Bandung": [
    "Sekretariat DPRD",
    "Dinas Pendidikan Kota Bandung",
  ],
  "Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP)": [
    "Kedeputian Bidang Monitoring-Evaluasi dan Pengembangan Sistem Informasi",
    "Kedeputian Bidang Pengembangan Strategi dan Kebijakan Pengadaan",
  ],
  "Kementerian Kelautan dan Perikanan": [
    "Direktorat Jenderal PSDKP",
    "Direktorat Jenderal Perikanan Tangkap",
  ],
  "Pemerintah Kota Surabaya": [
    "Dinas Kesehatan Kota Surabaya",
    "Bagian Pengadaan Barang dan Jasa",
  ],
  "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)": [
    "Kedeputian Bidang Geofisika",
    "Kedeputian Bidang Meteorologi",
  ],
  "Kementerian Pertahanan": [
    "Badan Sarana Pertahanan (Baranahan)",
    "Direktorat Jenderal Potensi Pertahanan",
  ],
  "Kementerian Keuangan": [
    "Sekretariat Jenderal",
    "Direktorat Jenderal Anggaran",
  ],
};

export const SATKER_BY_ESELON: Record<string, string[]> = {
  "Direktorat Jenderal Bina Marga": [
    "Balai Pelaksanaan Jalan Nasional Wilayah I",
    "Balai Pelaksanaan Jalan Nasional Wilayah II",
  ],
  "Direktorat Jenderal Pelayanan Kesehatan": [
    "Biro Pengadaan dan Pengelolaan BMN Kemkes",
    "Unit Layanan Pengadaan RSCM",
  ],
  "Dinas Pendidikan Provinsi DKI Jakarta": [
    "Suban Pengadaan Wilayah Jakarta Timur",
    "Suban Pengadaan Wilayah Jakarta Barat",
  ],
  "Kedeputian Bidang Logistik dan Peralatan": [
    "Satker Tanggap Darurat Bencana",
  ],
  "Badan Aksesibilitas Telekomunikasi dan Informasi (BAKTI)": [
    "Satker Infrastruktur Serat Optik 3T",
  ],
  "Dinas Pertanian dan Ketahanan Pangan": [
    "Unit Pengelola Sarana Pertanian Terpadu",
  ],
  "Direktorat Jenderal Kebudayaan": [
    "Galeri Budaya Nusantara",
  ],
  "Direktorat Jenderal Perhubungan Laut": [
    "Distrik Navigasi Tanjung Priok",
  ],
  "Kedeputian Bidang Ekonomi": [
    "Biro Perencanaan dan Kerja Sama Teknik",
  ],
  "Sekretariat DPRD": [
    "Bagian Umum dan Perlengkapan",
  ],
  "Kedeputian Bidang Monitoring-Evaluasi dan Pengembangan Sistem Informasi": [
    "Direktorat Pengembangan Sistem Pengadaan Secara Elektronik",
  ],
  "Direktorat Jenderal PSDKP": [
    "Pangkalan PSDKP Benoa",
  ],
  "Dinas Kesehatan Kota Surabaya": [
    "UPTD Pengelolaan Obat dan Farmasi",
  ],
  "Kedeputian Bidang Geofisika": [
    "Pusat Seismologi Teknik",
  ],
  "Badan Sarana Pertahanan (Baranahan)": [
    "Pusat Pengadaan Baranahan",
  ],
  "Sekretariat Jenderal": [
    "Biro Manajemen BMN dan Pengadaan",
  ],
};

export function getInstansiOptions(selectedJenis: string[]): string[] {
  if (!selectedJenis || selectedJenis.length === 0) {
    return Object.values(INSTANSI_BY_JENIS).flat();
  }
  const result: string[] = [];
  selectedJenis.forEach((jenis) => {
    if (INSTANSI_BY_JENIS[jenis]) {
      result.push(...INSTANSI_BY_JENIS[jenis]);
    }
  });
  return Array.from(new Set(result));
}

export function getEselonOptions(selectedInstansi: string[]): string[] {
  if (!selectedInstansi || selectedInstansi.length === 0) {
    return Object.values(ESELON_BY_INSTANSI).flat();
  }
  const result: string[] = [];
  selectedInstansi.forEach((ins) => {
    if (ESELON_BY_INSTANSI[ins]) {
      result.push(...ESELON_BY_INSTANSI[ins]);
    }
  });
  return Array.from(new Set(result));
}

export function getSatkerOptions(selectedEselon: string[]): string[] {
  if (!selectedEselon || selectedEselon.length === 0) {
    return Object.values(SATKER_BY_ESELON).flat();
  }
  const result: string[] = [];
  selectedEselon.forEach((es) => {
    if (SATKER_BY_ESELON[es]) {
      result.push(...SATKER_BY_ESELON[es]);
    }
  });
  return Array.from(new Set(result));
}
