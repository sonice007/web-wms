"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Barang } from "@/types/admin/master/barang";
import {
  useGetKategoriListQuery,
} from "@/services/admin/master/kategori.service";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Definisikan tipe props yang lebih spesifik untuk form ini
interface BarangFormProps {
  form: Partial<Barang>;
  setForm: (data: Partial<Barang>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  readonly?: boolean;
  isLoading?: boolean;
}

export default function BarangForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  readonly = false,
  isLoading = false,
}: BarangFormProps) {
  const [mounted, setMounted] = useState(false);
 
  const [kategoriSearch, setKategoriSearch] = useState("");
  const { data: kategoriData, isLoading: isKategoriLoading } = useGetKategoriListQuery({
    page: 1,
    paginate: 100,
    search: kategoriSearch,
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Cari dan set nama kategori awal jika form dalam mode edit/readonly
    if (form.product_category_id && kategoriData?.data) {
      const selectedKategori = kategoriData.data.find(p => p.id === form.product_category_id);
      if (selectedKategori) {
        setKategoriSearch(selectedKategori.name);
      }
    }
  }, [form.product_category_id, kategoriData]);
  
  // Menutup dropdown saat klik di luar komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  const filteredKategori = useMemo(() => {
    if (!kategoriData?.data || kategoriSearch.length < 2) {
      return [];
    }
    return kategoriData.data.filter((kategori) =>
      kategori.name.toLowerCase().includes(kategoriSearch.toLowerCase())
    );
  }, [kategoriSearch, kategoriData]);
  
  const handleKategoriSelect = (kategori: { id: number; name: string }) => {
    setForm({ ...form, product_category_id: kategori.id });
    setKategoriSearch(kategori.name);
    setDropdownOpen(false);
  };

  if (!mounted) {
    // Skeleton loading
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold">Loading...</h2>
        </div>
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-2xl min-h-[400px] max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0">
        <h2 className="text-lg font-semibold">
          {readonly ? "Detail Barang" : form.id ? "Edit Barang" : "Tambah Barang"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          ✕
        </Button>
      </div>

      {/* Content */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex-1 overflow-y-auto p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kategori Searchable Dropdown */}
          <div className="flex flex-col gap-y-1.5" ref={dropdownRef}>
            <Label htmlFor="product_category_id">Kategori</Label>
            <div className="relative">
              <Input
                id="product_category_id"
                placeholder="Ketik min 2 huruf untuk mencari kategori..."
                value={kategoriSearch}
                onChange={(e) => {
                  setKategoriSearch(e.target.value);
                  setDropdownOpen(true);
                   // Hapus product_category_id jika input diubah
                  if (form.product_category_id) {
                    setForm({ ...form, product_category_id: undefined });
                  }
                }}
                onFocus={() => setDropdownOpen(true)}
                readOnly={readonly}
                required
                autoComplete="off"
              />
              {isDropdownOpen && !readonly && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isKategoriLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : kategoriSearch.length < 2 ? (
                     <p className="text-sm text-gray-500 p-3">Ketik minimal 2 huruf...</p>
                  ) : filteredKategori.length > 0 ? (
                    filteredKategori.map((kategori) => (
                      <button
                        type="button"
                        key={kategori.id}
                        onClick={() => handleKategoriSelect(kategori)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {kategori.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-3">Kategori tidak ditemukan.</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Code */}
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={form.sku ?? ""}
              placeholder="Masukkan SKU barang"
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              readOnly={readonly}
              required
            />
          </div>

          {/* Nama Barang */}
          <div className="flex flex-col gap-y-1.5 col-span-2">
            <Label htmlFor="name">Nama Barang</Label>
            <Input
              id="name"
              value={form.name ?? ""}
              placeholder="Masukkan nama barang"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              readOnly={readonly}
              required
            />
          </div>

          <div className="flex flex-col gap-y-1.5 col-span-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={form.description ?? ""}
              placeholder="Masukkan deskripsi barang"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              readOnly={readonly}
              required
            />
          </div>

          {/* Harga */}
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor="price">Harga</Label>
            <Input
              id="price"
              value={form.price ?? ""}
              placeholder="Masukkan harga"
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              readOnly={readonly}
              required
            />
          </div>

          {/* Stok */}
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor="stock">Stok</Label>
            <Input
              id="stock"
              value={form.stock ?? ""}
              placeholder="Masukkan stok"
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              readOnly={readonly}
              required
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor="min_stock">Minimal Stok</Label>
            <Input
              id="min_stock"
              value={form.min_stock ?? ""}
              placeholder="Masukkan minimal stok"
              onChange={(e) => setForm({ ...form, min_stock: Number(e.target.value) })}
              readOnly={readonly}
              required
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={form.unit ?? ""}
              placeholder="Masukkan unit"
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              readOnly={readonly}
              required
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-y-1.5 col-span-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={typeof form.status === "boolean" ? (form.status ? 1 : 0) : form.status ?? 1}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value === "1" })
              }
              disabled={readonly}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={1}>Aktif</option>
              <option value={0}>Tidak Aktif</option>
            </select>
          </div>
        </div>
      </form>

      {/* Footer */}
      {!readonly && (
        <div className="p-6 border-t border-gray-200 dark:border-zinc-700 flex justify-end gap-2 flex-shrink-0">
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={isLoading || !form.product_category_id}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      )}
    </div>
  );
}
