"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import {
  useGetKlasifikasiListQuery,
  useCreateKlasifikasiMutation,
  useUpdateKlasifikasiMutation,
  useDeleteKlasifikasiMutation,
} from "@/services/admin/konfigurasi/klasifikasi.service";
import { Klasifikasi } from "@/types/admin/konfigurasi/klasifikasi";
import FormKlasifikasi from "@/components/form-modal/admin/konfigurasi/klasifikasi-form";
import { Input } from "@/components/ui/input";
import ActionsGroup from "@/components/admin-components/actions-group";
import { Plus } from "lucide-react";

export default function KlasifikasiPage() {
  const [form, setForm] = useState<Partial<Klasifikasi>>({
    name: "",
    amount: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [readonly, setReadonly] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data, isLoading, refetch } = useGetKlasifikasiListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: query,
  });

  const klasifikasiList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [createKlasifikasi, { isLoading: isCreating }] =
    useCreateKlasifikasiMutation();
  const [updateKlasifikasi, { isLoading: isUpdating }] =
    useUpdateKlasifikasiMutation();
  const [deleteKlasifikasi] = useDeleteKlasifikasiMutation();

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name || "",
        amount: form.amount || "",
        description: form.description || "",
      };

      if (editingId) {
        await updateKlasifikasi({ id: editingId, payload }).unwrap();
        Swal.fire("Sukses", "Klasifikasi diperbarui", "success");
      } else {
        await createKlasifikasi(payload).unwrap();
        Swal.fire("Sukses", "Klasifikasi ditambahkan", "success");
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

  const handleEdit = (item: Klasifikasi) => {
    setForm({ ...item });
    setEditingId(item.id);
    setReadonly(false);
    openModal();
  };

  const handleDetail = (item: Klasifikasi) => {
    setForm(item);
    setReadonly(true);
    openModal();
  };

  const handleDelete = async (item: Klasifikasi) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Klasifikasi?",
      text: item.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteKlasifikasi(item.id).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Klasifikasi dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Klasifikasi", "error");
        console.error(error);
      }
    }
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!query) return klasifikasiList;
    return klasifikasiList.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [klasifikasiList, query]);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-md bg-white p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Kiri: filter */}
          <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Cari klasifikasi..."
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
            {openModal && <Button onClick={openModal}><Plus /> Klasifikasi</Button>}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Jumlah</th>
                <th className="px-4 py-2">Keterangan</th>
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
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="px-4 py-2 font-medium">{item.amount}</td>
                    <td className="px-4 py-2 font-medium">{item.description}</td>
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
          <FormKlasifikasi
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
