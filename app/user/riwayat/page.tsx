"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IconHistory, IconCalendar } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

interface Transaction {
  id: string;
  date: string;
  rawDate: string;
  location: string;
  kwh: number;
  price: string;
  status: "Selesai" | "Proses" | "Dibatalkan";
}

const andiTransactions: Transaction[] = [
  { id: "TXN-001", date: "25 Jun 2026, 14:30", rawDate: "2026-06-25", location: "SPKLU BSB Center", kwh: 32.5, price: "Rp 65.000", status: "Selesai" },
  { id: "TXN-002", date: "22 Jun 2026, 09:15", rawDate: "2026-06-22", location: "SPKLU RBS Plaza", kwh: 18.2, price: "Rp 36.400", status: "Selesai" },
  { id: "TXN-003", date: "20 Jun 2026, 16:45", rawDate: "2026-06-20", location: "SPKLU Balikpapan Superblock", kwh: 45.0, price: "Rp 90.000", status: "Proses" },
  { id: "TXN-004", date: "15 Mei 2026, 10:20", rawDate: "2026-05-15", location: "SPKLU Terminal Klandasan", kwh: 28.0, price: "Rp 56.000", status: "Selesai" },
  { id: "TXN-005", date: "08 Mei 2026, 13:00", rawDate: "2026-05-08", location: "SPKLU BSB Center", kwh: 41.3, price: "Rp 82.600", status: "Selesai" },
  { id: "TXN-006", date: "01 Apr 2026, 08:30", rawDate: "2026-04-01", location: "SPKLU RBS Plaza", kwh: 22.0, price: "Rp 44.000", status: "Selesai" },
];

const fetchTransactions = async (userType: string): Promise<Transaction[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (userType === "signin") return andiTransactions;
  return [];
};

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Selesai: "default",
  Proses: "secondary",
  Dibatalkan: "destructive",
};

export default function RiwayatPage() {
  const [userType, setUserType] = useState("signup");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const stored = localStorage.getItem("neoncharge_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserType(parsed.type || "signup");
    }
  }, []);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", userType],
    queryFn: () => fetchTransactions(userType),
  });

  const filteredTransactions = transactions?.filter((txn) => {
    const date = new Date(txn.rawDate);
    return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
  });

  const availableYears = [...new Set(transactions?.map((t) => new Date(t.rawDate).getFullYear()) || [])].sort((a, b) => b - a);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Riwayat Transaksi</h1>
        <p className="mt-1 text-sm text-slate-400">Daftar pengisian daya terakhir Anda.</p>
      </div>

      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <IconHistory className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base tracking-tight">Riwayat Pengisian Daya</CardTitle>
          </div>

          {transactions && transactions.length > 0 && (
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4 text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="h-9 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-xl px-3 py-1 text-sm text-slate-900 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="h-9 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-xl px-3 py-1 text-sm text-slate-900 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                {availableYears.length > 0 ? (
                  availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))
                ) : (
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                )}
              </select>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
            </div>
          ) : transactions && transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                <IconHistory className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">Belum ada riwayat transaksi</p>
              <p className="text-xs text-slate-400 mt-1">Riwayat pengisian daya Anda akan muncul di sini</p>
            </div>
          ) : filteredTransactions && filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                <IconCalendar className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">Tidak ada transaksi di bulan ini</p>
              <p className="text-xs text-slate-400 mt-1">Coba pilih bulan atau tahun yang lain</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/60">
                  <TableHead className="text-slate-500">Tanggal</TableHead>
                  <TableHead className="text-slate-500">Lokasi</TableHead>
                  <TableHead className="text-right text-slate-500">Energi (kWh)</TableHead>
                  <TableHead className="text-right text-slate-500">Total Biaya</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions?.map((txn) => (
                  <TableRow key={txn.id} className="border-slate-200/40">
                    <TableCell className="font-medium">{txn.date}</TableCell>
                    <TableCell>{txn.location}</TableCell>
                    <TableCell className="text-right">{txn.kwh}</TableCell>
                    <TableCell className="text-right font-medium">{txn.price}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[txn.status]}>{txn.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
