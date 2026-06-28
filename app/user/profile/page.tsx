"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconBolt,
  IconUser,
  IconCar,
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
import { Card, CardContent } from "@/app/components/ui/card";

const steps = ["Data Diri", "Profil Kendaraan", "Selesai"];

const vehicleModels = [
  { value: "Hyundai Ioniq 5", kapasitas: "72.6 kWh", konektor: "CCS2" },
  { value: "Hyundai Ioniq 6", kapasitas: "77.4 kWh", konektor: "CCS2" },
  { value: "Tesla Model 3", kapasitas: "75 kWh", konektor: "CCS2" },
  { value: "Tesla Model Y", kapasitas: "75 kWh", konektor: "CCS2" },
  { value: "BYD Atto 3", kapasitas: "60.5 kWh", konektor: "CCS2" },
  { value: "BYD Seal", kapasitas: "82.5 kWh", konektor: "CCS2" },
  { value: "Nissan Leaf", kapasitas: "40 kWh", konektor: "CHAdeMO" },
  { value: "Mitsubishi i-MiEV", kapasitas: "16 kWh", konektor: "CHAdeMO" },
  { value: "BMW iX3", kapasitas: "74 kWh", konektor: "CCS2" },
  { value: "Mercedes EQC", kapasitas: "80 kWh", konektor: "CCS2" },
  { value: "Volvo XC40 Recharge", kapasitas: "78 kWh", konektor: "CCS2" },
  { value: "Wuling Air EV", kapasitas: "26.7 kWh", konektor: "AC Type 2" },
  { value: "Hyundai Kona Electric", kapasitas: "64 kWh", konektor: "CCS2" },
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
    const newErrors: Record<string, string> = {};
    if (!nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!email.trim()) newErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email tidak valid";
    if (!telepon.trim()) newErrors.telepon = "Telepon wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!modelKendaraan) newErrors.modelKendaraan = "Pilih model kendaraan";
    if (!kapasitas.trim()) newErrors.kapasitas = "Kapasitas wajib diisi";
    if (!platNomor.trim()) newErrors.platNomor = "Plat nomor wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      {/* Floating Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between bg-white/30 backdrop-blur-2xl rounded-2xl px-6 mt-3 border border-white/50 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.04)]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <IconBolt className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">NeonCharge</span>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="rounded-xl border-slate-200/60 bg-white/50 backdrop-blur-xl text-slate-600 hover:bg-white/80 hover:text-emerald-600 hover:border-emerald-300 text-[13px] font-semibold h-9 px-4">
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 w-full max-w-lg mt-20">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                i < currentStep
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : i === currentStep
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-110"
                    : "bg-white/60 border border-slate-200 text-slate-400"
              }`}>
                {i < currentStep ? <IconCheck className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-0.5 rounded-full transition-all duration-300 ${
                  i < currentStep ? "bg-emerald-500" : "bg-slate-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
          <CardContent className="p-8">
            {/* Step 0: Data Diri */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/25 mx-auto">
                    <IconUser className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lengkapi Profil Anda</h1>
                  <p className="text-sm text-slate-400">Mulai dengan data diri Anda</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconUser className="h-4 w-4 text-slate-400" /> Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Masukkan nama lengkap"
                      value={nama}
                      onChange={(e) => { setNama(e.target.value); setErrors((prev) => ({ ...prev, nama: "" })); }}
                      className={`h-12 rounded-2xl border-slate-200/80 bg-white/80 ${errors.nama ? "border-red-400 focus:ring-red-100" : ""}`}
                    />
                    {errors.nama && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.nama}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconMail className="h-4 w-4 text-slate-400" /> Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "" })); }}
                      className={`h-12 rounded-2xl border-slate-200/80 bg-white/80 ${errors.email ? "border-red-400 focus:ring-red-100" : ""}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconPhone className="h-4 w-4 text-slate-400" /> Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="+62 xxx-xxxx-xxxx"
                      value={telepon}
                      onChange={(e) => { setTelepon(e.target.value); setErrors((prev) => ({ ...prev, telepon: "" })); }}
                      className={`h-12 rounded-2xl border-slate-200/80 bg-white/80 ${errors.telepon ? "border-red-400 focus:ring-red-100" : ""}`}
                    />
                    {errors.telepon && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.telepon}</p>}
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
                >
                  Selanjutnya
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 1: Profil Kendaraan */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/25 mx-auto">
                    <IconCar className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profil Kendaraan</h1>
                  <p className="text-sm text-slate-400">Masukkan data kendaraan listrik Anda</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconCar className="h-4 w-4 text-slate-400" /> Model Kendaraan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={modelKendaraan}
                      onChange={(e) => { handleModelSelect(e.target.value); setErrors((prev) => ({ ...prev, modelKendaraan: "" })); }}
                      className={`flex h-12 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${errors.modelKendaraan ? "border-red-400" : ""}`}
                    >
                      <option value="">Pilih model kendaraan</option>
                      {vehicleModels.map((v) => (
                        <option key={v.value} value={v.value}>{v.value}</option>
                      ))}
                    </select>
                    {errors.modelKendaraan && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.modelKendaraan}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconBatteryCharging className="h-4 w-4 text-slate-400" /> Kapasitas Baterai (kWh) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Otomatis terisi dari model"
                      value={kapasitas}
                      onChange={(e) => { setKapasitas(e.target.value); setErrors((prev) => ({ ...prev, kapasitas: "" })); }}
                      className={`h-12 rounded-2xl border-slate-200/80 bg-white/80 ${errors.kapasitas ? "border-red-400" : ""}`}
                    />
                    {errors.kapasitas && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.kapasitas}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <IconLicense className="h-4 w-4 text-slate-400" /> Plat Nomor <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Contoh: KT 1234 EV"
                      value={platNomor}
                      onChange={(e) => { setPlatNomor(e.target.value); setErrors((prev) => ({ ...prev, platNomor: "" })); }}
                      className={`h-12 rounded-2xl border-slate-200/80 bg-white/80 font-mono ${errors.platNomor ? "border-red-400" : ""}`}
                    />
                    {errors.platNomor && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {errors.platNomor}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tipe Konektor</label>
                    <select
                      value={tipeKonektor}
                      onChange={(e) => setTipeKonektor(e.target.value)}
                      className="flex h-12 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
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
                    className="flex-1 h-12 rounded-2xl border-slate-200/80 bg-white/80 backdrop-blur-xl font-semibold text-slate-700 hover:bg-white hover:border-slate-300"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
                  >
                    Selanjutnya
                    <IconArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Selesai */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/25 mx-auto">
                    <IconCheck className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profil Lengkap!</h1>
                  <p className="text-sm text-slate-400">Anda siap menggunakan NeonCharge</p>
                </div>

                <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200/60 p-4 space-y-2">
                  <p className="text-sm font-medium text-emerald-800">Ringkasan Profil:</p>
                  <div className="text-sm text-emerald-700 space-y-1">
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
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
                >
                  Masuk ke Dashboard
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-4">
          Langkah {currentStep + 1} dari {steps.length} — {steps[currentStep]}
        </p>
      </div>
    </div>
  );
}
