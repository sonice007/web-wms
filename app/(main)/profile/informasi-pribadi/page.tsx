"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const provinces = ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten"]

const cities: Record<string, string[]> = {
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Utara", "Jakarta Selatan", "Jakarta Timur", "Jakarta Barat"],
  "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Depok", "Cirebon"],
  "Jawa Tengah": ["Semarang", "Solo", "Magelang", "Salatiga", "Pekalongan"],
  "Jawa Timur": ["Surabaya", "Malang", "Kediri", "Madiun", "Blitar"],
  Banten: ["Tangerang", "Serang", "Cilegon", "Tangerang Selatan"],
}

export default function InformasiPribadiPage() {
  const [selectedProvince, setSelectedProvince] = useState("DKI Jakarta")

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-4 p-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">Informasi Pribadi</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Photo */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-primary text-white text-2xl">JD</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Klik untuk mengubah foto profil</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Nama Lengkap</Label>
              <Input id="fullname" placeholder="Masukkan nama lengkap" defaultValue="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" defaultValue="john.doe@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">No. Handphone</Label>
              <Input id="phone" type="tel" placeholder="08xxxxxxxxxx" defaultValue="081234567890" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input id="address" placeholder="Masukkan alamat lengkap" defaultValue="Jl. Contoh No. 123" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Kabupaten/Kota</Label>
              <Select defaultValue={cities[selectedProvince]?.[0]}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kota" />
                </SelectTrigger>
                <SelectContent>
                  {cities[selectedProvince]?.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kelurahan">Kelurahan</Label>
              <Input id="kelurahan" placeholder="Masukkan kelurahan" defaultValue="Kelurahan Contoh" />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full">Simpan Perubahan</Button>
      </div>
    </div>
  )
}
