"use client"

import { AnnouncementCard } from "@/components/announcement-card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Bell } from "lucide-react";

// Import hook API service dan komponen tambahan (misalnya Skeleton dan Card)
import { useGetPengumumanListQuery } from "@/services/admin/pengumuman.service"; 
import { Card } from "@/components/ui/card";
// Removed Skeleton import (module missing) and defined a local Skeleton component below.
import { Pengumuman } from "@/types/admin/pengumuman";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = ({ className = "", ...props }: SkeletonProps) => (
  <div
    className={`animate-pulse rounded-md bg-muted ${className}`}
    {...props}
  />
);


export default function PengumumanPage() {
    // Pengaturan pagination/query default (sesuaikan jika perlu)
    const currentPage = 1;
    const itemsPerPage = 10;
    const query = "";

    const { data, isLoading, isError } = useGetPengumumanListQuery({
        page: currentPage,
        paginate: itemsPerPage,
        search: query,
    });

    // Ekstrak data pengumuman dari respons API. Gunakan array kosong jika data belum tersedia.
    const announcements: Pengumuman[] = (data as any)?.data || [];

    // Filter pengumuman menjadi penting dan reguler (anggap properti isImportant opsional, default false)
    const regularAnnouncements = (announcements as (Pengumuman & { isImportant?: boolean })[])
        .filter(a => !a.isImportant);

    // --- Penanganan Loading State ---
    if (isLoading) {
        return (
            <div className="space-y-6 p-4 safe-area-top">
                <div className="pt-4 flex gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div>
                        <Skeleton className="h-6 w-48 mb-1" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                {/* Skeleton untuk Pengumuman Penting */}
                <section className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <div className="space-y-4">
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                    </div>
                </section>
                {/* Skeleton untuk Semua Pengumuman */}
                <section className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <div className="grid grid-cols-1 gap-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </section>
            </div>
        );
    }

    // --- Penanganan Error State ---
    if (isError) {
        return (
            <div className="p-4 safe-area-top">
                <Card className="p-5 text-center bg-red-50 border-red-300 text-red-700">
                    Gagal memuat pengumuman. Terjadi kesalahan saat mengambil data dari server.
                </Card>
            </div>
        );
    }

    // --- Penanganan Data Kosong ---
    if (announcements.length === 0) {
        return (
            <div className="space-y-6 p-4 safe-area-top">
                <div className="pt-4 flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Megaphone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground leading-tight">
                            Pengumuman
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi terbaru untuk seluruh anggota
                        </p>
                    </div>
                </div>
                <Card className="p-5 text-center text-muted-foreground border-dashed">
                    Tidak ada pengumuman yang tersedia saat ini.
                </Card>
            </div>
        );
    }


    // --- Render Konten Halaman dengan Data API ---
    return (
        <div className="space-y-6 p-4 safe-area-top">
            {/* Header */}
            <div className="pt-4 flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground leading-tight">
                        Pengumuman
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Informasi terbaru untuk seluruh anggota
                    </p>
                </div>
            </div>

            {/* Regular Announcements */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-border">
                    <Megaphone className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Semua Pengumuman</h2>
                    <Badge variant="secondary" className="h-5 text-xs">
                        {regularAnnouncements.length}
                    </Badge>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {/* Menggunakan data dari API */}
                    {regularAnnouncements.map((announcement, index) => (
                        <AnnouncementCard
                            key={announcement.id}
                            {...announcement}
                        />
                    ))}
                </div>
                {/* Tambahkan tombol Load More atau pagination jika itemsPerPage tidak mencakup semua data */}
            </section>
        </div>
    );
}