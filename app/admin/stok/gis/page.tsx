"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Package,
  LayoutGrid,
  Search,
  X,
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

// ===== Impor Peta Baru: Pigeon-Maps =====
// Tidak perlu dynamic import!
import { Map, Marker, Overlay } from "pigeon-maps";

// ===== Utilitas =====
const formatNumber = (num: number): string =>
  new Intl.NumberFormat("id-ID").format(num);

// ===== Tipe Data (Sama) =====
interface WarehouseItem {
  id: string;
  nama: string;
  stok: number;
}
interface WarehouseData {
  id: string;
  nama: string;
  posisi: [number, number]; // [lat, lon]
  totalKategori: number;
  totalBarang: number;
  items: WarehouseItem[];
}

// ===== Data Dummy (Sama) =====
const DUMMY_WAREHOUSE_DATA: WarehouseData[] = [
  {
    id: "jkt",
    nama: "Warehouse Jakarta",
    posisi: [-6.2088, 106.8456],
    totalKategori: 50,
    totalBarang: 5200,
    items: [
      { id: "jkt1", nama: "Laptop XPS 15", stok: 100 },
      { id: "jkt2", nama: "Mouse Logitech MX", stok: 350 },
      { id: "jkt3", nama: "Keyboard Mechanical", stok: 210 },
      { id: "jkt4", nama: "Monitor Dell 27\"", stok: 150 },
      { id: "jkt5", nama: "Tinta Printer Epson", stok: 800 },
    ],
  },
  {
    id: "bdg",
    nama: "Warehouse Bandung",
    posisi: [-6.9175, 107.6191],
    totalKategori: 30,
    totalBarang: 3100,
    items: [
      { id: "bdg1", nama: "Kabel HDMI 2m", stok: 500 },
      { id: "bdg2", nama: "Webcam Full HD", stok: 120 },
      { id: "bdg3", nama: "Kursi Gaming", stok: 80 },
    ],
  },
  {
    id: "sby",
    nama: "Warehouse Surabaya",
    posisi: [-7.2575, 112.7521],
    totalKategori: 40,
    totalBarang: 4500,
    items: [
      { id: "sby1", nama: "Router WiFi 6", stok: 130 },
      { id: "sby2", nama: "SSD NVMe 1TB", stok: 200 },
      { id: "sby3", nama: "RAM DDR5 16GB", stok: 400 },
      { id: "sby4", nama: "Mousepad Gaming XL", stok: 600 },
    ],
  },
];

// ===== Komponen Peta JAUH LEBIH SEDERHANA =====

export default function StokGisPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

  // State untuk Modal (Dialog)
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<WarehouseData | null>(null);
  
  // State untuk Popup (Overlay) di Peta
  const [activeMarker, setActiveMarker] = useState<WarehouseData | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");

  const warehouseData = DUMMY_WAREHOUSE_DATA;
  const isFetching = false; // Dummy

  // Tidak perlu lagi `useMemo` untuk ikon!

  // Opsi tahun
  const yearOptions = useMemo(
    () => Array.from({ length: 6 }, (_, i) => currentYear - i),
    [currentYear]
  );

  // Filter pencarian
  const filteredItems = useMemo(() => {
    if (!selectedWarehouse) return [];
    return selectedWarehouse.items.filter((item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedWarehouse, searchTerm]);

  // Handler Modal (Dialog)
  const handleOpenModal = (warehouse: WarehouseData) => {
    setActiveMarker(null); // Tutup popup peta
    setSelectedWarehouse(warehouse); // Buka modal
    setSearchTerm("");
  };

  const handleCloseModal = () => {
    setSelectedWarehouse(null);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Data Stok di Warehouse (GIS)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau lokasi dan detail stok warehouse secara geografis
          </p>
        </div>

        {/* Filter Tahun */}
        <div className="flex items-center gap-2">
          <label htmlFor="year" className="text-sm text-gray-600">
            Tahun:
          </label>
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
          {/* Ganti MapContainer -> Map
            Ganti center -> defaultCenter
            Ganti zoom -> defaultZoom
            Tidak perlu 'style' atau 'zIndex'
          */}
          <Map 
            height={540} // Anda bisa atur tinggi di sini atau biarkan 100% dari parent
            defaultCenter={[-6.9175, 109.6191]} // Center di tengah P. Jawa
            defaultZoom={7}
            onClick={() => setActiveMarker(null)} // Klik peta akan menutup popup
          >
            {/* TileLayer sudah otomatis (OSM) */}
            
            {warehouseData.map((wh) => (
              <Marker
                key={wh.id}
                anchor={wh.posisi} // Ganti position -> anchor
                color="#3B82F6" // Ganti warna pin
                onClick={() => setActiveMarker(wh)} // Klik marker untuk buka popup
              />
            ))}

            {/* Ini pengganti <Popup> dari Leaflet */}
            {activeMarker && (
              <Overlay
                anchor={activeMarker.posisi}
                offset={[0, 0]} // Sesuaikan offset
              >
                {/* Kita buat UI Popup manual dengan Tailwind */}
                <div className="w-60 bg-white rounded-lg shadow-lg p-3 relative">
                  <button
                    onClick={() => setActiveMarker(null)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow"
                  >
                    <X className="h-4 w-4 text-gray-600"/>
                  </button>

                  <div className="space-y-2">
                    <h3 className="font-bold text-md">{activeMarker.nama}</h3>
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

      {/* Modal / Dialog untuk Detail Stok (Tidak berubah) */}
      <Dialog open={!!selectedWarehouse} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Detail Stok: {selectedWarehouse?.nama}
            </DialogTitle>
          </DialogHeader>
          <DialogClose
            onClick={handleCloseModal}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {/* Search Bar di dalam Modal */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama barang..."
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
                  <th scope="col" className="px-6 py-3">
                    Nama Barang
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Jumlah Stok
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="bg-white border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {item.nama}
                    </th>
                    <td className="px-6 py-4 text-right font-bold">
                      {formatNumber(item.stok)}
                    </td>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}