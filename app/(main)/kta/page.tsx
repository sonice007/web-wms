"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { useRef } from "react";

export default function KtaPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (window) window.print();
  };

  const handleDownloadPDF = () => {
    import("html2pdf.js").then((html2pdf) => {
      if (cardRef.current) {
        html2pdf.default().from(cardRef.current).save("kta.pdf");
      }
    });
  };

  const member = {
    nomor: "KTA-2025-00123",
    nama: "Aldi Rahmaddani",
    alamat: "Jl. Merdeka No. 45",
    kelurahan: "Sukamaju",
    kecamatan: "Bandung Wetan",
    provinsi: "Jawa Barat",
    kelamin: "Laki-laki",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 bg-[var(--background)] text-[var(--foreground)]">
      <Card
        ref={cardRef}
        className="w-full max-w-md rounded-2xl shadow-lg border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] overflow-hidden"
      >
        <CardHeader className="bg-[var(--primary)] text-[var(--primary-foreground)]">
          <CardTitle className="text-center text-lg font-semibold tracking-wide">
            Kartu Tanda Anggota
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-3 text-sm">
          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-muted-foreground">Nomor Anggota</span>
            <span>{member.nomor}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-muted-foreground">Nama Lengkap</span>
            <span>{member.nama}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-muted-foreground">Alamat</span>
            <span>{member.alamat}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-muted-foreground">Kelurahan / Kecamatan</span>
            <span>
              {member.kelurahan} / {member.kecamatan}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-muted-foreground">Provinsi</span>
            <span>{member.provinsi}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-muted-foreground">Jenis Kelamin</span>
            <span>{member.kelamin}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer size={16} /> Print KTA
        </Button>
        <Button onClick={handleDownloadPDF} variant="secondary" className="flex items-center gap-2">
          <Download size={16} /> Download PDF
        </Button>
      </div>
    </div>
  );
}
