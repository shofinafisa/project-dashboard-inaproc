import { Transaction } from "@/types/dashboard";

export function exportTransactionsToCSV(transactions: Transaction[], filename = "transactions_export.csv") {
  const headers = ["Invoice", "Customer", "Email", "Product", "Category", "Amount ($)", "Status", "Date", "Payment Method"];
  const rows = transactions.map((t) => [
    t.invoiceNumber,
    `"${t.customerName.replace(/"/g, '""')}"`,
    t.customerEmail,
    `"${t.product.replace(/"/g, '""')}"`,
    `"${t.category.replace(/"/g, '""')}"`,
    t.amount.toString(),
    t.status,
    t.date,
    `"${t.paymentMethod.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
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

export function exportSummaryReportPDF() {
  // Trigger standard browser print optimized for PDF generation
  window.print();
}
