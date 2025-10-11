"use client"

import { QrCode } from "lucide-react"
import { Card } from "@/components/ui/card"

interface KTACardProps {
  memberName: string
  memberId: string
  memberSince: string
  province: string
}

export function KTACard({ memberName, memberId, memberSince, province }: KTACardProps) {
  return (
    <Card className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden shadow-xl border-0">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full translate-y-20 -translate-x-20" />
      </div>

      {/* Card Content */}
      <div className="relative h-full p-5 flex flex-col justify-between text-white">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium opacity-90">KARTU TANDA ANGGOTA</div>
            <div className="text-lg font-bold mt-0.5">Digital KTA</div>
          </div>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
        </div>

        {/* Member Info */}
        <div className="space-y-2">
          <div>
            <div className="text-xs opacity-75">Nama Anggota</div>
            <div className="text-base font-bold">{memberName}</div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-xs opacity-75">No. Anggota</div>
              <div className="text-sm font-semibold">{memberId}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs opacity-75">Bergabung</div>
              <div className="text-sm font-semibold">{memberSince}</div>
            </div>
          </div>

          <div>
            <div className="text-xs opacity-75">Provinsi</div>
            <div className="text-sm font-semibold">{province}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
