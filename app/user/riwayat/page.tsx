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
  user: string;
  kwh: number;
  price: string;
  status: "Selesai" | "Proses" | "Dibatalkan";
}

const stationTotals = [
  { name: "BSB Center", totalKwh: 400.2, totalRevenue: 4357500, totalTx: 95 },
  { name: "RBS Plaza", totalKwh: 274.8, totalRevenue: 2985000, totalTx: 65 },
  { name: "Balikpapan Superblock", totalKwh: 177.4, totalRevenue: 1497000, totalTx: 42 },
  { name: "Terminal Klandasan", totalKwh: 329.0, totalRevenue: 2612500, totalTx: 78 },
  { name: "E-Walk Balikpapan", totalKwh: 65.6, totalRevenue: 998000, totalTx: 32 },
];

const pricePerKwh = 2000;
const users = ["Andi Pratama", "Budi Santoso", "Sari Dewi", "Rizky Firmansyah", "Dian Permata", "Fajar Nugroho", "Lestari Budiman", "Maya Putri", "Dedi Kurniawan"];

const datePool: { raw: string; display: string }[] = [];
const monthDefs = [
  { m: "01", name: "Januari", days: 28 },
  { m: "02", name: "Februari", days: 28 },
  { m: "03", name: "Maret", days: 31 },
  { m: "04", name: "April", days: 30 },
  { m: "05", name: "Mei", days: 31 },
  { m: "06", name: "Juni", days: 29 },
];
const times = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "18:00"];

monthDefs.forEach(({ m, name, days }) => {
  for (let d = 1; d <= days; d++) {
    const dd = String(d).padStart(2, "0");
    times.forEach((t) => {
      datePool.push({ raw: `2026-${m}-${dd}`, display: `${d} ${name} 2026, ${t}` });
    });
  }
});

function generateAllTransactions(): Transaction[] {
  const txs: Transaction[] = [];
  let id = 1;

  stationTotals.forEach((station, stationIdx) => {
    const avgKwh = station.totalKwh / station.totalTx;
    const numSelesai = Math.floor(station.totalTx * 0.85);
    const numDibatalkan = Math.floor(station.totalTx * 0.08);
    const numProses = station.totalTx - numSelesai - numDibatalkan;

    let remainingKwh = station.totalKwh;
    let remainingRevenue = station.totalRevenue;

    for (let i = 0; i < numSelesai; i++) {
      const isLast = i === numSelesai - 1;
      const pseudoRandom = ((i * 7 + stationIdx * 13) % 10) / 10;
      const kwh = isLast ? Math.round(remainingKwh * 10) / 10 : Math.round((avgKwh * (0.5 + pseudoRandom)) * 10) / 10;
      const actualKwh = isLast ? remainingKwh : Math.min(kwh, remainingKwh);
      const price = Math.round(actualKwh * pricePerKwh);
      const actualPrice = isLast ? remainingRevenue : Math.min(price, remainingRevenue);
      remainingKwh = Math.round((remainingKwh - actualKwh) * 10) / 10;
      remainingRevenue -= actualPrice;

      const monthIdx = id % 6;
      const dayInMonth = (id * 3 + stationIdx * 7) % monthDefs[monthIdx].days + 1;
      const picked = datePool.find((d) => {
        const parts = d.raw.split("-");
        return parseInt(parts[1]) === monthIdx + 1 && parseInt(parts[2]) === dayInMonth;
      }) || datePool[id % datePool.length];

      txs.push({
        id: `TXN-${String(id).padStart(3, "0")}`,
        date: picked.display,
        rawDate: picked.raw,
        location: `SPKLU ${station.name}`,
        user: users[id % users.length],
        kwh: Math.round(actualKwh * 10) / 10,
        price: `Rp ${actualPrice.toLocaleString("id-ID")}`,
        status: "Selesai",
      });
      id++;
    }

    for (let i = 0; i < numDibatalkan; i++) {
      const monthIdx = id % 6;
      const dayInMonth = (id * 3 + stationIdx * 7) % monthDefs[monthIdx].days + 1;
      const picked = datePool.find((d) => {
        const parts = d.raw.split("-");
        return parseInt(parts[1]) === monthIdx + 1 && parseInt(parts[2]) === dayInMonth;
      }) || datePool[id % datePool.length];
      txs.push({
        id: `TXN-${String(id).padStart(3, "0")}`,
        date: picked.display,
        rawDate: picked.raw,
        location: `SPKLU ${station.name}`,
        user: users[id % users.length],
        kwh: 0,
        price: "Rp 0",
        status: "Dibatalkan",
      });
      id++;
    }

    for (let i = 0; i < numProses; i++) {
      const monthIdx = id % 6;
      const dayInMonth = (id * 3 + stationIdx * 7) % monthDefs[monthIdx].days + 1;
      const picked = datePool.find((d) => {
        const parts = d.raw.split("-");
        return parseInt(parts[1]) === monthIdx + 1 && parseInt(parts[2]) === dayInMonth;
      }) || datePool[id % datePool.length];
      const kwh = Math.round(avgKwh * 0.5 * 10) / 10;
      txs.push({
        id: `TXN-${String(id).padStart(3, "0")}`,
        date: picked.display,
        rawDate: picked.raw,
        location: `SPKLU ${station.name}`,
        user: users[id % users.length],
        kwh,
        price: `Rp ${(kwh * pricePerKwh).toLocaleString("id-ID")}`,
        status: "Proses",
      });
      id++;
    }
  });

  return txs.sort((a, b) => b.rawDate.localeCompare(a.rawDate) || b.id.localeCompare(a.id));
}

const allGeneratedTransactions = generateAllTransactions();

const fetchTransactions = async (userName: string): Promise<Transaction[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!userName) return [];
  return allGeneratedTransactions.filter((tx) => tx.user === userName);
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
  const [userName, setUserName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const stored = localStorage.getItem("neoncharge_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserName(parsed.nama || "");
    }
  }, []);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", userName],
    queryFn: () => fetchTransactions(userName),
    enabled: !!userName,
  });

  const filteredTransactions = transactions?.filter((txn) => {
    const date = new Date(txn.rawDate);
    return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
  });

  const availableYears = [...new Set(transactions?.map((t) => new Date(t.rawDate).getFullYear()) || [])].sort((a, b) => b - a);

  return (
    <>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Riwayat Transaksi</h1>
        <p className="mt-1 text-sm text-slate-400">Daftar pengisian daya terakhir Anda.</p>
      </div>

      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
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
                      <TableCell className="font-medium whitespace-nowrap">{txn.date}</TableCell>
                      <TableCell className="whitespace-nowrap">{txn.location}</TableCell>
                      <TableCell className="text-right">{txn.kwh}</TableCell>
                      <TableCell className="text-right font-medium">{txn.price}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[txn.status]}>{txn.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
