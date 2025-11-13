"use client";
import Swal from "sweetalert2";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ActionsGroup from "@/components/admin-components/actions-group";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  useGetBarangMasukListQuery,
  useDeleteBarangMasukMutation,
} from "@/services/admin/transaksi/barang-masuk.service";
// Hapus import 'Barang', tidak digunakan di sini
import { BarangMasuk } from "@/types/admin/transaksi/barang-masuk";
// Impor komponen tombol PDF baru
import { InvoicePOButton } from "@/components/admin-components/InvoicePOButton";


export default function BarangMasukPage() {
  const router = useRouter();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [deleteBarangMasuk] = useDeleteBarangMasukMutation();

  const { data, isLoading, refetch } = useGetBarangMasukListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: query,
  });

  const listData = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const handleDetail = (item: BarangMasuk) => {
    router.push(`/admin/transaksi/barang-masuk/detail/${item.id}`);
  };

  const handleEdit = (item: BarangMasuk) => {
    router.push(`/admin/transaksi/barang-masuk/edit/${item.id}`);
  };


  const handleDelete = async (item: BarangMasuk) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Barang Masuk?",
      text: item.reference,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteBarangMasuk(item.id).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Barang dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Barang", "error");
        console.error(error);
      }
    }
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
                <th className="px-4 py-2">Warehouse</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Tanggal Jatuh Tempo</th>
                <th className="px-4 py-2 text-right">Total</th> {/* Dibuat rata kanan */}
                <th className="px-4 py-2">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center p-4"> {/* colSpan diubah jadi 7 */}
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : listData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4"> {/* colSpan diubah jadi 7 */}
                    Tidak ada data transaksi.
                  </td>
                </tr>
              ) : (
                listData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        {/* --- TOMBOL BARU DITAMBAHKAN DI SINI --- */}
                        <InvoicePOButton itemId={item.id} />
                        
                        {/* Tombol Aksi yang sudah ada */}
                        <ActionsGroup
                          handleDetail={() => handleDetail(item)}
                          handleEdit={() => handleEdit(item)}
                          handleDelete={() => handleDelete(item)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium">{item.reference}</td>
                    <td className="px-4 py-2">{item.warehouse_name}</td>
                    <td className="px-4 py-2">{new Date(item.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">{new Date(item.due_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2 text-right">{/* Dibuat rata kanan */}
                      {new Intl.NumberFormat("id-ID", { 
                        style: "currency", 
                        currency: "IDR", 
                        minimumFractionDigits: 0 
                      }).format(item.total)}
                    </td>
                    <td className="px-4 py-2">{item.notes}</td>
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