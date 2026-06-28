"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBolt,
  IconDashboard,
  IconBuilding,
  IconTool,
  IconReportMoney,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import { Badge } from "@/app/components/ui/badge";

const sidebarMenu = [
  { label: "Dashboard", href: "/admin/dashboard", icon: IconDashboard },
  { label: "Manajemen Stasiun", href: "/admin/stasiun", icon: IconBuilding },
  { label: "Manual Override", href: "/admin/override", icon: IconTool },
  { label: "Keuangan", href: "/admin/keuangan", icon: IconReportMoney },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50/60 via-[#f6fdf8] to-teal-50/40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-200/60 to-teal-100/40 blur-[100px]" />
        <div className="absolute top-[10%] right-[0%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-100/70 to-cyan-100/30 blur-[80px]" />
        <div className="absolute bottom-[0%] left-[10%] w-[600px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/50 to-green-100/30 blur-[90px]" />
      </div>

      {/* Sidebar - Glassmorphism */}
      <aside className="hidden md:flex w-72 flex-shrink-0 flex-col p-6 relative z-10">
        <div className="flex flex-col h-full min-h-[calc(100vh-3rem)] rounded-3xl border border-white/50 bg-white/30 backdrop-blur-2xl shadow-[0_2px_24px_-4px_rgba(0,0,0,0.04)] p-5">
          <Link href="/" className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <IconBolt className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">NeonCharge</span>
          </Link>

          <div className="mb-4">
            <Badge variant="outline" className="border-emerald-300/60 text-emerald-600 bg-emerald-50/50 backdrop-blur-xl rounded-xl">Admin Panel</Badge>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {sidebarMenu.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50/80 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/40 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 flex-shrink-0">
                <IconUser className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 break-words">Admin NeonCharge</p>
                <p className="text-xs text-slate-500 break-words">admin@neoncharge.id</p>
              </div>
              <Link href="/login" className="flex-shrink-0">
                <button className="rounded-xl p-2 text-slate-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500">
                  <IconLogout className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 relative z-10">
        <div className="mx-auto max-w-5xl space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
