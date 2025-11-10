"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  Settings,
  Network,
  UserCog,
  ShieldCheck,
  Package, // <-- Ikon baru untuk Barang
  Archive, // <-- Ikon baru untuk Rak
  ArrowLeftRight, // <-- Ikon baru untuk Transaksi
  PackagePlus, // <-- Ikon baru untuk Barang Masuk
  PackageMinus, // <-- Ikon baru untuk Barang Keluar
  TrendingUp,
  CardSim,
  IdCard, // <-- Ikon baru untuk Prediksi
} from "lucide-react";
import Header from "@/components/admin-components/header";
import Sidebar from "@/components/admin-components/sidebar";
import { AdminLayoutProps, MenuItem } from "@/types";
import { useSession } from "next-auth/react";
import type { User } from "@/types/user";
import ClientAuthGuard from "@/components/client-guards";

// Fungsi pembantu untuk cek role (memperhatikan struktur roles[0].name)
const userHasRole = (user: User | undefined, roleName: string): boolean => {
  if (!user || !user.roles || user.roles.length === 0) {
    return false;
  }
  // Cek apakah role pertama (asumsi role utama) sesuai, atau cek seluruh array roles jika perlu
  return user.roles[0].name?.toLowerCase() === roleName.toLowerCase();
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  // Menutup sidebar saat ukuran layar berubah ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Definisi menu untuk superadmin (SEMUA MENU)
  const superadminMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      id: "stok",
      label: "Data Stok",
      icon: <IdCard className="h-5 w-5" />,
      href: "#",
      children: [
        {
          id: "stok/gis",
          label: "GIS Stok",
          icon: <PackagePlus className="h-4 w-4" />,
          href: "/admin/stok/gis",
        },
        {
          id: "stok/kartu",
          label: "Kartu Stok",
          icon: <PackageMinus className="h-4 w-4" />,
          href: "/admin/stok/kartu",
        },
        {
          id: "stok/opname",
          label: "Stok Opname",
          icon: <Package className="h-4 w-4" />,
          href: "/admin/stok/opname",
        }
      ],
    },
    {
      id: "transaksi",
      label: "Transaksi",
      icon: <ArrowLeftRight className="h-5 w-5" />,
      href: "#",
      children: [
        {
          id: "transaksi/masuk",
          label: "Barang Masuk",
          icon: <PackagePlus className="h-4 w-4" />,
          href: "/admin/transaksi/barang-masuk",
        },
        {
          id: "transaksi/keluar",
          label: "Barang Keluar",
          icon: <PackageMinus className="h-4 w-4" />,
          href: "/admin/transaksi/barang-keluar",
        },
      ],
    },
    {
      id: "masterdata",
      label: "Master Data",
      icon: <Archive className="h-5 w-5" />, // Ganti ikon agar beda dengan konfigurasi
      href: "#",
      children: [
        {
          id: "masterdata/kategori",
          label: "Data Kategori",
          icon: <Package className="h-4 w-4" />,
          href: "/admin/master/kategori",
        },
        {
          id: "masterdata/barang",
          label: "Data Barang",
          icon: <Package className="h-4 w-4" />,
          href: "/admin/master/barang",
        },
        {
          id: "masterdata/warehouse",
          label: "Data Warehouse",
          icon: <Building2 className="h-4 w-4" />,
          href: "/admin/master/warehouse",
        },
        {
          id: "masterdata/rak",
          label: "Data Rak",
          icon: <Archive className="h-4 w-4" />,
          href: "/admin/master/rak",
        },
      ],
    },
    {
      id: "konfigurasi",
      label: "Konfigurasi",
      icon: <Settings className="h-5 w-5" />,
      href: "#",
      children: [
        {
          id: "konfigurasi/klasifikasi",
          label: "Klasifikasi",
          icon: <Network className="h-4 w-4" />,
          href: "/admin/master/klasifikasi",
        },
        {
          id: "konfigurasi/prediksi-stok",
          label: "Prediksi Stok",
          icon: <TrendingUp className="h-4 w-4" />,
          href: "/admin/master/prediksi-stok",
        },
        {
          id: "konfigurasi/pengelola",
          label: "Data Pengguna",
          icon: <UserCog className="h-4 w-4" />,
          href: "/admin/pengelola",
        },
        {
          id: "konfigurasi/role",
          label: "Role",
          icon: <ShieldCheck className="h-4 w-4" />,
          href: "/admin/role",
        },
      ],
    },
  ];

  // ✅ DEFINISI MENU KHUSUS UNTUK ADMIN (KONTEKS WMS)
  // Admin fokus pada operasional (Transaksi) dan melihat data,
  // tapi tidak bisa mengubah konfigurasi sistem.
  const adminMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      id: "transaksi",
      label: "Transaksi",
      icon: <ArrowLeftRight className="h-5 w-5" />,
      href: "#",
      children: [
        {
          id: "transaksi/masuk",
          label: "Barang Masuk",
          icon: <PackagePlus className="h-4 w-4" />,
          href: "/admin/transaksi/masuk",
        },
        {
          id: "transaksi/keluar",
          label: "Barang Keluar",
          icon: <PackageMinus className="h-4 w-4" />,
          href: "/admin/transaksi/keluar",
        },
      ],
    },
    {
      id: "masterdata",
      label: "Lihat Data", // Admin mungkin hanya bisa 'melihat'
      icon: <Settings className="h-5 w-5" />,
      href: "#",
      children: [
        {
          id: "masterdata/barang",
          label: "Data Barang",
          icon: <Package className="h-4 w-4" />,
          href: "/admin/master/barang",
        },
        {
          id: "masterdata/warehouse",
          label: "Data Warehouse",
          icon: <Building2 className="h-4 w-4" />,
          href: "/admin/master/warehouse",
        },
        {
          id: "masterdata/rak",
          label: "Data Rak",
          icon: <Archive className="h-4 w-4" />,
          href: "/admin/master/rak",
        },
      ],
    },
  ];

  // Tentukan menu items berdasarkan role pengguna
  let menuItems: MenuItem[] = [];

  if (user) {
    if (userHasRole(user, "superadmin")) {
      menuItems = superadminMenuItems;
    } else if (userHasRole(user, "admin")) {
      menuItems = adminMenuItems;
    }
  }

  // Jika tidak ada user atau role tidak dikenali, menu akan kosong (sesuai let menuItems = [])
  // Ini membantu mencegah akses ke menu jika otentikasi belum selesai.

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
      />

      {/* Konten Utama */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />

        {/* Konten Halaman */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-2">
            <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2">
              <ClientAuthGuard
                excludedRoutes={["/auth", "/auth/login", "/public", "/"]}
                excludedFetchPrefixes={["/api/auth/", "/auth/"]}
                loginPath="/auth/login"
              />
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;