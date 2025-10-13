"use client";

import type React from "react";

import useDebounce from "@/hooks/use-debounce";
import { useGetProvinsiListQuery } from "@/services/admin/master/provinsi.service";
import { useGetKotaListQuery } from "@/services/admin/master/kota.service";
import { useGetKecamatanListQuery } from "@/services/admin/master/kecamatan.service";
import { useGetKelurahanListQuery } from "@/services/admin/master/kelurahan.service";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Loader2 } from "lucide-react";

const districts: Record<string, { id: string; name: string }[]> = {
  "1-1": [
    { id: "1-1-1", name: "Gambir" },
    { id: "1-1-2", name: "Tanah Abang" },
    { id: "1-1-3", name: "Menteng" },
  ],
  "2-1": [
    { id: "2-1-1", name: "Bandung Wetan" },
    { id: "2-1-2", name: "Sumur Bandung" },
  ],
};

const subDistricts: Record<string, { id: string; name: string }[]> = {
  "1-1-1": [
    { id: "1-1-1-1", name: "Gambir" },
    { id: "1-1-1-2", name: "Cideng" },
  ],
  "2-1-1": [
    { id: "2-1-1-1", name: "Cihapit" },
    { id: "2-1-1-2", name: "Citarum" },
  ],
};

const religions = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
];
const maritalStatuses = [
  "Belum Menikah",
  "Menikah",
  "Cerai Hidup",
  "Cerai Mati",
];
const educationLevels = ["SD", "SMP", "SMA/SMK", "D3", "S1", "S2", "S3"];

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const taskId = searchParams.get("taskId") || "";
  const referal = searchParams.get("referal") || "";

  const dropdownProvinsiRef = useRef<HTMLDivElement>(null);
  const dropdownKotaRef = useRef<HTMLDivElement>(null);
  const dropdownKecamatanRef = useRef<HTMLDivElement>(null);
  const dropdownKelurahanRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    // Group 1: Akun
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referalCode: "",
    // Group 2: Identitas
    ktpPhoto: null as File | null,
    nik: "",
    province: "",
    city: "",
    district: "",
    subDistrict: "",
    rt: "",
    rw: "",
    detailAddress: "",
    birthDate: "",
    birthPlace: "",
    religion: "",
    maritalStatus: "",
    occupation: "",
    education: "",
    // Group 3: Kontak
    phone: "",
    homePhone: "",
    officePhone: "",
    fax: "",
    // Group 4: Media Sosial
    facebook: "",
    instagram: "",
    twitter: "",
    whatsapp: "",
    tiktok: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);

  const [openSelect, setOpenSelect] = useState({
    province: false,
    city: false,
    district: false,
    subDistrict: false,
  });

  // provinsi
  const [provinsiSearch, setProvinsiSearch] = useState("");
  const debouncedProvinsiSearch = useDebounce(provinsiSearch, 500);
  const { data: provinsiData, isLoading: isProvinsiLoading } =
    useGetProvinsiListQuery(
      {
        page: 1,
        paginate: 100,
        search: debouncedProvinsiSearch,
      },
      { skip: debouncedProvinsiSearch.length < 2 }
    );
  const filteredProvince = provinsiData?.data || [];

  // kota
  const [kotaSearch, setKotaSearch] = useState("");
  const debouncedKotaSearch = useDebounce(kotaSearch, 500);
  const { data: kotaData, isLoading: isKotaLoading } = useGetKotaListQuery(
    {
      page: 1,
      paginate: 100,
      search: debouncedProvinsiSearch,
      province_id: formData.province,
    },
    { skip: !formData.province || debouncedKotaSearch.length < 2 }
  );
  const filteredKota = useMemo(() => {
    if (!kotaData?.data) return [];

    return kotaData.data.filter((kota) => {
      return kota.name
        .toLowerCase()
        .includes(debouncedKotaSearch.toLowerCase());
    });
  }, [kotaData, debouncedKotaSearch]);

  // kecamatan
  const [districtSearch, setDistrictSearch] = useState("");
  const debouncedDistrictSearch = useDebounce(districtSearch, 500);
  const { data: kecamatanData, isLoading: isKecamatanLoading } =
    useGetKecamatanListQuery(
      {
        page: 1,
        paginate: 100,
        search: debouncedDistrictSearch,
        regency_id: formData.city,
      },
      { skip: !formData.city || debouncedDistrictSearch.length < 2 }
    );
  const filteredDistrict = useMemo(() => {
    if (!kecamatanData?.data) return [];
    return kecamatanData.data.filter((district) => {
      return district.name
        .toLocaleLowerCase()
        .includes(debouncedDistrictSearch.toLowerCase());
    });
  }, [kecamatanData, debouncedDistrictSearch]);

  // kelurahan
  const [subDistrictSearch, setSubDistrictSearch] = useState("");
  const debouncedSubDistrictSearch = useDebounce(subDistrictSearch, 500);
  const { data: kelurahanData, isLoading: isKelurahanLoading } =
    useGetKelurahanListQuery(
      {
        page: 1,
        paginate: 100,
        search: debouncedSubDistrictSearch,
        district_id: formData.district,
      },
      { skip: !formData.city || debouncedSubDistrictSearch.length < 2 }
    );
  const filteredSubDistrict = useMemo(() => {
    if (!kelurahanData?.data) return [];
    return kelurahanData.data.filter((district) => {
      return district.name
        .toLocaleLowerCase()
        .includes(debouncedSubDistrictSearch.toLowerCase());
    });
  }, [kelurahanData, debouncedSubDistrictSearch]);

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, ktpPhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1500);
  };

  const handleProvinsiSelect = (provinsi: { id: string; name: string }) => {
    console.log("dijalankan");
    setFormData((prev) => ({ ...prev, province: provinsi.id }));
    setProvinsiSearch(provinsi.name);
    setOpenSelect({ ...openSelect, province: false });
  };

  const handleKotaSelect = (kota: { id: string; name: string }) => {
    setFormData((prev) => ({ ...prev, city: kota.id }));
    setKotaSearch(kota.name);
    setOpenSelect({ ...openSelect, city: false });
  };

  const handleKecamatanSelect = (kecamatan: { id: string; name: string }) => {
    setFormData((prev) => ({ ...prev, district: kecamatan.id }));
    setDistrictSearch(kecamatan.name);
    setOpenSelect({ ...openSelect, district: false });
  };

  const handleKelurahanSelect = (kelurahan: { id: string; name: string }) => {
    setFormData((prev) => ({ ...prev, subDistrict: kelurahan.id }));
    setSubDistrictSearch(kelurahan.name);
    setOpenSelect({ ...openSelect, subDistrict: false });
  };

  useEffect(() => {
    if (referal) {
      setFormData((prev) => ({ ...prev, referalCode: referal }));
    }
  }, [referal]);

  // Menutup dropdown saat klik di luar komponen
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (
  //       dropdownProvinsiRef.current &&
  //       !dropdownProvinsiRef.current.contains(event.target as Node)
  //     ) {
  //       setOpenSelect({ ...openSelect, province: false });
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dropdownProvinsiRef]);

  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (
  //       dropdownKotaRef.current &&
  //       !dropdownKotaRef.current.contains(event.target as Node)
  //     ) {
  //       setOpenSelect({ ...openSelect, city: false });
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dropdownKotaRef]);

  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (
  //       dropdownKecamatanRef.current &&
  //       !dropdownKecamatanRef.current.contains(event.target as Node)
  //     ) {
  //       setOpenSelect({ ...openSelect, district: false });
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dropdownKecamatanRef]);

  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Card className="border-border shadow-xl">
        <CardHeader className="space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent-foreground rounded-2xl flex items-center justify-center shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Daftar Anggota Baru
          </CardTitle>
          <CardDescription className="text-center">
            Lengkapi formulir pendaftaran di bawah ini
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Group 1: Informasi Akun */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-base">Informasi Akun</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Nama Lengkap <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Kata Sandi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={8}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Konfirmasi Kata Sandi{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi kata sandi"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referalCode">Kode Referal (Opsional)</Label>
                <Input
                  disabled={!!referal}
                  id="referalCode"
                  type="text"
                  placeholder="Masukkan kode referal jika ada"
                  value={formData.referalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, referalCode: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* Group 2: Data Identitas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-base">Data Identitas</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ktpPhoto">
                  Foto KTP <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <Input
                      id="ktpPhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleKtpUpload}
                      required
                      className="h-11"
                    />
                  </div>
                  {ktpPreview && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                      <Image
                        unoptimized
                        src={ktpPreview || "/placeholder.svg"}
                        alt="Preview KTP"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nik">
                  NIK <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nik"
                  type="text"
                  placeholder="16 digit NIK"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData({ ...formData, nik: e.target.value })
                  }
                  required
                  maxLength={16}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">
                  Tanggal Lahir <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthPlace">
                  Tempat Lahir <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="birthPlace"
                  type="text"
                  placeholder="Kota tempat lahir"
                  value={formData.birthPlace}
                  onChange={(e) =>
                    setFormData({ ...formData, birthPlace: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="religion">
                  Agama <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.religion}
                  onValueChange={(value) =>
                    setFormData({ ...formData, religion: value })
                  }
                  required
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih agama" />
                  </SelectTrigger>
                  <SelectContent>
                    {religions.map((religion) => (
                      <SelectItem key={religion} value={religion}>
                        {religion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">
                  Status Menikah <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.maritalStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, maritalStatus: value })
                  }
                  required
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">
                  Pekerjaan <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="occupation"
                  type="text"
                  placeholder="Masukkan pekerjaan"
                  value={formData.occupation}
                  onChange={(e) =>
                    setFormData({ ...formData, occupation: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">
                  Pendidikan Terakhir{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.education}
                  onValueChange={(value) =>
                    setFormData({ ...formData, education: value })
                  }
                  required
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" ref={dropdownProvinsiRef}>
                <Label htmlFor="province_id">Provinsi</Label>
                <div className="relative">
                  <Input
                    id="province_id"
                    placeholder="Ketik min 2 huruf untuk mencari provinsi..."
                    value={provinsiSearch}
                    onChange={(e) => {
                      setProvinsiSearch(e.target.value);
                      setOpenSelect({ ...openSelect, province: true });
                      if (formData.province) {
                        setFormData((prev) => ({ ...prev, province: "" }));
                      }
                    }}
                    onFocus={() => {
                      setOpenSelect({ ...openSelect, province: true });
                    }}
                    required
                    autoComplete="off"
                  />
                  {openSelect.province && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {isProvinsiLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      ) : provinsiSearch.length < 2 ? (
                        <p className="text-sm text-gray-500 p-3">
                          Ketik minimal 2 huruf...
                        </p>
                      ) : filteredProvince.length > 0 ? (
                        provinsiData?.data.map((provinsi) => (
                          <button
                            type="button"
                            key={provinsi.id}
                            onClick={() => {
                              handleProvinsiSelect(provinsi);
                            }}
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

              <div className="space-y-2" ref={dropdownKotaRef}>
                <Label htmlFor="city">Kabupaten/Kota</Label>
                <div className="relative">
                  <Input
                    id="city"
                    placeholder="Ketik min 2 huruf untuk mencari kabupaten/kota..."
                    value={kotaSearch}
                    onChange={(e) => {
                      setKotaSearch(e.target.value);
                      setOpenSelect({ ...openSelect, city: true });
                      if (formData.city) {
                        setFormData((prev) => ({ ...prev, city: "" }));
                      }
                    }}
                    onFocus={() => {
                      setOpenSelect({ ...openSelect, city: true });
                    }}
                    required
                    autoComplete="off"
                  />
                  {openSelect.city && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {isKotaLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      ) : kotaSearch.length < 2 ? (
                        <p className="text-sm text-gray-500 p-3">
                          Ketik minimal 2 huruf...
                        </p>
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

              <div className="space-y-2" ref={dropdownKecamatanRef}>
                <Label htmlFor="district">Kecamatan</Label>
                <div className="relative">
                  <Input
                    id="district"
                    placeholder="Ketik min 2 huruf untuk mencari kecamatan..."
                    value={districtSearch}
                    onChange={(e) => {
                      setDistrictSearch(e.target.value);
                      setOpenSelect({ ...openSelect, district: true });
                      if (formData.city) {
                        setFormData((prev) => ({ ...prev, district: "" }));
                      }
                    }}
                    onFocus={() => {
                      setOpenSelect({ ...openSelect, district: true });
                    }}
                    required
                    autoComplete="off"
                  />
                  {openSelect.district && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {isKecamatanLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      ) : districtSearch.length < 2 ? (
                        <p className="text-sm text-gray-500 p-3">
                          Ketik minimal 2 huruf...
                        </p>
                      ) : filteredDistrict.length > 0 ? (
                        filteredDistrict.map((kecamatan) => (
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
                          kecamatan tidak ditemukan.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2" ref={dropdownKelurahanRef}>
                <Label htmlFor="subDistrict">Kelurahan</Label>
                <div className="relative">
                  <Input
                    id="subDistrict"
                    placeholder="Ketik min 2 huruf untuk mencari kelurahan..."
                    value={subDistrictSearch}
                    onChange={(e) => {
                      setSubDistrictSearch(e.target.value);
                      setOpenSelect({ ...openSelect, subDistrict: true });
                      if (formData.city) {
                        setFormData((prev) => ({ ...prev, subDistrict: "" }));
                      }
                    }}
                    onFocus={() => {
                      setOpenSelect({ ...openSelect, subDistrict: true });
                    }}
                    required
                    autoComplete="off"
                  />
                  {openSelect.subDistrict && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {isKelurahanLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      ) : subDistrictSearch.length < 2 ? (
                        <p className="text-sm text-gray-500 p-3">
                          Ketik minimal 2 huruf...
                        </p>
                      ) : filteredSubDistrict.length > 0 ? (
                        filteredSubDistrict.map((kelurahan) => (
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="rt">
                    RT <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="rt"
                    type="text"
                    placeholder="001"
                    value={formData.rt}
                    onChange={(e) =>
                      setFormData({ ...formData, rt: e.target.value })
                    }
                    required
                    maxLength={3}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rw">
                    RW <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="rw"
                    type="text"
                    placeholder="001"
                    value={formData.rw}
                    onChange={(e) =>
                      setFormData({ ...formData, rw: e.target.value })
                    }
                    required
                    maxLength={3}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailAddress">
                  Alamat Detail <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="detailAddress"
                  placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, dll)"
                  value={formData.detailAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, detailAddress: e.target.value })
                  }
                  required
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Group 3: Informasi Kontak */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-base">Informasi Kontak</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Nomor Telepon <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homePhone">
                  Telepon Rumah{" "}
                  <span className="text-muted-foreground text-xs">
                    (Opsional)
                  </span>
                </Label>
                <Input
                  id="homePhone"
                  type="tel"
                  placeholder="021xxxxxxxx"
                  value={formData.homePhone}
                  onChange={(e) =>
                    setFormData({ ...formData, homePhone: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="officePhone">
                  Telepon Kantor{" "}
                  <span className="text-muted-foreground text-xs">
                    (Opsional)
                  </span>
                </Label>
                <Input
                  id="officePhone"
                  type="tel"
                  placeholder="021xxxxxxxx"
                  value={formData.officePhone}
                  onChange={(e) =>
                    setFormData({ ...formData, officePhone: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fax">
                  Faksimili{" "}
                  <span className="text-muted-foreground text-xs">
                    (Opsional)
                  </span>
                </Label>
                <Input
                  id="fax"
                  type="tel"
                  placeholder="021xxxxxxxx"
                  value={formData.fax}
                  onChange={(e) =>
                    setFormData({ ...formData, fax: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>

            {/* Group 4: Media Sosial */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-base">Media Sosial</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Semua field di bawah ini bersifat opsional
              </p>

              <div className="space-y-2">
                <Label htmlFor="facebook">Link Facebook</Label>
                <Input
                  id="facebook"
                  type="url"
                  placeholder="https://facebook.com/username"
                  value={formData.facebook}
                  onChange={(e) =>
                    setFormData({ ...formData, facebook: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Link Instagram</Label>
                <Input
                  id="instagram"
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Link Twitter</Label>
                <Input
                  id="twitter"
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={formData.twitter}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok">Link TikTok</Label>
                <Input
                  id="tiktok"
                  type="url"
                  placeholder="https://tiktok.com/@username"
                  value={formData.tiktok}
                  onChange={(e) =>
                    setFormData({ ...formData, tiktok: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 font-semibold text-base"
                disabled={isLoading}
              >
                {isLoading ? "Memproses Pendaftaran..." : "Daftar Sekarang"}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link
                href="/anggota/login"
                className="text-primary font-semibold hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}