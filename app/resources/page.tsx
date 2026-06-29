"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  IconHelp,
  IconInfoCircle,
  IconSend,
  IconBolt,
  IconBatteryCharging,
  IconRosetteDiscountCheck,
  IconArrowLeft,
} from "@tabler/icons-react";

const ticketSchema = z.object({
  subject: z.string().min(3, "Subjek harus minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  message: z.string().min(10, "Pesan harus minimal 10 karakter"),
});

type TicketForm = z.infer<typeof ticketSchema>;

const connectorData = [
  {
    value: "ccs2",
    name: "CCS2",
    fullName: "Combined Charging System",
    speed: "Hingga 350 kW",
    desc: "Standar dominan di Eropa dan Asia untuk pengisian daya DC super cepat. Menggabungkan pin AC dan DC dalam satu konektor.",
    icon: IconBolt,
    image: "/CCS2.png",
  },
  {
    value: "chademo",
    name: "CHAdeMO",
    fullName: "CHArge de MOve",
    speed: "Hingga 400 kW",
    desc: "Teknologi pengisian daya DC cepat asal Jepang. Mendukung Vehicle-to-Grid (V2G) untuk transfer energi dua arah.",
    icon: IconBatteryCharging,
    image: "/CHADEMO.png",
  },
  {
    value: "actype2",
    name: "AC Type 2",
    fullName: "Mennekes Connector",
    speed: "Hingga 22 kW",
    desc: "Konektor standar untuk pengisian daya AC di rumah dan tempat umum. Ideal untuk pengisian semalaman.",
    icon: IconRosetteDiscountCheck,
    image: "/AC Type 2.png",
  },
];

const faqItems = [
  {
    question: "Bagaimana cara melakukan reservasi sesi charging?",
    answer:
      "Buka aplikasi NeonCharge, pilih stasiun terdekat dari peta interaktif, lalu pilih waktu yang tersedia. Konfirmasi reservasi dan Anda akan mendapatkan QR code untuk mengakses sesi charging.",
  },
  {
    question: "Metode pembayaran apa saja yang didukung?",
    answer:
      "Kami menerima pembayaran melalui e-wallet (GoPay, OVO, Dana), kartu kredit/debit, dan saldo NeonCharge. Semua transaksi diproses secara aman melalui gateway pembayaran kami.",
  },
  {
    question: "Bagaimana cara memeriksa status stasiun secara real-time?",
    answer:
      "Status setiap stasiun ditampilkan secara real-time di peta interaktif kami. Warna hijau menandakan tersedia, kuning sedang digunakan, dan abu-abu dalam maintenance. Anda juga bisa mengatur notifikasi untuk stasiun favorit.",
  },
  {
    question: "Apakah saya bisa membatalkan reservasi yang sudah dibuat?",
    answer:
      "Ya, Anda bisa membatalkan reservasi hingga 30 menit sebelum sesi dimulai tanpa dikenakan biaya. Pembatalan mendekati waktu sesi akan dikenakan biaya pembatalan sebesar 10%.",
  },
  {
    question: "Apakah NeonCharge aman digunakan untuk semua jenis kendaraan listrik?",
    answer:
      "Ya, semua stasiun kami telah tersertifikasi dan kompatibel dengan kendaraan listrik standar SNI. Kami mendukung berbagai tipe konektor seperti CCS2, CHAdeMO, dan AC Type 2. Pastikan Anda memilih konektor yang sesuai dengan kendaraan Anda.",
  },
  {
    question: "Bagaimana cara menjadi member NeonCharge?",
    answer:
      "Download aplikasi NeonCharge dari App Store atau Google Play, lalu daftar akun baru dengan email atau nomor telepon Anda. Setelah verifikasi, Anda akan mendapatkan akses ke fitur member termasuk saldo digital, riwayat charging, dan reward.",
  },
  {
    question: "Apakah ada biaya langganan untuk menggunakan NeonCharge?",
    answer:
      "Tidak ada biaya langganan. Anda hanya membayar sesuai dengan energi yang digunakan saat sesi charging. Namun, member premium kami mendapatkan keuntungan seperti harga per kWh yang lebih rendah dan akses prioritas di stasiun ramai.",
  },
  {
    question: "Bagaimana jika stasiun charging mengalami gangguan teknis?",
    answer:
      "Segera laporkan melalui aplikasi NeonCharge atau hubungi layanan pelanggan kami. Tim teknisi akan merespon dalam waktu 30 menit. Anda akan mendapatkan komponen berupa saldo kredit jika gangguan terjadi saat sesi charging aktif.",
  },
];

const sectionNavItems = [
  { label: "Tentang Kami", href: "#about" },
  { label: "Konektor", href: "#connectors" },
  { label: "Dukungan", href: "#support" },
];

export default function ResourcesPage() {
  const [submitted, setSubmitted] = useState(false);
  const [activeNav, setActiveNav] = useState("Tentang Kami");
  const navRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

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

  useEffect(() => {
    const sections = ["about", "connectors", "support"];
    const labelMap: Record<string, string> = {
      about: "Tentang Kami",
      connectors: "Konektor",
      support: "Dukungan",
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 160;

      if (scrollY < 200) {
        setActiveNav("Tentang Kami");
        return;
      }

      let current = "about";
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
  });

  const onSubmit = (data: TicketForm) => {
    console.log("Ticket submitted:", data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-[#f6fdf8] to-teal-50/40 text-slate-900 font-sans antialiased">
      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between bg-white/30 backdrop-blur-2xl rounded-2xl px-6 mt-3 border border-white/50 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.04)]">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <IconBolt
                  className="h-4.5 w-4.5 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                NeonCharge
              </span>
            </Link>

            {/* Section Nav */}
            <div className="hidden md:flex items-center gap-1 relative">
              {sectionNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  ref={(el) => {
                    if (el) navRefs.current.set(item.label, el);
                  }}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-4 py-2 text-[13px] font-medium rounded-xl transition-colors duration-200 z-10 ${
                    activeNav === item.label
                      ? "text-emerald-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <span
                className="absolute bottom-0.5 h-[2px] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.opacity,
                }}
              />
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] shrink-0 border border-emerald-400/40"
            >
              <IconArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════ HERO HEADER ═══════════════════════ */}
      <section className="relative pt-28 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-200/50 to-teal-100/30 blur-[100px]" />
          <div className="absolute top-[10%] right-[0%] w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-emerald-100/60 to-cyan-100/20 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-emerald-100/40 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 tracking-wide uppercase">
              Pusat Pengetahuan
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
            <span className="bg-gradient-to-r from-emerald-500 via-teal-300 via-50% to-emerald-500 bg-clip-text text-transparent animate-shimmer">
              Pusat Panduan & Bantuan
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed font-light">
            Semua informasi yang Anda butuhkan tentang layanan NeonCharge.
          </p>
        </div>
      </section>

      {/* ═══════════════════════ CONTENT ═══════════════════════ */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        {/* ─── About Us ─── */}
        <div id="about" className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08)] border border-slate-200/60 space-y-7 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/80 text-emerald-600 text-xs font-semibold tracking-wide uppercase">
            <IconInfoCircle className="w-3.5 h-3.5" />
            Tentang Kami
          </div>
          <h2 className="text-3xl font-bold text-slate-900 leading-[1.15] tracking-tight">
            Visi Kami adalah Masa Depan{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              Zero Emission
            </span>
          </h2>
          <p className="text-slate-400 text-[15px] leading-relaxed max-w-3xl mx-auto">
            NeonCharge hadir untuk mendukung percepatan transformasi
            transportasi listrik di Indonesia. Kami berkomitmen menyediakan
            infrastruktur pengisian daya yang andal, cepat, dan ramah
            lingkungan untuk menjadikan mobilitas berkelanjutan sebagai
            standar baru. Dengan lebih dari 500 stasiun yang tersebar di
            berbagai kota besar, setiap sesi charging dengan NeonCharge
            adalah langkah kecil menuju masa depan yang lebih hijau.
          </p>
        </div>

        {/* ─── Connector Guidelines ─── */}
        <div id="connectors" className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Panduan <span className="text-emerald-600">Konektor</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto">
              Spesifikasi standar pengisian daya kendaraan listrik
            </p>
          </div>

          <Tabs defaultValue="ccs2" className="w-full max-w-3xl mx-auto">
            <TabsList className="flex w-full bg-slate-50 p-1.5 rounded-2xl h-14 border border-slate-200/60 shadow-sm gap-1.5">
              {connectorData.map((c) => (
                <TabsTrigger
                  key={c.value}
                  value={c.value}
                  className="flex-1 rounded-xl text-sm font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 data-[state=active]:pointer-events-none hover:bg-slate-100 transition-all duration-300"
                >
                  {c.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {connectorData.map((c) => (
              <TabsContent key={c.value} value={c.value} className="mt-6 m-0">
                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08)] border border-slate-200/60 flex flex-col items-center">
                  <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="flex-shrink-0 w-32 h-32 rounded-[1.5rem] bg-emerald-50 overflow-hidden flex items-center justify-center shadow-lg shadow-emerald-500/10 border-2 border-emerald-200/60">
                      <Image
                        src={c.image}
                        alt={c.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover rounded-[1.1rem]"
                      />
                    </div>
                    <div className="text-center md:text-left space-y-3">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {c.name}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium">
                          {c.fullName}
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 text-emerald-700 border border-emerald-200/60 text-xs font-medium">
                        <IconBolt className="w-3 h-3" />
                        {c.speed}
                      </div>
                      <p className="text-slate-500 leading-relaxed">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* ─── Support Center ─── */}
        <div id="support" className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Pusat <span className="text-emerald-600">Dukungan</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto">
              Temukan jawaban atas pertanyaan Anda atau hubungi tim kami
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FAQ */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08)] border border-slate-200/60">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 shadow-sm">
                  <IconHelp className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Pertanyaan Umum
                  </h3>
                  <p className="text-xs text-slate-400">
                    Jawaban cepat untuk pertanyaan yang sering diajukan
                  </p>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-slate-700 hover:text-emerald-600 text-sm font-medium">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-500 text-sm leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Submit Ticket */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08)] border border-slate-200/60">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 shadow-sm">
                  <IconSend className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Kirim Tiket Dukungan
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kami siap membantu Anda
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-600">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="email@contoh.com"
                    className="rounded-xl border-slate-200/60 bg-slate-50/50 h-11 text-sm focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-600">
                    Subjek
                  </label>
                  <Input
                    placeholder="Ringkasan masalah Anda"
                    className="rounded-xl border-slate-200/60 bg-slate-50/50 h-11 text-sm focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200"
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-600">
                    Keluhan
                  </label>
                  <Textarea
                    placeholder="Jelaskan kendala Anda..."
                    className="min-h-[110px] rounded-xl border-slate-200/60 bg-slate-50/50 text-sm resize-none focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white h-11 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] border border-emerald-400/40"
                >
                  <IconSend className="w-4 h-4 mr-2" />
                  {submitted ? "Terkirim!" : "Kirim Tiket"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="relative border-t border-slate-200/60 bg-white/40 backdrop-blur-xl mt-12">
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
