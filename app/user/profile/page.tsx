"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  IconBolt,
  IconUser,
  IconCar,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconMail,
  IconPhone,
  IconLicense,
  IconBatteryCharging,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

const steps = ["Data Diri", "Profil Kendaraan", "Selesai"];

const step0Schema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
  telepon: z
    .string()
    .min(1, "Telepon wajib diisi")
    .regex(
      /^\+?[\d\s\-()]{8,20}$/,
      "Hanya digit, spasi, strip, dan tanda kurung yang diperbolehkan"
    ),
});

const step1Schema = z.object({
  modelKendaraan: z.string().min(1, "Pilih model kendaraan"),
  kapasitas: z.string().min(1, "Kapasitas wajib diisi"),
  platNomor: z
    .string()
    .min(1, "Plat nomor wajib diisi")
    .regex(
      /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/,
      "Format plat tidak valid (contoh: B 1234 ABC)"
    ),
});

const vehicleModels = [
  { value: "Hyundai Ioniq 5", kapasitas: "72.6 kWh", konektor: "CCS2" },
  { value: "Hyundai Ioniq 6", kapasitas: "77.4 kWh", konektor: "CCS2" },
  { value: "Hyundai Kona Electric", kapasitas: "64 kWh", konektor: "CCS2" },
  { value: "Hyundai Stargazer X EV", kapasitas: "59.3 kWh", konektor: "CCS2" },
  { value: "Tesla Model 3", kapasitas: "75 kWh", konektor: "CCS2" },
  { value: "Tesla Model Y", kapasitas: "75 kWh", konektor: "CCS2" },
  { value: "Tesla Model S", kapasitas: "100 kWh", konektor: "CCS2" },
  { value: "Tesla Model X", kapasitas: "100 kWh", konektor: "CCS2" },
  { value: "BYD Atto 3", kapasitas: "60.5 kWh", konektor: "CCS2" },
  { value: "BYD Seal", kapasitas: "82.5 kWh", konektor: "CCS2" },
  { value: "BYD Dolphin", kapasitas: "60.4 kWh", konektor: "CCS2" },
  { value: "BYD M6", kapasitas: "71.8 kWh", konektor: "CCS2" },
  { value: "Nissan Leaf", kapasitas: "40 kWh", konektor: "CHAdeMO" },
  { value: "Nissan Ariya", kapasitas: "87 kWh", konektor: "CCS2" },
  { value: "Mitsubishi i-MiEV", kapasitas: "16 kWh", konektor: "CHAdeMO" },
  { value: "Mitsubishi Outlander PHEV", kapasitas: "13.8 kWh", konektor: "CHAdeMO" },
  { value: "BMW iX3", kapasitas: "74 kWh", konektor: "CCS2" },
  { value: "BMW i4", kapasitas: "83.9 kWh", konektor: "CCS2" },
  { value: "BMW iX", kapasitas: "111.5 kWh", konektor: "CCS2" },
  { value: "Mercedes EQC", kapasitas: "80 kWh", konektor: "CCS2" },
  { value: "Mercedes EQA", kapasitas: "66.5 kWh", konektor: "CCS2" },
  { value: "Mercedes EQB", kapasitas: "66.5 kWh", konektor: "CCS2" },
  { value: "Volvo XC40 Recharge", kapasitas: "78 kWh", konektor: "CCS2" },
  { value: "Volvo C40 Recharge", kapasitas: "78 kWh", konektor: "CCS2" },
  { value: "Wuling Air EV", kapasitas: "26.7 kWh", konektor: "AC Type 2" },
  { value: "Wuling BinguoEV", kapasitas: "31.9 kWh", konektor: "AC Type 2" },
  { value: "Wuling CloudEV", kapasitas: "50.6 kWh", konektor: "CCS2" },
  { value: "MG ZS EV", kapasitas: "51 kWh", konektor: "CCS2" },
  { value: "MG4 Electric", kapasitas: "64 kWh", konektor: "CCS2" },
  { value: "Hyundai Ioniq 5 N", kapasitas: "84 kWh", konektor: "CCS2" },
  { value: "Toyota bZ4X", kapasitas: "71.4 kWh", konektor: "CCS2" },
  { value: "Lexus RZ 450e", kapasitas: "71.4 kWh", konektor: "CCS2" },
  { value: "Porsche Taycan", kapasitas: "93.4 kWh", konektor: "CCS2" },
  { value: "Audi Q8 e-tron", kapasitas: "114 kWh", konektor: "CCS2" },
  { value: "Rivian R1T", kapasitas: "135 kWh", konektor: "CCS2" },
  { value: "Honda e:Ny1", kapasitas: "61.9 kWh", konektor: "CCS2" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");

  const [modelKendaraan, setModelKendaraan] = useState("");
  const [kapasitas, setKapasitas] = useState("");
  const [platNomor, setPlatNomor] = useState("");
  const [tipeKonektor, setTipeKonektor] = useState("CCS2");

  const validateStep0 = () => {
    const result = step0Schema.safeParse({ nama, email, telepon });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep1 = () => {
    const result = step1Schema.safeParse({ modelKendaraan, kapasitas, platNomor });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateStep0()) return;
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = () => {
    const userData = {
      type: "signup",
      nama,
      email,
      telepon,
      model: modelKendaraan,
      kapasitas,
      platNomor,
      tipeKonektor,
    };
    localStorage.setItem("neoncharge_user", JSON.stringify(userData));
    router.push("/user/dashboard");
  };

  const handleModelSelect = (value: string) => {
    const vehicle = vehicleModels.find((v) => v.value === value);
    setModelKendaraan(value);
    if (vehicle) {
      setKapasitas(vehicle.kapasitas);
      setTipeKonektor(vehicle.konektor);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/60 via-[#f6fdf8] to-teal-50/40 font-sans antialiased p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-200/60 to-teal-100/40 blur-[100px]" />
        <div className="absolute top-[10%] right-[0%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-100/70 to-cyan-100/30 blur-[80px]" />
        <div className="absolute bottom-[0%] left-[10%] w-[600px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/50 to-green-100/30 blur-[90px]" />
      </div>

      {/* Header with Glassmorphism */}
      <nav className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-3">
        <div className="mx-auto max-w-7xl flex h-14 items-center justify-between bg-white/30 backdrop-blur-2xl rounded-2xl px-5 border border-white/50 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.04)]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-emerald-500/30">
              <IconBolt className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">NeonCharge</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-[13px] font-medium rounded-xl transition-colors duration-200 text-slate-500 hover:text-emerald-600">
              Beranda
            </Link>
            <Link href="/resources" className="px-4 py-2 text-[13px] font-medium rounded-xl transition-colors duration-200 text-slate-500 hover:text-emerald-600">
              Panduan
            </Link>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] shrink-0 border border-emerald-400/40"
          >
            <IconArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </nav>

      {/* Profile Card - Landscape */}
      <div className="relative z-10 w-full max-w-4xl mx-4 rounded-[1.5rem] border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.06)] overflow-hidden mt-16">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-4 sm:py-5 border-b border-white/40 bg-gradient-to-r from-emerald-50/50 via-white/30 to-emerald-50/50 px-4">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-1.5 sm:gap-2">
              <div className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                i < currentStep
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : i === currentStep
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-110"
                    : "bg-white/60 border border-slate-200 text-slate-400"
              }`}>
                {i < currentStep ? <IconCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-6 sm:w-12 h-0.5 rounded-full transition-all duration-300 ${
                  i < currentStep ? "bg-emerald-500" : "bg-slate-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row min-h-[auto] md:min-h-[480px]">
          {/* Left - Branding */}
          <div className="flex flex-col items-center justify-center p-8 md:w-2/5 bg-gradient-to-br from-emerald-500/10 via-emerald-50/50 to-teal-50/30 border-b md:border-b-0 md:border-r border-white/40">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/25 mb-5">
              {currentStep === 0 ? (
                <IconUser className="h-8 w-8 text-white" strokeWidth={2} />
              ) : currentStep === 1 ? (
                <IconCar className="h-8 w-8 text-white" strokeWidth={2} />
              ) : (
                <IconCheck className="h-8 w-8 text-white" strokeWidth={2.5} />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
              {currentStep === 0 ? "Lengkapi Profil" : currentStep === 1 ? "Profil Kendaraan" : "Selesai!"}
            </h1>
            <p className="text-sm text-slate-400 text-center mt-2 max-w-[240px]">
              {currentStep === 0 ? "Mulai dengan data diri Anda" : currentStep === 1 ? "Masukkan data kendaraan listrik Anda" : "Anda siap menggunakan NeonCharge"}
            </p>
            <div className="hidden md:flex flex-col items-center gap-2 mt-8">
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Data Aman & Terenkripsi
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Profil Tersimpan Otomatis
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="flex flex-col justify-center p-8 md:w-3/5">
            {/* Step 0: Data Diri */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconUser className="h-4 w-4 text-slate-400" /> Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Masukkan nama lengkap"
                      value={nama}
                      onChange={(e) => { setNama(e.target.value); setErrors((prev) => ({ ...prev, nama: "" })); }}
                      className={`h-11 rounded-2xl border-slate-200/80 bg-white/80 ${errors.nama ? "border-red-400 focus:ring-red-100" : ""}`}
                    />
                    {errors.nama && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.nama}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconMail className="h-4 w-4 text-slate-400" /> Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "" })); }}
                      className={`h-11 rounded-2xl border-slate-200/80 bg-white/80 ${errors.email ? "border-red-400 focus:ring-red-100" : ""}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconPhone className="h-4 w-4 text-slate-400" /> Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      inputMode="tel"
                      placeholder="+62 xxx-xxxx-xxxx"
                      value={telepon}
                      onChange={(e) => {
                        const filtered = e.target.value.replace(/[^0-9+\-\s()]/g, "");
                        setTelepon(filtered);
                        setErrors((prev) => ({ ...prev, telepon: "" }));
                      }}
                      className={`h-11 rounded-2xl border-slate-200/80 bg-white/80 ${errors.telepon ? "border-red-400 focus:ring-red-100" : ""}`}
                    />
                    {errors.telepon && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.telepon}</p>}
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
                >
                  Selanjutnya
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 1: Profil Kendaraan */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconCar className="h-4 w-4 text-slate-400" /> Model Kendaraan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={modelKendaraan}
                      onChange={(e) => { handleModelSelect(e.target.value); setErrors((prev) => ({ ...prev, modelKendaraan: "" })); }}
                      className={`flex h-11 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${errors.modelKendaraan ? "border-red-400" : ""}`}
                    >
                      <option value="">Pilih model kendaraan</option>
                      {vehicleModels.map((v) => (
                        <option key={v.value} value={v.value}>{v.value}</option>
                      ))}
                    </select>
                    {errors.modelKendaraan && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.modelKendaraan}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconBatteryCharging className="h-4 w-4 text-slate-400" /> Kapasitas Baterai (kWh) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Otomatis terisi dari model"
                      value={kapasitas}
                      onChange={(e) => { setKapasitas(e.target.value); setErrors((prev) => ({ ...prev, kapasitas: "" })); }}
                      className={`h-11 rounded-2xl border-slate-200/80 bg-white/80 ${errors.kapasitas ? "border-red-400" : ""}`}
                    />
                    {errors.kapasitas && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.kapasitas}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconLicense className="h-4 w-4 text-slate-400" /> Plat Nomor <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Contoh: B 1234 ABC"
                      value={platNomor}
                      onChange={(e) => { setPlatNomor(e.target.value.toUpperCase()); setErrors((prev) => ({ ...prev, platNomor: "" })); }}
                      className={`h-11 rounded-2xl border-slate-200/80 bg-white/80 font-mono ${errors.platNomor ? "border-red-400" : ""}`}
                    />
                    {errors.platNomor && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.platNomor}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Tipe Konektor</label>
                    <select
                      value={tipeKonektor}
                      onChange={(e) => setTipeKonektor(e.target.value)}
                      className="flex h-11 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="CCS2">CCS2</option>
                      <option value="CHAdeMO">CHAdeMO</option>
                      <option value="AC Type 2">AC Type 2</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(0)}
                    className="flex-1 h-11 rounded-2xl border-slate-200/80 bg-white/80 backdrop-blur-xl font-semibold text-slate-700 hover:bg-white hover:border-slate-300"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
                  >
                    Selanjutnya
                    <IconArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Selesai */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200/60 p-4 space-y-2">
                  <p className="text-sm font-medium text-emerald-800">Ringkasan Profil:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-emerald-700">
                    <p>Nama: {nama}</p>
                    <p>Email: {email}</p>
                    <p>Telepon: {telepon}</p>
                    <p>Kendaraan: {modelKendaraan}</p>
                    <p>Kapasitas: {kapasitas}</p>
                    <p>Plat: {platNomor}</p>
                    <p>Konektor: {tipeKonektor}</p>
                  </div>
                </div>

                <Button
                  onClick={handleFinish}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
                >
                  Masuk ke Dashboard
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="fixed bottom-4 text-xs text-slate-400">
        Langkah {currentStep + 1} dari {steps.length} — {steps[currentStep]}
      </p>
    </div>
  );
}
