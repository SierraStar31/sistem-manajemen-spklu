"use client";

import Link from "next/link";
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

const defaultStations = [
  { id: "SPK-001", location: "BSB Center", status: "Aktif" },
  { id: "SPK-002", location: "RBS Plaza", status: "Aktif" },
  { id: "SPK-003", location: "Balikpapan Superblock", status: "Maintenance" },
  { id: "SPK-004", location: "Terminal Klandasan", status: "Aktif" },
  { id: "SPK-005", location: "E-Walk Balikpapan", status: "Offline" },
];

function getStationsFromStorage() {
  if (typeof window === "undefined") return defaultStations;
  const stored = localStorage.getItem("neoncharge_stations");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return defaultStations;
}

const users = ["Andi Pratama", "Budi Santoso", "Sari Dewi", "Rizky Firmansyah", "Dian Permata", "Fajar Nugroho", "Lestari Budiman", "Maya Putri", "Dedi Kurniawan"];

function generateActivities(): RecentActivity[] {
  const stations = getStationsFromStorage();
  const activities: RecentActivity[] = [];
  let id = 1;

  const timeOffsets = [2, 5, 12, 18, 35, 48, 65, 90, 120, 180, 240, 360, 480, 720, 1080];

  stations.forEach((station: { id: string; location: string; status: string }, idx: number) => {
    const shortLoc = station.location.split(",")[0];
    const user = users[idx % users.length];

    if (station.status === "Aktif") {
      activities.push({
        id: id++,
        time: `${timeOffsets[id % timeOffsets.length]} menit lalu`,
        event: `${station.id} ${shortLoc} mulai charging - ${user}`,
        type: "success",
      });
      activities.push({
        id: id++,
        time: `${timeOffsets[(id + 3) % timeOffsets.length]} menit lalu`,
        event: `${station.id} ${shortLoc} selesai charging`,
        type: "success",
      });
    } else if (station.status === "Maintenance") {
      activities.push({
        id: id++,
        time: `${timeOffsets[(id + 1) % timeOffsets.length]} menit lalu`,
        event: `${station.id} ${shortLoc} masuk maintenance`,
        type: "warning",
      });
    } else if (station.status === "Offline") {
      activities.push({
        id: id++,
        time: `${timeOffsets[(id + 2) % timeOffsets.length]} menit lalu`,
        event: `${station.id} ${shortLoc} offline - perlu inspeksi`,
        type: "warning",
      });
    }
  });

  const payments = [65000, 36400, 90000, 45600, 21000, 56600, 100000, 80400, 71600, 55000, 24000, 44000];
  payments.forEach((amount, i) => {
    const user = users[i % users.length];
    activities.push({
      id: id++,
      time: `${timeOffsets[(i + 5) % timeOffsets.length]} menit lalu`,
      event: `Pembayaran diterima: Rp ${amount.toLocaleString("id-ID")} - ${user}`,
      type: "success",
    });
  });

  activities.push(
    { id: id++, time: "30 menit lalu", event: "User baru terdaftar: Budi Santoso", type: "info" },
    { id: id++, time: "1 jam lalu", event: "User baru terdaftar: Sari Dewi", type: "info" },
    { id: id++, time: "2 jam lalu", event: "Reservasi baru: Terminal Klandasan, 14:00-15:00", type: "info" },
    { id: id++, time: "3 jam lalu", event: "Reservasi baru: BSB Center, 16:00-17:00", type: "info" },
    { id: id++, time: "4 jam lalu", event: "Sistem backup data selesai", type: "info" },
    { id: id++, time: "5 jam lalu", event: "Update firmware mesin SPK-001 berhasil", type: "success" },
  );

  return activities.sort((a, b) => {
    const getMinutes = (t: string) => parseInt(t) * (t.includes("jam") ? 60 : 1);
    return getMinutes(a.time) - getMinutes(b.time);
  });
}

const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return generateActivities();
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
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Pusat Kendali Admin</h1>
        <p className="mt-1 text-sm text-slate-400">Kelola seluruh operasional SPKLU NeonCharge.</p>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardContent className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 shrink-0">
                <IconGasStation className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">SPKLU Aktif</p>
                <p className="text-xl font-bold tracking-tight text-slate-900">{metrics?.totalActiveSPKLU}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardContent className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 shrink-0">
                <IconUser className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">Total Pengguna</p>
                <p className="text-xl font-bold tracking-tight text-slate-900">{metrics?.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(239,68,68,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardContent className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-red-500 shadow-lg shadow-red-500/20 shrink-0">
                <IconAlertTriangle className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">Peringatan</p>
                <p className="text-xl font-bold tracking-tight text-slate-900">{metrics?.systemWarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardContent className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/20 shrink-0">
                <IconActivity className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">Transaksi Hari Ini</p>
                <p className="text-xl font-bold tracking-tight text-slate-900">{metrics?.todayTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 shrink-0">
                <IconCoin className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">Total Pendapatan</p>
                <p className="text-base font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">{metrics?.totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/20 shrink-0">
                <IconBolt className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">Energi Terjual</p>
                <p className="text-base font-bold tracking-tight text-slate-900">{metrics?.energySold} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardContent className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 shadow-lg shadow-violet-500/20 shrink-0">
                <IconClock className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">Rata-rata Sesi</p>
                <p className="text-base font-bold tracking-tight text-slate-900">{metrics?.avgSessionMinutes} menit</p>
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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <IconActivity className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base tracking-tight">Aktivitas Terbaru</CardTitle>
              <p className="text-xs text-slate-400">{activities?.length || 0} aktivitas hari ini</p>
            </div>
          </div>
          <Link href="/admin/transaksi" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
            Lihat Semua →
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activities?.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/40 backdrop-blur-sm p-3 border border-white/60 hover:bg-white/60 transition-colors duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    activity.type === "success" ? "bg-emerald-500" :
                    activity.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <span className="text-sm text-slate-700 truncate">{activity.event}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
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
