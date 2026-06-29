import { IconBolt } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/60 via-[#f6fdf8] to-teal-50/40 font-sans antialiased">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-200/60 to-teal-100/40 blur-[100px]" />
        <div className="absolute top-[10%] right-[0%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-100/70 to-cyan-100/30 blur-[80px]" />
        <div className="absolute bottom-[0%] left-[10%] w-[600px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/50 to-green-100/30 blur-[90px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <IconBolt className="h-10 w-10 text-emerald-500 animate-pulse" strokeWidth={2} />
        <p className="text-sm text-slate-400">Memuat data...</p>
      </div>
    </div>
  );
}
