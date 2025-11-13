"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import {
  useGetInventoryListQuery
} from "@/services/admin/master/barang.service";
import {
  useCreateStockOpnameMutation
} from "@/services/admin/stock-opname.service";
import { Barang, Inventory } from "@/types/admin/master/barang";
import { Input } from "@/components/ui/input";
import ActionsGroup from "@/components/admin-components/actions-group";
import { useGetWarehouseListQuery } from "@/services/admin/master/warehouse.service";
import { useGetRakListQuery } from "@/services/admin/master/rak.service";
import { useGetKategoriListQuery } from "@/services/admin/master/kategori.service";
import { Download, Edit, Loader2 } from "lucide-react";
import FormBarang from "@/components/form-modal/admin/master/barang-form";
// IMPORT BARU: Import modal detail yang akan kita buat
import DetailBarangModal from "@/components/modals/barang-detail"; 
import FormPenyesuaianStok, { ItemUntukPenyesuaian } from "@/components/form-modal/admin/FormPenyesuaianStok";
import { CreateStockOpnameRequest } from "@/types/admin/stock-opname";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // Asumsi pakai ShadCN Dialog
import Swal from "sweetalert2";

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
  const { isOpen: isFormOpen, closeModal: closeFormModal } = useModal();
  const [createStockOpname, { isLoading: isCreating }] = useCreateStockOpnameMutation();

  // State BARU: untuk Modal Detail
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailBarang, setSelectedDetailBarang] = useState<Inventory | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk menyimpan item mana yang sedang dipilih
  const [selectedItem, setSelectedItem] = useState<ItemUntukPenyesuaian | null>(null);

  // State untuk data form
  const [formState, setFormState] = useState<Partial<CreateStockOpnameRequest>>({});
  // -----------------------------

  // Fungsi ini dipanggil saat tombol "Penyesuaian" di klik
  const handleOpenModal = (item: ItemUntukPenyesuaian) => {
    setSelectedItem(item); // Simpan item yang dipilih

    // ----- INI BAGIAN PENTING -----
    // Mengisi form state sesuai permintaan Anda
    setFormState({
      inventory_id: item.id,       // <-- Sesuai permintaan Anda
      initial_stock: item.stock, // Ambil stok sistem dari item
      date: new Date().toISOString().split('T')[0], // Default tanggal hari ini
      counted_stock: item.stock, // Default stok fisik = stok sistem
      notes: "",
    });
    // -----------------------------

    setIsModalOpen(true); // Buka modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormState({}); // Kosongkan form state
  };

  const handleSubmitSuccess = async () => {
    try {
      if (
        !formState.inventory_id ||
        !formState.date ||
        formState.initial_stock === undefined ||
        formState.counted_stock === undefined
      ) {
        // Validasi minimal
        return;
      }
      const payload: CreateStockOpnameRequest = {
        inventory_id: formState.inventory_id,
        date: formState.date,
        initial_stock: formState.initial_stock,
        counted_stock: formState.counted_stock,
        difference: formState.counted_stock - formState.initial_stock,
        cogs: 0,
        total: 0,
        notes: formState.notes || "",
      };

      await createStockOpname(payload).unwrap();
      handleCloseModal();
      Swal.fire("Sukses", "Barang ditambahkan", "success");
      refetch();
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan", "error");
    }
  };

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const [filterWarehouseId, setFilterWarehouseId] = useState<number | undefined>(
    undefined
  );

  const [filterRakId, setFilterRakId] = useState<number | undefined>(
    undefined
  );

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
  
  const { data, isLoading, refetch } = useGetInventoryListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: query,
    warehouse_id: filterWarehouseId,
    warehouse_storage_id: filterRakId,
    low_stock: undefined,
  });

  useEffect(() => {
    refetch();
  }, []);

  const barangList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const filteredData = useMemo(() => {
    if (!query) return barangList;
    return barangList.filter(
      (item) =>
        item.warehouse_name.toLowerCase().includes(query.toLowerCase())
    );
  }, [barangList, query]);


  const handleDetail = (item: Inventory) => {
    setSelectedDetailBarang(item);
    setIsDetailOpen(true);
  };

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
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold">Data Kartu Stok</h3>
            <Button
              onClick={async () => {
                // Ambil data yang sudah difilter
                const exportData = filteredData.map((item) => ({
                  "Kode Warehouse": item.warehouse_code,
                  Warehouse: item.warehouse_name,
                  Rak: item.warehouse_storage_name,
                  SKU: item.product_sku,
                  Nama: item.product_name,
                  Stok: item.stock,
                  "Min. Stok": item.min_stock,
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
                <th className="px-4 py-2">Warehouse</th>
                <th className="px-4 py-2">Rak</th>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">Min. Stok</th>
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
                        <Button 
                          variant="outline"
                          size="sm"
                          title="Stock Opname"
                          onClick={() => handleOpenModal(item as ItemUntukPenyesuaian)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Stok
                        </Button>
                        <ActionsGroup
                          handleDetail={() => handleDetail(item)}
                          // handleDelete={() => handleDelete(item.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium">{item.warehouse_name}</td>
                    <td className="px-4 py-2 font-medium">{item.warehouse_storage_name}</td>
                    <td className="px-4 py-2 font-medium">{item.product_sku}</td>
                    <td className="px-4 py-2 font-medium">{item.product_name}</td>
                    <td className="px-4 py-2 font-medium">{item.stock}</td>
                    <td className="px-4 py-2 font-medium">{item.min_stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* ----- MODAL DI LUAR TABEL ----- */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent 
              className="p-0" 
              onEscapeKeyDown={handleCloseModal}
              onInteractOutside={handleCloseModal}
            >
              <FormPenyesuaianStok
                item={selectedItem}
                form={formState}
                setForm={setFormState}
                onCancel={handleCloseModal}
                onSubmit={handleSubmitSuccess}
              />
            </DialogContent>
          </Dialog>
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