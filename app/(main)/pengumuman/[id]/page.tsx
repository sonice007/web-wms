import { notFound } from "next/navigation"
import { AnnouncementDetailHeader } from "@/components/announcement-detail-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample announcements data
const announcementsData: Record<
  string,
  {
    id: string
    title: string
    content: string
    imageUrl: string
    date: string
    category: string
    author: string
  }
> = {
  "1": {
    id: "1",
    title: "Pendaftaran Anggota Baru Dibuka",
    content: `Kami dengan senang hati mengumumkan bahwa pendaftaran anggota baru telah dibuka untuk periode ini. Sebagai anggota, Anda akan mendapatkan berbagai benefit eksklusif termasuk akses ke program pelatihan, networking events, dan kesempatan untuk berkontribusi dalam berbagai kegiatan organisasi.

Program keanggotaan kami dirancang untuk memberikan nilai maksimal bagi setiap anggota. Dengan bergabung, Anda akan menjadi bagian dari komunitas yang solid dan saling mendukung dalam mencapai tujuan bersama.

Beberapa benefit yang akan Anda dapatkan:
• Akses ke semua program pelatihan dan workshop
• Networking dengan profesional dari berbagai bidang
• Kesempatan untuk mengikuti kegiatan sosial dan pengabdian masyarakat
• Dukungan dalam pengembangan karir dan bisnis
• Akses ke platform digital eksklusif untuk anggota

Jangan lewatkan kesempatan emas ini! Daftarkan diri Anda sekarang juga dan jadilah bagian dari perubahan positif. Untuk informasi lebih lanjut dan pendaftaran, silakan hubungi sekretariat kami atau kunjungi website resmi organisasi.`,
    imageUrl: "/announcement-registration.jpg",
    date: "15 Jan 2024",
    category: "Keanggotaan",
    author: "Tim Sekretariat",
  },
  "2": {
    id: "2",
    title: "Rapat Koordinasi Bulanan",
    content: `Rapat koordinasi bulanan akan dilaksanakan pada tanggal 20 Januari 2024. Agenda rapat meliputi evaluasi program bulan lalu, pembahasan program kerja bulan ini, dan diskusi mengenai strategi pengembangan organisasi ke depan.

Kehadiran seluruh anggota sangat diharapkan untuk memastikan koordinasi yang baik dalam menjalankan program-program organisasi. Rapat akan dilaksanakan secara hybrid, baik offline maupun online melalui platform video conference.

Detail Acara:
• Tanggal: 20 Januari 2024
• Waktu: 09.00 - 12.00 WIB
• Tempat: Kantor Pusat / Online via Zoom
• Dresscode: Smart Casual

Agenda Rapat:
1. Pembukaan dan laporan ketua
2. Evaluasi program bulan lalu
3. Presentasi program kerja bulan ini
4. Diskusi dan masukan dari anggota
5. Penutupan

Mohon konfirmasi kehadiran Anda paling lambat 2 hari sebelum acara. Untuk yang berhalangan hadir, dapat mengikuti secara online dengan mendaftar terlebih dahulu.`,
    imageUrl: "/meeting-coordination.jpg",
    date: "12 Jan 2024",
    category: "Acara",
    author: "Koordinator Acara",
  },
  "3": {
    id: "3",
    title: "Program Pelatihan Gratis",
    content: `Organisasi kami menyelenggarakan program pelatihan gratis untuk seluruh anggota. Pelatihan ini mencakup berbagai topik seperti leadership, public speaking, dan digital marketing. Daftarkan diri Anda segera karena kuota terbatas.

Program pelatihan ini dirancang khusus untuk meningkatkan kompetensi dan skill anggota dalam berbagai bidang yang relevan dengan perkembangan zaman. Semua materi akan disampaikan oleh praktisi dan ahli yang berpengalaman di bidangnya.

Topik Pelatihan:
• Leadership & Management Skills
• Public Speaking & Communication
• Digital Marketing & Social Media
• Personal Branding
• Financial Literacy

Fasilitas:
• Materi pelatihan lengkap
• Sertifikat resmi
• Networking session
• Konsultasi gratis dengan mentor
• Akses ke komunitas alumni pelatihan

Syarat & Ketentuan:
• Anggota aktif organisasi
• Mengisi formulir pendaftaran
• Komitmen mengikuti seluruh sesi pelatihan
• Kuota terbatas 50 peserta

Segera daftarkan diri Anda dan tingkatkan kompetensi untuk masa depan yang lebih baik!`,
    imageUrl: "/training-program.png",
    date: "10 Jan 2024",
    category: "Pelatihan",
    author: "Divisi Pengembangan SDM",
  },
}

export default function PengumumanDetailPage({ params }: { params: { id: string } }) {
  const announcement = announcementsData[params.id]

  if (!announcement) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementDetailHeader imageUrl={announcement.imageUrl} title={announcement.title} />

      <div className="p-4 space-y-6 pb-8">
        {/* Meta Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Badge>{announcement.category}</Badge>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{announcement.date}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </Button>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Dipublikasikan oleh <span className="font-semibold text-foreground">{announcement.author}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              {announcement.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-sm text-foreground leading-relaxed mb-4 last:mb-0 text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
