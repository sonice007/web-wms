"use client";

import { PrinterIcon, IdCard } from "lucide-react";
import { useRef } from "react";
import { KTACard } from "@/components/kta-card-admin";
import KTACardBack from "@/components/kta-card-back-admin";
import { Button } from "@/components/ui/button";

export default function KtaPage() {
  const memberId = "KTA-001234";
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-2 flex gap-3 no-print">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <IdCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Kartu Anggota
            </h1>
            <p className="text-sm text-muted-foreground">
              Tampilan depan dan belakang kartu, siap cetak
            </p>
          </div>
        </div>

        <div ref={printRef} className="space-y-6">
          <div className="flex items-center justify-center">
            <KTACard />
          </div>
          <div className="flex items-center justify-center">
            <KTACardBack memberId={memberId} />
          </div>
        </div>

        <div>
          <Button
            className="w-full no-print"
            onClick={handlePrint}
            size="lg"
            variant="default"
          >
            <PrinterIcon />
            <span> Print / Download PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
