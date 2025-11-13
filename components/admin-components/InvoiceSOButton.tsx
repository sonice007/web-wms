"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { 
  BarangKeluar, 
  // BarangKeluarDetail, // Tipe ini sudah terkeluar dalam BarangKeluar
  // BarangKeluarApiResponse // Tipe ini ditangani oleh hook RTK Query
} from "@/types/admin/transaksi/barang-keluar";

import {
  useGetBarangKeluarByIdQuery
} from "@/services/admin/transaksi/barang-keluar.service";
import Swal from "sweetalert2";

// --- DUMMY HOOK (SEKARANG DIHAPUS) ---
// ...
// --- AKHIR DUMMY HOOK ---


// Fungsi helper untuk format mata uang
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Fungsi helper untuk format tanggal
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Fungsi untuk generate PDF
// (data: BarangKeluar) -> Asumsi tipe BarangKeluar Anda sudah benar
// sesuai API (memiliki 'warehouse: object' dan 'details: array')
const generatePDF = (data: BarangKeluar) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageMargin = 15;
  const contentWidth = pageWidth - pageMargin * 2;
  let cursorY = 20;

  // 1. Header Utama
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text("PURCHASE ORDER", pageWidth / 2, cursorY, { align: "center" });
  cursorY += 10;

  // 2. Info Referensi SO
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(data.reference, pageWidth / 2, cursorY, { align: "center" });
  cursorY += 15;

  // 3. Kolom Info (Perusahaan & Supplier)
  const infoStartY = cursorY;
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);

  // Info Kiri (Supplier)
  doc.setFont("helvetica", "bold");
  doc.text("Partner:", pageMargin, cursorY);
  cursorY += 5;
  doc.setFont("helvetica", "normal");
  doc.text(data.partner || "N/A", pageMargin, cursorY);

  // Info Kanan (Info SO)
  cursorY = infoStartY; // Reset Y ke posisi awal
  const rightColX = pageWidth - pageMargin - (contentWidth / 3);
  
  doc.setFont("helvetica", "bold");
  doc.text("Tanggal SO:", rightColX, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(data.date), rightColX + 35, cursorY); // +35 untuk alignment
  cursorY += 5;

  doc.setFont("helvetica", "bold");
  doc.text("Gudang:", rightColX, cursorY);
  doc.setFont("helvetica", "normal");
  // --- DIPERBAIKI ---
  // Mengambil nama dari 'data.warehouse.name' bukan 'data.warehouse_name'
  doc.text(data?.warehouse?.name || "N/A", rightColX + 35, cursorY);
  cursorY += 15; // Spasi sebelum tabel

  // 4. Tabel Item
  const tableBody = data.details.map((item, index) => [
    index + 1,
    // --- DIPERBAIKI ---
    // API Anda mengirim 'description: null'. Kode ini sudah benar
    // karena akan otomatis fallback ke "Produk ID: ..."
    item.description || `Produk ID: ${item.product_id}`,
    item.quantity,
    formatCurrency(item.price),
    formatCurrency(item.total),
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [["No", "Deskripsi Barang", "Jumlah", "Harga Satuan", "Total"]],
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: [41, 128, 185], // Warna biru tua
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      cellPadding: 3,
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' },
      4: { cellWidth: 40, halign: 'right' },
    },
    didDrawPage: (hookData) => {
      // Update cursorY jika tabel berlanjut ke halaman baru
      if (hookData.cursor) {
        cursorY = hookData.cursor.y;
      }
    }
  });

  cursorY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY
    ? (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable!.finalY + 10
    : cursorY + 10; // Ambil Y setelah tabel

  // 5. Kalkulasi Total
  const totalColX = pageWidth - pageMargin - 60; // 60 = lebar kolom nilai
  
  doc.setFontSize(10);
  
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", totalColX, cursorY, { align: "right" });
  doc.text(formatCurrency(data.subtotal), pageWidth - pageMargin, cursorY, { align: "right" });
  cursorY += 6;

  doc.text("Diskon:", totalColX, cursorY, { align: "right" });
  doc.text(formatCurrency(data.discount), pageWidth - pageMargin, cursorY, { align: "right" });
  cursorY += 6;

  doc.text("Pajak (Tax):", totalColX, cursorY, { align: "right" });
  doc.text(formatCurrency(data.tax), pageWidth - pageMargin, cursorY, { align: "right" });
  cursorY += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("GRAND TOTAL:", totalColX, cursorY, { align: "right" });
  doc.text(formatCurrency(data.total), pageWidth - pageMargin, cursorY, { align: "right" });
  cursorY += 15;

  // 6. Notes / Keterangan
  if (data.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Catatan:", pageMargin, cursorY);
    cursorY += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const splitNotes = doc.splitTextToSize(data.notes, contentWidth);
    doc.text(splitNotes, pageMargin, cursorY);
  }

  // 7. Simpan file
  doc.save(`SO_${data.reference}.pdf`);
};

// Komponen Tombol
interface InvoiceSOButtonProps {
  itemId: number;
}

export function InvoiceSOButton({ itemId }: InvoiceSOButtonProps) {
  // --- DIPERBAIKI ---
  // Menggunakan hook query yang asli dari RTK Query
  const { data, isLoading, refetch } = useGetBarangKeluarByIdQuery(itemId);

  const handleDownload = async () => {
    try {
      // Pastikan data sudah tersedia
      if (!data) {
        await refetch();
      }
      if (!data) {
        throw new Error("Data tidak ditemukan.");
      }

      // Generate PDF
      generatePDF(data);

    } catch (error: unknown) {
      console.error("Error generating PDF:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        (error as Error)?.message ||
        "Gagal membuat PDF";
      Swal.fire("Gagal", errorMessage, "error");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDownload}
      disabled={isLoading}
      title="Download Invoice SO"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileText className="w-4 h-4" />
      )}
    </Button>
  );
}