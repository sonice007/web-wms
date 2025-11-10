"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Rak } from "@/types/admin/master/rak";
import {
  useGetWarehouseListQuery,
} from "@/services/admin/master/warehouse.service";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Definisikan tipe props yang lebih spesifik untuk form ini
interface RakFormProps {
  form: Partial<Rak>;
  setForm: (data: Partial<Rak>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  readonly?: boolean;
  isLoading?: boolean;
}

export default function RakForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  readonly = false,
  isLoading = false,
}: RakFormProps) {
  const [mounted, setMounted] = useState(false);
 
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const { data: warehouseData, isLoading: isWarehouseLoading } = useGetWarehouseListQuery({
    page: 1,
    paginate: 100,
    search: warehouseSearch,
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Cari dan set nama warehouse awal jika form dalam mode edit/readonly
    if (form.warehouse_id && warehouseData?.data) {
      const selectedWarehouse = warehouseData.data.find(p => p.id === form.warehouse_id);
      if (selectedWarehouse) {
        setWarehouseSearch(selectedWarehouse.name);
      }
    }
  }, [form.warehouse_id, warehouseData]);
  
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


  const filteredWarehouse = useMemo(() => {
    if (!warehouseData?.data || warehouseSearch.length < 2) {
      return [];
    }
    return warehouseData.data.filter((warehouse) =>
      warehouse.name.toLowerCase().includes(warehouseSearch.toLowerCase())
    );
  }, [warehouseSearch, warehouseData]);
  
  const handleWarehouseSelect = (warehouse: { id: number; name: string }) => {
    setForm({ ...form, warehouse_id: warehouse.id });
    setWarehouseSearch(warehouse.name);
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
          {readonly ? "Detail Rak" : form.id ? "Edit Rak" : "Tambah Rak"}
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
          {/* Warehouse Searchable Dropdown */}
          <div className="flex flex-col gap-y-1.5 col-span-2" ref={dropdownRef}>
            <Label htmlFor="warehouse_id">Warehouse</Label>
            <div className="relative">
              <Input
                id="warehouse_id"
                placeholder="Ketik min 2 huruf untuk mencari warehouse..."
                value={warehouseSearch}
                onChange={(e) => {
                  setWarehouseSearch(e.target.value);
                  setDropdownOpen(true);
                   // Hapus warehouse_id jika input diubah
                  if (form.warehouse_id) {
                    setForm({ ...form, warehouse_id: undefined });
                  }
                }}
                onFocus={() => setDropdownOpen(true)}
                readOnly={readonly}
                required
                autoComplete="off"
              />
              {isDropdownOpen && !readonly && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isWarehouseLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : warehouseSearch.length < 2 ? (
                     <p className="text-sm text-gray-500 p-3">Ketik minimal 2 huruf...</p>
                  ) : filteredWarehouse.length > 0 ? (
                    filteredWarehouse.map((warehouse) => (
                      <button
                        type="button"
                        key={warehouse.id}
                        onClick={() => handleWarehouseSelect(warehouse)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {warehouse.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-3">Warehouse tidak ditemukan.</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Code */}
          <div className="flex flex-col gap-y-1.5 col-span-2">
            <Label htmlFor="code">Kode</Label>
            <Input
              id="code"
              value={form.code ?? ""}
              placeholder="Masukkan nama kode"
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              readOnly={readonly}
              required
            />
          </div>

          {/* Nama Rak */}
          <div className="flex flex-col gap-y-1.5 col-span-2">
            <Label htmlFor="name">Nama Rak</Label>
            <Input
              id="name"
              value={form.name ?? ""}
              placeholder="Masukkan nama rak"
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
              placeholder="Masukkan deskripsi rak"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              readOnly={readonly}
              required
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-y-1.5 col-span-2">
            <Label htmlFor="type">Tipe</Label>
            <select
              id="type"
              value={form.type ?? "Rak Palet"}
              required
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              disabled={readonly}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Pilih Rak</option>
              <option value="Rak Palet">Rak Palet</option>
              <option value="Rak Berat">Rak Berat</option>
              <option value="Rak Ringan">Rak Ringan</option>
              <option value="Rak Serbaguna">Rak Serbaguna</option>
              <option value="Dll">Dll</option>
            </select>
          </div>

          {/* Kapasitas */}
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor="capacity">Kapasitas</Label>
            <Input
              id="capacity"
              value={form.capacity ?? ""}
              placeholder="Masukkan kapasitas"
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              readOnly={readonly}
              required
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-y-1.5">
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
          <Button onClick={onSubmit} disabled={isLoading || !form.warehouse_id}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      )}
    </div>
  );
}
