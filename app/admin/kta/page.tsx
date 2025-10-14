"use client";

import { PrinterIcon, IdCard } from "lucide-react";
import { useRef, useMemo, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { KTACard } from "@/components/kta-card-admin";
import KTACardBack from "@/components/kta-card-back-admin";
import { Button } from "@/components/ui/button";

/** Skeleton ringan saat menunggu router params/searchParams siap */
function KtaPageFallback() {
  return (
    <div className="min-h-screen bg-background p-4 animate-pulse">
      <div className="h-10 w-1/3 bg-muted rounded mb-4" />
      <div className="h-6 w-2/3 bg-muted rounded mb-6" />
      <div className="h-[220px] bg-muted rounded mb-4" />
      <div className="h-[220px] bg-muted rounded mb-6" />
      <div className="h-12 w-full bg-muted rounded" />
    </div>
  );
}

function KtaPageContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  // id dari /admin/kta/[id] atau ?id=
  const rawId =
    (params?.id as string | undefined) ?? searchParams?.get("id") ?? undefined;

  const numericId = useMemo(() => {
    if (!rawId) return undefined;
    return /^\d+$/.test(rawId) ? Number(rawId) : undefined;
  }, [rawId]);

  const backId = rawId ?? "KTA-001234";

  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Global print styles */}
      <style jsx global>{`
        /* ============================
           KENDALI UKURAN
           ============================ */
        :root {
          --card-width-preview: 120mm; /* lebar di layar (preview) */
          --card-width-print: 140mm; /* lebar saat CETAK (dibesarkan) */
          --page-margin: 8mm;
          --card-gap: 10mm;
        }

        /* Preview layar (WYSIWYG) */
        .kta-card-frame {
          width: var(--card-width-preview);
          max-width: 100%;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: var(--page-margin);
          }

          html,
          body,
          #__next {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
            background: transparent !important;
          }

          /* hanya area kartu yang tampil */
          body * {
            visibility: hidden !important;
          }
          .print-area,
          .print-area * {
            visibility: visible !important;
          }

          .print-area {
            position: fixed;
            inset: 0;
            margin: var(--page-margin);
            display: grid;
            justify-content: center;
            align-content: start;
            row-gap: var(--card-gap);
          }

          /* >>> INI yang menentukan LEBAR SAAT PRINT <<< */
          .kta-card-frame {
            width: var(--card-width-print) !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="space-y-6">
        {/* Header (hilang saat print) */}
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

        {/* === Area yang dicetak (dua kartu) === */}
        <div
          ref={printRef}
          className="print-area flex flex-col items-center gap-[var(--card-gap)]"
        >
          {/* Depan */}
          <div className="kta-card-frame">
            <KTACard memberId={numericId} onClickRoute="/admin/kta/[id]" />
          </div>
          {/* Belakang */}
          <div className="kta-card-frame">
            <KTACardBack memberId={backId} />
          </div>
        </div>

        {/* Tombol Print (hilang saat print) */}
        <div className="no-print">
          <Button className="w-full" onClick={handlePrint} size="lg">
            <PrinterIcon />
            <span> Print / Download PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function KtaPage() {
  return (
    <Suspense fallback={<KtaPageFallback />}>
      <KtaPageContent />
    </Suspense>
  );
}