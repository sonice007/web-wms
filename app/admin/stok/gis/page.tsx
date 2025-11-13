"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Inventory } from "@/types/admin/master/barang";
import {
  Building2,
  Package,
  LayoutGrid,
  Search,
  X,
  DollarSign, // Ikon baru untuk Total Value
  Loader2,  // Ikon loading
} from "lucide-react";

// Impor untuk Modal (Dialog) dan Input
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  useGetGisWarehouseQuery, 
  useGetGisWarehouseByIdQuery 
} from "@/services/admin/dashboard.service";

import {
  useGetInventoryListQuery
} from "@/services/admin/master/barang.service";

// Impor Peta
import { Map, Marker, Overlay } from "pigeon-maps";

// ===== Utilitas =====
const formatNumber = (num: number): string =>
  new Intl.NumberFormat("id-ID").format(num);
  
const formatCurrency = (num: number): string =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

// ===== Tipe Data (Asumsi dari kode Anda) =====
interface WarehouseItem {
  id: string;
  name: string;
  stok: number;
}
interface WarehouseData {
  id: string; // ID ini bisa jadi string, kita akan konversi ke number
  name: string;
  posisi: [number, number]; // [lat, lon]
  totalKategori: number;
  totalBarang: number;
  items: WarehouseItem[];
}

// ===== Data Dummy (Sama) =====
const DUMMY_WAREHOUSE_DATA: WarehouseData[] = [
  // ... data dummy Anda tidak berubah ...
  {
    id: "jkt",
    name: "Warehouse Jakarta",
    posisi: [-6.2088, 106.8456],
    totalKategori: 50,
    totalBarang: 5200,
    items: [
      { id: "jkt1", name: "Laptop XPS 15", stok: 100 },
      { id: "jkt2", name: "Mouse Logitech MX", stok: 350 },
    ],
  },
  {
    id: "bdg",
    name: "Warehouse Bandung",
    posisi: [-6.9175, 107.6191],
    totalKategori: 30,
    totalBarang: 3100,
    items: [
      { id: "bdg1", name: "Kabel HDMI 2m", stok: 500 },
      // ...
    ],
  },
  // ...
];


// ===== Komponen Peta =====

export default function StokGisPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

  // 1. Hook untuk list warehouse (tetap)
  // Fetch list warehouse
  const { data: gisWarehouseData, isFetching: isGisWarehouseFetching } = 
    useGetGisWarehouseQuery({});

  // 2. State untuk ID warehouse yang akan di-fetch detailnya
  const [fetchId, setFetchId] = useState<number | null>(null);

  // 3. Hook untuk detail warehouse (dipanggil di top-level)
  const { 
    data: gisWarehouseByIdData, 
    isFetching: isGisWarehouseByIdFetching 
  } = useGetGisWarehouseByIdQuery(
    // Parameter: { id }
    { id: fetchId! }, 
    // Opsi: 'skip' jika fetchId null (penting!)
    { skip: !fetchId } 
  );

  // State untuk Modal (Dialog)
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<Inventory | null>(null);
  
  // State untuk Popup (Overlay) di Peta
  const [activeMarker, setActiveMarker] = useState<WarehouseData | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");

  const warehouseData = gisWarehouseData || DUMMY_WAREHOUSE_DATA;
  const isFetching = isGisWarehouseFetching; // Hanya loading list awal

  // Opsi tahun
  const yearOptions = useMemo(
    () => Array.from({ length: 6 }, (_, i) => currentYear - i),
    [currentYear]
  );

  // Query inventory list for selected warehouse
  const { data: inventoryData } = useGetInventoryListQuery(
    selectedWarehouse
      ? {
          page: 1,
          paginate: 100,
          search: searchTerm,
          warehouse_id: Number(selectedWarehouse.id),
        }
      : { page: 1, paginate: 100, search: searchTerm, warehouse_id: undefined },
    { skip: !selectedWarehouse }
  );

  // filteredItems available in render scope
  const filteredItems = useMemo(() => {
    const itemsFromApi = inventoryData?.data ?? [];
    return itemsFromApi.length > 0
      ? itemsFromApi
      : [];
  }, [inventoryData, selectedWarehouse, searchTerm]);

  // Handler Modal (Dialog)
  const handleOpenModal = (warehouse: WarehouseData) => {
    setActiveMarker(null); // Tutup popup peta
    setFetchId(Number(warehouse.id)); // **INI KUNCINYA**: Memicu hook fetch by ID
    setSelectedWarehouse({
      id: Number(warehouse.id),
      warehouse_code: "",
    } as Inventory); // Set ID saja dulu
    setActiveMarker(warehouse);
    setSearchTerm("");
  };

  const handleCloseModal = () => {
    setSelectedWarehouse(null);
    setFetchId(null); // **INI KUNCINYA**: Reset fetch ID agar query berhenti
  };

  // Komponen Tabel
  const SimpleTable = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full text-sm text-left text-gray-500">
        {children}
      </table>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header dan Filter Tahun */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* ... header tidak berubah ... */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Data Stok di Warehouse (GIS)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau lokasi dan detail stok warehouse secara geografis
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* ... filter tahun tidak berubah ... */}
          <select
            id="year"
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {isFetching && (
            <span className="text-xs text-gray-500">Memuat...</span>
          )}
        </div>
      </div>

      {/* Konten Peta */}
      <Card>
        <CardContent className="h-[60vh] md:h-[68vh] w-full p-4 mt-[-20px]">
          <Map 
            height={540}
            defaultCenter={[-6.9175, 109.6191]}
            defaultZoom={7}
            onClick={() => setActiveMarker(null)}
          >
            {warehouseData.map((wh) => (
              <Marker
                key={wh.id}
                anchor={wh.posisi}
                color="#3B82F6"
                onClick={() => setActiveMarker(wh)}
              />
            ))}

            {activeMarker && (
              <Overlay
                anchor={activeMarker.posisi}
                offset={[0, 0]}
              >
                <div className="w-60 bg-white rounded-lg shadow-lg p-3 relative">
                  {/* ... popup overlay tidak berubah ... */}
                  <button
                    onClick={() => setActiveMarker(null)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow"
                  >
                    <X className="h-4 w-4 text-gray-600"/>
                  </button>
                  <div className="space-y-2">
                    <h3 className="font-bold text-md">{activeMarker.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <LayoutGrid className="h-4 w-4 text-blue-600" />
                      <span>{formatNumber(activeMarker.totalKategori)} Kategori</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-emerald-600" />
                      <span>{formatNumber(activeMarker.totalBarang)} Barang</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleOpenModal(activeMarker)}
                    >
                      Lihat Detail Stok
                    </Button>
                  </div>
                </div>
              </Overlay>
            )}
          </Map>
        </CardContent>
      </Card>

      {/* ===== Modal / Dialog untuk Detail Stok (DIPERBARUI) ===== */}
      <Dialog open={!!selectedWarehouse} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Detail Stok
            </DialogTitle>
          </DialogHeader>
          <DialogClose
            onClick={handleCloseModal}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {/* ----- Konten Modal DIPERBARUI ----- */}
          
          {/* 1. Tampilkan Loading jika sedang fetch data by ID */}
          {isGisWarehouseByIdFetching && (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2">Memuat data terbaru...</span>
            </div>
          )}

          {/* 2. Tampilkan data jika fetch selesai */}
          {!isGisWarehouseByIdFetching && (
            <>
              {/* Search Bar di dalam Modal */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari name barang di warehouse ini..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Tabel Daftar Barang (Scrollable) */}
              <div className="flex-1 overflow-y-auto mt-4">
                <SimpleTable>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2">Warehouse</th>
                      <th className="px-4 py-2">Rak</th>
                      <th className="px-4 py-2">SKU</th>
                      <th className="px-4 py-2">Nama</th>
                      <th className="px-4 py-2">Stok</th>
                      <th className="px-4 py-2">Min. Stok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Logika 'filteredItems' tetap bekerja */}
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="bg-white border-b">
                        <td className="px-4 py-2 font-medium">{item.warehouse_name}</td>
                        <td className="px-4 py-2 font-medium">{item.warehouse_storage_name}</td>
                        <td className="px-4 py-2 font-medium">{item.product_sku}</td>
                        <td className="px-4 py-2 font-medium">{item.product_name}</td>
                        <td className="px-4 py-2 font-medium">{item.stock}</td>
                        <td className="px-4 py-2 font-medium">{item.min_stock}</td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="text-center text-gray-500 py-6"
                        >
                          {searchTerm
                            ? "Barang tidak ditemukan."
                            : "Tidak ada barang di warehouse ini."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </SimpleTable>
              </div>
            </>
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
}