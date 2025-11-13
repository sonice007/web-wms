"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { CreateStockOpnameRequest } from "@/types/admin/stock-opname";

// TODO: Impor hook mutasi Anda untuk menyimpan data opname
// import { useAddStockOpnameMutation } from "@/services/admin/stock/opname.service";

// --- HOOK MUTASI DUMMY (Ganti dengan hook Anda) ---
const useAddStockOpnameMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const mutate = (
    data: Partial<CreateStockOpnameRequest>,
    options: { onSuccess: () => void }
  ) => {
    setIsLoading(true);
    console.log("Data Opname Disimpan:", data);
    setTimeout(() => {
      setIsLoading(false);
      options.onSuccess(); // Panggil onSuccess callback
    }, 1000); // Simulasikan delay network
  };
  return { mutate, isLoading };
};
// --- AKHIR DUMMY ---

/**
 * Tipe untuk prop 'item'.
 * Sesuaikan ini agar cocok dengan tipe data inventory Anda
 * yang memiliki semua properti yang diminta.
 */
export interface ItemUntukPenyesuaian {
  id: number; // Akan digunakan untuk inventory_id
  product_name: string;
  product_sku: string;
  warehouse_name: string;
  warehouse_storage_name: string;
  stock: number; // Ini akan jadi initial_stock
  cogs?: number; // Diperlukan untuk hitung 'total'
  // ... properti lain dari item Anda
}

interface FormPenyesuaianStokProps {
  item: ItemUntukPenyesuaian | null; // Item yang sedang disesuaikan (untuk display)
  form: Partial<CreateStockOpnameRequest>; // State form dari parent
  setForm: React.Dispatch<React.SetStateAction<Partial<CreateStockOpnameRequest>>>;
  onCancel: () => void;
  onSubmit: () => void; // Callback on success
}

export default function FormPenyesuaianStok({
  item,
  form,
  setForm,
  onCancel,
  onSubmit,
}: FormPenyesuaianStokProps) {
  
  const { mutate: addOpname, isLoading } = useAddStockOpnameMutation();

  // Hitung selisih dan total secara otomatis
  const { selisih, total } = useMemo(() => {
    const sistem = form.initial_stock || 0;
    const fisik = form.counted_stock || 0;
    const hpp = item?.cogs || 0; // Ambil HPP/COGS dari item

    const selisih = fisik - sistem;
    const total = selisih * hpp; // total = selisih * HPP
    return { selisih, total };
  }, [form.initial_stock, form.counted_stock, item?.cogs]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validasi: pastikan item ada dan inventory_id ada di form
    if (isLoading || !item || !form.inventory_id) {
      console.error("Item atau inventory_id tidak ada di form state.");
      return;
    }

    const dataToSubmit: Partial<CreateStockOpnameRequest> = {
      ...form,
      difference: selisih,
      total: total, // Sertakan total yang sudah dihitung
      cogs: item.cogs || 0, // Sertakan COGS saat submit
    };

    addOpname(dataToSubmit, {
      onSuccess: () => {
        onSubmit(); // Panggil refetch dan tutup modal dari parent
      },
      // onError: (error) => { ... }
    });
  };

  // Jangan render apapun jika tidak ada item (misal: saat modal ditutup)
  if (!item) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
        <h2 className="text-lg font-semibold">Form Penyesuaian Stok</h2>
        <Button variant="ghost" size="icon" onClick={onCancel} type="button" className="rounded-full">
          &times;
        </Button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-4 overflow-y-auto">
        
        {/* ----- Informasi Barang (Read-Only) ----- */}
        <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
          <h3 className="font-semibold text-sm">Informasi Barang</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <Label className="text-xs text-muted-foreground">SKU</Label>
              <p className="font-medium">{item.product_sku}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Produk</Label>
              <p className="font-medium">{item.product_name}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Gudang</Label>
              <p className="font-medium">{item.warehouse_name}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Lokasi</Label>
              <p className="font-medium">{item.warehouse_storage_name}</p>
            </div>
          </div>
        </div>
        
        {/* Input Tanggal */}
        <div className="space-y-2">
          <Label htmlFor="tanggal">Tanggal Opname</Label>
          <Input
            id="tanggal"
            type="date"
            value={form.date || ""}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
        </div>

        {/* Grup Stok (Sistem, Fisik, Selisih) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stock_sistem">Stok Sistem</Label>
            <Input
              id="stock_sistem"
              type="number"
              value={form.initial_stock || 0} // Ambil dari form state
              readOnly
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock_fisik">Stok Fisik</Label>
            <Input
              id="stock_fisik"
              type="number"
              value={form.counted_stock || 0}
              onChange={(e) => setForm((p) => ({ ...p, counted_stock: parseInt(e.target.value) || 0 }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selisih">Selisih</Label>
            <Input
              id="selisih"
              type="number"
              value={selisih}
              readOnly
              disabled
              className={`font-semibold ${selisih > 0 ? 'text-green-600' : selisih < 0 ? 'text-red-600' : ''}`}
            />
          </div>
        </div>

        {/* Keterangan */}
        <div className="space-y-2">
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea
            id="keterangan"
            placeholder="Misal: Hasil opname bulanan, barang rusak, hilang, dll."
            value={form.notes || ""}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          />
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-2 p-4 border-t dark:border-zinc-700">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading || !form.inventory_id}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Simpan Penyesuaian
        </Button>
      </div>
    </form>
  );
}