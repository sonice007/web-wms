"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Barang } from "@/types/admin/master/barang";
import { Warehouse } from "@/types/admin/master/warehouse"; // Asumsi Anda punya tipe ini
import { Rak } from "@/types/admin/master/rak"; // Asumsi Anda punya tipe ini
import { BarangKeluarHeader } from "../page"; // Impor dari file list

// --- Impor Hook Selector (Ganti dengan path Anda) ---
import { useGetWarehouseListQuery } from "@/services/admin/master/warehouse.service";
import { useGetRakListQuery } from "@/services/admin/master/rak.service";
import { useGetBarangListQuery } from "@/services/admin/master/barang.service";

// Tipe data untuk Detail
interface BarangKeluarDetail {
  barang_id: number;
  barang_name: string; // Simpan nama untuk tampilan
  warehouse_id: number;
  warehouse_name: string;
  rak_id: number;
  rak_name: string;
  jumlah: number;
}

// --- HOOK MUTASI DUMMY (Ganti dengan RTK Query Anda) ---
const useAddBarangKeluarMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const mutate = (data: any, options: any) => {
    setIsLoading(true);
    console.log("Data Transaksi Disimpan:", data);
    setTimeout(() => {
      setIsLoading(false);
      options.onSuccess(); // Panggil onSuccess callback
    }, 1500);
  };
  return { mutate, isLoading };
};
// --- AKHIR DUMMY ---


export default function TambahBarangKeluarPage() {
  const router = useRouter();
  const [header, setHeader] = useState<Partial<BarangKeluarHeader>>({
    tanggal: new Date().toISOString().split('T')[0], // Default hari ini
    keterangan: "",
    kode_transaksi: "", // Sebaiknya di-generate server
  });
  const [details, setDetails] = useState<BarangKeluarDetail[]>([]);

  // State untuk form 'Add Item'
  const [currentItem, setCurrentItem] = useState<Partial<BarangKeluarDetail>>({
    jumlah: 1,
  });

  // Hook mutasi untuk menyimpan
  const { mutate: addTransaksi, isLoading } = useAddBarangKeluarMutation();

  // --- (SEMUA LOGIKA DROPDOWN WAREHOUSE, RAK, BARANG TETAP SAMA) ---
  // --- LOGIKA DROPDOWN WAREHOUSE ---
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const { data: warehouseData, isLoading: isWarehouseLoading } = useGetWarehouseListQuery({ page: 1, paginate: 100, search: warehouseSearch });
  const [isDropdownWarehouseOpen, setDropdownWarehouseOpen] = useState(false);
  const dropdownWarehouseRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownWarehouseRef.current && !dropdownWarehouseRef.current.contains(event.target as Node)) {
        setDropdownWarehouseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownWarehouseRef]);
  const filteredWarehouse = useMemo(() => {
    if (!warehouseData?.data) return [];
    return warehouseData.data.filter((w: Warehouse) => w.name.toLowerCase().includes(warehouseSearch.toLowerCase()));
  }, [warehouseSearch, warehouseData]);
  
  // --- LOGIKA DROPDOWN RAK (Tergantung Warehouse) ---
  const [rakSearch, setRakSearch] = useState("");
  const { data: rakData, isLoading: isRakLoading } = useGetRakListQuery({
    page: 1, paginate: 100, search: rakSearch,
    warehouse_id: currentItem.warehouse_id || 0, // Ambil dari currentItem
  });
  const [isDropdownRakOpen, setDropdownRakOpen] = useState(false);
  const dropdownRakRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRakRef.current && !dropdownRakRef.current.contains(event.target as Node)) {
        setDropdownRakOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRakRef]);
  const filteredRak = useMemo(() => {
    if (!rakData?.data) return [];
    return rakData.data.filter((r: Rak) => r.name.toLowerCase().includes(rakSearch.toLowerCase()));
  }, [rakSearch, rakData]);
  
  // --- LOGIKA DROPDOWN BARANG ---
  const [barangSearch, setBarangSearch] = useState("");
  const { data: barangData, isLoading: isBarangLoading } = useGetBarangListQuery({ page: 1, paginate: 100, search: barangSearch });
  const [isDropdownBarangOpen, setDropdownBarangOpen] = useState(false);
  const dropdownBarangRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownBarangRef.current && !dropdownBarangRef.current.contains(event.target as Node)) {
        setDropdownBarangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownBarangRef]);
  const filteredBarang = useMemo(() => {
    if (!barangData?.data) return [];
    return barangData.data.filter((b: Barang) => b.name.toLowerCase().includes(barangSearch.toLowerCase()));
  }, [barangSearch, barangData]);


  // Handler untuk menambah item ke tabel detail
  const handleAddItem = () => {
    // Validasi input
    if (
      !currentItem.warehouse_id ||
      !currentItem.rak_id ||
      !currentItem.barang_id ||
      !currentItem.jumlah || currentItem.jumlah <= 0
    ) {
      alert("Harap lengkapi semua field item (Gudang, Rak, Barang, Jumlah).");
      return;
    }

    // --- PERBAIKAN LOGIKA DIMULAI DI SINI ---

    // 1. Cari apakah item dengan kombinasi yang sama sudah ada
    const existingItemIndex = details.findIndex(
      (item) =>
        item.barang_id === currentItem.barang_id &&
        item.warehouse_id === currentItem.warehouse_id &&
        item.rak_id === currentItem.rak_id
    );

    if (existingItemIndex > -1) {
      // 2. Jika ADA, update jumlah item yang sudah ada
      setDetails(prevDetails => 
        prevDetails.map((item, index) => {
          if (index === existingItemIndex) {
            // Ini adalah item yang cocok, kembalikan objek baru dengan jumlah yang diperbarui
            return {
              ...item,
              jumlah: item.jumlah + (currentItem.jumlah || 0) // Tambahkan jumlah baru
            };
          }
          // Ini bukan item yang cocok, kembalikan apa adanya
          return item;
        })
      );
    } else {
      // 3. Jika TIDAK ADA, tambahkan sebagai baris baru (perilaku lama)
      setDetails(prev => [
        ...prev,
        {
          ...currentItem as BarangKeluarDetail, // Asumsikan sudah tervalidasi
        }
      ]);
    }
    
    // --- AKHIR PERBAIKAN LOGIKA ---

    // Reset form item
    setCurrentItem({ jumlah: 1 });
    setWarehouseSearch("");
    setRakSearch("");
    setBarangSearch("");
  };

  // Handler untuk menghapus item dari tabel detail
  const handleRemoveItem = (index: number) => {
    setDetails(prev => prev.filter((_, i) => i !== index));
  };

  // Handler untuk menyimpan seluruh transaksi
  const handleSimpanTransaksi = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (details.length === 0) {
      alert("Harap tambahkan minimal 1 item barang.");
      return;
    }

    const dataToSubmit = {
      ...header,
      details: details,
    };

    addTransaksi(dataToSubmit, {
      onSuccess: () => {
        alert("Transaksi berhasil disimpan!");
        router.push("/admin/transaksi/barang-keluar"); // Kembali ke halaman list
      },
      onError: () => {
        alert("Terjadi kesalahan saat menyimpan.");
      },
    });
  };

  return (
    <form onSubmit={handleSimpanTransaksi} className="p-6 space-y-6">
      {/* Tombol Aksi Utama (Simpan/Batal) - Taruh di atas */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Form Barang Keluar Baru</h3>
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Simpan Transaksi
          </Button>
        </div>
      </div>

      {/* Card 1: Header Transaksi */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="kode_transaksi">Kode Transaksi</Label>
            <Input
              id="kode_transaksi"
              placeholder="Contoh: BM-001 (auto jika dikosongi)"
              value={header.kode_transaksi}
              onChange={(e) => setHeader(p => ({ ...p, kode_transaksi: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              type="date"
              value={header.tanggal}
              onChange={(e) => setHeader(p => ({ ...p, tanggal: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              placeholder="Keterangan transaksi (misal: Penerimaan dari Supplier X)"
              value={header.keterangan}
              onChange={(e) => setHeader(p => ({ ...p, keterangan: e.target.value }))}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Detail Barang */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Barang</CardTitle>
        </CardHeader>
        <CardContent className="mt-[-15px]">
          {/* Form Tambah Item */}
          <div className="flex flex-col md:flex-row gap-4 items-end p-4 border rounded-md">
            {/* Warehouse */}
            <div className="flex-1 w-full space-y-2" ref={dropdownWarehouseRef}>
              <Label>Warehouse</Label>
              <Input
                placeholder="Cari Warehouse..."
                value={warehouseSearch}
                onChange={(e) => {
                  setWarehouseSearch(e.target.value);
                  setDropdownWarehouseOpen(true);
                  if (currentItem.warehouse_id) {
                    setCurrentItem(p => ({ ...p, warehouse_id: undefined, warehouse_name: undefined, rak_id: undefined, rak_name: undefined }));
                    setRakSearch("");
                  }
                }}
                onFocus={() => setDropdownWarehouseOpen(true)}
                autoComplete="off"
              />
              {isDropdownWarehouseOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isWarehouseLoading ? <Loader2 className="h-5 w-5 animate-spin m-4" /> :
                    filteredWarehouse.map((w: Warehouse) => (
                      <button type="button" key={w.id}
                        onClick={() => {
                          setCurrentItem(p => ({ ...p, warehouse_id: w.id, warehouse_name: w.name }));
                          setWarehouseSearch(w.name);
                          setDropdownWarehouseOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >{w.name}</button>
                    ))}
                </div>
              )}
            </div>
            {/* Rak */}
            <div className="flex-1 w-full space-y-2" ref={dropdownRakRef}>
              <Label>Rak</Label>
              <Input
                placeholder={!currentItem.warehouse_id ? "Pilih Warehouse dulu" : "Cari Rak..."}
                value={rakSearch}
                onChange={(e) => {
                  setRakSearch(e.target.value);
                  setDropdownRakOpen(true);
                  if (currentItem.rak_id) {
                    setCurrentItem(p => ({ ...p, rak_id: undefined, rak_name: undefined }));
                  }
                }}
                onFocus={() => currentItem.warehouse_id && setDropdownRakOpen(true)}
                disabled={!currentItem.warehouse_id}
                autoComplete="off"
              />
              {isDropdownRakOpen && currentItem.warehouse_id && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isRakLoading ? <Loader2 className="h-5 w-5 animate-spin m-4" /> :
                    filteredRak.map((r: Rak) => (
                      <button type="button" key={r.id}
                        onClick={() => {
                          setCurrentItem(p => ({ ...p, rak_id: r.id, rak_name: r.name }));
                          setRakSearch(r.name);
                          setDropdownRakOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >{r.name}</button>
                    ))}
                </div>
              )}
            </div>
            {/* Barang */}
            <div className="flex-1 w-full space-y-2" ref={dropdownBarangRef}>
              <Label>Barang</Label>
              <Input
                placeholder="Cari Barang..."
                value={barangSearch}
                onChange={(e) => {
                  setBarangSearch(e.target.value);
                  setDropdownBarangOpen(true);
                  if (currentItem.barang_id) {
                    setCurrentItem(p => ({ ...p, barang_id: undefined, barang_name: undefined }));
                  }
                }}
                onFocus={() => setDropdownBarangOpen(true)}
                autoComplete="off"
              />
              {isDropdownBarangOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isBarangLoading ? <Loader2 className="h-5 w-5 animate-spin m-4" /> :
                    filteredBarang.map((b: Barang) => (
                      <button type="button" key={b.id}
                        onClick={() => {
                          setCurrentItem(p => ({ ...p, barang_id: b.id, barang_name: b.name }));
                          setBarangSearch(b.name);
                          setDropdownBarangOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >{b.sku} - {b.name}</button>
                    ))}
                </div>
              )}
            </div>
            {/* Jumlah */}
            <div className="w-full md:w-24 space-y-2">
              <Label>Jumlah</Label>
              <Input
                type="number"
                min="1"
                value={currentItem.jumlah}
                onChange={(e) => setCurrentItem(p => ({ ...p, jumlah: parseInt(e.target.value) || 1 }))}
              />
            </div>
            {/* Tombol Tambah Item */}
            <Button type="button" onClick={handleAddItem}>
              <Plus className="w-4 h-4 mr-2" /> Tambah
            </Button>
          </div>

          {/* Tabel Item yang Sudah Ditambah */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-2">Barang</th>
                  <th className="px-4 py-2">Warehouse</th>
                  <th className="px-4 py-2">Rak</th>
                  <th className="px-4 py-2">Jumlah</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      Belum ada barang yang ditambahkan.
                    </td>
                  </tr>
                ) : (
                  details.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 font-medium">{item.barang_name}</td>
                      <td className="px-4 py-2">{item.warehouse_name}</td>
                      <td className="px-4 py-2">{item.rak_name}</td>
                      <td className="px-4 py-2">{item.jumlah}</td>
                      <td className="px-4 py-2">
                        <Button
                          variant="destructive"
                          size="icon"
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}