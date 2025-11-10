"use client";

import React from "react";
import { Barang } from "@/types/admin/master/barang";
import { Button } from "@/components/ui/button";
import { X, Loader2, Printer } from "lucide-react";

// Print only .print-section
if (typeof window !== "undefined") {
  const styleId = "print-section-only-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        .print-section, .print-section * {
          visibility: visible !important;
        }
        .print-section {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100vw !important;
          background: white !important;
          z-index: 9999 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// --- (Hook dummy 'useGetStockCardQuery' Anda di sini) ---
// ...
const useGetStockCardQuery = (barangId: number | undefined) => {
  console.log("Fetching stock card for barangId:", barangId);
  const dummyData = {
    data: [
      { id: 1, date: "2025-11-01", type: "in", quantity: 100, stock_after: 100, description: "Stok Awal" },
      { id: 2, date: "2025-11-03", type: "out", quantity: 20, stock_after: 80, description: "Penjualan INV/001" },
      { id: 3, date: "2025-11-05", type: "in", quantity: 50, stock_after: 130, description: "Pembelian PO/001" },
      { id: 4, date: "2025-11-10", type: "out", quantity: 10, stock_after: 120, description: "Penjualan INV/002" },
      { id: 5, date: "2025-11-11", type: "in", quantity: 25, stock_after: 145, description: "Retur Penjualan" },
    ],
  };
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  return { data: dummyData, isLoading: isLoading, isError: false };
};
// ---

interface DetailBarangModalProps {
  barang: Barang;
  onClose: () => void;
}

export default function DetailBarangModal({
  barang,
  onClose,
}: DetailBarangModalProps) {
  
  const { data: historyData, isLoading: isHistoryLoading } = useGetStockCardQuery(barang.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    // Backdrop modal
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      {/* Kotak Modal Shell */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        
        {/* Modal Header -> tambahkan 'no-print' */}
        <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700 no-print">
          <h2 className="text-lg font-semibold">Detail Barang & Kartu Stok</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Cetak PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Modal Content -> tambahkan 'print-section' */}
        <div className="p-6 overflow-y-auto print-section">
          {/* Bagian 1: Informasi Head (INI AKAN TERCETAK) */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3 border-b pb-2">Informasi Barang</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div><strong>SKU:</strong> {barang.sku}</div>
              <div><strong>Nama:</strong> {barang.name}</div>
              <div><strong>Kategori:</strong> {barang.category_name}</div>
              <div><strong>Harga:</strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(barang.price ?? 0)}</div>
              <div><strong>Stok Saat Ini:</strong> {barang.stock} {barang.unit}</div>
              <div><strong>Min. Stok:</strong> {barang.min_stock} {barang.unit}</div>
              <div className="col-span-1 md:col-span-2"><strong>Deskripsi:</strong> {barang.description || "-"}</div>
              <div><strong>Status:</strong>
                <span className={`ml-2 inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    barang.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {barang.status ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>
          </div>

          {/* Bagian 2: Tabel Riwayat Stok (INI AKAN TERCETAK) */}
          <div>
            <h3 className="text-base font-semibold mb-3 border-b pb-2">Riwayat Stok (Kartu Stok)</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2">Tanggal</th>
                    <th className="px-4 py-2">Tipe</th>
                    <th className="px-4 py-2">Jumlah</th>
                    <th className="px-4 py-2">Stok Akhir</th>
                    <th className="px-4 py-2">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {isHistoryLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : !historyData || historyData.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4">
                        Tidak ada riwayat stok.
                      </td>
                    </tr>
                  ) : (
                    historyData.data.map((item: any) => (
                      <tr key={item.id} className="border-t dark:border-zinc-700">
                        <td className="px-4 py-2">{new Date(item.date).toLocaleDateString('id-ID')}</td>
                        <td className="px-4 py-2">
                          <span className={`font-medium ${item.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.type === 'in' ? 'Masuk' : 'Keluar'}
                          </span>
                        </td>
                        <td className="px-4 py-2">{item.type === 'in' ? '+' : '-'}{item.quantity}</td>
                        <td className="px-4 py-2">{item.stock_after}</td>
                        <td className="px-4 py-2">{item.description}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div> {/* Akhir dari .print-section */}
        
      </div> {/* Akhir dari Kotak Modal Shell */}
    </div>
  );
}