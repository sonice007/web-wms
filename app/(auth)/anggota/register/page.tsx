"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus } from "lucide-react"

const provinces = [
  { id: "1", name: "DKI Jakarta" },
  { id: "2", name: "Jawa Barat" },
  { id: "3", name: "Jawa Tengah" },
  { id: "4", name: "Jawa Timur" },
  { id: "5", name: "Banten" },
]

const cities: Record<string, { id: string; name: string }[]> = {
  "1": [
    { id: "1-1", name: "Jakarta Pusat" },
    { id: "1-2", name: "Jakarta Utara" },
    { id: "1-3", name: "Jakarta Selatan" },
    { id: "1-4", name: "Jakarta Timur" },
    { id: "1-5", name: "Jakarta Barat" },
  ],
  "2": [
    { id: "2-1", name: "Bandung" },
    { id: "2-2", name: "Bekasi" },
    { id: "2-3", name: "Bogor" },
    { id: "2-4", name: "Depok" },
  ],
}

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
}

const subDistricts: Record<string, { id: string; name: string }[]> = {
  "1-1-1": [
    { id: "1-1-1-1", name: "Gambir" },
    { id: "1-1-1-2", name: "Cideng" },
  ],
  "2-1-1": [
    { id: "2-1-1-1", name: "Cihapit" },
    { id: "2-1-1-2", name: "Citarum" },
  ],
}

const religions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"]
const maritalStatuses = ["Belum Menikah", "Menikah", "Cerai Hidup", "Cerai Mati"]
const educationLevels = ["SD", "SMP", "SMA/SMK", "D3", "S1", "S2", "S3"]

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Group 1: Akun
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
  })
  const [isLoading, setIsLoading] = useState(false)
  const [ktpPreview, setKtpPreview] = useState<string | null>(null)

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, ktpPhoto: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setKtpPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!")
      return
    }

    setIsLoading(true)

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      router.push("/login")
    }, 1500)
  }

  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Card className="border-border shadow-xl">
        <CardHeader className="space-y-3 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Daftar Anggota Baru</CardTitle>
          <CardDescription className="text-center">Lengkapi formulir pendaftaran di bawah ini</CardDescription>
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
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Konfirmasi Kata Sandi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi kata sandi"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={8}
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
                      <img
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
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  required
                  maxLength={16}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">
                  Provinsi <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) =>
                    setFormData({ ...formData, province: value, city: "", district: "", subDistrict: "" })
                  }
                  required
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  Kabupaten/Kota <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData({ ...formData, city: value, district: "", subDistrict: "" })}
                  disabled={!formData.province}
                  required
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih kabupaten/kota" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.province &&
                      cities[formData.province]?.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">
                  Kecamatan <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => setFormData({ ...formData, district: value, subDistrict: "" })}
                  disabled={!formData.city}
                  required
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.city &&
                      districts[formData.city]?.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subDistrict">
                  Kelurahan <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.subDistrict}
                  onValueChange={(value) => setFormData({ ...formData, subDistrict: value })}
                  disabled={!formData.district}
                  required
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih kelurahan" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.district &&
                      subDistricts[formData.district]?.map((subDistrict) => (
                        <SelectItem key={subDistrict.id} value={subDistrict.id}>
                          {subDistrict.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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
                    onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                  required
                  rows={3}
                  className="resize-none"
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
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
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
                  onValueChange={(value) => setFormData({ ...formData, religion: value })}
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
                  onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
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
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">
                  Pendidikan Terakhir <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.education}
                  onValueChange={(value) => setFormData({ ...formData, education: value })}
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homePhone">
                  Telepon Rumah <span className="text-muted-foreground text-xs">(Opsional)</span>
                </Label>
                <Input
                  id="homePhone"
                  type="tel"
                  placeholder="021xxxxxxxx"
                  value={formData.homePhone}
                  onChange={(e) => setFormData({ ...formData, homePhone: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="officePhone">
                  Telepon Kantor <span className="text-muted-foreground text-xs">(Opsional)</span>
                </Label>
                <Input
                  id="officePhone"
                  type="tel"
                  placeholder="021xxxxxxxx"
                  value={formData.officePhone}
                  onChange={(e) => setFormData({ ...formData, officePhone: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fax">
                  Faksimili <span className="text-muted-foreground text-xs">(Opsional)</span>
                </Label>
                <Input
                  id="fax"
                  type="tel"
                  placeholder="021xxxxxxxx"
                  value={formData.fax}
                  onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
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
              <p className="text-sm text-muted-foreground">Semua field di bawah ini bersifat opsional</p>

              <div className="space-y-2">
                <Label htmlFor="facebook">Link Facebook</Label>
                <Input
                  id="facebook"
                  type="url"
                  placeholder="https://facebook.com/username"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full h-12 font-semibold text-base" disabled={isLoading}>
                {isLoading ? "Memproses Pendaftaran..." : "Daftar Sekarang"}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Masuk di sini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
