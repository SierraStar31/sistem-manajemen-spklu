"use client";

import { useState, useEffect } from "react";
import {
  IconQrcode,
  IconMapPin,
  IconClock,
  IconCalendar,
  IconBolt,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

const stations = [
  { name: "SPKLU BSB Center - CCS2", available: true, power: "150 kW" },
  { name: "SPKLU RBS Plaza - CHAdeMO", available: true, power: "100 kW" },
  { name: "SPKLU Balikpapan Superblock - AC Type 2", available: false, power: "22 kW" },
  { name: "SPKLU Terminal Klandasan - CCS2", available: true, power: "150 kW" },
];

const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "16:00 - 17:00",
];

interface TicketData {
  code: string;
  station: string;
  date: string;
  time: string;
  power: string;
}

export default function ReservasiPage() {
  const [selectedStation, setSelectedStation] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [activeBooking, setActiveBooking] = useState<TicketData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("neoncharge_active_booking");
    if (stored) {
      setActiveBooking(JSON.parse(stored));
    }
  }, []);

  const handleReservation = () => {
    const station = stations[selectedStation];
    const code = `BK-${Date.now().toString(36).toUpperCase()}`;
    const newTicket: TicketData = {
      code,
      station: station.name,
      date: selectedDate || "Hari Ini",
      time: selectedTime,
      power: station.power,
    };
    setTicketData(newTicket);
    setActiveBooking(newTicket);
    localStorage.setItem("neoncharge_active_booking", JSON.stringify(newTicket));
    setShowTicket(true);
  };

  const cancelBooking = () => {
    setActiveBooking(null);
    localStorage.removeItem("neoncharge_active_booking");
  };

  return (
    <>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Reservasi Pengisian Daya</h1>
        <p className="mt-1 text-sm text-slate-400">Pilih stasiun, tanggal, dan waktu untuk reservasi pengisian daya EV Anda.</p>
      </div>

      {/* Station Selection */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <IconMapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base tracking-tight">Pilih Stasiun SPKLU</CardTitle>
            <p className="text-xs text-slate-400">Pilih lokasi pengisian daya yang tersedia</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {stations.map((station, i) => (
              <button
                key={i}
                onClick={() => station.available && setSelectedStation(i)}
                disabled={!station.available}
                className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                  selectedStation === i
                    ? "border-emerald-500 bg-emerald-50/80 shadow-lg shadow-emerald-200/50 scale-[1.02]"
                    : !station.available
                      ? "border-slate-200/40 bg-slate-50/50 opacity-50 cursor-not-allowed"
                      : "border-slate-200/80 bg-white/60 hover:border-slate-300 hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{station.name}</p>
                  <p className="text-xs text-slate-400">Daya: {station.power}</p>
                </div>
                <Badge variant={station.available ? "default" : "destructive"} className="text-xs">
                  {station.available ? "Tersedia" : "Penuh"}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <IconCalendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base tracking-tight">Jadwal Reservasi</CardTitle>
            <p className="text-xs text-slate-400">Atur tanggal dan waktu pengisian daya</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700">
                <IconCalendar className="h-4 w-4 text-emerald-500" />
                Tanggal
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-10 rounded-2xl border-slate-200/80 bg-white/80 backdrop-blur-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700">
                <IconClock className="h-4 w-4 text-emerald-500" />
                Slot Waktu
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="flex h-10 w-full rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50/80 border border-emerald-200/60 p-4">
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <IconBolt className="h-4 w-4" />
              <span>KT 1234 EV &middot; {stations[selectedStation].name.split(" - ")[1]}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
              <IconBolt className="h-4 w-4" />
              {stations[selectedStation].power}
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleReservation}
              disabled={!stations[selectedStation].available}
              className="w-full sm:w-auto h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40 disabled:opacity-50 disabled:hover:scale-100"
            >
              <IconQrcode className="mr-2 h-4.5 w-4.5" />
              Buat Reservasi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active QR Booking — always shown */}
      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <IconQrcode className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base tracking-tight">Reservasi Aktif</CardTitle>
              <p className="text-xs text-slate-400">Tiket booking yang sedang berlaku</p>
            </div>
          </div>
          {activeBooking && (
            <Badge variant="outline" className="border-emerald-300 text-emerald-600 bg-emerald-50/50">Aktif</Badge>
          )}
        </CardHeader>
        <CardContent>
          {activeBooking ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 flex-shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <IconQrcode className="h-12 w-12 text-emerald-500" />
                  <span className="text-[10px] font-mono font-bold text-emerald-600">{activeBooking.code}</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Kode Booking</span>
                  <span className="font-mono font-bold text-slate-900">{activeBooking.code}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Stasiun</span>
                  <span className="text-right font-medium text-slate-900">{activeBooking.station}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tanggal</span>
                  <span className="font-medium text-slate-900">{activeBooking.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Waktu</span>
                  <span className="font-medium text-slate-900">{activeBooking.time}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200/60 pt-2">
                  <span className="text-slate-400">Daya</span>
                  <span className="font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">{activeBooking.power}</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={cancelBooking}
                className="rounded-2xl border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 text-sm font-semibold transition-all duration-300"
              >
                <IconX className="mr-1.5 h-4 w-4" />
                Batalkan
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                <IconQrcode className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">Belum ada reservasi aktif</p>
              <p className="text-xs text-slate-400 mt-1">Buat reservasi terlebih dahulu untuk melihat tiket di sini</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active QR Booking Ticket Dialog */}
      <Dialog open={showTicket} onOpenChange={setShowTicket}>
        <DialogContent className="sm:max-w-md rounded-[1.5rem] border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg tracking-tight">Tiket Reservasi Aktif</DialogTitle>
          </DialogHeader>
          {ticketData && (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="flex flex-col items-center gap-2">
                  <IconQrcode className="h-20 w-20 text-emerald-500" />
                  <span className="text-xs font-mono font-bold text-emerald-600">{ticketData.code}</span>
                </div>
              </div>

              <div className="w-full space-y-2 rounded-2xl bg-slate-50/80 backdrop-blur-xl p-4 border border-slate-200/60">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Kode Booking</span>
                  <span className="font-mono font-bold text-slate-900">{ticketData.code}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Stasiun</span>
                  <span className="text-right font-medium text-slate-900">{ticketData.station}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tanggal</span>
                  <span className="font-medium text-slate-900">{ticketData.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Waktu</span>
                  <span className="font-medium text-slate-900">{ticketData.time}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200/60 pt-2">
                  <span className="text-slate-400">Daya</span>
                  <span className="font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">{ticketData.power}</span>
                </div>
              </div>

              <Button
                onClick={() => setShowTicket(false)}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                Tutup
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
