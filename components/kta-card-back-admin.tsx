"use client";

import Image from "next/image";

export default function KTACardBack({ memberId }: { memberId: string }) {
  const qrData =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${encodeURIComponent(memberId)}`
      : "https://digitalkta.app/";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    qrData
  )}`;

  return (
    <div>
      <div
        className="w-full h-full rounded-xl shadow-xl overflow-hidden p-6 space-y-4"
        style={{
          background:
            "linear-gradient(145deg, var(--secondary) 0%, var(--primary) 95%)",
        }}
      >
        <div className="h-full flex text-white">
          {/* Left: terms */}
          <div className="w-2/3 pr-3 overflow-hidden">
            <h3 className="font-semibold mb-2">Ketentuan Keanggotaan</h3>
            <ul className="text-xs leading-snug list-disc pl-5 opacity-90 space-y-1">
              <li>Anggota wajib menjaga kerahasiaan data Digital KTA.</li>
              <li>Kartu hanya digunakan untuk keperluan resmi Digital KTA.</li>
              <li>Segera laporkan kehilangan atau penyalahgunaan ke admin.</li>
              <li>
                Hak dan kewajiban anggota mengikuti ketentuan Digital KTA.
              </li>
            </ul>
          </div>

          {/* Right: QR */}
          <div className="w-1/3 flex items-center justify-center">
            <div className="bg-white p-2 rounded-md">
              <Image src={qrSrc} alt="QR KTA" width={220} height={220} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-white/20">
          <span className="text-xs opacity-85"></span>
          <span className="font-bold text-base italic text-white">
            🇮🇩 e-KTA
          </span>
        </div>
      </div>
    </div>
  );
}
