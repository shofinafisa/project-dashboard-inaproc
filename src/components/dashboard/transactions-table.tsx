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
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { TransactionStatus } from "@/types/dashboard";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";

export function TransactionsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((item) => {
      const matchSearch =
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="purple" className="gap-1 font-medium">
            <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="gap-1 font-medium">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1 font-medium">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Failed
          </Badge>
        );
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
                Riwayat Transaksi Terbaru
              </CardTitle>
              <CardDescription className="mt-0.5">
                Daftar pembayaran klien institusional & status pemrosesan
              </CardDescription>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari transaksi, invoice, klien..."
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
              className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-6">Invoice</th>
                <th className="py-3 px-6">Klien / Customer</th>
                <th className="py-3 px-6">Produk & Kategori</th>
                <th className="py-3 px-6">Tanggal</th>
                <th className="py-3 px-6">Nominal</th>
                <th className="py-3 px-6">Metode</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-medium text-blue-600 dark:text-blue-400">
                      {tx.invoiceNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Image
                          src={tx.customerAvatar}
                          alt={tx.customerName}
                          width={32}
                          height={32}
                          unoptimized
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {tx.customerName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {tx.customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {tx.product}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {tx.category}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {renderStatusBadge(tx.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ditemukan data transaksi yang sesuai filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 px-6 border-t border-slate-100 dark:border-slate-800 gap-3 text-xs text-slate-500">
          <div>
            Menampilkan{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {filteredTransactions.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            hingga{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
            </span>{" "}
            dari total{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {filteredTransactions.length}
            </span>{" "}
            transaksi
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Sebelumnya
            </Button>
            <span className="px-2 font-medium text-slate-700 dark:text-slate-300">
              Hal {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5"
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
