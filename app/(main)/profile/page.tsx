"use client";

import { signOut } from "next-auth/react";
import { useLogoutMutation } from "@/services/auth.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  CreditCard,
  User,
  Lock,
  Users,
  LogOut,
  ChevronRight,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } finally {
      await signOut({ callbackUrl: "/anggota/login", redirect: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Profile Info */}
      <div
        className="p-6 text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
        }}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-white/20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" />
            <AvatarFallback className="bg-white text-primary text-xl font-bold">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-bold">John Doe</h1>
            <p className="text-sm text-white/80">john.doe@email.com</p>
            <p className="text-xs text-white/60 mt-1">
              Bergabung sejak 15 Januari 2024
            </p>
          </div>
        </div>
      </div>

      {/* Earnings Section */}
      <div className="p-4 -mt-6">
        <Card
          className="border-0 shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)",
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white/80">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Total Pendapatan</span>
              </div>
              <TrendingUp className="h-4 w-4 text-white/60" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              Rp 2.450.000
            </div>
            <p className="text-xs text-white/60">
              Dari 24 tugas yang diselesaikan
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-xs text-white/60 mb-1">Bulan Ini</p>
                <p className="text-lg font-bold text-white">Rp 450.000</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Tersedia</p>
                <p className="text-lg font-bold text-white">Rp 350.000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Navigation */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground px-2">
            Keuangan
          </h2>
          <Card>
            <CardContent className="p-0">
              <Link
                href="/profile/penarikan"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Penarikan</p>
                    <p className="text-xs text-muted-foreground">
                      Tarik saldo ke rekening
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>

              <Link
                href="/profile/kartu-bank"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Kartu Bank</p>
                    <p className="text-xs text-muted-foreground">
                      Kelola rekening bank
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground px-2">
            Akun
          </h2>
          <Card>
            <CardContent className="p-0">
              <Link
                href="/profile/informasi-pribadi"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Informasi Pribadi</p>
                    <p className="text-xs text-muted-foreground">
                      Edit profil dan data diri
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>

              <Link
                href="/profile/ubah-password"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Ubah Password</p>
                    <p className="text-xs text-muted-foreground">
                      Ganti kata sandi akun
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>

              <Link
                href="/profile/referal"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Referal Saya</p>
                    <p className="text-xs text-muted-foreground">
                      Kode dan link referal
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <Button
          disabled={isLoggingOut}
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3 h-auto p-4 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Keluar dari Akun</span>
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground pt-2">
          Versi Aplikasi 1.0.0
        </p>
      </div>
    </div>
  );
}

