"use client"

import { useState } from "react"
import { TaskCard } from "@/components/task-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, ArrowUpDown, Briefcase } from "lucide-react"

// Sample tasks data
const allTasks = [
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
  {
    id: "5",
    category: "Simpatisan" as const,
    title: "Survey Kepuasan Simpatisan",
    description: "Kumpulkan feedback dari simpatisan untuk evaluasi program",
    progress: 55,
    target: 150,
    achieved: 83,
    startDate: "1 Feb",
    endDate: "28 Feb",
    bonus: 30000,
  },
  {
    id: "6",
    category: "Lainnya" as const,
    title: "Laporan Kegiatan Bulanan",
    description: "Submit laporan kegiatan bulanan beserta dokumentasi pendukung",
    progress: 90,
    target: 30,
    achieved: 27,
    startDate: "1 Jan",
    endDate: "5 Feb",
    bonus: 20000,
  },
]

export default function TaskPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Filter tasks by category
  const filteredTasks = allTasks.filter((task) => {
    if (categoryFilter === "all") return true
    return task.category === categoryFilter
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "newest") {
      return Number.parseInt(b.id) - Number.parseInt(a.id)
    } else {
      return Number.parseInt(a.id) - Number.parseInt(b.id)
    }
  })

  return (
    <div className="space-y-4 p-4 safe-area-top">
      {/* Header */}
      <div className="pt-2 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">Semua Task</h1>
          <p className="text-sm text-muted-foreground">Pilih task dan selesaikan untuk mendapatkan bonus</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 w-full">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Rekrutment">Rekrutment</SelectItem>
              <SelectItem value="Simpatisan">Simpatisan</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 w-full">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>

      {sortedTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tidak ada task ditemukan</p>
        </div>
      )}
    </div>
  )
}
