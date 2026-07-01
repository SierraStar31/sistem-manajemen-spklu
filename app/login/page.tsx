"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  IconBolt,
  IconUser,
  IconShield,
  IconMail,
  IconLock,
  IconArrowLeft,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Email tidak valid"),
  password: z
    .string()
    .min(1, "Kata sandi wajib diisi"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const roles = [
  {
    id: "user",
    label: "Pengguna",
    description: "Akses dashboard & reservasi SPKLU",
    icon: IconUser,
  },
  {
    id: "admin",
    label: "Administrator",
    description: "Kelola stasiun & operasional",
    icon: IconShield,
  },
] as const;

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Panduan", href: "/resources" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (selectedRole === "admin") {
      localStorage.setItem("neoncharge_user", JSON.stringify({
        type: "admin",
        nama: "Admin NeonCharge",
        email: "admin@neoncharge.id",
      }));
      router.push("/admin/dashboard");
    } else {
      const existing = localStorage.getItem("neoncharge_user");
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.email === data.email && parsed.type === "signup") {
          router.push("/user/dashboard");
          return;
        }
      }
      localStorage.setItem("neoncharge_user", JSON.stringify({
        type: "signin",
        nama: "Andi Pratama",
        email: data.email,
        telepon: "+62 812-3456-7890",
        model: "Hyundai Ioniq 5",
        kapasitas: "72.6 kWh",
        platNomor: "KT 1234 EV",
        tipeKonektor: "CCS2",
        foto: "",
        saldo: 250000,
      }));
      router.push("/user/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const existing = localStorage.getItem("neoncharge_user");
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.type === "signup") {
        router.push("/user/dashboard");
        return;
      }
    }
    localStorage.setItem("neoncharge_user", JSON.stringify({
      type: "signin",
      nama: "Andi Pratama",
      email: "andi@email.com",
      telepon: "+62 812-3456-7890",
      model: "Hyundai Ioniq 5",
      kapasitas: "72.6 kWh",
      platNomor: "KT 1234 EV",
      tipeKonektor: "CCS2",
      foto: "",
      saldo: 250000,
    }));
    router.push("/user/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-y-auto bg-gradient-to-br from-emerald-50/60 via-[#f6fdf8] to-teal-50/40 font-sans antialiased pt-24 pb-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-200/60 to-teal-100/40 blur-[100px]" />
        <div className="absolute top-[10%] right-[0%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-100/70 to-cyan-100/30 blur-[80px]" />
        <div className="absolute bottom-[0%] left-[10%] w-[600px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/50 to-green-100/30 blur-[90px]" />
        <div className="absolute bottom-[15%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-teal-100/40 to-emerald-50/20 blur-[70px]" />
      </div>

      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between bg-white/30 backdrop-blur-2xl rounded-2xl px-4 sm:px-6 mt-3 border border-white/50 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.04)]">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-emerald-500/30">
                <IconBolt className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                NeonCharge
              </span>
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-1 relative">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-[13px] font-medium rounded-xl transition-colors duration-200 z-10 text-slate-500 hover:text-emerald-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA - Desktop */}
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] shrink-0 border border-emerald-400/40"
            >
              <IconArrowLeft className="h-4 w-4" />
              Kembali
            </Link>

            {/* Hamburger - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:bg-white/50 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <IconX className="h-5 w-5" />
              ) : (
                <IconMenu2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mx-4 mt-2 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/50 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="px-4 pb-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-200 border border-emerald-400/40"
              >
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Login Card - Landscape */}
      <div className="relative z-10 w-full max-w-4xl mx-4 rounded-[1.5rem] border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[auto] md:min-h-[540px]">
          {/* Left - Branding */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:w-2/5 bg-gradient-to-br from-emerald-500/10 via-emerald-50/50 to-teal-50/30 border-b md:border-b-0 md:border-r border-white/40">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/25 mb-5">
              <IconBolt className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
              Masuk ke NeonCharge
            </h1>
            <p className="text-sm text-slate-400 text-center mt-2 max-w-[240px]">
              Akses dashboard pengisian daya EV Anda
            </p>
            <div className="hidden md:flex flex-col items-center gap-2 mt-8">
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Pengisian Cepat & Aman
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Jaringan SPKLU Luas
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Real-Time Monitoring
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="flex flex-col justify-center p-6 sm:p-8 md:w-3/5">
            {/* Role Selection */}
            <div className="space-y-3 mb-5">
              <p className="text-sm font-medium text-slate-700">Masuk sebagai</p>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all duration-300 ${
                      selectedRole === role.id
                        ? "border-emerald-500 bg-emerald-50/80 shadow-lg shadow-emerald-200/50 scale-[1.02]"
                        : "border-slate-200/80 bg-white/60 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50 hover:scale-[1.01]"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                        selectedRole === role.id
                          ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                          : "bg-slate-100/80 text-slate-500"
                      }`}
                    >
                      {role.id === "user" ? (
                        <IconUser className="w-5 h-5" strokeWidth={1.8} />
                      ) : (
                        <IconShield className="w-5 h-5" strokeWidth={1.8} />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          selectedRole === role.id ? "text-emerald-700" : "text-slate-700"
                        }`}
                      >
                        {role.label}
                      </p>
                      <p className="text-[11px] text-slate-400">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(handleLogin)} noValidate className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <IconMail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="Masukkan email Anda"
                    {...register("email")}
                    className={`h-11 rounded-2xl bg-white/80 pl-11 text-sm focus:ring-2 ${
                      errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200/80 focus:border-emerald-400 focus:ring-emerald-100"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Kata Sandi</label>
                <div className="relative">
                  <IconLock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="Masukkan kata sandi"
                    {...register("password")}
                    className={`h-11 rounded-2xl bg-white/80 pl-11 text-sm focus:ring-2 ${
                      errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200/80 focus:border-emerald-400 focus:ring-emerald-100"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40 disabled:opacity-60 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Memproses...
                  </div>
                ) : (
                  `Masuk sebagai ${selectedRole === "admin" ? "Admin" : "Pengguna"}`
                )}
              </Button>
            </form>

            {/* Divider - only for user */}
            {selectedRole === "user" && (
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white/60 backdrop-blur-xl px-4 text-slate-400">atau</span>
                </div>
              </div>
            )}

            {/* Google Sign-In - only for user sign-in */}
            {selectedRole === "user" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="h-11 w-full rounded-2xl border-slate-200/80 bg-white/80 backdrop-blur-xl font-semibold text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
              >
                <svg className="mr-2.5 h-4.5 w-4.5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Masuk dengan Google
              </Button>
            )}

            {/* Registration Link - only for user */}
            {selectedRole === "user" && (
              <div className="text-center mt-4">
                <p className="text-sm text-slate-500">
                  Belum punya akun?{" "}
                  <Link
                    href="/user/profile"
                    className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Registrasi Sekarang
                  </Link>
                </p>
              </div>
            )}

            <p className="text-center text-xs text-slate-400 mt-3">
              Demo login — masukkan email dan password apa saja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
