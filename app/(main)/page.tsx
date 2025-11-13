"use client";

import React, { useState, useEffect, forwardRef, ElementType, ReactNode } from "react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa"; // Ikon dari react-icons
import {
  Package,
  PackageSearch,
  ClipboardList,
  BarChart3,
  Warehouse,
  ArrowRight,
  Truck,
  Zap,
  Menu,
  X,
  Instagram,
  PlayCircle,
} from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "lg";
  asChild?: boolean;
  children?: React.ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variantClasses = {
      default:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl",
      secondary:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 shadow-md",
      outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 py-3 text-base",
    };

    const Comp =
      asChild && React.isValidElement(props.children)
        ? props.children.type
        : "button";

    const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <Comp ref={ref} className={finalClasses} {...props}>
        {props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

interface FeatureCardProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
}

function FeatureCard({ icon: Icon, title, children }: FeatureCardProps) {
  return (
    <div className="bg-white p-7 rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-xl hover:border-blue-300 hover:scale-[1.02] cursor-pointer group">
      <div className="flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-xl mb-6 transition-colors duration-300 group-hover:bg-blue-100">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{children}</p>
    </div>
  );
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
}

function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl aspect-video bg-black rounded-lg shadow-2xl m-4"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat klik video
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors"
          aria-label="Tutup Video"
        >
          <X className="w-6 h-6" />
        </button>
        <video
          className="w-full h-full rounded-lg"
          src={videoSrc}
          controls
          autoPlay
          playsInline
        >
          Browser Anda tidak mendukung tag video.
        </video>
      </div>
    </div>
  );
}

// 4. Interface untuk Navigasi (TSX)
interface NavItem {
  href: string;
  label: string;
}

// 5. Komponen Halaman Utama (Landing Page)
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const navItems: NavItem[] = [
    { href: "#tentang-saya", label: "Tentang Saya" },
    { href: "#fitur", label: "Fitur" },
    { href: "#cta", label: "Kontak" },
  ];

  const handleNavLinkClick = (): void => {
    // Menutup menu mobile saat link diklik
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      {/* 3.1. Header / Navigasi */}
      <header className="bg-white/95 sticky top-0 z-50 shadow-md backdrop-blur-md transition-shadow duration-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a
            href="/"
            className="flex items-center gap-2 text-2xl font-extrabold text-blue-700 transition-colors hover:text-blue-500"
          >
            <Package className="w-7 h-7" />
            <span>Warehouse MS</span>
          </a>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            ))}
          </div>

          {/* Tombol Aksi Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Button asChild className="transition-all hover:bg-blue-500">
              <a href="/auth/login">Masuk</a>
            </Button>
          </div>

          {/* Tombol Menu Mobile */}
          <button
            className="md:hidden text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out animate-in slide-in-from-top-4">
            <nav className="flex flex-col p-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavLinkClick}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 border-b border-gray-50/50"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col space-y-2">
                <Button asChild variant="outline">
                  <a href="/auth/login" onClick={handleNavLinkClick}>Masuk</a>
                </Button>
                <Button asChild>
                  <a href="/auth/register" onClick={handleNavLinkClick}>Daftar Gratis</a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="bg-white pt-24 pb-20 md:pt-24 md:pb-28 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 pointer-events-none"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight animate-fade-in-up duration-1000">
              Solusi WMS Modern untuk{" "}
              <span className="text-blue-600 block sm:inline-block mt-2">Efisiensi Operasional</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-4xl mx-auto opacity-0 animate-fade-in-up delay-300 duration-1000" style={{ animationFillMode: 'forwards' }}>
              Memperkenalkan aplikasi WMS yang cepat, andal, dan real-time. Dibangun
              dengan Next.js (FE), Laravel (BE), dan Tailwind CSS untuk manajemen
              inventaris, PO, dan SO yang superior.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 opacity-0 animate-fade-in-up delay-500 duration-1000" style={{ animationFillMode: 'forwards' }}>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto text-lg font-semibold px-8 py-6 shadow-blue-500/50 transition-transform hover:scale-105"
              >
                <a href="/auth/login" className="flex justify-center items-center w-full">
                  Demo Aplikasi <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-lg font-semibold px-8 py-6 transition-transform hover:scale-105"
              >
                <a href="#fitur" className="flex justify-center items-center w-full">
                  Lihat Keunggulan
                </a>
              </Button>
            </div>
            
            <div
              className="mt-20 w-full max-w-6xl mx-auto perspective-1000 transition-all duration-700 hover:rotate-x-1"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <div className="relative bg-gray-100 h-125 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-4 border-gray-200 flex items-center justify-center overflow-hidden transform transition-transform duration-700 ease-in-out cursor-pointer group">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-300">
                  <PlayCircle className="w-24 h-24 text-white/80 transform scale-90 group-hover:scale-100 transition-transform duration-300" />
                </div>
                <img
                  src="/video-demo.gif"
                  alt="Pratinjau Dashboard WMS"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="tentang-saya" className="py-20 md:py-32 bg-gray-50/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              
              <div className="flex-1 flex justify-center order-1 md:order-1">
                <div className="relative w-64 h-64 md:w-80 md:h-80 transition-transform duration-500 hover:scale-[1.03]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-20 blur-xl transform scale-100 transition-all duration-1000 ease-in-out group-hover:scale-110"></div>
                  
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white mt-[-30px]">
                    <img
                      src="/photo-soni.webp"
                      alt="Soni Setiawan"
                      width={320}
                      height={320}
                      className="object-cover w-full h-full transition-opacity duration-500 hover:opacity-90"
                    />
                  </div>
                  <div className="mt-4 w-full flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-blue-600 text-center">Soni Setiawan</h3>
                    <div className="w-16 h-0.5 bg-blue-400 rounded-full my-2 mx-auto" />
                    <p className="text-lg text-gray-500 font-medium text-center">Full-Stack Developer | Next, Laravel</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left order-2 md:order-2">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">Developer Profile</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Tentang Pembuat
                </h2>
                
                <p className="text-gray-700 mt-6 leading-relaxed text-base md:text-lg text-justify">
                  Halo! Saya Soni, seorang developer dengan hasrat untuk membangun solusi perangkat lunak yang bersih, efisien, dan skalabel.
                </p>
                <p className="text-gray-700 mt-4 leading-relaxed text-base md:text-lg text-justify">
                  Aplikasi WMS ini dikembangkan sebagai demonstrasi kemampuan teknis saya dalam membangun aplikasi full-stack modern. Proyek ini dibuat untuk menunjukkan kesiapan saya untuk berkontribusi di <span className="font-bold text-blue-700">PT. Mitra Kreasi Natural</span>.
                </p>
                <div className="mt-8 flex flex-col md:flex-row items-center gap-6">
                  <Button asChild size="default" className="transition-transform hover:scale-[1.02]">
                    <a href="mailto:soni.setiawan@example.com">Hubungi Saya</a>
                  </Button>
                  <div className="hidden md:block h-8 w-px bg-gray-300 mx-4" />
                  <div className="flex items-center gap-6">
                    <a
                      href="https://wa.me/628132072732"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-green-500 transition-colors duration-300 transition-transform hover:scale-[1.02]"
                      aria-label="Hubungi via WhatsApp"
                    >
                      <FaWhatsapp className="w-7 h-7" />
                    </a>
                    <a
                      href="https://instagram.com/sonisettiawan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-pink-500 transition-colors duration-300"
                      aria-label="Lihat Instagram"
                    >
                      <Instagram className="w-7 h-7" />
                    </a>
                    <a
                      href="https://tiktok.com/@sonisettiawan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-black transition-colors duration-300"
                      aria-label="Lihat TikTok"
                    >
                      <FaTiktok className="w-7 h-7" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="fitur" className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Fitur dan Keunggulan Aplikasi
              </h2>
              <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
                Semua yang Anda butuhkan untuk mengelola operasional gudang secara lengkap, didukung teknologi modern.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={PackageSearch} title="Manajemen Inventaris">
                Lacak stok barang secara real-time, kelola multi-warehouse, dan dapatkan notifikasi stok minimum secara otomatis.
              </FeatureCard>
              <FeatureCard icon={ClipboardList} title="Pelacakan PO & SO">
                Kelola siklus Purchase Order (Barang Masuk) dan Sales Order (Barang Keluar) dengan alur kerja yang terstruktur.
              </FeatureCard>
              <FeatureCard icon={BarChart3} title="Laporan & Analitik">
                Dapatkan wawasan dari data perputaran barang, nilai inventaris, dan performa supplier melalui dashboard visual.
              </FeatureCard>
              <FeatureCard icon={Warehouse} title="Manajemen Multi-Gudang">
                Kelola beberapa lokasi gudang dan penempatan rak (storage) dari satu dashboard terpusat, dengan navigasi yang cepat.
              </FeatureCard>
              <FeatureCard icon={Truck} title="Integrasi Pengiriman">
                Hubungkan dengan layanan logistik untuk melacak pengiriman barang keluar (Sales Order) hingga ke tangan pelanggan.
              </FeatureCard>
              <FeatureCard icon={Zap} title="Modern & Cepat">
                 Dibangun dengan Next.js App Router dan RTK Query untuk data fetching yang instan dan UI yang responsif.
              </FeatureCard>
            </div>
          </div>
        </section>

        <section id="cta" className="py-20 md:py-28 bg-blue-700 text-white shadow-inner">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Tertarik dengan Proyek Ini?
            </h2>
            <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Saya siap untuk mendiskusikan bagaimana keahlian saya dapat berkontribusi untuk perusahaan di PT. Mitra Kreasi Natural.
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg font-bold px-10 py-6 text-blue-700 bg-white hover:bg-gray-100 shadow-xl transition-all duration-300 hover:scale-[1.05]"
              >
                <a href="mailto:soni.setiawan.it07@gmail.com"> 
                  Hubungi Soni Setiawan Sekarang
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center border-t border-gray-800">
          <p className="text-sm tracking-wider">&copy; {new Date().getFullYear()} WMS Prototype. Dibuat oleh Soni Setiawan. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
      
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/video-demo.mp4" 
      />
      
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        
        .perspective-1000 {
            perspective: 1000px;
        }
        .hover\\:rotate-x-1:hover > div {
            transform: rotateX(1deg);
        }
      `}</style>
    </div>
  );
}