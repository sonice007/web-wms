"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Barang } from "@/types/admin/master/barang";
import { Warehouse } from "@/types/admin/master/warehouse";
import { Rak } from "@/types/admin/master/rak";
import { CreateBarangMasukRequest, CreateBarangMasukDetailRequest } from "@/types/admin/transaksi/barang-masuk";

// --- Impor Hook Selector (Ganti dengan path Anda) ---
import { useGetWarehouseListQuery } from "@/services/admin/master/warehouse.service";
import { useGetRakListQuery } from "@/services/admin/master/rak.service";
import { useGetBarangListQuery } from "@/services/admin/master/barang.service";
import {
  useCreateBarangMasukMutation,
} from "@/services/admin/transaksi/barang-masuk.service";

// Tipe lokal untuk menampung data detail + data display (nama)
interface BarangMasukDetailLokal extends CreateBarangMasukDetailRequest {
  barang_name?: string;
  warehouse_name?: string; // Nama warehouse tempat rak berada
  rak_name?: string;
}

// Tipe lokal untuk form 'Add Item'
// Termasuk 'warehouse_id' sementara untuk filter rak
interface CurrentItemState extends Partial<BarangMasukDetailLokal> {
  warehouse_id?: number; // ID warehouse sementara untuk filter rak
}


export default function TambahBarangMasukPage() {
  const router = useRouter();
  
  // State untuk Header
  const [header, setHeader] = useState<Partial<CreateBarangMasukRequest>>({
    warehouse_id: 0, // Ini adalah warehouse utama transaksi
    date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0],
    supplier: "",
    notes: "",
  });
  
  // State untuk Detail (menggunakan tipe lokal)
  const [details, setDetails] = useState<BarangMasukDetailLokal[]>([]);

  // State untuk form 'Add Item' (menggunakan tipe lokal)
  const [currentItem, setCurrentItem] = useState<CurrentItemState>({
    product_id: 0,
    warehouse_storage_id: 0, // Ini adalah ID Rak
    warehouse_id: 0, // Ini ID Warehouse (sementara)
    quantity: 1,
    price: 0,
    subtotal: 0,
    discount_value: 0,
    tax_value: 0,
    total: 0
  });

  // Hook mutasi untuk menyimpan
  const [createBarangMasuk, { isLoading: isCreating }] = useCreateBarangMasukMutation();

  // --- LOGIKA DROPDOWN WAREHOUSE (HEADER) ---
  const [headerWarehouseSearch, setHeaderWarehouseSearch] = useState("");
  const { data: warehouseData, isLoading: isWarehouseLoading } = useGetWarehouseListQuery({ page: 1, paginate: 100, search: "" });
  const [isDropdownHeaderWarehouseOpen, setDropdownHeaderWarehouseOpen] = useState(false);
  const dropdownHeaderWarehouseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownHeaderWarehouseRef.current && !dropdownHeaderWarehouseRef.current.contains(event.target as Node)) {
        setDropdownHeaderWarehouseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownHeaderWarehouseRef]);

  const filteredHeaderWarehouse = useMemo(() => {
    if (!warehouseData?.data) return [];
    return warehouseData.data.filter((w: Warehouse) => w.name.toLowerCase().includes(headerWarehouseSearch.toLowerCase()));
  }, [headerWarehouseSearch, warehouseData]);

  // --- LOGIKA DROPDOWN WAREHOUSE (DETAIL - Untuk Rak) ---
  const [detailWarehouseSearch, setDetailWarehouseSearch] = useState("");
  const [isDropdownDetailWarehouseOpen, setDropdownDetailWarehouseOpen] = useState(false);
  const dropdownDetailWarehouseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownDetailWarehouseRef.current && !dropdownDetailWarehouseRef.current.contains(event.target as Node)) {
        setDropdownDetailWarehouseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownDetailWarehouseRef]);

  const filteredDetailWarehouse = useMemo(() => {
    if (!warehouseData?.data) return [];
    return warehouseData.data.filter((w: Warehouse) => w.name.toLowerCase().includes(detailWarehouseSearch.toLowerCase()));
  }, [detailWarehouseSearch, warehouseData]);
  
  // --- LOGIKA DROPDOWN RAK (Tergantung Warehouse Detail) ---
  const [rakSearch, setRakSearch] = useState("");
  const { data: rakData, isLoading: isRakLoading } = useGetRakListQuery({
    page: 1, paginate: 100, search: rakSearch,
    warehouse_id: currentItem.warehouse_id || 0 // Filter berdasarkan warehouse di detail
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
      !currentItem.warehouse_id || // Pastikan warehouse detail dipilih (untuk rak)
      !currentItem.warehouse_storage_id || // Pastikan rak dipilih
      !currentItem.product_id ||
      !currentItem.quantity || currentItem.quantity <= 0 ||
      !currentItem.price || currentItem.price <= 0
    ) {
      alert("Harap lengkapi semua field item (Barang, Warehouse, Rak, Harga, Jumlah).");
      return;
    }

    // Kalkulasi nilai
    const qty = currentItem.quantity || 1;
    const price = currentItem.price || 0;
    const subtotal = qty * price;
    const discount = currentItem.discount_value || 0;
    const tax = currentItem.tax_value || 0; // Asumsi ini nilai, bukan rate
    const total = subtotal - discount + tax;

    // Siapkan data yang akan ditambahkan (menggunakan tipe lokal)
    const itemToAdd: BarangMasukDetailLokal = {
      product_id: currentItem.product_id,
      warehouse_storage_id: currentItem.warehouse_storage_id,
      description: currentItem.description || null,
      quantity: qty,
      price: price,
      subtotal: subtotal,
      discount_type: currentItem.discount_type || null,
      discount_rate: currentItem.discount_rate || null,
      discount_value: discount,
      tax_rate: currentItem.tax_rate || null,
      tax_value: tax,
      total: total,
      // Data untuk display
      barang_name: currentItem.barang_name,
      warehouse_name: currentItem.warehouse_name,
      rak_name: currentItem.rak_name,
    };

    // 1. Cari apakah item (barang + rak + harga) yang sama sudah ada
    const existingItemIndex = details.findIndex(
      (item) =>
        item.product_id === itemToAdd.product_id &&
        item.warehouse_storage_id === itemToAdd.warehouse_storage_id &&
        item.price === itemToAdd.price
    );

    if (existingItemIndex > -1) {
      // 2. Jika ADA, update quantity & total
      setDetails(prevDetails => 
        prevDetails.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + itemToAdd.quantity;
            const newSubtotal = item.subtotal + itemToAdd.subtotal;
            const newDiscount = item.discount_value + itemToAdd.discount_value;
            const newTax = item.tax_value + itemToAdd.tax_value;
            const newTotal = item.total + itemToAdd.total;
            
            return {
              ...item,
              quantity: newQuantity,
              subtotal: newSubtotal,
              discount_value: newDiscount,
              tax_value: newTax,
              total: newTotal,
            };
          }
          return item;
        })
      );
    } else {
      // 3. Jika TIDAK ADA, tambahkan sebagai baris baru
      setDetails(prev => [ ...prev, itemToAdd ]);
    }
    
    // Reset form item
    setCurrentItem({
      quantity: 1,
      price: 0,
      product_id: 0,
      warehouse_id: 0,
      warehouse_storage_id: 0,
      subtotal: 0,
      discount_rate: 0,
      discount_value: 0,
      tax_value: 0,
      total: 0
    });
    setDetailWarehouseSearch("");
    setRakSearch("");
    setBarangSearch("");
  };

  // Handler untuk menghapus item dari tabel detail
  const handleRemoveItem = (index: number) => {
    setDetails(prev => prev.filter((_, i) => i !== index));
  };

  const handleSimpanTransaksi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (details.length === 0) {
      await Swal.fire("Peringatan", "Harap tambahkan minimal 1 item barang.", "warning");
      return;
    }
    if (!header.warehouse_id || header.warehouse_id === 0) {
      await Swal.fire("Peringatan", "Harap pilih Warehouse utama di bagian header.", "warning");
      return;
    }

    try {
      const detailsToSubmit: CreateBarangMasukDetailRequest[] = details.map(d => ({
        product_id: d.product_id,
        warehouse_storage_id: d.warehouse_storage_id,
        description: d.description,
        quantity: d.quantity,
        price: d.price,
        subtotal: d.subtotal,
        discount_type: d.discount_type,
        // discount_rate: d.discount_rate,
        discount_rate: 0,
        discount_value: d.discount_value,
        // tax_rate: d.tax_rate,
        tax_rate: 0,
        tax_value: d.tax_value,
        total: d.total,
      }));

      const payload: CreateBarangMasukRequest = {
        warehouse_id: header.warehouse_id,
        date: header.date!,
        due_date: header.due_date!,
        supplier: header.supplier || null,
        notes: header.notes || null,
        details: detailsToSubmit,
      };

      await createBarangMasuk(payload).unwrap();
      await Swal.fire("Sukses", "Barang ditambahkan", "success");
      router.push("/admin/transaksi/barang-masuk");
    } catch (error) {
      console.error(error);
      await Swal.fire("Gagal", "Gagal menyimpan data", "error");
    }
  };

  return (
    <form onSubmit={handleSimpanTransaksi} className="p-6 space-y-6">
      {/* Tombol Aksi Utama */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Form Barang Masuk Baru</h3>
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isCreating}>
            Batal
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Simpan Transaksi
          </Button>
        </div>
      </div>

      {/* Card 1: Header Transaksi */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6"> {/* Added pt-6 for padding */}
          
          {/* WAREHOUSE HEADER */}
          <div className="space-y-2">
            <div className="flex-1 w-full space-y-2" ref={dropdownHeaderWarehouseRef}>
              <Label>Warehouse (Tujuan Utama)</Label>
              <Input
                placeholder="Cari Warehouse..."
                value={headerWarehouseSearch}
                onChange={(e) => {
                  setHeaderWarehouseSearch(e.target.value);
                  setDropdownHeaderWarehouseOpen(true);
                  // Jika user mengetik, reset ID
                  setHeader(p => ({ ...p, warehouse_id: 0 }));
                }}
                onFocus={() => setDropdownHeaderWarehouseOpen(true)}
                autoComplete="off"
              />
              {isDropdownHeaderWarehouseOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isWarehouseLoading ? <Loader2 className="h-5 w-5 animate-spin m-4" /> :
                    filteredHeaderWarehouse.map((w: Warehouse) => (
                      <button type="button" key={w.id}
                        onClick={() => {
                          // SET HEADER WAREHOUSE
                          setHeader(p => ({ ...p, warehouse_id: w.id }));
                          setHeaderWarehouseSearch(w.name);
                          setDropdownHeaderWarehouseOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >{w.name}</button>
                    ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              type="text"
              value={header.supplier ?? ""}
              onChange={(e) => setHeader(p => ({ ...p, supplier: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={header.date}
              onChange={(e) => setHeader(p => ({ ...p, date: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Tanggal Jatuh Tempo</Label>
            <Input
              id="due_date"
              type="date"
              value={header.due_date}
              onChange={(e) => setHeader(p => ({ ...p, due_date: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              placeholder="Keterangan transaksi (misal: Penerimaan dari Supplier X)"
              value={header.notes ?? ""}
              onChange={(e) => setHeader(p => ({ ...p, notes: e.target.value }))}
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
            {/* Barang */}
            <div className="flex-1 w-full space-y-2" ref={dropdownBarangRef}>
              <Label>Barang</Label>
              <Input
                placeholder="Cari Barang..."
                value={barangSearch}
                onChange={(e) => {
                  setBarangSearch(e.target.value);
                  setDropdownBarangOpen(true);
                  if (currentItem.product_id) {
                    setCurrentItem(p => ({ ...p, product_id: 0, barang_name: undefined }));
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
                          setCurrentItem(p => ({ ...p, product_id: b.id, barang_name: b.name }));
                          setBarangSearch(b.name);
                          setDropdownBarangOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >{b.sku} - {b.name}</button>
                    ))}
                </div>
              )}
            </div>

            {/* WAREHOUSE DETAIL (UNTUK RAK) */}
            <div className="flex-1 w-full space-y-2" ref={dropdownDetailWarehouseRef}>
              <Label>Warehouse (Lokasi Rak)</Label>
              <Input
                placeholder="Cari Warehouse..."
                value={detailWarehouseSearch}
                onChange={(e) => {
                  setDetailWarehouseSearch(e.target.value);
                  setDropdownDetailWarehouseOpen(true);
                  // Jika user mengetik, reset ID rak dan warehouse
                  if (currentItem.warehouse_id) {
                    setCurrentItem(p => ({ ...p, warehouse_id: 0, warehouse_name: undefined, warehouse_storage_id: 0, rak_name: undefined }));
                    setRakSearch("");
                  }
                }}
                onFocus={() => setDropdownDetailWarehouseOpen(true)}
                autoComplete="off"
              />
              {isDropdownDetailWarehouseOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isWarehouseLoading ? <Loader2 className="h-5 w-5 animate-spin m-4" /> :
                    filteredDetailWarehouse.map((w: Warehouse) => (
                      <button type="button" key={w.id}
                        onClick={() => {
                          // SET CURRENT ITEM WAREHOUSE (SEMENTARA)
                          setCurrentItem(p => ({ ...p, warehouse_id: w.id, warehouse_name: w.name }));
                          setDetailWarehouseSearch(w.name);
                          setDropdownDetailWarehouseOpen(false);
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
                  if (currentItem.warehouse_storage_id) {
                    setCurrentItem(p => ({ ...p, warehouse_storage_id: 0, rak_name: undefined }));
                  }
                }}
                onFocus={() => currentItem.warehouse_id && setDropdownRakOpen(true)}
                disabled={!currentItem.warehouse_id}
                autoComplete="off"
              />
              {isDropdownRakOpen && currentItem.warehouse_id && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isRakLoading ? <Loader2 className="h-5 w-5 animate-spin m-4" /> :
                    (filteredRak.length > 0 ? filteredRak.map((r: Rak) => (
                      <button type="button" key={r.id}
                        onClick={() => {
                          // SET RAK ID (warehouse_storage_id)
                          setCurrentItem(p => ({ ...p, warehouse_storage_id: r.id, rak_name: r.name }));
                          setRakSearch(r.name);
                          setDropdownRakOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >{r.name}</button>
                    )) : <span className="block p-4 text-sm text-gray-500">Rak tidak ditemukan.</span>
                    )}
                </div>
              )}
            </div>
            
            <div className="w-full md:w-24 space-y-2">
              <Label>Harga</Label>
              <Input
                type="number"
                min="0"
                value={currentItem.price}
                onChange={(e) => setCurrentItem(p => ({ ...p, price: parseInt(e.target.value) || 0 }))}
              />
            </div>
            {/* Jumlah */}
            <div className="w-full md:w-24 space-y-2">
              <Label>Jumlah</Label>
              <Input
                type="number"
                min="1"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="w-full md:w-24 space-y-2">
              <Label>Total</Label>
              <Input
                type="number"
                value={(currentItem.quantity ?? 1) * (currentItem.price ?? 0)}
                readOnly
                className="bg-muted"
              />
            </div>
            {/* Tombol Tambah Item */}
            <Button type="button" onClick={handleAddItem} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabel Item yang Sudah Ditambah */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-2">Barang</th>
                  <th className="px-4 py-2">Warehouse (Rak)</th>
                  <th className="px-4 py-2">Rak</th>
                  <th className="px-4 py-2 text-right">Harga</th>
                  <th className="px-4 py-2 text-right">Jumlah</th>
                  <th className="px-4 py-2 text-right">Total</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      Belum ada barang yang ditambahkan.
                    </td>
                  </tr>
                ) : (
                  details.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 font-medium">{item.barang_name}</td>
                      <td className="px-4 py-2">{item.warehouse_name}</td>
                      <td className="px-4 py-2">{item.rak_name}</td>
                      <td className="px-4 py-2 text-right">{item.price}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">{item.total}</td>
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