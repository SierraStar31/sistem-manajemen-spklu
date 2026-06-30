import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface StationRevenue {
  location: string;
  connectorType: string;
  totalTransactions: number;
  totalKwh: number;
  totalRevenue: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  kwh: number;
}

interface Transaction {
  id: string;
  date: string;
  station: string;
  user: string;
  kwh: number;
  price: string;
  rawPrice: number;
  status: string;
}

function formatCurrency(val: number): string {
  return `Rp ${val.toLocaleString("id-ID")}`;
}

function addHeader(doc: jsPDF, title: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("NeonCharge", 20, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Sistem Manajemen SPKLU", 20, 26);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, pageWidth - 20, 18, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, pageWidth - 20, 26, { align: "right" });

  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.line(20, 44, pageWidth - 20, 44);
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`NeonCharge - Laporan Operasional`, 20, pageHeight - 10);
    doc.text(`Halaman ${i} dari ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: "right" });
  }
}

export function generateLaporanKeuangan(stationData: StationRevenue[], monthlyData: MonthlyData[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  addHeader(doc, "Laporan Keuangan");

  let y = 54;

  const totalRevenue = stationData.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalTransactions = stationData.reduce((sum, s) => sum + s.totalTransactions, 0);
  const totalKwh = stationData.reduce((sum, s) => sum + s.totalKwh, 0);
  const avgPerTx = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Ringkasan Pendapatan", 20, y);
  y += 10;

  const summaryData = [
    ["Total Pendapatan", formatCurrency(totalRevenue)],
    ["Total Transaksi", `${totalTransactions}`],
    ["Total Energi Terjual", `${totalKwh.toLocaleString("id-ID")} kWh`],
    ["Rata-rata per Transaksi", formatCurrency(avgPerTx)],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Metrik", "Nilai"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 60 }, 1: { halign: "right" } },
    margin: { left: 20, right: 20 },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Pendapatan per Stasiun", 20, y);
  y += 2;

  const stationTableData = stationData.map((s) => [
    s.location,
    s.connectorType,
    `${s.totalTransactions}`,
    `${s.totalKwh.toLocaleString("id-ID")}`,
    formatCurrency(s.totalRevenue),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Stasiun", "Konektor", "Transaksi", "kWh", "Pendapatan"]],
    body: stationTableData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: { 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right", fontStyle: "bold" } },
    margin: { left: 20, right: 20 },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Pendapatan Bulanan", 20, y);
  y += 2;

  const monthlyTableData = monthlyData.map((m) => [
    m.month,
    `${m.kwh.toLocaleString("id-ID")} kWh`,
    formatCurrency(m.revenue),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Bulan", "Energi", "Pendapatan"]],
    body: monthlyTableData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right", fontStyle: "bold" } },
    margin: { left: 20, right: 20 },
  });

  addFooter(doc);
  doc.save("NeonCharge-Laporan-Keuangan.pdf");
}

export function generateRiwayatTransaksi(transactions: Transaction[]) {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();

  addHeader(doc, "Riwayat Transaksi");

  let y = 54;

  const totalSelesai = transactions.filter((t) => t.status === "Selesai").reduce((sum, t) => sum + t.rawPrice, 0);
  const totalKwh = transactions.filter((t) => t.status === "Selesai").reduce((sum, t) => sum + t.kwh, 0);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Total: ${transactions.length} transaksi | ${totalKwh.toLocaleString("id-ID")} kWh | ${formatCurrency(totalSelesai)}`, 20, y);
  y += 8;

  const tableData = transactions.map((tx) => [
    tx.id,
    tx.date,
    tx.station,
    tx.user,
    tx.status === "Dibatalkan" ? "-" : `${tx.kwh}`,
    tx.status === "Dibatalkan" ? "-" : tx.price,
    tx.status,
  ]);

  autoTable(doc, {
    startY: y,
    head: [["ID", "Waktu", "Stasiun", "User", "kWh", "Harga", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 42 },
      4: { halign: "right" },
      5: { halign: "right", fontStyle: "bold" },
      6: { cellWidth: 28 },
    },
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 6) {
        const val = data.cell.raw as string;
        if (val === "Selesai") {
          data.cell.styles.textColor = [16, 125, 82];
          data.cell.styles.fontStyle = "bold";
        } else if (val === "Dibatalkan") {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        } else if (val === "Proses") {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
    margin: { left: 20, right: 20 },
  });

  addFooter(doc);
  doc.save("NeonCharge-Riwayat-Transaksi.pdf");
}

interface UserTransaction {
  id: string;
  date: string;
  rawDate?: string;
  location?: string;
  station?: string;
  user: string;
  kwh: number;
  price: string;
  rawPrice?: number;
  status: string;
}

export function generateStrukPembayaran(transactions: UserTransaction[], userName: string) {
  const doc = new jsPDF({ orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();

  addHeader(doc, "Struk Pembayaran");

  let y = 54;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Pengguna: ${userName}`, 20, y);
  y += 6;
  doc.text(`Total: ${transactions.length} transaksi`, 20, y);
  y += 12;

  const completed = transactions.filter((t) => t.status === "Selesai");
  const totalRevenue = completed.reduce((sum, t) => sum + (t.rawPrice ?? (parseInt(t.price.replace(/\D/g, ""), 10) || 0)), 0);
  const totalKwh = completed.reduce((sum, t) => sum + t.kwh, 0);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Ringkasan Pembayaran", 20, y);
  y += 10;

  const summaryData = [
    ["Total Pembayaran", formatCurrency(totalRevenue)],
    ["Total Energi", `${totalKwh.toLocaleString("id-ID")} kWh`],
    ["Transaksi Selesai", `${completed.length}`],
    ["Rata-rata per Transaksi", completed.length > 0 ? formatCurrency(Math.round(totalRevenue / completed.length)) : "-"],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Metrik", "Nilai"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 60 }, 1: { halign: "right" } },
    margin: { left: 20, right: 20 },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Detail Transaksi", 20, y);
  y += 2;

  const tableData = transactions.map((tx) => [
    tx.id,
    tx.date,
    tx.station || tx.location || "-",
    tx.status === "Dibatalkan" ? "-" : `${tx.kwh}`,
    tx.status === "Dibatalkan" ? "-" : tx.price,
    tx.status,
  ]);

  autoTable(doc, {
    startY: y,
    head: [["ID", "Waktu", "Stasiun", "kWh", "Harga", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 42 },
      3: { halign: "right" },
      4: { halign: "right", fontStyle: "bold" },
      5: { cellWidth: 28 },
    },
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 5) {
        const val = data.cell.raw as string;
        if (val === "Selesai") {
          data.cell.styles.textColor = [16, 125, 82];
          data.cell.styles.fontStyle = "bold";
        } else if (val === "Dibatalkan") {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        } else if (val === "Proses") {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
    margin: { left: 20, right: 20 },
  });

  addFooter(doc);
  doc.save(`NeonCharge-Struk-${userName.replace(/\s+/g, "-")}.pdf`);
}