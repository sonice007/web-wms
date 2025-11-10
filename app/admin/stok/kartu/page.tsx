"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import {
  useGetBarangListQuery,
} from "@/services/admin/master/barang.service";
import { Barang } from "@/types/admin/master/barang";
import { Input } from "@/components/ui/input";
import ActionsGroup from "@/components/admin-components/actions-group";
import { useGetWarehouseListQuery } from "@/services/admin/master/warehouse.service";
import { useGetRakListQuery } from "@/services/admin/master/rak.service";
import { useGetKategoriListQuery } from "@/services/admin/master/kategori.service";
import { Download, Loader2, Plus } from "lucide-react";
import FormBarang from "@/components/form-modal/admin/master/barang-form";
// IMPORT BARU: Import modal detail yang akan kita buat
import DetailBarangModal from "@/components/modals/barang-detail"; 

export default function BarangPage() {
  const [form, setForm] = useState<Partial<Barang>>({
    product_category_id: 0,
    sku: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    min_stock: 0,
    unit: "",
    status: true,
  });
  const [readonly, setReadonly] = useState(false);
  
  // State untuk Form Modal (Tambah/Edit)
  const { isOpen: isFormOpen, openModal: openFormModal, closeModal: closeFormModal } = useModal();
  
  // State BARU: untuk Modal Detail
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailBarang, setSelectedDetailBarang] = useState<Barang | null>(null);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const [filterWarehouseId, setFilterWarehouseId] = useState<number | undefined>(
    undefined
  );

  const [filterRakId, setFilterRakId] = useState<number | undefined>(
    undefined
  );

  // ... (SEMUA KODE FILTER WAREHOUSE, RAK, KATEGORI TETAP SAMA) ...
  // [Kode untuk warehouseSearch, useGetWarehouseListQuery, dropdownWarehouseRef, dst... tidak berubah]
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const { data: warehouseData, isLoading: isWarehouseLoading } = useGetWarehouseListQuery({ page: 1, paginate: 100, search: warehouseSearch });
  const [isDropdownWarehouseOpen, setDropdownWarehouseOpen] = useState(false);
  const dropdownWarehouseRef = useRef<HTMLDivElement>(null);
  const isWarehouseDisabled = false;
  useEffect(() => {
    if (filterWarehouseId && warehouseData?.data) {
      const selectedWarehouse = warehouseData.data.find(
        (p) => p.id === filterWarehouseId
      );
      if (selectedWarehouse) setWarehouseSearch(selectedWarehouse.name);
    } 
  }, [filterWarehouseId, warehouseData]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownWarehouseRef.current &&
        !dropdownWarehouseRef.current.contains(event.target as Node)
      ) {
        setDropdownWarehouseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownWarehouseRef]);
  const filteredWarehouse = useMemo(() => {
    if (!warehouseData?.data || warehouseSearch.length < 2) return [];
    return warehouseData.data.filter((warehouse) =>
      warehouse.name.toLowerCase().includes(warehouseSearch.toLowerCase())
    );
  }, [warehouseSearch, warehouseData]);
  const handleWarehouseSelect = (warehouse: { id: number; name: string }) => {
    setFilterWarehouseId(warehouse.id);
    setWarehouseSearch(warehouse.name);
    setDropdownWarehouseOpen(false);
  };

  // [Kode untuk rakSearch, useGetRakListQuery, dropdownRakRef, dst... tidak berubah]
  const [rakSearch, setRakSearch] = useState("");
  const { data: rakData, isLoading: isRakLoading } = useGetRakListQuery({
    page: 1,
    paginate: 100,
    search: rakSearch,
    warehouse_id: filterWarehouseId || 0,
  });
  const [isDropdownRakOpen, setDropdownRakOpen] = useState(false);
  const dropdownRakRef = useRef<HTMLDivElement>(null);
  const isRakDisabled = filterWarehouseId ? false : true;
  useEffect(() => {
    if (filterRakId && rakData?.data) {
      const selectedRak = rakData.data.find(
        (p) => p.id === filterRakId
      );
      if (selectedRak) setRakSearch(selectedRak.name);
    }
    else if (!filterRakId) {
      // PERUBAHAN KECIL: Reset rak search jika warehouse di-clear
      setRakSearch("");
    }
  }, [filterRakId, rakData]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRakRef.current &&
        !dropdownRakRef.current.contains(event.target as Node)
      ) {
        setDropdownRakOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRakRef]);
  const filteredRak = useMemo(() => {
    if (!rakData?.data || rakSearch.length < 2) return [];
    return rakData.data.filter((rak) =>
      rak.name.toLowerCase().includes(rakSearch.toLowerCase())
    );
  }, [rakSearch, rakData]);
  const handleRakSelect = (rak: { id: number; name: string }) => {
    setFilterRakId(rak.id);
    setRakSearch(rak.name);
    setDropdownRakOpen(false);
  };

  // [Kode untuk filterKategoriId, kategoriSearch, useGetKategoriListQuery, dst... tidak berubah]
  const [filterKategoriId, setFilterKategoriId] = useState<number | undefined>(
    undefined
  );
  const [kategoriSearch, setKategoriSearch] = useState("");
  const { data: kategoriData, isLoading: isKategoriLoading } = useGetKategoriListQuery({ page: 1, paginate: 100, search: kategoriSearch });
  const [isDropdownKategoriOpen, setDropdownKategoriOpen] = useState(false);
  const dropdownKategoriRef = useRef<HTMLDivElement>(null);
  const isKategoriDisabled = false;
  useEffect(() => {
    if (filterKategoriId && kategoriData?.data) {
      const selectedKategori = kategoriData.data.find(
        (p) => p.id === filterKategoriId
      );
      if (selectedKategori) setKategoriSearch(selectedKategori.name);
    }
  }, [filterKategoriId, kategoriData]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownKategoriRef.current &&
        !dropdownKategoriRef.current.contains(event.target as Node)
      ) {
        setDropdownKategoriOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownKategoriRef]);
  const filteredKategori = useMemo(() => {
    if (!kategoriData?.data || kategoriSearch.length < 2) return [];
    return kategoriData.data.filter((kategori) =>
      kategori.name.toLowerCase().includes(kategoriSearch.toLowerCase())
    );
  }, [kategoriSearch, kategoriData]);
  const handleKategoriSelect = (kategori: { id: number; name: string }) => {
    setFilterKategoriId(kategori.id);
    setKategoriSearch(kategori.name);
    setDropdownKategoriOpen(false);
  };
  // ... (AKHIR DARI KODE FILTER) ...


  const { data, isLoading, refetch } = useGetBarangListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: query,
    // PERUBAHAN: Teruskan filter ID ke query
    // warehouse_id: filterWarehouseId,
    // rak_id: filterRakId,
    // product_category_id: filterKategoriId,
  });

  const barangList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  // PERUBAHAN: handleDetail sekarang membuka Modal Detail
  const handleDetail = (item: Barang) => {
    setSelectedDetailBarang(item);
    setIsDetailOpen(true);
  };

  // BARU: Fungsi untuk membuka form tambah
  const handleAdd = () => {
    setForm({ // Reset form ke default
      product_category_id: 0,
      sku: "",
      name: "",
      description: "",
      price: 0,
      stock: 0,
      min_stock: 0,
      unit: "",
      status: true,
    });
    setReadonly(false);
    openFormModal();
  };

  // BARU: Fungsi untuk membuka form edit (Asumsi)
  // Anda bisa meng-hook ini ke ActionsGroup jika ada tombol edit
  const handleEdit = (item: Barang) => {
    setForm(item);
    setReadonly(false);
    openFormModal();
  };

  // Filter data berdasarkan search query
  const filteredData = useMemo(() => {
    // Filtering sisi klien tidak lagi diperlukan jika query API menangani 'search'
    // return barangList; 
    
    // Jika API search belum live, gunakan filter sisi klien ini:
    if (!query) return barangList;
    return barangList.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [barangList, query]);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-md bg-white p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2">
          {/* Kiri: filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
            <div className="flex-1">
              <Input
                placeholder="Cari barang..."
                value={query}
                onChange={(e) => {
                  const q = e.target.value;
                  setQuery(q);
                  // PERUBAHAN: Reset halaman saat query berubah
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>
            {/* ... (SEMUA INPUT FILTER TETAP SAMA) ... */}
            <div className="w-full md:w-52">
              <div className="relative" ref={dropdownWarehouseRef}>
                <Input
                  id="warehouse_id"
                  placeholder="Filter Warehouse..."
                  value={warehouseSearch}
                  onChange={(e) => {
                    setWarehouseSearch(e.target.value);
                    setDropdownWarehouseOpen(true);
                    if (filterWarehouseId) {
                      setFilterWarehouseId(undefined);
                      setFilterRakId(undefined); // Reset rak jika warehouse berubah
                      setRakSearch("");
                    }
                    setWarehouseSearch(e.target.value);
                  }}
                  onFocus={() => setDropdownWarehouseOpen(true)}
                  readOnly={readonly || isWarehouseDisabled}
                  required
                  autoComplete="off"
                  disabled={isWarehouseDisabled}
                />
                {isDropdownWarehouseOpen && !isWarehouseDisabled && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {isWarehouseLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
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
                      <p className="text-sm text-gray-500 p-3">
                        Warehouse tidak ditemukan.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-52">
              <div className="relative" ref={dropdownRakRef}>
                <Input
                  id="rak_id"
                  placeholder={
                    !filterWarehouseId
                      ? "Pilih warehouse..."
                      : "Filter Rak..."
                  }
                  value={rakSearch}
                  onChange={(e) => {
                    setRakSearch(e.target.value);
                    setDropdownRakOpen(true);
                    if (filterRakId) setFilterRakId(undefined);
                  }}
                  onFocus={() => {
                    if (filterWarehouseId) setDropdownRakOpen(true);
                  }}
                  readOnly={readonly || isRakDisabled}
                  required
                  autoComplete="off"
                  disabled={!filterWarehouseId || isRakDisabled}
                />
                {isDropdownRakOpen && filterWarehouseId && !isRakDisabled && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {isRakLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    ) : filteredRak.length > 0 ? (
                      filteredRak.map((rak) => (
                        <button
                          type="button"
                          key={rak.id}
                          onClick={() => handleRakSelect(rak)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                        >
                          {rak.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 p-3">
                        Rak tidak ditemukan.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-52">
              <div className="relative" ref={dropdownKategoriRef}>
                <Input
                  id="kategori_id"
                  placeholder="Filter Kategori..."
                  value={kategoriSearch}
                  onChange={(e) => {
                    setKategoriSearch(e.target.value);
                    setDropdownKategoriOpen(true);
                    if (filterKategoriId) {
                      setFilterKategoriId(undefined);
                    }
                    setKategoriSearch(e.target.value);
                  }}
                  onFocus={() => setDropdownKategoriOpen(true)}
                  readOnly={readonly || isKategoriDisabled}
                  required
                  autoComplete="off"
                  disabled={isKategoriDisabled}
                />
                {isDropdownKategoriOpen && !isKategoriDisabled && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {isKategoriLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
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
                      <p className="text-sm text-gray-500 p-3">
                        Kategori tidak ditemukan.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold">Data Kartu Stok</h3>
            <Button
              onClick={async () => {
                // Ambil data yang sudah difilter
                const exportData = filteredData.map((item) => ({
                  Kategori: item.category_name,
                  SKU: item.sku,
                  Nama: item.name,
                  Harga: item.price,
                  Stok: item.stock,
                  "Min. Stok": item.min_stock,
                  Unit: item.unit,
                  Status: item.status ? "Aktif" : "Tidak Aktif",
                }));

                // Import xlsx secara dinamis agar tidak membebani bundle utama
                const XLSX = await import("xlsx");

                // Buat worksheet dan workbook
                const worksheet = XLSX.utils.json_to_sheet(exportData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "KartuStok");

                // Export ke file
                XLSX.writeFile(workbook, "kartu-stok.xlsx");
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Kartu Stok
            </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Nama</th>
                {/* <th className="px-4 py-2">Deskripsi</th> */}
                <th className="px-4 py-2">Harga</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">Min. Stok</th>
                <th className="px-4 py-2">Unit</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <ActionsGroup
                          handleDetail={() => handleDetail(item)}
                          // Asumsi Anda memiliki handleEdit dan handleDelete
                          // handleEdit={() => handleEdit(item)}
                          // handleDelete={() => handleDelete(item.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium">{item.category_name}</td>
                    <td className="px-4 py-2 font-medium">{item.sku}</td>
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    {/* <td className="px-4 py-2 font-medium">{item.description}</td> */}
                    <td className="px-4 py-2 font-medium">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price ?? 0)}
                    </td>
                    <td className="px-4 py-2 font-medium">{item.stock}</td>
                    <td className="px-4 py-2 font-medium">{item.min_stock}</td>
                    <td className="px-4 py-2 font-medium">{item.unit}</td>
                    <td className="px-4 py-2 font-medium">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        <div className="p-4 flex items-center justify-between bg-muted">
          <div className="text-sm">
            Halaman <strong>{currentPage}</strong> dari{" "}
            <strong>{lastPage}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={currentPage >= lastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Modal untuk Form (Tambah/Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <FormBarang
            form={form}
            setForm={setForm}
            onCancel={() => {
              setForm({ name: "" }); // Reset form
              setReadonly(false);
              closeFormModal();
            }}
            onSubmit={() => {
              refetch();
              closeFormModal(); // Tutup modal setelah submit
            }}
            readonly={readonly}
            isLoading={isLoading} // Anda mungkin perlu state loading khusus untuk mutasi
          />
        </div>
      )}

      {/* Modal BARU untuk Detail & Kartu Stok */}
      {isDetailOpen && selectedDetailBarang && (
        <DetailBarangModal
          barang={selectedDetailBarang}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedDetailBarang(null);
          }}
        />
      )}
    </div>
  );
}