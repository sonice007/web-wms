"use client";

import React from "react";
import { Inventory } from "@/types/admin/master/barang";
import { Button } from "@/components/ui/button";
import { X, Loader2, Printer } from "lucide-react";
import {
  useGetKartuStokListQuery
} from "@/services/admin/master/barang.service";

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


interface DetailBarangModalProps {
  barang: Inventory;
  onClose: () => void;
}

export default function DetailBarangModal({
  barang,
  onClose,
}: DetailBarangModalProps) {
  
  const { data: historyData, isLoading: isHistoryLoading } = useGetKartuStokListQuery({
    page: 1,
    paginate: 100,
    search: "",
    inventory_id: barang.id,
  });

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
              <div><strong>Warehouse:</strong> {barang.warehouse_code} - {barang.warehouse_name}</div>
              <div><strong>Rak:</strong> {barang.warehouse_storage_name}</div>
              <div><strong>SKU:</strong> {barang.product_sku}</div>
              <div><strong>Nama:</strong> {barang.product_name}</div>
              <div><strong>Stok Saat Ini:</strong> {barang.stock}</div>
              <div><strong>Min. Stok:</strong> {barang.min_stock}</div>
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
                    <th className="px-4 py-2 text-right">Jumlah</th>
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
                    (() => {
                      // Define the type for stock history item
                      interface StockHistoryItem {
                        id: string;
                        updated_at: string;
                        notes: string;
                        quantity: number;
                      }

                      // Hitung stok akhir mundur dari barang.stock
                      let currentStock = barang.stock ?? 0;
                      // Urutkan data dari terbaru ke terlama
                      const sortedData = ([...historyData.data] as unknown as StockHistoryItem[]).sort(
                        (a, b) =>
                          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                      );
                      // Simpan stok akhir untuk setiap item
                      const stockAfterMap: Record<string, number> = {};
                      sortedData.forEach((item: StockHistoryItem) => {
                        stockAfterMap[item.id] = currentStock;
                        // Kurangi/tambah stok sesuai tipe
                        if (item.notes.startsWith('Sales Order')) {
                          currentStock += item.quantity; // Keluar (-), jadi tambahkan ke stok mundur
                        } else {
                          currentStock -= item.quantity; // Masuk (+), jadi kurangi stok mundur
                        }
                      });
                      // Render data urut dari terbaru ke terlama
                      return sortedData.map((item: StockHistoryItem) => (
                        <tr key={item.id} className="border-t dark:border-zinc-700">
                          <td className="px-4 py-2">{new Date(item.updated_at).toLocaleDateString('id-ID')}</td>
                          <td className="px-4 py-2">
                            <span className={`font-medium ${
                              item.notes.startsWith('Sales Order') ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {item.notes.startsWith('Sales Order') ? 'Keluar (-)' : 'Masuk (+)'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right">{item.notes.startsWith('Sales Order') ? '+' : '-'}{item.quantity}</td>
                          <td className="px-4 py-2">{stockAfterMap[item.id]}</td>
                          <td className="px-4 py-2">{item.notes}</td>
                        </tr>
                      ));
                    })()
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Akhir dari .print-section */}
        
      </div> {/* Akhir dari Kotak Modal Shell */}
    </div>
  );
}