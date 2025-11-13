"use client";
import Swal from "sweetalert2";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ActionsGroup from "@/components/admin-components/actions-group";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetBarangKeluarListQuery,
  useDeleteBarangKeluarMutation,
} from "@/services/admin/transaksi/barang-keluar.service";
import { BarangKeluar } from "@/types/admin/transaksi/barang-keluar";
// Impor komponen tombol PDF baru
import { InvoiceSOButton } from "@/components/admin-components/InvoiceSOButton";

export default function BarangKeluarPage() {
  const router = useRouter();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [deleteBarangKeluar] = useDeleteBarangKeluarMutation();

  const { data, isLoading, refetch } = useGetBarangKeluarListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: query,
  });

  const listData = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const handleDetail = (item: BarangKeluar) => {
    router.push(`/admin/transaksi/barang-keluar/detail/${item.id}`);
  };

  const handleEdit = (item: BarangKeluar) => {
    router.push(`/admin/transaksi/barang-keluar/edit/${item.id}`);
  };

  const handleDelete = async (item: BarangKeluar) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Barang Keluar?",
      text: item.reference,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteBarangKeluar(item.id).unwrap();
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
          <h3 className="text-lg font-semibold">Transaksi Barang Keluar</h3>
          <Button onClick={() => router.push('/admin/transaksi/barang-keluar/tambah')}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Barang Keluar
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
                <th className="px-4 py-2">Partner</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Keterangan</th>
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
                        {/* --- TOMBOL BARU DITAMBAHKAN DI SINI --- */}
                        <InvoiceSOButton itemId={item.id} />
                        
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
                    <td className="px-4 py-2">{item.partner}</td>
                    <td className="px-4 py-2">{new Date(item.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">{item.total}</td>
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