"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import {
  useGetRakListQuery,
  useCreateRakMutation,
  useUpdateRakMutation,
  useDeleteRakMutation,
} from "@/services/admin/master/rak.service";
import { Rak } from "@/types/admin/master/rak";
import FormRak from "@/components/form-modal/admin/master/rak-form";
import { Input } from "@/components/ui/input";
import ActionsGroup from "@/components/admin-components/actions-group";
import { Plus } from "lucide-react";

export default function RakPage() {
  const [form, setForm] = useState<Partial<Rak>>({
    warehouse_id: 0,
    code: "",
    type: "",
    name: "",
    description: "",
    capacity: "",
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [readonly, setReadonly] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data, isLoading, refetch } = useGetRakListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: query,
  });

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [createRak, { isLoading: isCreating }] =
    useCreateRakMutation();
  const [updateRak, { isLoading: isUpdating }] =
    useUpdateRakMutation();
  const [deleteRak] = useDeleteRakMutation();

  const handleSubmit = async () => {
    // Validasi
    if (
      !form.warehouse_id ||
      !form.code?.trim() ||
      !form.type?.trim() ||
      !form.name?.trim()
    ) {
      Swal.fire("Gagal", "Warehouse, Kode, Tipe, dan Nama tidak boleh kosong", "error");
      return;
    }

    try {
      const payload = {
        warehouse_id: form.warehouse_id || 0,
        code: form.code || "",
        type: form.type || "",
        name: form.name || "",
        description: form.description || "",
        capacity: form.capacity || "",
        status: form.status === false ? 0 : 1,
      };

      if (editingId) {
        await updateRak({ id: editingId, payload }).unwrap();
        Swal.fire("Sukses", "Rak diperbarui", "success");
      } else {
        await createRak(payload).unwrap();
        Swal.fire("Sukses", "Rak ditambahkan", "success");
      }

      setForm({ name: "", warehouse_id: 0, code: "", type: "", description: "", capacity: "", status: true });
      setEditingId(null);
      await refetch();
      closeModal();
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal", "Gagal menyimpan data", "error");
    }
  };

  const handleEdit = (item: Rak) => {
    setForm({ ...item });
    setEditingId(item.id);
    setReadonly(false);
    openModal();
  };

  const handleDetail = (item: Rak) => {
    setForm(item);
    setReadonly(true);
    openModal();
  };

  const handleDelete = async (item: Rak) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Rak?",
      text: item.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteRak(item.id).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Rak dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Rak", "error");
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
              placeholder="Cari rak..."
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
            {openModal && <Button onClick={openModal}><Plus /> Rak</Button>}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">Warehouse</th>
                <th className="px-4 py-2">Kode</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Tipe</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Kapasitas</th>
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
                    <td className="px-4 py-2 font-medium">{item.warehouse_name}</td>
                    <td className="px-4 py-2 font-medium">{item.code}</td>
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="px-4 py-2 font-medium">{item.type}</td>
                    <td className="px-4 py-2 font-medium">{item.description}</td>
                    <td className="px-4 py-2 font-medium">{item.capacity}</td>
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
          <FormRak
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
