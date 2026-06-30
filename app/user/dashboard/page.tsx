"use client";

import { useState, useEffect, useRef } from "react";
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
  IconCamera,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { useLanguage } from "@/app/providers";
import { t } from "@/lib/i18n";

const vehicleProfileSchema = z.object({
  model: z.string().min(1, "Pilih model kendaraan"),
  kapasitas: z.string().min(1, "Kapasitas wajib diisi"),
  platNomor: z
    .string()
    .min(1, "Plat nomor wajib diisi")
    .regex(
      /^[a-zA-Z]{1,2}\s\d{1,4}(?:\s[a-zA-Z]{1,3})?$/,
      "Format plat tidak valid. Gunakan spasi, contoh: KT 1234 EV atau KT 1975",
    ),
  tipeKonektor: z.string().min(1, "Pilih tipe konektor"),
});

type VehicleProfileData = z.infer<typeof vehicleProfileSchema>;

const vehicleModels = [
  { value: "BMW iX1 xDrive30", kapasitas: "64.7 kWh", konektor: "CCS2" },
  { value: "BMW iX3", kapasitas: "74 kWh", konektor: "CCS2" },
  { value: "BYD Atto 3", kapasitas: "60.5 kWh", konektor: "CCS2" },
  { value: "BYD Dolphin", kapasitas: "44.9 kWh", konektor: "CCS2" },
  { value: "BYD Seal", kapasitas: "82.5 kWh", konektor: "CCS2" },
  { value: "Hyundai Ioniq 5", kapasitas: "72.6 kWh", konektor: "CCS2" },
  { value: "Hyundai Ioniq 5 N", kapasitas: "84 kWh", konektor: "CCS2" },
  { value: "Hyundai Ioniq 6", kapasitas: "77.4 kWh", konektor: "CCS2" },
  {
    value: "Hyundai Ioniq 6 Long Range",
    kapasitas: "77.4 kWh",
    konektor: "CCS2",
  },
  { value: "Hyundai Kona Electric", kapasitas: "64 kWh", konektor: "CCS2" },
  {
    value: "Hyundai Kona Electric Long Range",
    kapasitas: "77.4 kWh",
    konektor: "CCS2",
  },
  { value: "Hyundai Stargazer X EV", kapasitas: "59.3 kWh", konektor: "CCS2" },
  { value: "MG 4 Electric", kapasitas: "51 kWh", konektor: "CCS2" },
  { value: "MG 4 Electric Long Range", kapasitas: "77 kWh", konektor: "CCS2" },
  { value: "MG ZS EV", kapasitas: "44.5 kWh", konektor: "CCS2" },
  { value: "Nissan Ariya", kapasitas: "63 kWh", konektor: "CCS2" },
  { value: "Nissan Leaf", kapasitas: "40 kWh", konektor: "CHAdeMO" },
  { value: "Tesla Model 3", kapasitas: "60 kWh", konektor: "CCS2" },
  { value: "Tesla Model 3 Long Range", kapasitas: "75 kWh", konektor: "CCS2" },
  { value: "Tesla Model 3 Performance", kapasitas: "75 kWh", konektor: "CCS2" },
  { value: "Tesla Model S", kapasitas: "100 kWh", konektor: "CCS2" },
  { value: "Tesla Model S Plaid", kapasitas: "100 kWh", konektor: "CCS2" },
  { value: "Tesla Model X", kapasitas: "100 kWh", konektor: "CCS2" },
  { value: "Tesla Model X Plaid", kapasitas: "100 kWh", konektor: "CCS2" },
  { value: "Tesla Model Y", kapasitas: "60 kWh", konektor: "CCS2" },
  { value: "Tesla Model Y Long Range", kapasitas: "75 kWh", konektor: "CCS2" },
  { value: "Tesla Model Y Performance", kapasitas: "75 kWh", konektor: "CCS2" },
  { value: "Volvo XC40 Recharge", kapasitas: "78 kWh", konektor: "CCS2" },
  { value: "Volvo C40 Recharge", kapasitas: "78 kWh", konektor: "CCS2" },
  { value: "Wuling Air EV", kapasitas: "26.7 kWh", konektor: "AC Type 2" },
  { value: "Wuling Binguo EV", kapasitas: "31.9 kWh", konektor: "CCS2" },
];

const defaultData = {
  nama: "Andi Pratama",
  email: "andi@email.com",
  telepon: "+62 812-3456-7890",
  model: "Hyundai Ioniq 5",
  kapasitas: "72.6 kWh",
  platNomor: "KT 1234 EV",
  tipeKonektor: "CCS2",
  foto: "",
  saldo: 250000,
};

export default function UserDashboardPage() {
  const { locale, setLocale } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(defaultData);
  const [platError, setPlatError] = useState("");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [photoMode, setPhotoMode] = useState<"upload" | "url">("upload");
  const [photoUrl, setPhotoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const {
    formState: {},
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
        foto: parsed.foto || defaultData.foto,
        saldo: parsed.saldo ?? defaultData.saldo,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("neoncharge_user", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validatePlat = (value: string) => {
    const result = vehicleProfileSchema.shape.platNomor.safeParse(value);
    if (!result.success) {
      setPlatError(
        result.error.issues[0]?.message || "Format plat tidak valid",
      );
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
      localStorage.setItem(
        "neoncharge_user",
        JSON.stringify({ ...parsed, ...data }),
      );
      window.dispatchEvent(new Event("neoncharge_profile_updated"));
    }
    setIsEditing(false);
    setPlatError("");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setData((prev) => ({ ...prev, foto: base64 }));
      const stored = localStorage.getItem("neoncharge_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          "neoncharge_user",
          JSON.stringify({ ...parsed, foto: base64 }),
        );
        window.dispatchEvent(new Event("neoncharge_profile_updated"));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {t(locale, "dashboard")}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t(locale, "dashboardDesc")}
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={
            isEditing
              ? "rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl"
              : "rounded-2xl border-slate-200/80 bg-white/60 backdrop-blur-xl text-slate-700 hover:bg-white hover:border-slate-300 transition-all duration-300"
          }
        >
          <IconEdit className="mr-2 h-4 w-4" />
          {isEditing ? t(locale, "save") : t(locale, "editProfile")}
        </Button>
      </div>

      {/* Profile + Vehicle */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        {/* Data Diri */}
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <IconUser className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base tracking-tight">
              {t(locale, "dataDiri")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Photo Upload - only in edit mode */}
            {isEditing ? (
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                    {data.foto ? (
                      <img
                        src={data.foto}
                        alt="Foto Profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <IconUser className="h-8 w-8 text-emerald-300" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <IconCamera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {data.nama}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPhotoMode("upload")}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${photoMode === "upload" ? "bg-emerald-100 text-emerald-700 font-medium" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      {t(locale, "uploadFoto")}
                    </button>
                    <button
                      onClick={() => setPhotoMode("url")}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${photoMode === "url" ? "bg-emerald-100 text-emerald-700 font-medium" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      URL
                    </button>
                  </div>
                  {photoMode === "url" && (
                    <div className="flex gap-2">
                      <Input
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="h-8 rounded-lg text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (photoUrl.trim()) {
                            setData((prev) => ({
                              ...prev,
                              foto: photoUrl.trim(),
                            }));
                            const stored =
                              localStorage.getItem("neoncharge_user");
                            if (stored) {
                              const parsed = JSON.parse(stored);
                              localStorage.setItem(
                                "neoncharge_user",
                                JSON.stringify({
                                  ...parsed,
                                  foto: photoUrl.trim(),
                                }),
                              );
                              window.dispatchEvent(
                                new Event("neoncharge_profile_updated"),
                              );
                            }
                            setPhotoUrl("");
                          }
                        }}
                        className="h-8 rounded-lg text-xs px-3"
                      >
                        OK
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                  {data.foto ? (
                    <img
                      src={data.foto}
                      alt="Foto Profil"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <IconUser className="h-8 w-8 text-emerald-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {data.nama}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t(locale, "fotoProfil")}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <IconUser className="h-3 w-3" /> {t(locale, "nama")}
              </label>
              {isEditing ? (
                <Input
                  value={data.nama}
                  onChange={(e) => setData({ ...data, nama: e.target.value })}
                  className="h-9 rounded-xl text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-slate-900">
                  {data.nama}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <IconMail className="h-3 w-3" /> {t(locale, "email")}
              </label>
              {isEditing ? (
                <Input
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="h-9 rounded-xl text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-slate-900">
                  {data.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <IconPhone className="h-3 w-3" /> {t(locale, "telepon")}
              </label>
              {isEditing ? (
                <Input
                  type="tel"
                  inputMode="tel"
                  value={data.telepon}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(
                      /[^0-9+\-\s()]/g,
                      "",
                    );
                    setData({ ...data, telepon: filtered });
                  }}
                  className="h-9 rounded-xl text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-slate-900">
                  {data.telepon}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <IconCoin className="h-3 w-3" /> {t(locale, "saldo")}
              </label>
              <p className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Rp {(data.saldo || 0).toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profil Kendaraan */}
        <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)] transition-all duration-[400ms] hover:-translate-y-1 overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <IconCar className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base tracking-tight">
              {t(locale, "profilKendaraan")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">
                {t(locale, "modelKendaraan")}
              </label>
              {isEditing ? (
                <select
                  value={data.model}
                  onChange={(e) => {
                    const selected = vehicleModels.find(
                      (v) => v.value === e.target.value,
                    );
                    setData({
                      ...data,
                      model: e.target.value,
                      kapasitas: selected ? selected.kapasitas : data.kapasitas,
                      tipeKonektor: selected
                        ? selected.konektor
                        : data.tipeKonektor,
                    });
                  }}
                  className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  {vehicleModels.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.value}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-medium text-slate-900">
                  {data.model}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <IconBatteryCharging className="h-3 w-3" />{" "}
                {t(locale, "kapasitasBaterai")}
              </label>
              {isEditing ? (
                <Input
                  value={data.kapasitas}
                  onChange={(e) =>
                    setData({ ...data, kapasitas: e.target.value })
                  }
                  className="h-9 rounded-xl text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-slate-900">
                  {data.kapasitas}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <IconLicense className="h-3 w-3" /> {t(locale, "platNomor")}
              </label>
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
                <p className="text-sm font-medium font-mono text-slate-900">
                  {data.platNomor}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <IconPlugConnected className="h-3 w-3" />{" "}
                {t(locale, "tipeKonektor")}
              </label>
              {isEditing ? (
                <select
                  value={data.tipeKonektor}
                  onChange={(e) =>
                    setData({ ...data, tipeKonektor: e.target.value })
                  }
                  className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="CCS2">CCS2</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="AC Type 2">AC Type 2</option>
                </select>
              ) : (
                <Badge
                  variant="outline"
                  className="border-emerald-300 text-emerald-600 bg-emerald-50/50"
                >
                  {data.tipeKonektor}
                </Badge>
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
          <CardTitle className="text-base tracking-tight">
            {t(locale, "pengaturanAkun")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <IconBell className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {t(locale, "notifikasiEmail")}
                </p>
                <p className="text-xs text-slate-400">
                  {t(locale, "notifikasiEmailDesc")}
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <IconLock className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {t(locale, "autentikasiDuaFaktor")}
                </p>
                <p className="text-xs text-slate-400">
                  {t(locale, "autentikasiDuaFaktorDesc")}
                </p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <IconLanguage className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {t(locale, "bahasa")}
                </p>
                <p className="text-xs text-slate-400">
                  {locale === "id" ? "Bahasa Indonesia" : "English"}
                </p>
              </div>
            </div>
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="h-9 px-4 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-xl text-sm font-medium text-slate-700 hover:bg-white hover:border-slate-300 transition-all duration-200 flex items-center gap-2"
              >
                <IconLanguage className="h-4 w-4 text-slate-400" />
                {locale.toUpperCase()}
                <svg
                  className={`h-3 w-3 text-slate-400 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setLocale("id");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${locale === "id" ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    onClick={() => {
                      setLocale("en");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${locale === "en" ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
