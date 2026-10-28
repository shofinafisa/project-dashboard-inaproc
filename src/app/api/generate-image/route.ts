import { NextRequest, NextResponse } from "next/server";

const MASTER_PROMPT_TEMPLATE =
  "Buatkan gambar poster infografis visual modern ringkasan pengadaan barang/jasa pemerintah. Tahun: {{tahun}}, Jenis Instansi: {{jenisInstansi}}, Instansi: {{instansi}}, Eselon: {{eselon}}, Satker: {{satker}}. Tampilkan metrik utama (Total Realisasi, Total Paket, Efisiensi) dan grafik tren dalam tata letak visual yang rapi dan elegan.";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      yearRange = [2020, 2026],
      tahun,
      jenisInstansi,
      instansi,
      eselon,
      satker,
      metrics,
    } = body;

    const tahunText = yearRange
      ? `${yearRange[0]}—${yearRange[1]}`
      : tahun || "2020—2026";

    const jenisText = Array.isArray(jenisInstansi)
      ? jenisInstansi.length > 0
        ? jenisInstansi.join(", ")
        : "Semua Jenis Instansi"
      : jenisInstansi || "Semua Jenis Instansi";

    const instansiText = Array.isArray(instansi)
      ? instansi.length > 0
        ? instansi.join(", ")
        : "Seluruh Instansi Nasional"
      : instansi || "Seluruh Instansi Nasional";

    const eselonText = Array.isArray(eselon)
      ? eselon.length > 0
        ? eselon.join(", ")
        : "Semua Unit Eselon"
      : eselon || "Semua Unit Eselon";

    const satkerText = Array.isArray(satker)
      ? satker.length > 0
        ? satker.join(", ")
        : "Semua Satker"
      : satker || "Semua Satker";

    const realisasiText = metrics?.totalRealisasi || "Rp 48,2 T";
    const paketText = metrics?.totalPaket || "14.820 Paket";
    const efisiensiText = metrics?.efisiensi || "Rp 3,45 T (7.15%)";

    // Interpolate Master Prompt dynamically
    const prompt = MASTER_PROMPT_TEMPLATE.replace("{{tahun}}", tahunText)
      .replace("{{jenisInstansi}}", jenisText)
      .replace("{{instansi}}", instansiText)
      .replace("{{eselon}}", eselonText)
      .replace("{{satker}}", satkerText);

    const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Generate High-Resolution Vector Infographic Poster (SVG)
    const svgPoster = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850" width="1200" height="850">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#080e1a"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="blueAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="850" fill="url(#bgGrad)"/>
  <circle cx="200" cy="150" r="180" fill="#2563eb" opacity="0.08" filter="url(#glow)"/>
  <circle cx="1000" cy="300" r="220" fill="#4f46e5" opacity="0.07" filter="url(#glow)"/>
  <circle cx="600" cy="700" r="250" fill="#059669" opacity="0.06" filter="url(#glow)"/>

  <!-- Top Accent -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#blueAccent)"/>

  <!-- Header Section -->
  <g transform="translate(60, 45)">
    <rect x="0" y="0" width="160" height="28" rx="14" fill="#2563eb" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1"/>
    <circle cx="14" cy="14" r="4.5" fill="#3b82f6"/>
    <text x="28" y="18" fill="#60a5fa" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" letter-spacing="1">LKPP RI &bull; INAPROC</text>

    <text x="0" y="60" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="28" font-weight="800" letter-spacing="-0.5">RINGKASAN INFOGRAFIS PENGADAAN NASIONAL</text>
    
    <text x="0" y="90" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13" font-weight="500">
      Rentang Tahun: <tspan fill="#38bdf8" font-weight="700">${tahunText}</tspan> &bull; 
      Instansi: <tspan fill="#f8fafc" font-weight="600">${instansiText}</tspan>
    </text>
    <text x="0" y="112" fill="#64748b" font-family="-apple-system, sans-serif" font-size="11">
      Unit / Eselon: ${eselonText} &bull; Satker: ${satkerText}
    </text>
  </g>

  <!-- 4 KPI Summary Cards -->
  <g transform="translate(60, 180)">
    <!-- Card 1 -->
    <rect x="0" y="0" width="255" height="135" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="20" y="38" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="500">Total Realisasi Belanja</text>
    <text x="20" y="80" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="800">${realisasiText}</text>
    <text x="20" y="110" fill="#22c55e" font-family="sans-serif" font-size="11" font-weight="600">&uarr; Sesuai Filter Terpilih</text>

    <!-- Card 2 -->
    <rect x="275" y="0" width="255" height="135" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="295" y="38" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="500">Total Paket RUP</text>
    <text x="295" y="80" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="800">${paketText}</text>
    <text x="295" y="110" fill="#38bdf8" font-family="sans-serif" font-size="11">Paket SiRUP Aktif</text>

    <!-- Card 3 -->
    <rect x="550" y="0" width="255" height="135" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="570" y="38" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="500">Efisiensi Anggaran</text>
    <text x="570" y="80" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="800">${efisiensiText}</text>
    <text x="570" y="110" fill="#22c55e" font-family="sans-serif" font-size="11" font-weight="600">Rasio HPS vs Negosiasi</text>

    <!-- Card 4 -->
    <rect x="825" y="0" width="255" height="135" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="845" y="38" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="500">Porsi PDN &amp; UMKK</text>
    <text x="845" y="80" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="800">42.8%</text>
    <text x="845" y="110" fill="#c084fc" font-family="sans-serif" font-size="11">Melampaui Target 40%</text>
  </g>

  <!-- Mid Visual: Chart Sections -->
  <g transform="translate(60, 340)">
    <rect x="0" y="0" width="670" height="395" rx="18" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="24" y="36" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="700">Tren Realisasi Bulanan</text>
    <text x="24" y="58" fill="#94a3b8" font-family="sans-serif" font-size="12">Kurva akumulasi belanja pengadaan (Tahun ${tahunText})</text>

    <!-- Bars -->
    <line x1="50" y1="330" x2="620" y2="330" stroke="#475569" stroke-width="1.5"/>
    <rect x="75" y="240" width="30" height="90" rx="4" fill="#3b82f6" opacity="0.85"/>
    <rect x="125" y="210" width="30" height="120" rx="4" fill="#3b82f6" opacity="0.85"/>
    <rect x="175" y="180" width="30" height="150" rx="4" fill="#6366f1" opacity="0.85"/>
    <rect x="225" y="160" width="30" height="170" rx="4" fill="#6366f1" opacity="0.85"/>
    <rect x="275" y="140" width="30" height="190" rx="4" fill="#6366f1" opacity="0.85"/>
    <rect x="325" y="125" width="30" height="205" rx="4" fill="#059669" opacity="0.85"/>
    <rect x="375" y="110" width="30" height="220" rx="4" fill="#059669" opacity="0.85"/>
    <rect x="425" y="95" width="30" height="235" rx="4" fill="#10b981" opacity="0.95"/>
    <rect x="475" y="85" width="30" height="245" rx="4" fill="#10b981" opacity="1"/>

    <text x="90" y="352" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Jan</text>
    <text x="140" y="352" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Feb</text>
    <text x="190" y="352" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Mar</text>
    <text x="240" y="352" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Apr</text>
    <text x="290" y="352" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Mei</text>
    <text x="340" y="352" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Jun</text>
    <text x="390" y="352" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Jul</text>
    <text x="440" y="352" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Agu</text>
    <text x="490" y="352" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Sep</text>
  </g>

  <!-- Right Block: Donut breakdown -->
  <g transform="translate(750, 340)">
    <rect x="0" y="0" width="390" height="395" rx="18" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="24" y="36" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="700">Distribusi Metode Pengadaan</text>
    <text x="24" y="58" fill="#94a3b8" font-family="sans-serif" font-size="12">Porsi metode pada data terfilter</text>

    <circle cx="195" cy="180" r="85" fill="none" stroke="#1e293b" stroke-width="26"/>
    <circle cx="195" cy="180" r="85" fill="none" stroke="#10b981" stroke-width="26" stroke-dasharray="240 534" stroke-dashoffset="0"/>
    <circle cx="195" cy="180" r="85" fill="none" stroke="#3b82f6" stroke-width="26" stroke-dasharray="150 534" stroke-dashoffset="-240"/>
    <circle cx="195" cy="180" r="85" fill="none" stroke="#f59e0b" stroke-width="26" stroke-dasharray="90 534" stroke-dashoffset="-390"/>

    <text x="195" y="185" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="800" text-anchor="middle">INAPROC</text>

    <g transform="translate(24, 290)">
      <circle cx="8" cy="8" r="5" fill="#10b981"/>
      <text x="22" y="12" fill="#f8fafc" font-family="sans-serif" font-size="11" font-weight="600">E-Purchasing (45%)</text>
      <circle cx="8" cy="30" r="5" fill="#3b82f6"/>
      <text x="22" y="34" fill="#f8fafc" font-family="sans-serif" font-size="11" font-weight="600">Tender &amp; Seleksi (35%)</text>
      <circle cx="8" cy="52" r="5" fill="#f59e0b"/>
      <text x="22" y="56" fill="#f8fafc" font-family="sans-serif" font-size="11" font-weight="600">Pengadaan Langsung (20%)</text>
    </g>
  </g>

  <!-- Footer -->
  <g transform="translate(60, 775)">
    <line x1="0" y1="0" x2="1080" y2="0" stroke="#334155" stroke-width="1"/>
    <text x="0" y="30" fill="#64748b" font-family="sans-serif" font-size="11">
      Dokumen infografis AI resmi SPSE &bull; INAPROC LKPP RI
    </text>
    <text x="1080" y="30" fill="#94a3b8" font-family="sans-serif" font-size="11" text-anchor="end">
      Tanggal Cetak: ${currentDate}
    </text>
  </g>
</svg>
    `.trim();

    const base64Svg = Buffer.from(svgPoster, "utf-8").toString("base64");
    const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;

    return NextResponse.json({
      success: true,
      prompt,
      imageUrl,
      metadata: {
        tahun: tahunText,
        jenisInstansi: jenisText,
        instansi: instansiText,
        eselon: eselonText,
        satker: satkerText,
        generatedAt: new Date().toISOString(),
        metrics: {
          totalRealisasi: realisasiText,
          totalPaket: paketText,
          efisiensi: efisiensiText,
        },
      },
    });
  } catch (error) {
    console.error("Failed to generate infographic poster:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat memproses permintaan generate infografis AI.",
      },
      { status: 500 }
    );
  }
}
