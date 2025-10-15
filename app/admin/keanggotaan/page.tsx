"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetAnggotaListQuery,
  useDeleteAnggotaMutation,
  useExportAnggotaExcelMutation,
  useImportAnggotaExcelMutation,
} from "@/services/admin/anggota.service";
import type { Anggota } from "@/types/admin/anggota";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import ActionsGroup from "@/components/admin-components/actions-group";
import { Plus, Loader2 } from "lucide-react"; 
import useModal from "@/hooks/use-modal";
import { Input } from "@/components/ui/input";
import { useGetProvinsiListQuery } from "@/services/admin/master/provinsi.service";
import { useGetKotaListQuery } from "@/services/admin/master/kota.service";
import { useGetKecamatanListQuery } from "@/services/admin/master/kecamatan.service";
import { useGetKelurahanListQuery } from "@/services/admin/master/kelurahan.service";
import { useGetLevelListQuery } from "@/services/admin/master/level.service"; 

export default function AnggotaPage() {
  const router = useRouter();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "0" | "1" | "2">("all");
  const { isOpen, openModal, closeModal } = useModal();
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  

  useEffect(() => setMounted(true), []);

  const [filterRegion, setFilterRegion] = useState<{
    province_id: string | undefined;
    regency_id: string | undefined;
    district_id: string | undefined;
    village_id: string | undefined;
  }>({
    province_id: undefined,
    regency_id: undefined,
    district_id: undefined,
    village_id: undefined,
  });

  // Level ID: Tipe number (sesuai API) atau undefined
  const [filterLevelId, setFilterLevelId] = useState<number | undefined>(undefined);

  const { data, isLoading, refetch } = useGetAnggotaListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    province_id: filterRegion.province_id,
    regency_id: filterRegion.regency_id,
    district_id: filterRegion.district_id,
    village_id: filterRegion.village_id,
    level_id: filterLevelId,
    // Note: Query dan status difilter di frontend pada `filteredList`,
    // tetapi jika API mendukung, harusnya dimasukkan di sini.
  });

  const list = useMemo(() => data?.data ?? [], [data]);

  const filteredList = useMemo(() => {
    let arr = list;
    if (status !== "all")
      arr = arr.filter((it) => it.status === Number(status));
    
    // NOTE: Filter by query dilakukan di frontend
    if (!query.trim()) return arr;
    const q = query.toLowerCase();
    return arr.filter((it) =>
      [it.name, it.email, it.phone, it.address, it.ktp, ""].some(
        (f) => f?.toLowerCase?.().includes?.(q)
      )
    );
  }, [list, query, status]);

  const lastPage = useMemo(() => data?.last_page ?? 1, [data]);

  const [deleteAnggota] = useDeleteAnggotaMutation();

  // export/import hooks
  const [exportAnggotaExcel, { isLoading: isExporting }] =
    useExportAnggotaExcelMutation();
  const [importAnggotaExcel, { isLoading: isImporting }] =
    useImportAnggotaExcelMutation();

  const handleDelete = async (item: Anggota) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Anggota?",
      text: `${item.name} (${item.email})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });
    if (confirm.isConfirmed) {
      try {
        await deleteAnggota(item.id).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Anggota dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Anggota", "error");
        console.error(error);
      }
    }
  };

  const statusBadge = (status: number) => {
    if (status === 1) return <Badge variant="success">APPROVED</Badge>;
    if (status === 2) return <Badge variant="destructive">REJECTED</Badge>;
    return <Badge variant="secondary">PENDING</Badge>;
  };
  
  // =========================================================================
  // LOGIKA FILTER WILAYAH
  // =========================================================================

    // provinsi
    const [provinsiSearch, setProvinsiSearch] = useState("");
    const { data: provinsiData, isLoading: isProvinsiLoading } =
      useGetProvinsiListQuery({
        page: 1,
        paginate: 100,
        search: provinsiSearch,
      });
    const [isDropdownProvinsiOpen, setDropdownProvinsiOpen] = useState(false);
    const dropdownProvinsiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setMounted(true);
      if (filterRegion.province_id && provinsiData?.data) {
        const selectedProvinsi = provinsiData.data.find(
          (p) => p.id === filterRegion.province_id
        );
        if (selectedProvinsi) setProvinsiSearch(selectedProvinsi.name);
      }
    }, [filterRegion.province_id, provinsiData]);
  
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          dropdownProvinsiRef.current &&
          !dropdownProvinsiRef.current.contains(event.target as Node)
        ) {
          setDropdownProvinsiOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownProvinsiRef]);
  
    const filteredProvinsi = useMemo(() => {
      if (!provinsiData?.data || provinsiSearch.length < 2) return [];
      return provinsiData.data.filter((provinsi) =>
        provinsi.name.toLowerCase().includes(provinsiSearch.toLowerCase())
      );
    }, [provinsiSearch, provinsiData]);
  
    const handleProvinsiSelect = (provinsi: { id: string; name: string }) => {
      setFilterRegion({
        province_id: provinsi.id,
        regency_id: undefined,
        district_id: undefined,
        village_id: undefined,
      });
      setProvinsiSearch(provinsi.name);
      setDropdownProvinsiOpen(false);
      setKotaSearch("");
      setKecamatanSearch("");
      setKelurahanSearch("");
    };
  
    // kota
    const [kotaSearch, setKotaSearch] = useState("");
    const { data: kotaData, isLoading: isKotaLoading } = useGetKotaListQuery({
      page: 1,
      paginate: 100,
      search: kotaSearch,
      province_id: filterRegion.province_id || "",
    });
    const [isDropdownKotaOpen, setDropdownKotaOpen] = useState(false);
    const dropdownKotaRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      setMounted(true);
      if (filterRegion.regency_id && kotaData?.data) {
        const selectedKota = kotaData.data.find((p) => p.id === filterRegion.regency_id);
        if (selectedKota) setKotaSearch(selectedKota.name);
      }
    }, [filterRegion.regency_id, kotaData]);
  
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          dropdownKotaRef.current &&
          !dropdownKotaRef.current.contains(event.target as Node)
        ) {
          setDropdownKotaOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownKotaRef]);
  
    const filteredKota = useMemo(() => {
      if (!kotaData?.data || kotaSearch.length < 2) return [];
      return kotaData.data.filter((kota) =>
        kota.name.toLowerCase().includes(kotaSearch.toLowerCase())
      );
    }, [kotaSearch, kotaData]);
  
    const handleKotaSelect = (kota: { id: string; name: string }) => {
      setFilterRegion((prev) => ({
        ...prev,
        regency_id: kota.id,
        district_id: undefined,
        village_id: undefined,
      }));
      setKotaSearch(kota.name);
      setDropdownKotaOpen(false);
      setKecamatanSearch("");
      setKelurahanSearch("");
    };
  
    // kecamatan
    const [kecamatanSearch, setKecamatanSearch] = useState("");
    const { data: kecamatanData, isLoading: isKecamatanLoading } =
      useGetKecamatanListQuery({
        page: 1,
        paginate: 100,
        search: kecamatanSearch,
        regency_id: filterRegion.regency_id || "",
      });
    const [isDropdownKecamatanOpen, setDropdownKecamatanOpen] = useState(false);
    const dropdownKecamatanRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      setMounted(true);
      if (filterRegion.district_id && kecamatanData?.data) {
        const selectedKecamatan = kecamatanData.data.find(
          (p) => p.id === filterRegion.district_id
        );
        if (selectedKecamatan) setKecamatanSearch(selectedKecamatan.name);
      }
    }, [filterRegion.district_id, kecamatanData]);
  
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          dropdownKecamatanRef.current &&
          !dropdownKecamatanRef.current.contains(event.target as Node)
        ) {
          setDropdownKecamatanOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownKecamatanRef]);
  
    const filteredKecamatan = useMemo(() => {
      if (!kecamatanData?.data || kecamatanSearch.length < 2) return [];
      return kecamatanData.data.filter((kecamatan) =>
        kecamatan.name.toLowerCase().includes(kecamatanSearch.toLowerCase())
      );
    }, [kecamatanSearch, kecamatanData]);
  
    const handleKecamatanSelect = (kecamatan: { id: string; name: string }) => {
      setFilterRegion((prev) => ({ 
        ...prev, 
        district_id: kecamatan.id, 
        village_id: undefined 
      }));
      setKecamatanSearch(kecamatan.name);
      setDropdownKecamatanOpen(false);
      setKelurahanSearch("");
    };
  
    // kelurahan
    const [kelurahanSearch, setKelurahanSearch] = useState("");
    const { data: kelurahanData, isLoading: isKelurahanLoading } =
      useGetKelurahanListQuery({
        page: 1,
        paginate: 100,
        search: kelurahanSearch,
        district_id: filterRegion.district_id || "",
      });
    const [isDropdownKelurahanOpen, setDropdownKelurahanOpen] = useState(false);
    const dropdownKelurahanRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      setMounted(true);
      if (filterRegion.village_id && kelurahanData?.data) {
        const selectedKelurahan = kelurahanData.data.find(
          (p) => p.id === filterRegion.village_id
        );
        if (selectedKelurahan) setKelurahanSearch(selectedKelurahan.name);
      }
    }, [filterRegion.village_id, kelurahanData]);
  
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          dropdownKelurahanRef.current &&
          !dropdownKelurahanRef.current.contains(event.target as Node)
        ) {
          setDropdownKelurahanOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownKelurahanRef]);
  
    const filteredKelurahan = useMemo(() => {
      if (!kelurahanData?.data || kelurahanSearch.length < 2) return [];
      return kelurahanData.data.filter((kelurahan) =>
        kelurahan.name.toLowerCase().includes(kelurahanSearch.toLowerCase())
      );
    }, [kelurahanSearch, kelurahanData]);
  
    const handleKelurahanSelect = (kelurahan: { id: string; name: string }) => {
      setFilterRegion((prev) => ({ ...prev, village_id: kelurahan.id }));
      setKelurahanSearch(kelurahan.name);
      setDropdownKelurahanOpen(false);
    };

  // =========================================================================
  // LOGIKA UNTUK FILTER LEVEL
  // =========================================================================
  const [levelSearch, setLevelSearch] = useState("");
  const { data: levelData, isLoading: isLevelLoading } = useGetLevelListQuery({
    page: 1,
    paginate: 100,
    search: levelSearch,
  });
  const [isDropdownLevelOpen, setDropdownLevelOpen] = useState(false);
  const dropdownLevelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filterLevelId && levelData?.data) {
      const selectedLevel = levelData.data.find(
        (l) => Number(l.id) === filterLevelId
      );
      if (selectedLevel) setLevelSearch(selectedLevel.name);
    } else if (!filterLevelId) {
        setLevelSearch("");
    }
  }, [filterLevelId, levelData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownLevelRef.current &&
        !dropdownLevelRef.current.contains(event.target as Node)
      ) {
        setDropdownLevelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownLevelRef]);

  const filteredLevel = useMemo(() => {
    if (!levelData?.data) return [];
    return levelData.data.filter((level) =>
      level.name.toLowerCase().includes(levelSearch.toLowerCase())
    );
  }, [levelSearch, levelData]);

  const handleLevelSelect = (level: { id: number; name: string }) => {
    // Pastikan ID level dikonversi ke Number karena state filterLevelId bertipe number
    setFilterLevelId(Number(level.id));
    setLevelSearch(level.name);
    setDropdownLevelOpen(false);
  };
  
  const handleClearLevel = () => {
    setFilterLevelId(undefined);
    setLevelSearch("");
    setDropdownLevelOpen(false);
  }

  // =========================================================================
  // LOGIKA IMPORT / EXPORT (sudah benar, hanya perlu didefinisikan)
  // =========================================================================
  // === Import handler ===
  const handleImportExcel = async (file?: File) => {
    try {
      if (!file) return Swal.fire("Gagal", "File tidak ditemukan", "error");
      const res = await importAnggotaExcel({ file }).unwrap();
      Swal.fire(
        "Import Dikirim",
        res.message ?? "Berhasil mengunggah file",
        "success"
      );
    } catch (e) {
      Swal.fire("Gagal", "Import gagal diproses", "error");
      console.error(e);
    }
  };

  // === Export handler ===
  const handleExportExcel = async () => {
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    const today = new Date();
    const last30 = new Date();
    last30.setDate(today.getDate() - 30);
    const todayStr = fmt(today),
      last30Str = fmt(last30);

    const { value: formValues } = await Swal.fire({
      title: "Export Anggota",
      html: `
        <div class="sae-wrap">
          <div class="sae-field">
            <label for="from_date" class="sae-label"><span class="sae-icon">📅</span> From date</label>
            <input id="from_date" type="date" class="sae-input" />
          </div>
          <div class="sae-field">
            <label for="to_date" class="sae-label"><span class="sae-icon">📆</span> To date</label>
            <input id="to_date" type="date" class="sae-input" />
          </div>
          <p class="sae-hint">Pilih rentang tanggal export anggota.</p>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Batal",
      width: 520,
      color: "#0f172a",
      background: "rgba(255,255,255,0.9)",
      backdrop: `rgba(15,23,42,0.4)`,
      customClass: {
        popup: "sae-popup",
        title: "sae-title",
        confirmButton: "sae-btn-confirm",
        cancelButton: "sae-btn-cancel",
      },
      didOpen: () => {
        if (!document.getElementById("sae-styles")) {
          const style = document.createElement("style");
          style.id = "sae-styles";
          style.innerHTML = `
            .sae-popup{border-radius:18px;box-shadow:0 20px 60px rgba(2,6,23,.15),0 2px 8px rgba(2,6,23,.06);backdrop-filter: blur(8px); border:1px solid rgba(2,6,23,.06)}
            .sae-title{font-weight:700; letter-spacing:.2px}
            .sae-wrap{display:grid; gap:14px}
            .sae-field{display:grid; gap:8px}
            .sae-label{font-size:12px; color:#475569; display:flex; align-items:center; gap:6px}
            .sae-icon{font-size:14px}
            .sae-input{appearance:none;width:100%;padding:12px 14px;border-radius:12px;border:1px solid #e2e8f0;background:#fff;font-size:14px;transition:all .15s ease}
            .sae-input:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}
            .sae-hint{margin-top:4px;font-size:12px;color:#64748b}
            .sae-btn-confirm{background:linear-gradient(90deg,#6366f1,#22d3ee);color:white;border:none;border-radius:10px !important;padding:10px 18px;font-weight:600}
            .sae-btn-cancel{background:white;color:#0f172a;border:1px solid #e2e8f0;border-radius:10px !important;padding:10px 18px;font-weight:600}
          `;
          document.head.appendChild(style);
        }
        const fromEl = document.getElementById("from_date") as HTMLInputElement;
        const toEl = document.getElementById("to_date") as HTMLInputElement;
        if (fromEl && toEl) {
          fromEl.value = last30Str;
          toEl.value = todayStr;
          fromEl.max = todayStr;
          toEl.max = todayStr;
          toEl.min = fromEl.value;
          fromEl.addEventListener("input", () => {
            toEl.min = fromEl.value || "";
            if (toEl.value < fromEl.value) toEl.value = fromEl.value;
          });
          toEl.addEventListener("input", () => {
            fromEl.max = toEl.value || todayStr;
          });
        }
      },
      preConfirm: () => {
        const from_date = (
          document.getElementById("from_date") as HTMLInputElement
        )?.value;
        const to_date = (document.getElementById("to_date") as HTMLInputElement)
          ?.value;
        if (!from_date || !to_date) {
          Swal.showValidationMessage("from_date dan to_date wajib diisi");
          return;
        }
        if (to_date < from_date) {
          Swal.showValidationMessage("to_date tidak boleh < from_date");
          return;
        }
        return { from_date, to_date };
      },
    });

    if (!formValues) return;

    try {
      Swal.fire({
        title: "Mengirim permintaan…",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        showConfirmButton: false,
        customClass: { popup: "sae-popup", title: "sae-title" },
      });
      const res = await exportAnggotaExcel(formValues).unwrap();
      Swal.fire({
        icon: "success",
        title: "Export diproses",
        text: res.message ?? "Permintaan export diterima \n Silahkan cek di notifikasi",
        confirmButtonText: "Oke",
        customClass: {
          popup: "sae-popup",
          title: "sae-title",
          confirmButton: "sae-btn-confirm",
        },
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Export gagal diproses",
        confirmButtonText: "Tutup",
        customClass: {
          popup: "sae-popup",
          title: "sae-title",
          confirmButton: "sae-btn-cancel",
        },
      });
      console.error(e);
    }
  };
  
  // =========================================================================
  // ✅ DEFINISI VARIABEL IMPORT/EXPORT
  // =========================================================================
  const templateCsvUrl = "https://api-koperasi.inovasidigitalpurwokerto.id/template-import-anggota.csv"; // Contoh URL
  const templateCsvLabel = "Template CSV";
  const exportLabel = isExporting ? "Exporting..." : "Export Excel";
  const importLabel = isImporting ? "Importing..." : "Import Excel";
  const exportDisabled = isExporting;
  const importAccept = ".xlsx,.xls,.csv";
  const readonly = false; // Definisikan readonly untuk JSX


    if (!mounted) {
      return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0">
            <h2 className="text-lg font-semibold">Loading...</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="rounded-md bg-white p-4 border border-gray-100 shadow-sm">
        {/* Baris 1: Filter Geografis dan Level */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Provinsi */}
          <div className="w-full flex flex-col">
             <div className="relative" ref={dropdownProvinsiRef}>
              <Input
                id="province_id"
                placeholder="Filter Provinsi..."
                value={provinsiSearch}
                onChange={(e) => {
                  setProvinsiSearch(e.target.value);
                  setDropdownProvinsiOpen(true);
                  if (filterRegion.province_id) {
                    setFilterRegion({
                      province_id: undefined,
                      regency_id: undefined,
                      district_id: undefined,
                      village_id: undefined,
                    });
                  }
                }}
                onFocus={() => setDropdownProvinsiOpen(true)}
                readOnly={readonly}
                required
                autoComplete="off"
              />
              {isDropdownProvinsiOpen && !readonly && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isProvinsiLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : filteredProvinsi.length > 0 ? (
                    filteredProvinsi.map((provinsi) => (
                      <button
                        type="button"
                        key={provinsi.id}
                        onClick={() => handleProvinsiSelect(provinsi)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {provinsi.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-3">
                      Provinsi tidak ditemukan.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Kota */}
          <div className="w-full flex flex-col">
            <div className="relative" ref={dropdownKotaRef}>
              <Input
                id="regency_id"
                placeholder={
                  !filterRegion.province_id
                    ? "Pilih provinsi terlebih dahulu..."
                    : "Filter Kota..."
                }
                value={kotaSearch}
                onChange={(e) => {
                  setKotaSearch(e.target.value);
                  setDropdownKotaOpen(true);
                  if (filterRegion.regency_id)
                    setFilterRegion((prev) => ({
                      ...prev,
                      regency_id: undefined,
                      district_id: undefined,
                      village_id: undefined,
                    }));
                }}
                onFocus={() => {
                  if (filterRegion.province_id) setDropdownKotaOpen(true);
                }}
                readOnly={readonly}
                required
                autoComplete="off"
                disabled={!filterRegion.province_id || readonly}
              />
              {isDropdownKotaOpen && !readonly && filterRegion.province_id && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isKotaLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : filteredKota.length > 0 ? (
                    filteredKota.map((kota) => (
                      <button
                        type="button"
                        key={kota.id}
                        onClick={() => handleKotaSelect(kota)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {kota.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-3">
                      Kota tidak ditemukan.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Kecamatan */}
          <div className="w-full flex flex-col">
            <div className="relative" ref={dropdownKecamatanRef}>
              <Input
                id="district_id"
                placeholder={
                  !filterRegion.regency_id
                    ? "Pilih kota terlebih dahulu..."
                    : "Filter Kecamatan..."
                }
                value={kecamatanSearch}
                onChange={(e) => {
                  setKecamatanSearch(e.target.value);
                  setDropdownKecamatanOpen(true);
                  if (filterRegion.district_id)
                    setFilterRegion((prev) => ({
                      ...prev,
                      district_id: undefined,
                      village_id: undefined,
                    }));
                }}
                onFocus={() => {
                  if (filterRegion.regency_id) setDropdownKecamatanOpen(true);
                }}
                readOnly={readonly}
                required
                autoComplete="off"
                disabled={!filterRegion.regency_id || readonly}
              />
              {isDropdownKecamatanOpen && !readonly && filterRegion.regency_id && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isKecamatanLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : filteredKecamatan.length > 0 ? (
                    filteredKecamatan.map((kecamatan) => (
                      <button
                        type="button"
                        key={kecamatan.id}
                        onClick={() => handleKecamatanSelect(kecamatan)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {kecamatan.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-3">
                      Kecamatan tidak ditemukan.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Kelurahan */}
          <div className="w-full flex flex-col">
            <div className="relative" ref={dropdownKelurahanRef}>
              <Input
                id="village_id"
                placeholder={
                  !filterRegion.district_id
                    ? "Pilih kecamatan terlebih dahulu..."
                    : "Filter Kelurahan..."
                }
                value={kelurahanSearch}
                onChange={(e) => {
                  setKelurahanSearch(e.target.value);
                  setDropdownKelurahanOpen(true);
                  if (filterRegion.village_id)
                    setFilterRegion((prev) => ({ ...prev, village_id: undefined }));
                }}
                onFocus={() => {
                  if (filterRegion.district_id) setDropdownKelurahanOpen(true);
                }}
                readOnly={readonly}
                required
                autoComplete="off"
                disabled={!filterRegion.district_id || readonly}
              />
              {isDropdownKelurahanOpen && !readonly && filterRegion.district_id && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isKelurahanLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : filteredKelurahan.length > 0 ? (
                    filteredKelurahan.map((kelurahan) => (
                      <button
                        type="button"
                        key={kelurahan.id}
                        onClick={() => handleKelurahanSelect(kelurahan)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {kelurahan.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-3">
                      Kelurahan tidak ditemukan.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Level Filter */}
          <div className="w-full flex flex-col">
            <div className="relative" ref={dropdownLevelRef}>
                <Input
                    id="level_id"
                    placeholder="Filter Level..."
                    value={levelSearch}
                    onChange={(e) => {
                      setLevelSearch(e.target.value);
                      setDropdownLevelOpen(true);
                      if (filterLevelId) handleClearLevel();
                    }}
                    onFocus={() => setDropdownLevelOpen(true)}
                    readOnly={readonly}
                    autoComplete="off"
                />
                {isDropdownLevelOpen && !readonly && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {isLevelLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        ) : filteredLevel.length > 0 ? (
                            <>
                                {/* Opsi Bersihkan Filter */}
                                <button
                                    type="button"
                                    onClick={handleClearLevel}
                                    className="block w-full text-left px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 border-b"
                                >
                                    (Semua Level)
                                </button>
                                {filteredLevel.map((level) => (
                                    <button
                                        type="button"
                                        key={level.id}
                                        onClick={() => handleLevelSelect(level)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                    >
                                        {level.name}
                                    </button>
                                ))}
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 p-3">
                                Level tidak ditemukan.
                            </p>
                        )}
                    </div>
                )}
            </div>
          </div>
        </div>
        
        {/* Baris 2: Actions */}
        {/* BARIS BARU UNTUK SEARCH DAN ACTIONS */}
        <div className="flex flex-col md:flex-row items-center gap-3 mt-4">
            {/* Input Cari Anggota (Diperpanjang) */}
            <div className="w-full md:w-2/5 lg:w-1/3 shrink-0"> 
                <Input
                    placeholder="Cari anggota..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Tombol Aksi (TIDAK ADA PERUBAHAN LEBAR DI SINI) */}
            <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end w-full md:w-3/5 lg:w-2/3">
                {/* Download Template CSV */}
                <a
                    href={templateCsvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                >
                    <Button variant="outline" className="h-10 w-full sm:w-auto">
                        {templateCsvLabel}
                    </Button>
                </a>
            
                {/* Export Excel */}
                <Button
                    className="h-10 w-full sm:w-auto"
                    onClick={handleExportExcel}
                    disabled={exportDisabled}
                    variant="outline"
                >
                    {exportLabel}
                </Button>
                
                {/* Import Excel */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={importAccept}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleImportExcel(file);
                            e.currentTarget.value = "";
                        }
                    }}
                />
                <Button
                    variant="outline"
                    className="h-10 w-full sm:w-auto"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                >
                    {importLabel}
                </Button>

                {/* Export Excel */}
                <Button
                    className="h-10 w-full sm:w-auto"
                    onClick={handleExportExcel}
                    disabled={exportDisabled}
                    variant="outline"
                >
                  Generate KTA
                </Button>

                {/* Button Tambah Anggota */}
                {/* Menggunakan w-full sm:w-auto untuk konsistensi */}
                {openModal && <Button onClick={openModal} className="h-10 w-full sm:w-auto"><Plus /> Tambah Anggota</Button>}
            </div>
        </div>
      </div>


      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">No. Anggota</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Telepon</th>
                <th className="px-4 py-2">Provinsi</th>
                <th className="px-4 py-2">Kota</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      <ActionsGroup
                        handleDetail={() =>
                          router.push(
                            `/admin/keanggotaan/add-data?mode=detail&id=${item.id}`
                          )
                        }
                        handleEdit={() =>
                          router.push(
                            `/admin/keanggotaan/add-data?mode=edit&id=${item.id}`
                          )
                        }
                        handleDelete={() => handleDelete(item)}
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.reference}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.phone}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.province_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.regency_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {statusBadge(item.status)}
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
    </div>
  );
}