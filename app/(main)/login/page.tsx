// "use client";

// import type React from "react";

// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Mail, Lock, ArrowRight } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setIsLoading(true);
//       const signInRes = await signIn("credentials", {
//         redirect: false,
//         email,
//         password,
//       });

//       if (signInRes?.ok) {
//         router.replace("/");
//       } else {
//         setError("Gagal masuk. Email atau password salah.");
//       }
//     } catch (err: unknown) {
//       console.error("Login error:", err);
//       setError("Login gagal. Cek kembali email dan password.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Decorative background elements */}
//       <div className="absolute inset-0 -z-10 overflow-hidden">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
//         <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
//       </div>

//       <Card className="border-border shadow-xl">
//         <CardHeader className="space-y-2">
//           <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent-foreground rounded-2xl flex items-center justify-center shadow-lg">
//             <Lock className="w-8 h-8 text-white" />
//           </div>
//           <CardTitle className="text-2xl font-bold text-center">
//             Selamat Datang Kembali
//           </CardTitle>
//           <CardDescription className="text-center">
//             Masuk ke akun Anda untuk melanjutkan
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium">
//                 Email
//               </Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="nama@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="h-12 pl-10"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-sm font-medium">
//                 Password
//               </Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="h-12 pl-10"
//                 />
//               </div>
//             </div>

//             {error && (
//               <p className="text-sm text-red-600 text-center">{error}</p>
//             )}

//             <div className="flex justify-end">
//               <Link
//                 href="/forgot-password"
//                 className="text-sm text-primary font-medium hover:underline"
//               >
//                 Lupa password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 font-semibold text-base group"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 "Memproses..."
//               ) : (
//                 <>
//                   Masuk
//                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </Button>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-border" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-card px-2 text-muted-foreground">Atau</span>
//               </div>
//             </div>

//             <div className="text-center text-sm text-muted-foreground">
//               Belum punya akun?{" "}
//               <Link
//                 href="/anggota/register"
//                 className="text-primary font-semibold hover:underline"
//               >
//                 Daftar sekarang
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import { KTACard } from "@/components/kta-card";
import { AnnouncementCarousel } from "@/components/announcement-carousel";
import { TaskCard } from "@/components/task-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Megaphone, Briefcase, LayoutGrid } from "lucide-react";
import Link from "next/link";

const popularTasks = [
  {
    id: "1",
    category: "Rekrutment" as const,
    title: "Rekrutmen Anggota Baru Wilayah Jakarta",
    description:
      "Bantu kami merekrut anggota baru di wilayah Jakarta dan sekitarnya",
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
];

export default function HomePage() {
  return (
    <div className="space-y-6 p-4 safe-area-top">
      {/* Header */}
      <div className="pt-4 flex gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <LayoutGrid className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Selamat Datang
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola keanggotaan Anda dengan mudah
          </p>
        </div>
      </div>

      {/* KTA Card */}
      <section>
        <KTACard />
      </section>

      {/* Announcements Carousel */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">
                Pengumuman Terbaru
              </h2>
              <p className="text-xs text-muted-foreground">
                Informasi penting untuk Anda
              </p>
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
              <p className="text-xs text-muted-foreground">
                Selesaikan dan dapatkan bonus
              </p>
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
  );
}


