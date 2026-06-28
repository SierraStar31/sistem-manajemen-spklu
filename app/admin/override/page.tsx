"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IconTool } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";

interface Machine {
  id: string;
  name: string;
  location: string;
  isOn: boolean;
}

const fetchMachines = async (): Promise<Machine[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { id: "MES-001", name: "Mesin CCS2 #1", location: "BSB Center", isOn: true },
    { id: "MES-002", name: "Mesin CHAdeMO #1", location: "RBS Plaza", isOn: true },
    { id: "MES-003", name: "Mesin AC Type 2 #1", location: "Balikpapan Superblock", isOn: false },
  ];
};

export default function OverridePage() {
  const [machines, setMachines] = useState<Machine[]>([]);

  const { isLoading } = useQuery({
    queryKey: ["machines"],
    queryFn: async () => {
      const data = await fetchMachines();
      setMachines(data);
      return data;
    },
  });

  const toggleMachine = (id: string) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isOn: !m.isOn } : m))
    );
  };

  const forceStop = (id: string) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isOn: false } : m))
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manual Override</h1>
        <p className="mt-1 text-sm text-slate-400">Kontrol langsung status mesin SPKLU.</p>
      </div>

      <Card className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <IconTool className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-base tracking-tight">Panel Kendali Mesin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-3">
            {machines.map((machine) => (
              <Card key={machine.id} className="border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] transition-all duration-[400ms] hover:-translate-y-1">
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-slate-900">{machine.name}</p>
                    <p className="text-xs text-slate-400">{machine.location}</p>
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
