"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconBolt,
  IconUser,
  IconShield,
  IconMail,
  IconLock,
  IconArrowLeft,
  IconUserPlus,
} from "@tabler/icons-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

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

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      localStorage.setItem("neoncharge_user", JSON.stringify({
        type: "signin",
        nama: "Andi Pratama",
        email: "andi@email.com",
        telepon: "+62 812-3456-7890",
        model: "Hyundai Ioniq 5",
        kapasitas: "72.6 kWh",
        platNomor: "KT 1234 EV",
        tipeKonektor: "CCS2",
      }));
      router.push("/user/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem("neoncharge_user", JSON.stringify({
      type: "signin",
      nama: "Andi Pratama",
      email: "andi@email.com",
      telepon: "+62 812-3456-7890",
      model: "Hyundai Ioniq 5",
      kapasitas: "72.6 kWh",
      platNomor: "KT 1234 EV",
      tipeKonektor: "CCS2",
    }));
    router.push("/user/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/60 via-[#f6fdf8] to-teal-50/40 font-sans antialiased pt-20 pb-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-200/60 to-teal-100/40 blur-[100px]" />
        <div className="absolute top-[10%] right-[0%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-100/70 to-cyan-100/30 blur-[80px]" />
        <div className="absolute bottom-[0%] left-[10%] w-[600px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/50 to-green-100/30 blur-[90px]" />
        <div className="absolute bottom-[15%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-teal-100/40 to-emerald-50/20 blur-[70px]" />
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between bg-white/30 backdrop-blur-2xl rounded-2xl px-6 mt-3 border border-white/50 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.04)]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <IconBolt className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                NeonCharge
              </span>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200/60 bg-white/50 backdrop-blur-xl text-slate-600 hover:bg-white/80 hover:text-emerald-600 hover:border-emerald-300 text-[13px] font-semibold h-9 px-4"
              >
                <IconArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 space-y-6 rounded-[1.5rem] border border-white/60 bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.06)]">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/25 mx-auto">
            <IconBolt className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Masuk ke NeonCharge
          </h1>
          <p className="text-sm text-slate-400">
            Akses dashboard pengisian daya EV Anda
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Masuk sebagai</p>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
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
                  <role.icon className="h-5 w-5" />
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
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <IconMail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl border-slate-200/80 bg-white/80 pl-11 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Kata Sandi</label>
            <div className="relative">
              <IconLock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="password"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border-slate-200/80 bg-white/80 pl-11 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40 disabled:opacity-60 disabled:hover:scale-100"
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
          <div className="relative">
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
            className="h-12 w-full rounded-2xl border-slate-200/80 bg-white/80 backdrop-blur-xl font-semibold text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
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
          <div className="text-center">
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

        <p className="text-center text-xs text-slate-400">
          Demo login — masukkan email dan password apa saja.
        </p>
      </div>
    </div>
  );
}
