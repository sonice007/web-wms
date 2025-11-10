"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import {
  useGetBarangListQuery,
  useCreateBarangMutation,
  useUpdateBarangMutation,
  useDeleteBarangMutation,
} from "@/services/admin/master/barang.service";
import { Barang } from "@/types/admin/master/barang";
import FormBarang from "@/components/form-modal/admin/master/barang-form";
import { Input } from "@/components/ui/input";
import ActionsGroup from "@/components/admin-components/actions-group";
import { Plus } from "lucide-react";

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [readonly, setReadonly] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data, isLoading, refetch } = useGetBarangListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: query,
  });

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [createBarang, { isLoading: isCreating }] =
    useCreateBarangMutation();
  const [updateBarang, { isLoading: isUpdating }] =
    useUpdateBarangMutation();
  const [deleteBarang] = useDeleteBarangMutation();

  const handleSubmit = async () => {
    try {
      const payload = {
        product_category_id: form.product_category_id || 0,
        sku: form.sku || "",
        name: form.name || "",
        description: form.description || "",
        price: form.price || 0,
        stock: form.stock || 0,
        min_stock: form.min_stock || 0,
        unit: form.unit || "",
        status: form.status === false ? 0 : 1,
      };

      if (editingId) {
        await updateBarang({ id: editingId, payload }).unwrap();
        Swal.fire("Sukses", "Barang diperbarui", "success");
      } else {
        await createBarang(payload).unwrap();
        Swal.fire("Sukses", "Barang ditambahkan", "success");
      }

      setForm({ name: "" });
      setEditingId(null);
      await refetch();
      closeModal();
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal", "Gagal menyimpan data", "error");
    }
  };

  const handleEdit = (item: Barang) => {
    setForm({ ...item });
    setEditingId(item.id);
    setReadonly(false);
    openModal();
  };

  const handleDetail = (item: Barang) => {
    setForm(item);
    setReadonly(true);
    openModal();
  };

  const handleDelete = async (item: Barang) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Barang?",
      text: item.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteBarang(item.id).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Barang dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Barang", "error");
        console.error(error);
      }
    }
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!query) return categoryList;
    return categoryList.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [categoryList, query]);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-md bg-white p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Kiri: filter */}
          <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Cari barang..."
              value={query}
              onChange={(e) => {
                const q = e.target.value;
                setQuery(q);
              }}
              className="w-full sm:max-w-xs"
            />
          </div>

          {/* Kanan: aksi */}
          <div className="shrink-0 flex flex-wrap items-center gap-2">
            {/* Tambah data (opsional) */}
            {openModal && <Button onClick={openModal}><Plus /> Barang</Button>}
          </div>
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
                <th className="px-4 py-2">Deskripsi</th>
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
                  <td colSpan={7} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">
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
                          handleEdit={() => handleEdit(item)}
                          handleDelete={() => handleDelete(item)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium">{item.category_name}</td>
                    <td className="px-4 py-2 font-medium">{item.sku}</td>
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="px-4 py-2 font-medium">{item.description}</td>
                    <td className="px-4 py-2 font-medium">{item.price}</td>
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

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <FormBarang
            form={form}
            setForm={setForm}
            onCancel={() => {
              setForm({ name: "" });
              setEditingId(null);
              setReadonly(false);
              closeModal();
            }}
            onSubmit={handleSubmit}
            readonly={readonly}
            isLoading={isCreating || isUpdating}
          />
        </div>
      )}
    </div>
  );
}
