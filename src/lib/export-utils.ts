import { Transaction } from "@/types/dashboard";

/**
 * Ekspor data paket pengadaan ke format Excel (.xlsx / XML Spreadsheet compatible)
 */
export function exportTransactionsToExcel(transactions: Transaction[], filename = "laporan_pengadaan_inaproc.xlsx") {
  const escapeXml = (str: string = "") =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const rowsXml = transactions
    .map(
      (t) => `
    <Row>
      <Cell><Data ss:Type="String">${escapeXml(t.invoiceNumber)}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(t.customerName)}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(t.product)}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(t.category)}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(t.methodLabel || t.procurementMethod)}</Data></Cell>
      <Cell><Data ss:Type="Number">${t.amount}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(t.status)}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(t.date)}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(t.paymentMethod || "-")}</Data></Cell>
    </Row>`
    )
    .join("");

  const xmlContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#059669" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Paket Pengadaan INAPROC">
  <Table>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Kode RUP</Data></Cell>
    <Cell><Data ss:Type="String">Instansi / Satuan Kerja</Data></Cell>
    <Cell><Data ss:Type="String">Nama Paket Pengadaan</Data></Cell>
    <Cell><Data ss:Type="String">Kategori Pengadaan</Data></Cell>
    <Cell><Data ss:Type="String">Metode Pengadaan</Data></Cell>
    <Cell><Data ss:Type="String">Pagu / Nilai Realisasi (Rp)</Data></Cell>
    <Cell><Data ss:Type="String">Status</Data></Cell>
    <Cell><Data ss:Type="String">Tanggal Penetapan</Data></Cell>
    <Cell><Data ss:Type="String">Sumber Anggaran</Data></Cell>
   </Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".xlsx") || filename.endsWith(".xls") ? filename : `${filename}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Ekspor data paket pengadaan ke format CSV (.csv) dengan header berbahasa Indonesia
 */
export function exportTransactionsToCSV(transactions: Transaction[], filename = "laporan_pengadaan_inaproc.csv") {
  const headers = [
    "Kode RUP",
    "Instansi / Satker",
    "Nama Paket Pengadaan",
    "Kategori",
    "Metode Pengadaan",
    "Nilai Pagu (Rp)",
    "Status Paket",
    "Tanggal Penetapan",
    "Sumber Anggaran",
  ];

  const rows = transactions.map((t) => [
    t.invoiceNumber,
    `"${t.customerName.replace(/"/g, '""')}"`,
    `"${t.product.replace(/"/g, '""')}"`,
    `"${t.category.replace(/"/g, '""')}"`,
    `"${(t.methodLabel || t.procurementMethod).replace(/"/g, '""')}"`,
    t.amount.toString(),
    t.status,
    t.date,
    `"${(t.paymentMethod || "-").replace(/"/g, '""')}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Cetak dokumen ringkasan dashboard resmi atau simpan sebagai PDF
 */
export function exportSummaryReportPDF() {
  window.print();
}
