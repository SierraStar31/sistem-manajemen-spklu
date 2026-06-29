import Link from "next/link";
import { IconPlugX, IconBolt } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/60 via-[#f6fdf8] to-teal-50/40 font-sans antialiased">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-200/60 to-teal-100/40 blur-[100px]" />
        <div className="absolute top-[10%] right-[0%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-100/70 to-cyan-100/30 blur-[80px]" />
        <div className="absolute bottom-[0%] left-[10%] w-[600px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/50 to-green-100/30 blur-[90px]" />
        <div className="absolute bottom-[15%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-teal-100/40 to-emerald-50/20 blur-[70px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.06)] mb-8">
          <IconPlugX className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-slate-900">
          404 - Jalur Terputus
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-md leading-relaxed font-light">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau stasiun tidak tersedia.
        </p>

        <Link
          href="/"
          className="mt-8 flex items-center gap-2 px-8 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
        >
          <IconBolt className="h-4.5 w-4.5" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
