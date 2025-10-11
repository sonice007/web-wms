import { AnnouncementCard } from "@/components/announcement-card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Bell } from "lucide-react";

// Sample announcements data
const announcements = [
  {
    id: "1",
    title: "Pendaftaran Anggota Baru Dibuka",
    excerpt:
      "Daftarkan diri Anda dan dapatkan benefit eksklusif sebagai anggota",
    content:
      "Kami dengan senang hati mengumumkan bahwa pendaftaran anggota baru telah dibuka untuk periode ini. Sebagai anggota, Anda akan mendapatkan berbagai benefit eksklusif termasuk akses ke program pelatihan, networking events, dan kesempatan untuk berkontribusi dalam berbagai kegiatan organisasi.",
    imageUrl: "/announcement-registration.jpg",
    date: "15 Jan 2024",
    category: "Keanggotaan",
    isImportant: true,
  },
  {
    id: "2",
    title: "Rapat Koordinasi Bulanan",
    excerpt:
      "Hadir dalam rapat koordinasi untuk membahas program kerja bulan ini",
    content:
      "Rapat koordinasi bulanan akan dilaksanakan pada tanggal 20 Januari 2024. Agenda rapat meliputi evaluasi program bulan lalu, pembahasan program kerja bulan ini, dan diskusi mengenai strategi pengembangan organisasi ke depan.",
    imageUrl: "/meeting-coordination.jpg",
    date: "12 Jan 2024",
    category: "Acara",
    isImportant: false,
  },
  {
    id: "3",
    title: "Program Pelatihan Gratis",
    excerpt:
      "Ikuti pelatihan skill development untuk meningkatkan kompetensi Anda",
    content:
      "Organisasi kami menyelenggarakan program pelatihan gratis untuk seluruh anggota. Pelatihan ini mencakup berbagai topik seperti leadership, public speaking, dan digital marketing. Daftarkan diri Anda segera karena kuota terbatas.",
    imageUrl: "/training-program.png",
    date: "10 Jan 2024",
    category: "Pelatihan",
    isImportant: true,
  },
  {
    id: "4",
    title: "Kegiatan Bakti Sosial Bulan Ini",
    excerpt:
      "Mari berpartisipasi dalam kegiatan bakti sosial untuk membantu masyarakat",
    content:
      "Dalam rangka meningkatkan kepedulian sosial, kami akan mengadakan kegiatan bakti sosial pada akhir bulan ini. Kegiatan meliputi pembagian sembako, pemeriksaan kesehatan gratis, dan renovasi fasilitas umum di daerah terpencil.",
    imageUrl: "/training-program.png",
    date: "8 Jan 2024",
    category: "Sosial",
    isImportant: false,
  },
  {
    id: "5",
    title: "Update Sistem Aplikasi Digital KTA",
    excerpt:
      "Sistem aplikasi telah diperbarui dengan fitur-fitur baru yang lebih baik",
    content:
      "Kami telah melakukan update pada sistem aplikasi Digital KTA dengan menambahkan berbagai fitur baru untuk meningkatkan pengalaman pengguna. Fitur baru meliputi notifikasi real-time, sistem poin yang lebih transparan, dan dashboard analytics yang lebih informatif.",
    imageUrl: "/training-program.png",
    date: "5 Jan 2024",
    category: "Teknologi",
    isImportant: false,
  },
  {
    id: "6",
    title: "Pengumuman Pemenang Kompetisi",
    excerpt: "Selamat kepada para pemenang kompetisi bulan lalu",
    content:
      "Kami mengucapkan selamat kepada para pemenang kompetisi bulan lalu. Terima kasih atas partisipasi luar biasa dari seluruh anggota. Hadiah akan segera dikirimkan ke alamat masing-masing pemenang dalam waktu 7 hari kerja.",
    imageUrl: "/training-program.png",
    date: "3 Jan 2024",
    category: "Kompetisi",
    isImportant: false,
  },
];

export default function PengumumanPage() {
  const importantAnnouncements = announcements.filter((a) => a.isImportant);
  const regularAnnouncements = announcements.filter((a) => !a.isImportant);

  return (
    <div className="space-y-6 p-4 safe-area-top">
      {/* Header */}
      <div className="pt-2 flex items-center gap-3">
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

      {/* Important Announcements */}
      {importantAnnouncements.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-border">
            <Bell className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-bold">Pengumuman Penting</h2>
            <Badge variant="destructive" className="h-5 text-xs">
              {importantAnnouncements.length}
            </Badge>
          </div>
          <div className="space-y-4">
            {importantAnnouncements.map((announcement, index) => (
              <div key={announcement.id}>
                <AnnouncementCard
                  {...announcement}
                  variant={index % 2 === 0 ? "large" : "card"}
                />
              </div>
            ))}
          </div>
        </section>
      )}

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
          {regularAnnouncements.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.id}
              {...announcement}
              variant={
                index % 3 === 0 ? "large" : index % 3 === 1 ? "card" : "compact"
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

