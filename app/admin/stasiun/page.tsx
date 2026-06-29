"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IconBuilding, IconEdit, IconTrash } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

interface Station {
  id: string;
  location: string;
  connectorType: string;
  status: "Aktif" | "Maintenance" | "Offline";
}

const fetchStations = async (): Promise<Station[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { id: "SPK-001", location: "BSB Center, Balikpapan", connectorType: "CCS2", status: "Aktif" },
    { id: "SPK-002", location: "RBS Plaza, Balikpapan", connectorType: "CHAdeMO", status: "Aktif" },
    { id: "SPK-003", location: "Balikpapan Superblock", connectorType: "AC Type 2", status: "Maintenance" },
    { id: "SPK-004", location: "Terminal Klandasan", connectorType: "CCS2", status: "Aktif" },
    { id: "SPK-005", location: "E-Walk Balikpapan", connectorType: "CCS2", status: "Offline" },
  ];
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Aktif: "default",
  Maintenance: "secondary",
  Offline: "destructive",
};

export default function StasiunPage() {
  const { data: stations, isLoading } = useQuery({
    queryKey: ["stations"],
    queryFn: fetchStations,
  });

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
          <Button className="h-9 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40">
            + Tambah Stasiun
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200/60">
                    <TableHead className="text-slate-500">ID Stasiun</TableHead>
                    <TableHead className="text-slate-500">Lokasi</TableHead>
                    <TableHead className="text-slate-500">Tipe Konektor</TableHead>
                    <TableHead className="text-slate-500">Status</TableHead>
                    <TableHead className="text-right text-slate-500">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stations?.map((station) => (
                    <TableRow key={station.id} className="border-slate-200/40">
                      <TableCell className="font-mono font-medium whitespace-nowrap">{station.id}</TableCell>
                      <TableCell className="whitespace-nowrap">{station.location}</TableCell>
                      <TableCell className="whitespace-nowrap">{station.connectorType}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[station.status]}>{station.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="rounded-xl p-2 text-slate-400 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600">
                            <IconEdit className="h-4 w-4" />
                          </button>
                          <button className="rounded-xl p-2 text-slate-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500">
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
