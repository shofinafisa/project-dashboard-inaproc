"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_TRANSACTIONS, FEATURE_CONFIGS } from "@/lib/mock-data";
import { useFeatures } from "@/context/feature-context";
import { formatCurrency, formatShortCurrency } from "@/lib/utils";
import { TransactionStatus, Transaction } from "@/types/dashboard";
import { FeatureKey } from "@/types/features";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Filter,
} from "lucide-react";

interface TransactionsTableProps {
  bypassFilters?: boolean;
}

export function TransactionsTable({ bypassFilters = false }: TransactionsTableProps) {
  const { isFeatureEnabled, activeCount, totalCount, yearRange } = useFeatures();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter transactions by active procurement methods and year range (from Feature Context)
  const availableTransactions = useMemo(() => {
    if (bypassFilters) return MOCK_TRANSACTIONS;
    const [minY, maxY] = yearRange;
    return MOCK_TRANSACTIONS.filter((tx) => {
      const methodOk = isFeatureEnabled(tx.procurementMethod);
      const txYear = parseInt(tx.date.substring(0, 4), 10);
      const yearOk = txYear >= minY && txYear <= maxY;
      return methodOk && yearOk;
    });
  }, [isFeatureEnabled, yearRange, bypassFilters]);

  const filteredTransactions = useMemo(() => {
    return availableTransactions.filter((item) => {
      const matchSearch =
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.methodLabel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      const matchMethod =
        selectedMethod === "all" ? true : item.procurementMethod === selectedMethod;

      return matchSearch && matchStatus && matchMethod;
    });
  }, [availableTransactions, searchTerm, statusFilter, selectedMethod]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="gap-1 font-medium text-[11px] whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Selesai Kontrak
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="purple" className="gap-1 font-medium text-[11px] whitespace-nowrap">
            <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            Masa Sanggah / Verifikasi
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="gap-1 font-medium text-[11px] whitespace-nowrap">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Penetapan Pemenang
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1 font-medium text-[11px] whitespace-nowrap">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Tender Gagal
          </Badge>
        );
    }
  };

  const getMethodBadgeClass = (method: FeatureKey) => {
    switch (method) {
      case "e_purchasing":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "tender":
        return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800";
      case "swakelola":
        return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800";
      case "pengadaan_langsung":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800";
      case "tender_cepat":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800";
      case "penunjukan_langsung":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      case "pengadaan_darurat":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
      case "sayembara":
      case "kontes":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="p-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Daftar Paket Pengadaan Barang & Jasa (INAPROC)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Menampilkan paket tahun {yearRange[0]} — {yearRange[1]} ({filteredTransactions.length} dari {MOCK_TRANSACTIONS.length} total paket)
              </CardDescription>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari satker, paket, RUP..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="completed">Selesai Kontrak</option>
              <option value="processing">Masa Sanggah</option>
              <option value="pending">Penetapan</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-6 font-semibold">Kode RUP / Satuan Kerja</th>
                <th className="py-3 px-6 font-semibold">Nama Paket Pengadaan</th>
                <th className="py-3 px-6 font-semibold">Metode Pengadaan</th>
                <th className="py-3 px-6 font-semibold">Nilai Pagu / Kontrak</th>
                <th className="py-3 px-6 font-semibold">Status</th>
                <th className="py-3 px-6 font-semibold">Sumber Dana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                          <Image
                            src={item.customerAvatar}
                            alt={item.customerName}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 block">
                            {item.invoiceNumber}
                          </span>
                          <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate block" title={item.customerName}>
                            {item.customerName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 max-w-[280px]">
                      <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2" title={item.product}>
                        {item.product}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Jenis: {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getMethodBadgeClass(
                          item.procurementMethod
                        )}`}
                      >
                        {item.methodLabel}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {formatShortCurrency(item.amount)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {formatCurrency(item.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      {renderStatusBadge(item.status)}
                    </td>

                    <td className="py-3.5 px-6 text-[11px] text-slate-500 dark:text-slate-400 max-w-[160px] truncate" title={item.paymentMethod}>
                      {item.paymentMethod}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 dark:text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 stroke-1 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Tidak ada paket pengadaan ditemukan
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        {availableTransactions.length === 0
                          ? "Semua metode pengadaan sedang dinonaktifkan oleh Administrator. Aktifkan minimal satu metode pengadaan di Admin Console."
                          : "Tidak ada paket yang sesuai dengan filter pencarian Anda."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan{" "}
            <strong>
              {filteredTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </strong>{" "}
            -{" "}
            <strong>
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
            </strong>{" "}
            dari <strong>{filteredTransactions.length}</strong> paket
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="h-8 px-2.5 text-xs"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Sebelumnya
            </Button>
            <span className="px-2 font-medium">
              Hal. {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="h-8 px-2.5 text-xs"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
