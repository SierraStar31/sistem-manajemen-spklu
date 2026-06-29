/**
 * Data Layer - Abstraction for data access
 * 
 * Saat ini menggunakan localStorage.
 * Untuk migrasi ke backend/database:
 * 1. Ganti fungsi di bawah dengan fetch/API calls
 * 2. Interface tetap sama, tidak perlu ubah komponen
 */

export interface Transaction {
  id: string;
  date: string;
  rawDate: string;
  station: string;
  user: string;
  kwh: number;
  price: string;
  rawPrice: number;
  status: "Selesai" | "Proses" | "Dibatalkan";
}

export interface Station {
  id: string;
  location: string;
  connectorType: string;
  status: "Aktif" | "Maintenance" | "Offline";
}

export interface TransactionFilter {
  status?: string;
  month?: string;
  year?: string;
  date?: string;
  station?: string;
}

// ===== Transactions =====

const STORAGE_KEY_TX = "neoncharge_transactions";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY_TX);
  if (stored) {
    try { return JSON.parse(stored); } catch { return []; }
  }
  return [];
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
}

export function addTransaction(tx: Transaction): void {
  const all = getTransactions();
  all.push(tx);
  saveTransactions(all);
}

export function filterTransactions(transactions: Transaction[], filter: TransactionFilter): Transaction[] {
  return transactions.filter((t) => {
    if (filter.status && filter.status !== "Semua" && t.status !== filter.status) return false;
    if (filter.date && !t.rawDate.startsWith(filter.date)) return false;
    if (filter.month) {
      const txMonth = t.rawDate.split("-")[1];
      if (txMonth !== filter.month) return false;
    }
    if (filter.year) {
      const txYear = t.rawDate.split("-")[0];
      if (txYear !== filter.year) return false;
    }
    if (filter.station && t.station !== filter.station) return false;
    return true;
  });
}

// ===== Stations =====

const STORAGE_KEY_STATIONS = "neoncharge_stations";

const defaultStations: Station[] = [
  { id: "SPK-001", location: "BSB Center, Balikpapan", connectorType: "CCS2", status: "Aktif" },
  { id: "SPK-002", location: "RBS Plaza, Balikpapan", connectorType: "CHAdeMO", status: "Aktif" },
  { id: "SPK-003", location: "Balikpapan Superblock", connectorType: "AC Type 2", status: "Maintenance" },
  { id: "SPK-004", location: "Terminal Klandasan", connectorType: "CCS2", status: "Aktif" },
  { id: "SPK-005", location: "E-Walk Balikpapan", connectorType: "CCS2", status: "Offline" },
];

export function getStations(): Station[] {
  if (typeof window === "undefined") return defaultStations;
  const stored = localStorage.getItem(STORAGE_KEY_STATIONS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return defaultStations;
}

export function saveStations(stations: Station[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_STATIONS, JSON.stringify(stations));
}

// ===== Summary Helpers =====

export function getTransactionSummary(transactions: Transaction[]) {
  const selesai = transactions.filter((t) => t.status === "Selesai");
  return {
    totalTransactions: transactions.length,
    totalRevenue: selesai.reduce((sum, t) => sum + t.rawPrice, 0),
    totalKwh: selesai.reduce((sum, t) => sum + t.kwh, 0),
    avgPerTransaction: selesai.length > 0
      ? selesai.reduce((sum, t) => sum + t.rawPrice, 0) / selesai.length
      : 0,
  };
}

// ===== Future Backend Migration =====
// 
// Untuk migrasi ke backend, ganti fungsi di atas dengan:
//
// export async function getTransactions(): Promise<Transaction[]> {
//   const res = await fetch('/api/transactions');
//   return res.json();
// }
//
// export async function addTransaction(tx: Transaction): Promise<void> {
//   await fetch('/api/transactions', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(tx),
//   });
// }
//
// export async function getStations(): Promise<Station[]> {
//   const res = await fetch('/api/stations');
//   return res.json();
// }
