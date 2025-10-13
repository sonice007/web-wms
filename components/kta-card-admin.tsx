"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

export function KTACard() {
  const router = useRouter();
  const member = {
    memberId: "KTA-001234",
    memberName: "Ahmad Fauzi",
    placeOfBirth: "Jakarta",
    dateOfBirth: "15 Jan 1990",
    address: "Jl. Merdeka No.1 RT 01 RW 02",
    kelurahan: "Kebon Kacang",
    kecamatan: "Tanah Abang",
    province: "DKI Jakarta",
    memberSince: "15 Jan 2024",
  };

  return (
    <Card
      onClick={() => router.push("/admin/kta")}
      role="button"
      aria-label="Buka Kartu Anggota"
      className="relative w-full overflow-hidden rounded-xl shadow-xl border-0 text-[13px] p-6 cursor-pointer"
      style={{
        background:
          "linear-gradient(145deg, var(--primary) 0%, var(--secondary) 95%)",
        color: "var(--primary-foreground)",
      }}
    >
      {/* Decorative accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-white/10 rounded-full" />
      </div>

      <div className="relative flex flex-col justify-between space-y-4 text-white">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium opacity-90 tracking-widest">
              KARTU TANDA ANGGOTA
            </p>
          </div>
          {/* Chip visual */}
          <div className="w-10 h-7 bg-yellow-300 rounded-md relative shadow-inner">
            <div className="absolute inset-1 border border-yellow-600 rounded-md" />
            <div className="absolute inset-x-2 top-1/2 h-[1px] bg-yellow-600 opacity-60" />
          </div>
        </div>

        {/* Content: compact two-column layout */}
        <div className="grid grid-cols-[auto_1fr] gap-x-10 sm:gap-x-14 gap-y-1">
          <span className="opacity-90">No. Anggota</span>
          <span className="font-semibold ">{member.memberId}</span>

          <span className="opacity-90">Nama</span>
          <span className="font-semibold ">{member.memberName}</span>

          <span className="opacity-90">Tempat/Tgl Lahir</span>
          <span className="">
            {member.placeOfBirth}, {member.dateOfBirth}
          </span>

          <span className="opacity-90">Alamat</span>
          <span className=" leading-snug">{member.address}</span>

          <span className="opacity-90">Kelurahan</span>
          <span className="">{member.kelurahan}</span>

          <span className="opacity-90">Kecamatan</span>
          <span className="">{member.kecamatan}</span>

          <span className="opacity-90">Provinsi</span>
          <span className="">{member.province}</span>
        </div>

        {/* Footer branding */}
        <div className="flex justify-between items-center pt-2 border-t border-white/20">
          <span className="text-xs opacity-85"></span>
          <span className="font-bold text-base italic text-white">
            🇮🇩 e-KTA
          </span>
        </div>
      </div>
    </Card>
  );
}

