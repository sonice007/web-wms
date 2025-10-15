import { redirect } from "next/navigation";
import { decryptKtaToken } from "@/lib/kta-url";

type PageProps = { params: { token: string } };
export const runtime = "nodejs";

function pickServerSecret(): string {
  const s1 = (process.env.KTA_URL_SECRET ?? "").trim();
  if (s1) return s1;
  const s2 = (process.env.NEXT_PUBLIC_KTA_URL_SECRET ?? "").trim();
  return s2;
}

export default async function Page({ params }: PageProps) {
  const token = params.token;

  // Dev helper: jika token angka murni → redirect langsung
  if (/^\d+$/.test(token)) {
    redirect(`/kta?id=${encodeURIComponent(token)}`);
  }

  const SECRET = pickServerSecret();

  try {
    const plain = await decryptKtaToken(token, SECRET);
    const id = plain.trim();
    if (!/^\d+$/.test(id)) throw new Error("Not numeric id");
    redirect(`/kta?id=${encodeURIComponent(id)}`);
  } catch {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Token tidak valid</h1>
          <p className="text-sm text-muted-foreground">
            Pastikan URL yang Anda buka benar atau belum kedaluwarsa.
          </p>
        </div>
      </div>
    );
  }
}