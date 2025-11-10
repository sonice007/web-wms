"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ActionsGroup from "@/components/admin-components/actions-group";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter

// --- Tipe Data (Ganti dengan Tipe Anda) ---
export interface BarangMasukHeader {
  id: number;
  kode_transaksi: string;
  tanggal: string;
  keterangan: string;
  status: "Draft" | "Selesai" | "Dibatalkan";
  // ... detail items bisa di-load nanti
}
// ---

// --- HOOK DUMMY (Ganti dengan RTK Query Anda) ---
const useGetBarangMasukListQuery = (params: { page: number, paginate: number, search: string }) => {
  const allData: BarangMasukHeader[] = [
    { id: 1, kode_transaksi: "BM-2025-001", tanggal: "2025-11-10", keterangan: "Penerimaan dari Supplier A", status: "Selesai" },
    { id: 2, kode_transaksi: "BM-2025-002", tanggal: "2025-11-11", keterangan: "Retur penjualan", status: "Selesai" },
    { id: 3, kode_transaksi: "BM-2025-003", tanggal: "2025-11-11", keterangan: "Stok awal", status: "Draft" },
  ];

  const filteredData = allData.filter(d => 
    d.kode_transaksi.toLowerCase().includes(params.search.toLowerCase()) ||
    d.keterangan.toLowerCase().includes(params.search.toLowerCase())
  );

  return {
    data: {
      data: filteredData.slice((params.page - 1) * params.paginate, params.page * params.paginate),
      last_page: Math.ceil(filteredData.length / params.paginate),
    },
    isLoading: false,
    refetch: () => console.log("Refetching list..."),
  };
};
// --- AKHIR DUMMY ---


export default function BarangMasukPage() {
  const router = useRouter();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data, isLoading, refetch } = useGetBarangMasukListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: query,
  });

  const listData = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const handleDetail = (item: BarangMasukHeader) => {
    // Arahkan ke halaman detail/edit
    router.push(`/admin/transaksi/barang-masuk/${item.id}`);
  };

  const handleEdit = (item: BarangMasukHeader) => {
    // Arahkan ke halaman edit (yang bisa jadi halaman form yang sama)
    router.push(`/admin/transaksi/barang-masuk/edit/${item.id}`);
  };

  const handleDelete = (item: BarangMasukHeader) => {
    // TODO: Tampilkan modal konfirmasi sebelum hapus
    console.log("Delete item", item.id);
    // panggil mutation delete
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-md bg-white p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold">Transaksi Barang Masuk</h3>
          <Button onClick={() => router.push('/admin/transaksi/barang-masuk/tambah')}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Barang Masuk
          </Button>
        </div>
        <hr className="my-4" />
        <div className="flex-1">
          <Input
            placeholder="Cari kode transaksi atau keterangan..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1); // Reset ke halaman 1 saat mencari
            }}
            className="w-full"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">Kode Transaksi</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Keterangan</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : listData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Tidak ada data transaksi.
                  </td>
                </tr>
              ) : (
                listData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <ActionsGroup
                          handleDetail={() => handleDetail(item)}
                          handleEdit={() => handleEdit(item)}
                          handleDelete={() => handleDelete(item)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium">{item.kode_transaksi}</td>
                    <td className="px-4 py-2">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">{item.keterangan}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Selesai"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
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
            Halaman <strong>{currentPage}</strong> dari <strong>{lastPage}</strong>
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
    </div>
  );
}