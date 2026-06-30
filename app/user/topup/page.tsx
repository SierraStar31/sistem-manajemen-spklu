"use client";

import { useState, useEffect } from "react";
import {
  IconCoin,
  IconCheck,
  IconCreditCard,
  IconQrcode,
  IconBuildingBank,
  IconWallet,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { useLanguage } from "@/app/providers";
import { t } from "@/lib/i18n";

const presetAmounts = [20000, 50000, 100000, 200000, 500000, 1000000];

const paymentMethods = [
  {
    id: "qris",
    labelKey: "qris" as const,
    icon: IconQrcode,
    desc: "Scan QRIS dari semua bank & e-wallet",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "transfer",
    labelKey: "transferBank" as const,
    icon: IconBuildingBank,
    desc: "BCA, Mandiri, BNI, BRI",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    id: "ewallet",
    labelKey: "ewallet" as const,
    icon: IconWallet,
    desc: "GoPay, OVO, Dana, ShopeePay",
    color: "from-violet-400 to-violet-600",
  },
];

const bankOptions = [
  { id: "bca", labelKey: "bankBca" as const },
  { id: "mandiri", labelKey: "bankMandiri" as const },
  { id: "bni", labelKey: "bankBni" as const },
  { id: "bri", labelKey: "bankBri" as const },
];

const ewalletOptions = [
  { id: "gopay", labelKey: "gopay" as const },
  { id: "ovo", labelKey: "ovo" as const },
  { id: "dana", labelKey: "dana" as const },
  { id: "shopeepay", labelKey: "shopeepay" as const },
];

export default function TopupPage() {
  const { locale } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedSubMethod, setSelectedSubMethod] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentSaldo, setCurrentSaldo] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("neoncharge_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentSaldo(parsed.saldo ?? 250000);
    }
  }, []);

  const getAmount = (): number => {
    if (selectedPreset) return selectedPreset;
    const parsed = parseInt(customAmount.replace(/\D/g, ""), 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleTopup = () => {
    const amount = getAmount();
    if (amount < 20000) {
      setError(t(locale, "nominalMinimal"));
      return;
    }
    if (!selectedMethod) {
      setError("Pilih metode pembayaran");
      return;
    }

    const newSaldo = currentSaldo + amount;
    setCurrentSaldo(newSaldo);

    const stored = localStorage.getItem("neoncharge_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem("neoncharge_user", JSON.stringify({ ...parsed, saldo: newSaldo }));
      window.dispatchEvent(new Event("neoncharge_profile_updated"));
    }

    setShowSuccess(true);
    setSelectedPreset(null);
    setCustomAmount("");
    setSelectedMethod("");
    setSelectedSubMethod("");
    setError("");
  };

  const formatCurrency = (val: number) =>
    `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {t(locale, "topupSaldo")}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {t(locale, "topupDesc")}
        </p>
      </div>

      {/* Current Balance */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <IconCoin className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{t(locale, "saldo")}</p>
              <p className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                {formatCurrency(currentSaldo)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preset Amounts */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <IconCoin className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-base tracking-tight">
            {t(locale, "pilihNominal")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedPreset(amount);
                  setCustomAmount("");
                  setError("");
                }}
                className={`rounded-2xl border-2 p-4 text-center transition-all duration-300 ${
                  selectedPreset === amount
                    ? "border-emerald-500 bg-emerald-50/80 shadow-lg shadow-emerald-200/50 scale-[1.02]"
                    : "border-slate-200/80 bg-white/60 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(amount)}
                </p>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">{t(locale, "inputManual")}</p>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">Rp</span>
              <Input
                type="text"
                inputMode="numeric"
                value={customAmount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setCustomAmount(raw ? parseInt(raw).toLocaleString("id-ID") : "");
                  setSelectedPreset(null);
                  setError("");
                }}
                placeholder="0"
                className="h-11 rounded-2xl border-slate-200/80 bg-white/80 pl-12 text-sm font-semibold"
              />
            </div>
            <p className="text-xs text-slate-400">{t(locale, "nominalMinimal")}</p>
          </div>

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <IconAlertCircle className="h-3 w-3" /> {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <IconCreditCard className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-base tracking-tight">
            {t(locale, "metodePembayaran")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id}>
              <button
                onClick={() => {
                  setSelectedMethod(method.id);
                  setSelectedSubMethod("");
                  setError("");
                }}
                className={`flex items-center gap-4 w-full rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                  selectedMethod === method.id
                    ? "border-emerald-500 bg-emerald-50/80 shadow-lg shadow-emerald-200/50"
                    : "border-slate-200/80 bg-white/60 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${method.color} shadow-lg flex-shrink-0`}>
                  <method.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{t(locale, method.labelKey)}</p>
                  <p className="text-xs text-slate-400">{method.desc}</p>
                </div>
                {selectedMethod === method.id && (
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <IconCheck className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </button>

              {/* Sub-methods */}
              {selectedMethod === method.id && (
                <div className="mt-3 ml-4 grid grid-cols-2 gap-2">
                  {(method.id === "transfer" ? bankOptions : method.id === "ewallet" ? ewalletOptions : []).map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubMethod(sub.id)}
                      className={`rounded-xl border-2 p-3 text-left text-sm font-medium transition-all duration-200 ${
                        selectedSubMethod === sub.id
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                          : "border-slate-200/80 bg-white/60 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {t(locale, sub.labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        onClick={handleTopup}
        disabled={getAmount() < 20000 || !selectedMethod}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40 disabled:opacity-50 disabled:hover:scale-100"
      >
        {t(locale, "prosesTopup")} {getAmount() >= 20000 ? formatCurrency(getAmount()) : ""}
      </Button>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md rounded-[1.5rem] border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg tracking-tight">{t(locale, "konfirmasi")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/25">
              <IconCheck className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-slate-900">{t(locale, "saldoBerhasil")}</p>
              <p className="text-sm text-slate-400">Saldo baru: <span className="font-semibold text-emerald-600">{formatCurrency(currentSaldo)}</span></p>
            </div>
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg"
            >
              {t(locale, "konfirmasi")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
