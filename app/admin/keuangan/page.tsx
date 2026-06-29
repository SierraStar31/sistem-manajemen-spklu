"use client";

import { useState, useEffect, useRef } from "react";
import {
  IconReportMoney,
  IconCoin,
  IconBolt,
  IconCalendar,
  IconDownload,
  IconBuilding,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { generateLaporanKeuangan } from "@/lib/pdf-utils";

interface StationRevenue {
  location: string;
  connectorType: string;
  totalTransactions: number;
  totalKwh: number;
  totalRevenue: number;
}

const stationRevenueData: StationRevenue[] = [
  { location: "BSB Center, Balikpapan", connectorType: "CCS2", totalTransactions: 95, totalKwh: 400.2, totalRevenue: 4357500 },
  { location: "RBS Plaza, Balikpapan", connectorType: "CHAdeMO", totalTransactions: 65, totalKwh: 274.8, totalRevenue: 2985000 },
  { location: "Balikpapan Superblock", connectorType: "AC Type 2", totalTransactions: 42, totalKwh: 177.4, totalRevenue: 1497000 },
  { location: "Terminal Klandasan", connectorType: "CCS2", totalTransactions: 78, totalKwh: 329.0, totalRevenue: 2612500 },
  { location: "E-Walk Balikpapan", connectorType: "CCS2", totalTransactions: 32, totalKwh: 65.6, totalRevenue: 998000 },
];

const monthlyData = [
  { month: "Januari", revenue: 1850000, kwh: 925 },
  { month: "Februari", revenue: 1920000, kwh: 960 },
  { month: "Maret", revenue: 2100000, kwh: 1050 },
  { month: "April", revenue: 2280000, kwh: 1140 },
  { month: "Mei", revenue: 2150000, kwh: 1075 },
  { month: "Juni", revenue: 2150000, kwh: 1075 },
];

function formatCurrency(val: number): string {
  return `Rp ${val.toLocaleString("id-ID")}`;
}

export default function KeuanganPage() {
  const [mounted, setMounted] = useState(false);
  const monthRevenue = stationRevenueData.reduce((sum, s) => sum + s.totalRevenue, 0);

  useEffect(() => { setMounted(true); }, []);

  const totalRevenue = stationRevenueData.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalTransactions = stationRevenueData.reduce((sum, s) => sum + s.totalTransactions, 0);
  const totalKwh = stationRevenueData.reduce((sum, s) => sum + s.totalKwh, 0);
  const avgPerTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const todayRevenue = 650000;

  const barMax = Math.max(...monthlyData.map((m) => m.revenue));

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Laporan Keuangan</h1>
          <p className="mt-1 text-sm text-slate-400">Pantau pendapatan dan laporan keuangan SPKLU secara detail.</p>
        </div>
        <Button onClick={() => generateLaporanKeuangan(stationRevenueData, monthlyData)} className="h-9 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40">
          <IconDownload className="h-4 w-4 mr-1.5" /> Download Laporan PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <IconCoin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Pendapatan</p>
                <p className="text-lg font-bold tracking-tight text-left bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/20">
                <IconBolt className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Energi Terjual</p>
                <p className="text-lg font-bold tracking-tight text-slate-900 text-left">{totalKwh.toLocaleString("id-ID")} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 shadow-lg shadow-violet-500/20">
                <IconCalendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Pendapatan Hari Ini</p>
                <p className="text-lg font-bold tracking-tight text-slate-900 text-left">{formatCurrency(todayRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-500/20">
                <IconReportMoney className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Rata-rata per Transaksi</p>
                <p className="text-lg font-bold tracking-tight text-slate-900 text-left">{formatCurrency(Math.round(avgPerTransaction))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <IconReportMoney className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base tracking-tight">Grafik Pendapatan Bulanan</CardTitle>
            <p className="text-xs text-slate-400">6 bulan terakhir</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyData.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="w-20 text-xs font-medium text-slate-500 shrink-0">{m.month}</span>
                <div className="flex-1 h-7 rounded-lg bg-slate-100/80 overflow-hidden">
                    {mounted && (
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 flex items-center justify-end pr-2"
                      style={{ width: `${(m.revenue / barMax) * 100}%` }}
                    >
                      <span className="text-[10px] font-bold text-white drop-shadow-sm">{formatCurrency(m.revenue)}</span>
                    </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Station Revenue Table */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/20">
            <IconBuilding className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base tracking-tight">Pendapatan per Stasiun</CardTitle>
            <p className="text-xs text-slate-400">Ringkasan pendapatan seluruh stasiun</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/60">
                  <TableHead className="text-slate-500">Stasiun</TableHead>
                  <TableHead className="text-slate-500">Konektor</TableHead>
                  <TableHead className="text-right text-slate-500">Transaksi</TableHead>
                  <TableHead className="text-right text-slate-500">Total kWh</TableHead>
                  <TableHead className="text-right text-slate-500">Pendapatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stationRevenueData.map((s) => (
                  <TableRow key={s.location} className="border-slate-200/40">
                    <TableCell className="text-sm font-medium whitespace-nowrap">{s.location}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{s.connectorType}</TableCell>
                    <TableCell className="text-sm text-right font-mono">{s.totalTransactions}</TableCell>
                    <TableCell className="text-sm text-right font-mono">{s.totalKwh.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-sm text-right font-semibold text-emerald-600">{formatCurrency(s.totalRevenue)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 border-slate-300/60">
                  <TableCell className="text-sm font-bold" colSpan={2}>Total</TableCell>
                  <TableCell className="text-sm text-right font-bold font-mono">{totalTransactions}</TableCell>
                  <TableCell className="text-sm text-right font-bold font-mono">{totalKwh.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-sm text-right font-bold text-emerald-600">{formatCurrency(totalRevenue)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
