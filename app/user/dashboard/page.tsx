"use client";

import { useState, useEffect } from "react";
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
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";

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

  const handleSave = () => {
    const stored = localStorage.getItem("neoncharge_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem("neoncharge_user", JSON.stringify({ ...parsed, ...data }));
      window.dispatchEvent(new Event("neoncharge_profile_updated"));
    }
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dasbor Saya</h1>
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
                <Input value={data.telepon} onChange={(e) => setData({ ...data, telepon: e.target.value })} className="h-9 rounded-xl text-sm" />
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
                <Input value={data.model} onChange={(e) => setData({ ...data, model: e.target.value })} className="h-9 rounded-xl text-sm" />
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
                <Input value={data.platNomor} onChange={(e) => setData({ ...data, platNomor: e.target.value })} className="h-9 rounded-xl text-sm font-mono" />
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
