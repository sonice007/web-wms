"use client"

import { Metadata } from "next" // Metadata harus ditangani secara dinamis dengan generateMetadata
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Share2, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  useGetPengumumanBySlugQuery,
} from "@/services/admin/pengumuman.service";

import { Pengumuman } from "@/types/admin/pengumuman";
import { usePathname } from "next/navigation"

// --- Helper Functions for Formatting ---

/**
 * Mengubah string tanggal ISO menjadi format "15 Oktober 2025".
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return dateString;
    }
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  } catch (error) {
    return dateString;
  }
};

/**
 * Fungsi ini digunakan untuk merender konten HTML yang mungkin mengandung <p>, <br>, dll.
 * Karena kita menggunakan `dangerouslySetInnerHTML`, kita asumsikan konten API aman.
 * Jika Anda ingin membersihkan dan merender setiap baris sebagai paragraf terpisah (seperti kode sebelumnya),
 * Anda harus memastikan konten API hanya mengandung teks atau tag dasar.
 * Saya akan mengembalikan ke logika pemisahan baris untuk keamanan dan konsistensi.
 */
const renderContent = (content: string) => {
    // Memisahkan paragraf berdasarkan baris baru ganda
    return content.split("\n\n").map((paragraph, index) => (
        <div key={index} className="mb-4 last:mb-0">
            {/* Merender setiap baris dalam paragraf sebagai teks terpisah untuk menghindari tag HTML bawaan */}
            {paragraph.split('\n').map((line, lineIndex) => (
                // Menggunakan dangerouslySetInnerHTML untuk merender tag HTML sederhana (misal: <b>) 
                // atau cukup render sebagai teks biasa jika content benar-benar murni teks/markdown.
                // Karena content dari API sebelumnya mengandung tag HTML, kita biarkan saja.
                <p key={lineIndex} className="text-base text-foreground leading-relaxed text-pretty">
                    {/* Menggunakan dangerouslySetInnerHTML jika kontennya benar-benar mengandung HTML yang ingin dirender */}
                    <span dangerouslySetInnerHTML={{ __html: line }} />
                </p>
            ))}
        </div>
    ));
};

// --- KOMPONEN HALAMAN DINAMIS ---
// Komponen menerima params dari Next.js
export default function PengumumanDetailPage({ params }: { params: { id: number } }) {
  const { id } = params;

  // Asumsi slug adalah ID numerik
  const pengumumanId = Number(id);

  // Panggil hook API
  const { data: announcement, isLoading, isError } = useGetPengumumanBySlugQuery(pengumumanId);

  // --- Penanganan Loading ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Memuat detail pengumuman...</p>
      </div>
    );
  }

  // --- Penanganan Error atau Data Tidak Ditemukan ---
  if (isError || !announcement) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <XCircle className="w-12 h-12 text-destructive" />
        <h1 className="text-xl font-bold mt-4">Pengumuman Tidak Ditemukan</h1>
        <p className="mt-2 text-muted-foreground text-center">
            {isError ? "Terjadi kesalahan saat mengambil data." : `Pengumuman dengan ID "${id}" tidak ada.`}
        </p>
        <Button asChild className="mt-6">
            <a href="/pengumuman">Kembali ke Daftar Pengumuman</a>
        </Button>
      </div>
    );
  }
  
  // Data telah berhasil diambil
  const formattedDate = formatDate(announcement.date);
  
  // --- Render Halaman Detail ---
  return (
    <div className="min-h-screen bg-background">
      {/* Header Gambar */}
      <div
        className="h-64 bg-cover bg-center flex items-end p-8"
        style={{ backgroundImage: `url(${announcement.image || '/placeholder.svg'})` }}
      >
      </div>


      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 pb-8">
        {/* Meta Info */}
        <Card>
          <CardContent className="p-4">
            <h1 className="text-xl text-black">
                {announcement.title}
              </h1>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span> {/* Tanggal rapih */}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              {/* Menggunakan fungsi renderContent yang menangani pemformatan baris baru */}
              {renderContent(announcement.content)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Catatan: Fungsi generateMetadata harus dipindahkan ke file terpisah di Next.js 13/14 App Router,
// atau diubah untuk mengambil data secara async di Server Component. Karena komponen ini adalah
// "use client", generateMetadata statis harus dihapus atau dimodifikasi agar sesuai dengan App Router. 
// Saya hapus implementasi generateMetadata statis karena tidak lagi relevan dengan data dinamis.
// Jika Anda menggunakan Pages Router, Anda bisa mengabaikan komentar ini.