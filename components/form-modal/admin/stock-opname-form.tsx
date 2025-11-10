"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useGetBarangListQuery } from "@/services/admin/master/barang.service";
import { Barang } from "@/types/admin/master/barang";
import { StockOpnameForm } from "@/types/admin/stock-opname";

// TODO: Impor hook mutasi Anda untuk menyimpan data opname
// import { useAddStockOpnameMutation } from "@/services/admin/stock/opname.service";

// --- HOOK MUTASI DUMMY (Ganti dengan hook Anda) ---
const useAddStockOpnameMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const mutate = (data: any, options: any) => {
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

interface FormPenyesuaianStokProps {
  form: Partial<StockOpnameForm>;
  setForm: React.Dispatch<React.SetStateAction<Partial<StockOpnameForm>>>;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function FormPenyesuaianStok({
  form,
  setForm,
  onCancel,
  onSubmit,
}: FormPenyesuaianStokProps) {
  
  const { mutate: addOpname, isLoading } = useAddStockOpnameMutation();

  // State untuk dropdown pencarian barang
  const [barangSearch, setBarangSearch] = useState("");
  const [isDropdownBarangOpen, setDropdownBarangOpen] = useState(false);
  const dropdownBarangRef = useRef<HTMLDivElement>(null);

  // Gunakan hook yang ada untuk mencari barang
  const { data: barangData, isLoading: isBarangLoading } = useGetBarangListQuery({ 
    page: 1, 
    paginate: 20, // Batasi hasil pencarian
    search: barangSearch 
  });

  const filteredBarang = useMemo(() => {
    if (!barangData?.data) return [];
    return barangData.data;
  }, [barangSearch, barangData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownBarangRef.current &&
        !dropdownBarangRef.current.contains(event.target as Node)
      ) {
        setDropdownBarangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownBarangRef]);

  // Handler saat memilih barang
  const handleBarangSelect = (barang: Barang) => {
    setForm((prev) => ({
      ...prev,
      barang_id: barang.id,
      stock_sistem: barang.stock, // Isi stok sistem
    }));
    setBarangSearch(barang.name); // Tampilkan nama di input
    setDropdownBarangOpen(false);
  };

  // Hitung selisih secara otomatis
  const selisih = useMemo(() => {
    const sistem = form.stock_sistem || 0;
    const fisik = form.stock_fisik || 0;
    return fisik - sistem;
  }, [form.stock_sistem, form.stock_fisik]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || !form.barang_id) return;

    const dataToSubmit = {
      ...form,
      selisih: selisih,
    };

    addOpname(dataToSubmit, {
      onSuccess: () => {
        onSubmit(); // Panggil refetch dan tutup modal dari parent
      },
      // onError: (error) => { ... }
    });
  };

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
        {/* Input Tanggal */}
        <div className="space-y-2">
          <Label htmlFor="tanggal">Tanggal Opname</Label>
          <Input
            id="tanggal"
            type="date"
            value={form.tanggal}
            onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))}
            required
          />
        </div>

        {/* Input Cari Barang */}
        <div className="space-y-2">
          <Label htmlFor="barang_id">Barang</Label>
          <div className="relative" ref={dropdownBarangRef}>
            <Input
              id="barang_id"
              placeholder="Cari SKU atau Nama Barang..."
              value={barangSearch}
              onChange={(e) => {
                setBarangSearch(e.target.value);
                setDropdownBarangOpen(true);
                // Hapus ID jika user mengetik lagi
                if (form.barang_id) {
                  setForm((p) => ({ ...p, barang_id: undefined, stock_sistem: 0 }));
                }
              }}
              onFocus={() => setDropdownBarangOpen(true)}
              required
              autoComplete="off"
            />
            {isDropdownBarangOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {isBarangLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : filteredBarang.length > 0 ? (
                  filteredBarang.map((barang) => (
                    <button
                      type="button"
                      key={barang.id}
                      onClick={() => handleBarangSelect(barang)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      {barang.sku} - {barang.name} (Stok: {barang.stock})
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-3">
                    Barang tidak ditemukan.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Grup Stok (Sistem, Fisik, Selisih) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stock_sistem">Stok Sistem</Label>
            <Input
              id="stock_sistem"
              type="number"
              value={form.stock_sistem || 0}
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
              value={form.stock_fisik || 0}
              onChange={(e) => setForm((p) => ({ ...p, stock_fisik: parseInt(e.target.value) || 0 }))}
              required
              disabled={!form.barang_id} // Hanya aktif jika barang dipilih
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
            value={form.keterangan || ""}
            onChange={(e) => setForm((p) => ({ ...p, keterangan: e.target.value }))}
            disabled={!form.barang_id}
          />
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-2 p-4 border-t dark:border-zinc-700">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading || !form.barang_id}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Simpan Penyesuaian
        </Button>
      </div>
    </form>
  );
}