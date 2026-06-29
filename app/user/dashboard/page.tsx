"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  IconUser,
  IconCar,
  IconMail,
  IconPhone,
  IconCoin,
  IconBatteryCharging,
  IconLicense,
  IconPlugConnected,
  IconSettings,
  IconBell,
  IconLock,
  IconLanguage,
  IconEdit,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";

const vehicleProfileSchema = z.object({
  model: z.string().min(1, "Pilih model kendaraan"),
  kapasitas: z.string().min(1, "Kapasitas wajib diisi"),
  platNomor: z
    .string()
    .min(1, "Plat nomor wajib diisi")
    .regex(
      /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/,
      "Format plat tidak valid (contoh: B 1234 ABC)"
    ),
  tipeKonektor: z.string().min(1, "Pilih tipe konektor"),
});

type VehicleProfileData = z.infer<typeof vehicleProfileSchema>;

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

const defaultData = {
  nama: "Andi Pratama",
  email: "andi@email.com",
  telepon: "+62 812-3456-7890",
  model: "Hyundai Ioniq 5",
  kapasitas: "72.6 kWh",
  platNomor: "KT 1234 EV",
  tipeKonektor: "CCS2",
};

export default function UserDashboardPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(defaultData);
  const [platError, setPlatError] = useState("");

  const {
    formState: { errors: formErrors },
  } = useForm<VehicleProfileData>({
    resolver: zodResolver(vehicleProfileSchema),
    defaultValues: {
      model: data.model,
      kapasitas: data.kapasitas,
      platNomor: data.platNomor,
      tipeKonektor: data.tipeKonektor,
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("neoncharge_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData({
        nama: parsed.nama || defaultData.nama,
        email: parsed.email || defaultData.email,
        telepon: parsed.telepon || defaultData.telepon,
        model: parsed.model || defaultData.model,
        kapasitas: parsed.kapasitas || defaultData.kapasitas,
        platNomor: parsed.platNomor || defaultData.platNomor,
        tipeKonektor: parsed.tipeKonektor || defaultData.tipeKonektor,
      });
    }
  }, []);

  const validatePlat = (value: string) => {
    const result = vehicleProfileSchema.shape.platNomor.safeParse(value);
    if (!result.success) {
      setPlatError(result.error.issues[0]?.message || "Format plat tidak valid");
      return false;
    }
    setPlatError("");
    return true;
  };

  const handleSave = () => {
    if (!validatePlat(data.platNomor)) return;
    const stored = localStorage.getItem("neoncharge_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem("neoncharge_user", JSON.stringify({ ...parsed, ...data }));
      window.dispatchEvent(new Event("neoncharge_profile_updated"));
    }
    setIsEditing(false);
    setPlatError("");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Dasbor Saya</h1>
          <p className="mt-1 text-sm text-slate-400">Kelola profil, kendaraan, dan pengaturan akun Anda.</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={isEditing
            ? "rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl"
            : "rounded-2xl border-slate-200/80 bg-white/60 backdrop-blur-xl text-slate-700 hover:bg-white hover:border-slate-300 transition-all duration-300"
          }
        >
          <IconEdit className="mr-2 h-4 w-4" />
          {isEditing ? "Simpan" : "Edit Profil"}
        </Button>
      </div>

      {/* Profile + Vehicle */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Data Diri */}
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <IconUser className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base tracking-tight">Data Diri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><IconUser className="h-3 w-3" /> Nama</label>
              {isEditing ? (
                <Input value={data.nama} onChange={(e) => setData({ ...data, nama: e.target.value })} className="h-9 rounded-xl text-sm" />
              ) : (
                <p className="text-sm font-medium text-slate-900">{data.nama}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><IconMail className="h-3 w-3" /> Email</label>
              {isEditing ? (
                <Input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="h-9 rounded-xl text-sm" />
              ) : (
                <p className="text-sm font-medium text-slate-900">{data.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><IconPhone className="h-3 w-3" /> Telepon</label>
              {isEditing ? (
                <Input
                  type="tel"
                  inputMode="tel"
                  value={data.telepon}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(/[^0-9+\-\s()]/g, "");
                    setData({ ...data, telepon: filtered });
                  }}
                  className="h-9 rounded-xl text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-slate-900">{data.telepon}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><IconCoin className="h-3 w-3" /> Saldo</label>
              <p className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">Rp 250.000</p>
            </div>
          </CardContent>
        </Card>

        {/* Profil Kendaraan */}
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <IconCar className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base tracking-tight">Profil Kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Model Kendaraan</label>
              {isEditing ? (
                <select
                  value={data.model}
                  onChange={(e) => {
                    const selected = vehicleModels.find((v) => v.value === e.target.value);
                    setData({
                      ...data,
                      model: e.target.value,
                      kapasitas: selected ? selected.kapasitas : data.kapasitas,
                      tipeKonektor: selected ? selected.konektor : data.tipeKonektor,
                    });
                  }}
                  className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  {vehicleModels.map((v) => (
                    <option key={v.value} value={v.value}>{v.value}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-medium text-slate-900">{data.model}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><IconBatteryCharging className="h-3 w-3" /> Kapasitas Baterai</label>
              {isEditing ? (
                <Input value={data.kapasitas} onChange={(e) => setData({ ...data, kapasitas: e.target.value })} className="h-9 rounded-xl text-sm" />
              ) : (
                <p className="text-sm font-medium text-slate-900">{data.kapasitas}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><IconLicense className="h-3 w-3" /> Plat Nomor</label>
              {isEditing ? (
                <>
                  <Input
                    value={data.platNomor}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setData({ ...data, platNomor: val });
                      validatePlat(val);
                    }}
                    placeholder="Contoh: B 1234 ABC"
                    className={`h-9 rounded-xl text-sm font-mono ${platError ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                  />
                  {platError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <IconAlertCircle className="h-3 w-3" /> {platError}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm font-medium font-mono text-slate-900">{data.platNomor}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><IconPlugConnected className="h-3 w-3" /> Tipe Konektor</label>
              {isEditing ? (
                <select
                  value={data.tipeKonektor}
                  onChange={(e) => setData({ ...data, tipeKonektor: e.target.value })}
                  className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="CCS2">CCS2</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="AC Type 2">AC Type 2</option>
                </select>
              ) : (
                <Badge variant="outline" className="border-emerald-300 text-emerald-600 bg-emerald-50/50">{data.tipeKonektor}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pengaturan Akun */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <IconSettings className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-base tracking-tight">Pengaturan Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBell className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Notifikasi Email</p>
                <p className="text-xs text-slate-400">Terima notifikasi pengisian daya via email</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconLock className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Autentikasi Dua Faktor</p>
                <p className="text-xs text-slate-400">Aktifkan 2FA untuk keamanan ekstra</p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconLanguage className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Bahasa</p>
                <p className="text-xs text-slate-400">Bahasa Indonesia</p>
              </div>
            </div>
            <span className="text-sm text-slate-500">ID</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
