import { KTACard } from "@/components/kta-card"
import { AnnouncementCarousel } from "@/components/announcement-carousel"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Megaphone, Briefcase } from "lucide-react"
import Link from "next/link"

// Sample data
const memberData = {
  memberName: "Ahmad Fauzi",
  memberId: "KTA-2024-001234",
  memberSince: "Jan 2024",
  province: "DKI Jakarta",
}

const popularTasks = [
  {
    id: "1",
    category: "Rekrutment" as const,
    title: "Rekrutmen Anggota Baru Wilayah Jakarta",
    description: "Bantu kami merekrut anggota baru di wilayah Jakarta dan sekitarnya",
    progress: 65,
    target: 100,
    achieved: 65,
    startDate: "1 Jan",
    endDate: "31 Jan",
    bonus: 50000,
  },
  {
    id: "2",
    category: "Simpatisan" as const,
    title: "Pendataan Simpatisan Daerah",
    description: "Lakukan pendataan simpatisan di daerah masing-masing",
    progress: 45,
    target: 200,
    achieved: 90,
    startDate: "5 Jan",
    endDate: "28 Feb",
    bonus: 35000,
  },
  {
    id: "3",
    category: "Lainnya" as const,
    title: "Dokumentasi Kegiatan Sosial",
    description: "Upload dokumentasi kegiatan sosial yang telah dilaksanakan",
    progress: 80,
    target: 50,
    achieved: 40,
    startDate: "10 Jan",
    endDate: "20 Jan",
    bonus: 25000,
  },
  {
    id: "4",
    category: "Rekrutment" as const,
    title: "Sosialisasi Program Keanggotaan",
    description: "Lakukan sosialisasi program keanggotaan di komunitas lokal",
    progress: 30,
    target: 75,
    achieved: 23,
    startDate: "15 Jan",
    endDate: "15 Feb",
    bonus: 40000,
  },
]

export default function HomePage() {
  return (
    <div className="space-y-6 p-4 safe-area-top">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-foreground">Selamat Datang</h1>
        <p className="text-sm text-muted-foreground">Kelola keanggotaan Anda dengan mudah</p>
      </div>

      {/* KTA Card */}
      <section>
        <KTACard {...memberData} />
      </section>

      {/* Announcements Carousel */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">Pengumuman Terbaru</h2>
              <p className="text-xs text-muted-foreground">Informasi penting untuk Anda</p>
            </div>
          </div>
          <Link href="/pengumuman">
            <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
              Semua
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <AnnouncementCarousel />
      </section>

      {/* Popular Tasks */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">Task Populer</h2>
              <p className="text-xs text-muted-foreground">Selesaikan dan dapatkan bonus</p>
            </div>
          </div>
          <Link href="/task">
            <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
              Semua
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      </section>
    </div>
  )
}
