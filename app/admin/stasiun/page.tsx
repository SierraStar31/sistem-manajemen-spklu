"use client";

import { useState, useEffect, useRef } from "react";
import {
  IconBuilding,
  IconEdit,
  IconTrash,
  IconPlus,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";

interface Station {
  id: string;
  location: string;
  connectorType: string;
  status: "Aktif" | "Maintenance" | "Offline";
}

const initialStations: Station[] = [
  { id: "SPK-001", location: "BSB Center, Balikpapan", connectorType: "CCS2", status: "Aktif" },
  { id: "SPK-002", location: "RBS Plaza, Balikpapan", connectorType: "CHAdeMO", status: "Aktif" },
  { id: "SPK-003", location: "Balikpapan Superblock", connectorType: "AC Type 2", status: "Maintenance" },
  { id: "SPK-004", location: "Terminal Klandasan", connectorType: "CCS2", status: "Aktif" },
  { id: "SPK-005", location: "E-Walk Balikpapan", connectorType: "CCS2", status: "Offline" },
];

const connectorTypes = ["CCS2", "CHAdeMO", "AC Type 2"];
const statusOptions: Station["status"][] = ["Aktif", "Maintenance", "Offline"];

function getStoredStations(): Station[] | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("neoncharge_stations");
  if (stored) {
    try { return JSON.parse(stored); } catch { return null; }
  }
  return null;
}

const statusStyles: Record<string, string> = {
  Aktif: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Maintenance: "bg-amber-100 text-amber-700 border-amber-200",
  Offline: "bg-red-100 text-red-700 border-red-200",
};

const emptyForm = { id: "", location: "", connectorType: "CCS2", status: "Aktif" as Station["status"] };

export default function StasiunPage() {
  const [stations, setStations] = useState<Station[]>(initialStations);
  const initialized = useRef(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [deletingStation, setDeletingStation] = useState<Station | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!initialized.current) {
      const stored = getStoredStations();
      if (stored && stored.length > 0) setStations(stored);
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (initialized.current) {
      localStorage.setItem("neoncharge_stations", JSON.stringify(stations));
    }
  }, [stations]);

  const openAdd = () => {
    setEditingStation(null);
    setForm({ ...emptyForm, id: `SPK-${String(stations.length + 1).padStart(3, "0")}` });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEdit = (station: Station) => {
    setEditingStation(station);
    setForm({ ...station });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openDelete = (station: Station) => {
    setDeletingStation(station);
    setIsDeleteOpen(true);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.id.trim()) errors.id = "ID wajib diisi";
    if (!form.location.trim()) errors.location = "Lokasi wajib diisi";
    if (editingStation) {
      if (stations.find((s) => s.id === form.id && s.id !== editingStation.id)) errors.id = "ID sudah digunakan";
    } else {
      if (stations.find((s) => s.id === form.id)) errors.id = "ID sudah digunakan";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingStation) {
      setStations((prev) => prev.map((s) => s.id === editingStation.id ? { id: form.id, location: form.location, connectorType: form.connectorType, status: form.status } : s));
    } else {
      setStations((prev) => [...prev, { id: form.id, location: form.location, connectorType: form.connectorType, status: form.status }]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (!deletingStation) return;
    setStations((prev) => prev.filter((s) => s.id !== deletingStation.id));
    setIsDeleteOpen(false);
    setDeletingStation(null);
  };

  return (
    <>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Manajemen Stasiun</h1>
        <p className="mt-1 text-sm text-slate-400">Kelola data stasiun pengisian daya.</p>
      </div>

      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <IconBuilding className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base tracking-tight">Daftar Stasiun</CardTitle>
          </div>
          <Button onClick={openAdd} className="h-9 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40">
            <IconPlus className="h-4 w-4 mr-1.5" /> Tambah Stasiun
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/60">
                  <TableHead className="text-slate-500">ID Stasiun</TableHead>
                  <TableHead className="text-slate-500">Nama / Lokasi</TableHead>
                  <TableHead className="text-slate-500">Tipe Konektor</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                  <TableHead className="text-right text-slate-500">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-sm text-slate-400">Belum ada data stasiun.</TableCell>
                  </TableRow>
                ) : stations.map((station) => (
                  <TableRow key={station.id} className="border-slate-200/40">
                    <TableCell className="font-mono font-medium whitespace-nowrap text-sm">{station.id}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{station.location}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{station.connectorType}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[station.status]}`}>{station.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(station)} className="rounded-xl p-2 text-slate-400 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600">
                          <IconEdit className="h-4 w-4" />
                        </button>
                        <button onClick={() => openDelete(station)} className="rounded-xl p-2 text-slate-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500">
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">{editingStation ? "Edit Stasiun" : "Tambah Stasiun Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">ID Stasiun <span className="text-red-500">*</span></label>
              <Input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value.toUpperCase() })} placeholder="SPK-001" disabled={!!editingStation} className={`h-10 rounded-xl border-slate-200/80 bg-white/80 font-mono text-sm ${formErrors.id ? "border-red-400" : ""} ${editingStation ? "opacity-60" : ""}`} />
              {formErrors.id && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {formErrors.id}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nama / Lokasi <span className="text-red-500">*</span></label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="BSB Center, Balikpapan" className={`h-10 rounded-xl border-slate-200/80 bg-white/80 text-sm ${formErrors.location ? "border-red-400" : ""}`} />
              {formErrors.location && <p className="text-xs text-red-500 flex items-center gap-1"><IconAlertCircle className="h-3 w-3" /> {formErrors.location}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Tipe Konektor <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                {connectorTypes.map((type) => (
                  <button key={type} onClick={() => setForm({ ...form, connectorType: type })} className={`flex-1 h-10 rounded-xl border text-sm font-medium transition-all duration-200 ${form.connectorType === type ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm" : "border-slate-200 bg-white/80 text-slate-500 hover:border-slate-300"}`}>{type}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <div className="flex gap-2">
                {statusOptions.map((status) => (
                  <button key={status} onClick={() => setForm({ ...form, status })} className={`flex-1 h-10 rounded-xl border text-sm font-medium transition-all duration-200 ${form.status === status ? (status === "Aktif" ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm" : status === "Maintenance" ? "border-amber-400 bg-amber-50 text-amber-700 shadow-sm" : "border-red-400 bg-red-50 text-red-700 shadow-sm") : "border-slate-200 bg-white/80 text-slate-500 hover:border-slate-300"}`}>{status}</button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">Batal</Button>
            <Button onClick={handleSave} className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 border border-emerald-400/40">{editingStation ? "Simpan Perubahan" : "Tambah Stasiun"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Hapus Stasiun</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">Apakah Anda yakin ingin menghapus stasiun <span className="font-semibold text-slate-700">{deletingStation?.location}</span> (<span className="font-mono text-xs">{deletingStation?.id}</span>)? Tindakan ini tidak dapat dibatalkan.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">Batal</Button>
            <Button onClick={handleDelete} className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/20"><IconTrash className="h-4 w-4 mr-1.5" /> Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
