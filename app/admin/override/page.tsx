"use client";

import { useState, useEffect, useRef } from "react";
import { IconTool } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";

interface Station {
  id: string;
  location: string;
  connectorType: string;
  status: "Aktif" | "Maintenance" | "Offline";
}

interface Machine {
  id: string;
  name: string;
  location: string;
  connectorType: string;
  isOn: boolean;
}

const defaultStations: Station[] = [
  { id: "SPK-001", location: "BSB Center, Balikpapan", connectorType: "CCS2", status: "Aktif" },
  { id: "SPK-002", location: "RBS Plaza, Balikpapan", connectorType: "CHAdeMO", status: "Aktif" },
  { id: "SPK-003", location: "Balikpapan Superblock", connectorType: "AC Type 2", status: "Maintenance" },
  { id: "SPK-004", location: "Terminal Klandasan", connectorType: "CCS2", status: "Aktif" },
  { id: "SPK-005", location: "E-Walk Balikpapan", connectorType: "CCS2", status: "Offline" },
];

function getStations(): Station[] {
  if (typeof window === "undefined") return defaultStations;
  const stored = localStorage.getItem("neoncharge_stations");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return defaultStations;
}

function getStoredMachines(): Machine[] | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("neoncharge_machines_override");
  if (stored) {
    try { return JSON.parse(stored); } catch { return null; }
  }
  return null;
}

function syncMachinesFromStations(stations: Station[], existingMachines: Machine[] | null): Machine[] {
  const machineMap = new Map<string, Machine>();
  if (existingMachines) {
    existingMachines.forEach((m) => machineMap.set(m.id, m));
  }

  return stations.map((station) => {
    const shortLoc = station.location.split(",")[0];
    const existing = machineMap.get(station.id);
    return {
      id: station.id,
      name: `Mesin ${station.connectorType} #${stations.indexOf(station) + 1}`,
      location: shortLoc,
      connectorType: station.connectorType,
      isOn: existing ? existing.isOn : station.status === "Aktif",
    };
  });
}

function syncStationStatus(stationId: string, isOn: boolean) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("neoncharge_stations");
  if (!stored) return;
  try {
    const stations = JSON.parse(stored);
    if (!Array.isArray(stations)) return;
    const updated = stations.map((s: Station) => {
      if (s.id === stationId) {
        if (!isOn) return { ...s, status: "Offline" as const };
        if (s.status === "Offline" || s.status === "Maintenance") return { ...s, status: "Aktif" as const };
      }
      return s;
    });
    localStorage.setItem("neoncharge_stations", JSON.stringify(updated));
    window.dispatchEvent(new Event("neoncharge_stations_updated"));
  } catch {}
}

export default function OverridePage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const stations = getStations();
      const existing = getStoredMachines();
      setMachines(syncMachinesFromStations(stations, existing));
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (initialized.current && machines.length > 0) {
      localStorage.setItem("neoncharge_machines_override", JSON.stringify(machines));
    }
  }, [machines]);

  const toggleMachine = (id: string) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newIsOn = !m.isOn;
        syncStationStatus(id, newIsOn);
        return { ...m, isOn: newIsOn };
      })
    );
  };

  const forceStop = (id: string) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        syncStationStatus(id, false);
        return { ...m, isOn: false };
      })
    );
  };

  return (
    <>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Manual Override</h1>
        <p className="mt-1 text-sm text-slate-400">Kontrol langsung status mesin SPKLU. Mesin otomatis mengikuti data stasiun.</p>
      </div>

      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <IconTool className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base tracking-tight">Panel Kendali Mesin</CardTitle>
            <p className="text-xs text-slate-400">{machines.length} mesin terdaftar</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {machines.map((machine) => (
              <Card key={machine.id} className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] transition-all duration-[400ms] hover:-translate-y-1">
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-slate-900">{machine.name}</p>
                    <p className="text-xs text-slate-400">{machine.location} &middot; {machine.connectorType}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Status:{" "}
                      <span className={machine.isOn ? "font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent" : "font-medium text-slate-400"}>
                        {machine.isOn ? "Nyala" : "Mati"}
                      </span>
                    </span>
                    <Switch
                      checked={machine.isOn}
                      onCheckedChange={() => toggleMachine(machine.id)}
                    />
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => forceStop(machine.id)}
                  >
                    Force Stop
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
