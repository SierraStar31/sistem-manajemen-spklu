"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  IconBolt,
  IconMapPin,
  IconArrowRight,
  IconChevronRight,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

const fetchStationStatus = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    totalLocations: 5,
    totalMachines: 10,
    available: 7,
    inUse: 2,
    maintenance: 1,
    uptime: 98.5,
    energyDelivered: 342,
    co2Saved: 89,
    lastUpdated: "Baru saja",
  };
};

const filters = ["Semua", "CCS2", "CHAdeMO", "AC Type 2"];

const mapQueries: Record<string, string> = {
  Semua: "SPKLU+Balikpapan+Kalimantan+Timur",
  CCS2: "SPKLU+CCS2+Balikpapan+Parking+BSB+Voltron",
  CHAdeMO: "SPKLU+CHAdeMO+Balikpapan+dekat+Voltron",
  "AC Type 2": "SPKLU+Type+2+Balikpapan+Parking+BSB+RBS",
};

const navItems = [
  { label: "Beranda", href: "#home" },
  { label: "Peta", href: "#peta" },
  { label: "Status", href: "#status" },
  { label: "Panduan", href: "/resources" },
];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [activeNav, setActiveNav] = useState("Beranda");
  const navRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const isClickScroll = useRef(false);
  const clickScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const mapLoadTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return;
    setMapLoading(true);
    setActiveFilter(filter);
    if (mapLoadTimeout.current) clearTimeout(mapLoadTimeout.current);
    mapLoadTimeout.current = setTimeout(() => setMapLoading(false), 2000);
  };

  const updateIndicator = useCallback(() => {
    const el = navRefs.current.get(activeNav);
    if (el) {
      const parent = el.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setIndicator({
          left: elRect.left - parentRect.left,
          width: elRect.width,
          opacity: 1,
        });
      }
    }
  }, [activeNav]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  // Scroll-based nav tracking
  useEffect(() => {
    const sections = ["peta", "status"];
    const labelMap: Record<string, string> = {
      peta: "Peta",
      status: "Status",
    };

    const handleScroll = () => {
      if (isClickScroll.current) return;

      const scrollY = window.scrollY;
      const offset = 160;

      // If at top, show Home
      if (scrollY < 200) {
        setActiveNav("Beranda");
        return;
      }

      let current = "Peta";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            current = id;
          }
        }
      }

      setActiveNav(labelMap[current]);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    isClickScroll.current = true;
    if (clickScrollTimeout.current) clearTimeout(clickScrollTimeout.current);

    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      clickScrollTimeout.current = setTimeout(() => {
        isClickScroll.current = false;
      }, 1000);
      return;
    }
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
      clickScrollTimeout.current = setTimeout(() => {
        isClickScroll.current = false;
      }, 1000);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["stationStatus"],
    queryFn: fetchStationStatus,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-[#f6fdf8] to-teal-50/40 text-slate-900 font-sans antialiased overflow-x-hidden">
      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between bg-white/30 backdrop-blur-2xl rounded-2xl px-6 mt-3 border border-white/50 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.04)]">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <IconBolt
                  className="h-4.5 w-4.5 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                NeonCharge
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1 relative">
              {navItems.map((item) =>
                item.href.startsWith("/") ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-4 py-2 text-[13px] font-medium rounded-xl transition-colors duration-200 z-10 text-slate-500 hover:text-emerald-600"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    ref={(el) => {
                      if (el) navRefs.current.set(item.label, el);
                    }}
                    onClick={(e) => {
                      setActiveNav(item.label);
                      handleNavClick(e, item.href);
                    }}
                    className={`relative px-4 py-2 text-[13px] font-medium rounded-xl transition-colors duration-200 z-10 ${
                      activeNav === item.label
                        ? "text-emerald-600"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              )}
              {/* Sliding indicator */}
              <span
                className="absolute bottom-0.5 h-[2px] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.opacity,
                }}
              />
            </div>

            {/* CTA */}
            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl px-5 h-9 text-[13px] font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40">
              Sign Up / Log In
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section
        id="home"
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-20"
      >
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-200/60 to-teal-100/40 blur-[100px]" />
          <div className="absolute top-[10%] right-[0%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-100/70 to-cyan-100/30 blur-[80px]" />
          <div className="absolute bottom-[0%] left-[10%] w-[600px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/50 to-green-100/30 blur-[90px]" />
          <div className="absolute bottom-[15%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-teal-100/40 to-emerald-50/20 blur-[70px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-emerald-100/40 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 tracking-wide uppercase">
              Live Monitoring Aktif
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-bold tracking-[-0.03em] leading-[1.05] text-slate-900">
            Energi Bersih,
            <br />
            Terkoneksi,{" "}
            <span className="inline-block bg-gradient-to-r from-emerald-500 via-teal-300 via-50% to-emerald-500 bg-clip-text text-transparent animate-shimmer">
              Tanpa Batas
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed font-light">
            Nikmati kemudahan mengisi daya kendaraan listrik Anda dengan
            jaringan SPKLU kami yang luas dan terintegrasi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => {
                const el = document.getElementById("peta");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white h-12 px-8 rounded-2xl text-[15px] font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
            >
              <IconMapPin className="mr-2 h-4.5 w-4.5" />
              Cari SPKLU Terdekat
              <IconArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Button>
            <Link href="/resources">
              <Button
                variant="outline"
                className="group h-12 px-8 rounded-2xl text-[15px] font-semibold border border-slate-200 text-slate-600 hover:bg-white/80 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-200/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-white/50 backdrop-blur-xl"
              >
                Pelajari Lebih Lanjut
                <IconChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CORE FEATURES ═══════════════════════ */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        {/* ─── Smart Port Filtering ─── */}
        <div id="peta" className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Temukan Stasiun <span className="text-emerald-600">Terdekat</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto">
              Filter berdasarkan tipe konektor yang kompatibel dengan kendaraan
              Anda
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2.5 justify-center">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`relative px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 backdrop-blur-xl ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-[1.02] border border-slate-700"
                    : "bg-white/60 text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:shadow-lg hover:shadow-slate-200/50 hover:scale-[1.01] hover:bg-white/80"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Peta SPKLU Balikpapan */}
          <div className="relative w-full h-[480px] sm:h-[520px] rounded-[2rem] overflow-hidden border-2 border-slate-200 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.06)]">
            <iframe
              key={activeFilter}
              src={`https://www.google.com/maps?q=${mapQueries[activeFilter]}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            {/* Loading overlay */}
            {mapLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity duration-300">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium text-slate-500">
                    Memuat peta...
                  </span>
                </div>
              </div>
            )}
            {/* Overlay gradient top */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
            {/* Map label */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-xl border border-slate-200/60 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">
                SPKLU {activeFilter === "Semua" ? "Balikpapan" : activeFilter}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Real-Time Status Monitor ─── */}
        <div id="status" className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Status <span className="text-emerald-600">Real-Time</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto">
              Pembaruan langsung dari seluruh jaringan stasiun pengisian kami
            </p>
          </div>

          {/* Main Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card
                    key={i}
                    className="border border-slate-200/80 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-[400ms]"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-300 text-sm font-medium">
                        Memuat data secara real-time...
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              : [
                  {
                    label: "Tersedia",
                    value: data?.available,
                    color: "emerald",
                    icon: "⚡",
                  },
                  {
                    label: "Sedang Digunakan",
                    value: data?.inUse,
                    color: "slate",
                    icon: "🔌",
                  },
                  {
                    label: "Pemeliharaan",
                    value: data?.maintenance,
                    color: "amber",
                    icon: "🔧",
                  },
                ].map((item, i) => (
                  <Card
                    key={i}
                    className="group border border-slate-200/80 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1.5 overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-slate-400 text-sm font-medium">
                          {item.label}
                        </CardTitle>
                        <span className="text-base">{item.icon}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-5xl font-bold tracking-tight ${
                          item.color === "emerald"
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 bg-clip-text text-transparent"
                            : item.color === "amber"
                              ? "bg-gradient-to-br from-amber-500 to-amber-600 bg-clip-text text-transparent"
                              : "bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent"
                        }`}
                      >
                        {item.value}
                      </div>
                      <div className="mt-3 h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            item.color === "emerald"
                              ? "from-emerald-400 to-emerald-500"
                              : item.color === "amber"
                                ? "from-amber-400 to-amber-500"
                                : "from-slate-400 to-slate-500"
                          }`}
                          style={{
                            width: `${Math.min((item.value! / 200) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* Extended Stats Bar */}
          {!isLoading && data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Lokasi",
                  value: data.totalLocations,
                  suffix: " tempat",
                  color: "text-slate-900",
                },
                {
                  label: "Total Mesin",
                  value: data.totalMachines,
                  suffix: " unit",
                  color: "text-emerald-600",
                },
                {
                  label: "Energi Hari Ini",
                  value: data.energyDelivered.toLocaleString("id-ID"),
                  suffix: " kWh",
                  color: "text-blue-600",
                },
                {
                  label: "CO₂ Terselamatkan",
                  value: data.co2Saved.toLocaleString("id-ID"),
                  suffix: " kg",
                  color: "text-emerald-600",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_-4px_rgba(16,185,129,0.15)] transition-all duration-300"
                >
                  <p className="text-xs text-slate-400 font-medium mb-1.5">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>
                    {stat.value}
                    <span className="text-sm font-medium text-slate-400 ml-0.5">
                      {stat.suffix}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Last Updated */}
          {!isLoading && data && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Terakhir diperbarui: {data.lastUpdated}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="relative border-t border-slate-200/60 bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <IconBolt className="h-3 w-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
                NeonCharge
              </span>
            </div>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} NeonCharge System. Hak cipta
              dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
