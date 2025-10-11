import { notFound } from "next/navigation"
import { TaskDetailHeader } from "@/components/task-detail-header"
import { RecruitmentForm } from "@/components/recruitment-form"
import { SimpatisanForm } from "@/components/simpatisan-form"
import { OtherTaskForm } from "@/components/other-task-form"

// Sample task data - in production, fetch from API
const tasksData: Record<
  string,
  {
    id: string
    category: "Rekrutment" | "Simpatisan" | "Lainnya"
    title: string
    description: string
    progress: number
    target: number
    achieved: number
    startDate: string
    endDate: string
    fullDescription: string
  }
> = {
  "1": {
    id: "1",
    category: "Rekrutment",
    title: "Rekrutmen Anggota Baru Wilayah Jakarta",
    description: "Bantu kami merekrut anggota baru di wilayah Jakarta dan sekitarnya",
    progress: 65,
    target: 100,
    achieved: 65,
    startDate: "1 Jan",
    endDate: "31 Jan",
    fullDescription:
      "Program rekrutmen anggota baru untuk wilayah Jakarta dan sekitarnya. Kami membutuhkan bantuan Anda untuk menjangkau calon anggota potensial dan membantu mereka dalam proses pendaftaran. Target kami adalah mendapatkan 100 anggota baru dalam periode ini.",
  },
  "2": {
    id: "2",
    category: "Simpatisan",
    title: "Pendataan Simpatisan Daerah",
    description: "Lakukan pendataan simpatisan di daerah masing-masing",
    progress: 45,
    target: 200,
    achieved: 90,
    startDate: "5 Jan",
    endDate: "28 Feb",
    fullDescription:
      "Kegiatan pendataan simpatisan di seluruh daerah untuk membangun database yang lebih komprehensif. Data yang dikumpulkan akan digunakan untuk program-program selanjutnya dan komunikasi yang lebih efektif dengan para simpatisan.",
  },
  "3": {
    id: "3",
    category: "Lainnya",
    title: "Dokumentasi Kegiatan Sosial",
    description: "Upload dokumentasi kegiatan sosial yang telah dilaksanakan",
    progress: 80,
    target: 50,
    achieved: 40,
    startDate: "10 Jan",
    endDate: "20 Jan",
    fullDescription:
      "Kumpulkan dan upload dokumentasi dari berbagai kegiatan sosial yang telah dilaksanakan. Dokumentasi ini penting untuk arsip organisasi dan publikasi di media sosial untuk meningkatkan awareness masyarakat.",
  },
  "4": {
    id: "4",
    category: "Rekrutment",
    title: "Rekrutmen Koordinator Wilayah",
    description: "Cari koordinator wilayah untuk daerah Jawa Barat",
    progress: 30,
    target: 20,
    achieved: 6,
    startDate: "15 Jan",
    endDate: "15 Feb",
    fullDescription:
      "Kami membutuhkan koordinator wilayah yang berpengalaman untuk mengelola kegiatan di Jawa Barat. Kandidat ideal memiliki kemampuan leadership yang baik dan pengalaman dalam organisasi kemasyarakatan.",
  },
  "5": {
    id: "5",
    category: "Simpatisan",
    title: "Survey Kepuasan Simpatisan",
    description: "Lakukan survey kepuasan terhadap program yang telah berjalan",
    progress: 55,
    target: 150,
    achieved: 82,
    startDate: "1 Feb",
    endDate: "28 Feb",
    fullDescription:
      "Survey ini bertujuan untuk mengetahui tingkat kepuasan simpatisan terhadap program-program yang telah dijalankan. Feedback yang diberikan akan sangat membantu kami dalam meningkatkan kualitas program di masa mendatang.",
  },
  "6": {
    id: "6",
    category: "Lainnya",
    title: "Laporan Kegiatan Bulanan",
    description: "Submit laporan kegiatan bulanan dari setiap koordinator",
    progress: 70,
    target: 30,
    achieved: 21,
    startDate: "1 Feb",
    endDate: "10 Feb",
    fullDescription:
      "Setiap koordinator wilayah diwajibkan untuk menyerahkan laporan kegiatan bulanan. Laporan harus mencakup kegiatan yang telah dilaksanakan, kendala yang dihadapi, dan rencana untuk bulan berikutnya. Gunakan form ini untuk mengirimkan laporan Anda.",
  },
  "7": {
    id: "7",
    category: "Rekrutment",
    title: "Rekrutmen Relawan Event",
    description: "Cari relawan untuk membantu event besar bulan depan",
    progress: 85,
    target: 50,
    achieved: 42,
    startDate: "20 Jan",
    endDate: "5 Feb",
    fullDescription:
      "Event besar akan diadakan bulan depan dan kami membutuhkan relawan untuk membantu berbagai aspek acara. Relawan akan mendapatkan sertifikat dan pengalaman berharga dalam event management.",
  },
  "8": {
    id: "8",
    category: "Simpatisan",
    title: "Kampanye Media Sosial",
    description: "Ajak simpatisan untuk aktif di media sosial organisasi",
    progress: 40,
    target: 300,
    achieved: 120,
    startDate: "1 Jan",
    endDate: "31 Mar",
    fullDescription:
      "Tingkatkan engagement di media sosial dengan mengajak simpatisan untuk follow, like, dan share konten organisasi. Semakin banyak engagement, semakin luas jangkauan pesan kita kepada masyarakat.",
  },
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = tasksData[params.id]

  if (!task) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <TaskDetailHeader
        title={task.title}
        category={task.category}
        progress={task.progress}
        target={task.target}
        achieved={task.achieved}
        startDate={task.startDate}
        endDate={task.endDate}
      />

      <div className="p-4 space-y-6 pb-8">
        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Deskripsi Task</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{task.fullDescription}</p>
        </div>

        {/* Form based on category */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Form Pengerjaan</h2>
          {task.category === "Rekrutment" && <RecruitmentForm taskId={task.id} />}
          {task.category === "Simpatisan" && <SimpatisanForm taskId={task.id} />}
          {task.category === "Lainnya" && <OtherTaskForm taskId={task.id} />}
        </div>
      </div>
    </div>
  )
}
