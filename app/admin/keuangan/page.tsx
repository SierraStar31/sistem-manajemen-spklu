"use client";

import { IconReportMoney } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function KeuanganPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan Keuangan</h1>
        <p className="mt-1 text-sm text-slate-400">Pantau pendapatan dan laporan keuangan SPKLU.</p>
      </div>

      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <IconReportMoney className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-base tracking-tight">Grafik Pendapatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100/80 to-slate-50/80 border border-slate-200/60">
            <p className="text-sm text-slate-400">Area Grafik Pendapatan</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
