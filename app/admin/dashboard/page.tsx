"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  IconGasStation,
  IconUser,
  IconAlertTriangle,
  IconCoin,
  IconBolt,
  IconClock,
  IconTrendingUp,
  IconActivity,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface AdminMetrics {
  totalActiveSPKLU: number;
  totalUsers: number;
  systemWarnings: number;
  totalRevenue: string;
  energySold: number;
  avgSessionMinutes: number;
  todayTransactions: number;
  uptime: number;
}

interface RecentActivity {
  id: number;
  time: string;
  event: string;
  type: "success" | "warning" | "info";
}

const fetchMetrics = async (): Promise<AdminMetrics> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    totalActiveSPKLU: 8,
    totalUsers: 156,
    systemWarnings: 3,
    totalRevenue: "Rp 12.450.000",
    energySold: 1247,
    avgSessionMinutes: 42,
    todayTransactions: 23,
    uptime: 98.5,
  };
};

const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    { id: 1, time: "2 menit lalu", event: "SPK-001 BSB Center mulai charging", type: "success" },
    { id: 2, time: "15 menit lalu", event: "SPK-003 Superblock masuk maintenance", type: "warning" },
    { id: 3, time: "32 menit lalu", event: "User baru terdaftar: Budi Santoso", type: "info" },
    { id: 4, time: "1 jam lalu", event: "SPK-002 RBS Plaza selesai charging", type: "success" },
    { id: 5, time: "2 jam lalu", event: "Pembayaran diterima: Rp 65.000", type: "success" },
  ];
};

const activityBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  warning: "secondary",
  info: "outline",
};

export default function AdminDashboardPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["adminMetrics"],
    queryFn: fetchMetrics,
  });

  const { data: activities } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: fetchRecentActivity,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pusat Kendali Admin</h1>
        <p className="mt-1 text-sm text-slate-400">Kelola seluruh operasional SPKLU NeonCharge.</p>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <IconGasStation className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">SPKLU Aktif</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900">{metrics?.totalActiveSPKLU}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <IconUser className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Pengguna</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900">{metrics?.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(239,68,68,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-red-500 shadow-lg shadow-red-500/20">
                <IconAlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Peringatan</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900">{metrics?.systemWarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/20">
                <IconActivity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Transaksi Hari Ini</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900">{metrics?.todayTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <IconCoin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Pendapatan</p>
                <p className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">{metrics?.totalRevenue}</p>
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
                <p className="text-xs text-slate-400">Energi Terjual</p>
                <p className="text-lg font-bold tracking-tight text-slate-900">{metrics?.energySold} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 shadow-lg shadow-violet-500/20">
                <IconClock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Rata-rata Sesi</p>
                <p className="text-lg font-bold tracking-tight text-slate-900">{metrics?.avgSessionMinutes} menit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uptime Bar */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <IconTrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-700">Uptime Sistem</span>
            </div>
            <span className="text-sm font-bold text-emerald-600">{metrics?.uptime}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${metrics?.uptime}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">Uptime 30 hari terakhir</p>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base tracking-tight">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between rounded-xl bg-white/40 backdrop-blur-sm p-3 border border-white/60">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === "success" ? "bg-emerald-500" :
                    activity.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <span className="text-sm text-slate-700">{activity.event}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{activity.time}</span>
                  <Badge variant={activityBadge[activity.type]} className="text-[10px]">
                    {activity.type === "success" ? "Berhasil" : activity.type === "warning" ? "Peringatan" : "Info"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
