"use client";

import { useState } from "react";
import {
  IconHistory,
  IconDownload,
  IconFilter,
  IconBolt,
  IconMapPin,
  IconClock,
  IconUser,
  IconCoin,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { generateRiwayatTransaksi } from "@/lib/pdf-utils";

interface Transaction {
  id: string;
  date: string;
  rawDate: string;
  station: string;
  user: string;
  kwh: number;
  price: string;
  rawPrice: number;
  status: "Selesai" | "Proses" | "Dibatalkan";
}

// Data transaksi harus sinkron dengan keuangan page
// Total: 312 transaksi, 1247 kWh, Rp 12.450.000
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
const months = [
  { m: "01", name: "Januari", days: 28 },
  { m: "02", name: "Februari", days: 28 },
  { m: "03", name: "Maret", days: 31 },
  { m: "04", name: "April", days: 30 },
  { m: "05", name: "Mei", days: 31 },
  { m: "06", name: "Juni", days: 29 },
];
const times = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "18:00"];

months.forEach(({ m, name, days }) => {
  for (let d = 1; d <= days; d++) {
    const dd = String(d).padStart(2, "0");
    times.forEach((t) => {
      datePool.push({ raw: `2026-${m}-${dd}`, display: `${d} ${name} 2026, ${t}` });
    });
  }
});

function generateTransactions(): Transaction[] {
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
      const dayInMonth = (id * 3 + stationIdx * 7) % months[monthIdx].days + 1;
      const userIdx = id % users.length;
      const picked = datePool.find((d) => {
        const parts = d.raw.split("-");
        return parseInt(parts[1]) === monthIdx + 1 && parseInt(parts[2]) === dayInMonth;
      }) || datePool[id % datePool.length];

      txs.push({
        id: `TXN-${String(id).padStart(3, "0")}`,
        date: picked.display,
        rawDate: picked.raw,
        station: station.name,
        user: users[userIdx],
        kwh: Math.round(actualKwh * 10) / 10,
        price: `Rp ${actualPrice.toLocaleString("id-ID")}`,
        rawPrice: actualPrice,
        status: "Selesai",
      });
      id++;
    }

    for (let i = 0; i < numDibatalkan; i++) {
      const monthIdx = id % 6;
      const dayInMonth = (id * 3 + stationIdx * 7) % months[monthIdx].days + 1;
      const userIdx = id % users.length;
      const picked = datePool.find((d) => {
        const parts = d.raw.split("-");
        return parseInt(parts[1]) === monthIdx + 1 && parseInt(parts[2]) === dayInMonth;
      }) || datePool[id % datePool.length];
      txs.push({
        id: `TXN-${String(id).padStart(3, "0")}`,
        date: picked.display,
        rawDate: picked.raw,
        station: station.name,
        user: users[userIdx],
        kwh: 0,
        price: "Rp 0",
        rawPrice: 0,
        status: "Dibatalkan",
      });
      id++;
    }

    for (let i = 0; i < numProses; i++) {
      const monthIdx = id % 6;
      const dayInMonth = (id * 3 + stationIdx * 7) % months[monthIdx].days + 1;
      const userIdx = id % users.length;
      const picked = datePool.find((d) => {
        const parts = d.raw.split("-");
        return parseInt(parts[1]) === monthIdx + 1 && parseInt(parts[2]) === dayInMonth;
      }) || datePool[id % datePool.length];
      const kwh = Math.round(avgKwh * 0.5 * 10) / 10;
      txs.push({
        id: `TXN-${String(id).padStart(3, "0")}`,
        date: picked.display,
        rawDate: picked.raw,
        station: station.name,
        user: users[userIdx],
        kwh,
        price: `Rp ${(kwh * pricePerKwh).toLocaleString("id-ID")}`,
        rawPrice: kwh * pricePerKwh,
        status: "Proses",
      });
      id++;
    }
  });

  return txs.sort((a, b) => b.rawDate.localeCompare(a.rawDate) || b.id.localeCompare(a.id));
}

const allTransactions = generateTransactions();

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  Selesai: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  Proses: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  Dibatalkan: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
};

const filterOptions = ["Semua", "Selesai", "Proses", "Dibatalkan"] as const;

const monthOptions = [
  { value: "", label: "Semua Bulan" },
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

const yearOptions = [
  { value: "", label: "Semua Tahun" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
];

export default function TransaksiPage() {
  const [filter, setFilter] = useState<string>("Semua");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = allTransactions.filter((t) => {
    if (filter !== "Semua" && t.status !== filter) return false;
    if (selectedDate && !t.rawDate.startsWith(selectedDate)) return false;
    if (selectedMonth) {
      const txMonth = t.rawDate.split("-")[1];
      if (txMonth !== selectedMonth) return false;
    }
    if (selectedYear) {
      const txYear = t.rawDate.split("-")[0];
      if (txYear !== selectedYear) return false;
    }
    return true;
  });

  const totalSelesai = filtered.filter((t) => t.status === "Selesai").reduce((sum, t) => sum + t.rawPrice, 0);
  const totalKwh = filtered.filter((t) => t.status === "Selesai").reduce((sum, t) => sum + t.kwh, 0);
  const totalTx = filtered.length;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Riwayat Transaksi</h1>
          <p className="mt-1 text-sm text-slate-400">Semua transaksi pengisian daya di seluruh stasiun.</p>
        </div>
        <Button onClick={() => generateRiwayatTransaksi(filtered)} className="h-9 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40">
          <IconDownload className="h-4 w-4 mr-1.5" /> Download PDF
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <IconHistory className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Transaksi</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900 text-left">{totalTx}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/20">
                <IconFilter className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Energi</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900 text-left">{totalKwh.toLocaleString("id-ID")} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 shadow-lg shadow-violet-500/20">
                <IconDownload className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Pendapatan</p>
                <p className="text-lg font-bold tracking-tight text-left bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">Rp {totalSelesai.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 h-9 rounded-xl border text-sm font-medium transition-all duration-200 ${
                filter === opt
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-slate-200 bg-white/60 text-slate-500 hover:border-slate-300 hover:bg-white/80"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Bulan:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-white/60 px-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Tahun:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-white/60 px-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {yearOptions.map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Tanggal:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-white/60 px-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          {(selectedMonth || selectedYear || selectedDate) && (
            <button
              onClick={() => { setSelectedMonth(""); setSelectedYear(""); setSelectedDate(""); }}
              className="h-9 px-3 rounded-xl border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition-all duration-200"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardContent className="pt-6">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/60">
                  <TableHead className="text-slate-500">ID</TableHead>
                  <TableHead className="text-slate-500">Waktu</TableHead>
                  <TableHead className="text-slate-500">Stasiun</TableHead>
                  <TableHead className="text-slate-500">User</TableHead>
                  <TableHead className="text-right text-slate-500">kWh</TableHead>
                  <TableHead className="text-right text-slate-500">Harga</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-sm text-slate-400">Tidak ada transaksi ditemukan.</TableCell>
                  </TableRow>
                ) : filtered.map((tx) => {
                  const sc = statusConfig[tx.status];
                  return (
                    <TableRow key={tx.id} className="border-slate-200/40 cursor-pointer hover:bg-emerald-50/50 transition-colors" onClick={() => setSelectedTx(tx)}>
                      <TableCell className="font-mono font-medium text-sm whitespace-nowrap">{tx.id}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{tx.date}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{tx.station}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{tx.user}</TableCell>
                      <TableCell className="text-sm text-right font-mono">{tx.status === "Dibatalkan" ? "-" : tx.kwh}</TableCell>
                      <TableCell className="text-sm text-right font-semibold">{tx.status === "Dibatalkan" ? "-" : tx.price}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text} ${sc.border}`}>{tx.status}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Detail Transaksi Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent className="sm:max-w-md rounded-[1.5rem] border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg tracking-tight">
              Detail Transaksi
            </DialogTitle>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${
                  selectedTx.status === "Selesai"
                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/25"
                    : selectedTx.status === "Proses"
                      ? "bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-500/25"
                      : "bg-gradient-to-br from-red-400 to-red-500 shadow-red-500/25"
                }`}>
                  <IconBolt className="h-7 w-7 text-white" strokeWidth={2} />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50/80 backdrop-blur-xl border border-slate-200/60 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <IconHistory className="h-3 w-3" /> ID Transaksi
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900">{selectedTx.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <IconClock className="h-3 w-3" /> Waktu
                  </span>
                  <span className="text-sm font-medium text-slate-900 text-right">{selectedTx.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <IconMapPin className="h-3 w-3" /> Stasiun
                  </span>
                  <span className="text-sm font-medium text-slate-900 text-right">{selectedTx.station}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <IconUser className="h-3 w-3" /> User
                  </span>
                  <span className="text-sm font-medium text-slate-900">{selectedTx.user}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Status</span>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusConfig[selectedTx.status].bg} ${statusConfig[selectedTx.status].text} ${statusConfig[selectedTx.status].border}`}>
                    {selectedTx.status}
                  </span>
                </div>

                <div className="border-t border-slate-200/60 pt-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <IconBolt className="h-3 w-3" /> Energi
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {selectedTx.status === "Dibatalkan" ? "-" : `${selectedTx.kwh} kWh`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <IconCoin className="h-3 w-3" /> Total Biaya
                    </span>
                    <span className="text-base font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                      {selectedTx.status === "Dibatalkan" ? "Rp 0" : selectedTx.price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTx(null)}
                  className="flex-1 h-11 rounded-2xl border-slate-200/80 bg-white/80 font-semibold text-slate-700"
                >
                  Tutup
                </Button>
                {selectedTx.status === "Selesai" && (
                  <Button
                    onClick={() => generateRiwayatTransaksi([selectedTx])}
                    className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300"
                  >
                    <IconDownload className="h-4 w-4 mr-1.5" />
                    Struk
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}