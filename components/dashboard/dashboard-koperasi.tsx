"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package, // Ikon untuk Total Barang
  Building2, // Ikon untuk Total Warehouse
  Archive, // Ikon untuk Total Rak
  LayoutGrid, // Ikon untuk Total Kategori
  AlertTriangle, // Ikon untuk Stok Rendah
  TrendingUp, // Ikon untuk Prediksi
  PackagePlus, // Ikon untuk Barang Masuk
  PackageMinus, // Ikon untuk Barang Keluar
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
// Asumsi: Anda memindahkan atau mengganti nama service query
// import { useGetDashboardWMSQuery } from "@/services/admin/wms.service";
import { Button } from "@/components/ui/button"; // Untuk toggle mingguan/bulanan

// Registrasi Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

// ===== Utilitas =====
const formatNumber = (num: number): string =>
  new Intl.NumberFormat("id-ID").format(num);

// Label untuk Bulanan & Mingguan
const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];
// Membuat label untuk 52 minggu (M1, M2, ..., M52)
const weekLabels = Array.from({ length: 52 }, (_, i) => `M${i + 1}`);

// ===== Data Dummy (untuk WMS) =====
const DUMMY_SUMMARY = {
  totalKategori: 120,
  totalBarang: 1500,
  totalWarehouse: 5,
  totalRak: 250,
};

// Data Bulanan (12 poin data)
const DUMMY_MONTHLY_MASUK = [
  150, 200, 180, 220, 250, 230, 210, 240, 260, 300, 280, 320,
];
const DUMMY_MONTHLY_KELUAR = [
  140, 190, 170, 210, 240, 220, 200, 230, 250, 290, 270, 310,
];

// Data Mingguan (52 poin data)
const DUMMY_WEEKLY_MASUK = Array.from({ length: 52 }, () =>
  Math.floor(Math.random() * 70 + 10)
);
const DUMMY_WEEKLY_KELUAR = Array.from({ length: 52 }, () =>
  Math.floor(Math.random() * 70 + 5)
);

const DUMMY_LOW_STOCK = [
  { id: "b1", nama: "Laptop XPS 15", sisa_stok: 8, min_stok: 10 },
  { id: "b2", nama: "Mouse Logitech MX", sisa_stok: 12, min_stok: 15 },
  { id: "b3", nama: "Keyboard Mechanical", sisa_stok: 5, min_stok: 5 },
  { id: "b4", nama: "Monitor Dell 27\"", sisa_stok: 3, min_stok: 10 },
];

const DUMMY_PREDICTIONS = [
  { id: "b1", nama: "Laptop XPS 15", prediksi_keluar: 150 },
  { id: "b2", nama: "Mouse Logitech MX", prediksi_keluar: 300 },
  { id: "b5", nama: "Tinta Printer Epson", prediksi_keluar: 500 },
  { id: "b3", nama: "Keyboard Mechanical", prediksi_keluar: 120 },
];

// Tipe data asumsi untuk item tabel
interface LowStockItem {
  id: string;
  nama: string;
  sisa_stok: number;
  min_stok: number;
}
interface PredictedItem {
  id: string;
  nama: string;
  prediksi_keluar: number;
}

export default function DashboardWMSPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [chartView, setChartView] = useState<"bulanan" | "mingguan">("bulanan");

  // Asumsi query API baru: { year }
  // Asumsi respons data:
  // {
  //   total_kategori: number, total_barang: number, total_warehouse: number, total_rak: number,
  //   monthly_barang_masuk: { month: number, count: number }[],
  //   monthly_barang_keluar: { month: number, count: number }[],
  //   weekly_barang_masuk: { week: number, count: number }[],
  //   weekly_barang_keluar: { week: number, count: number }[],
  //   low_stock_items: LowStockItem[],
  //   predicted_items: PredictedItem[]
  // }
  // Dummy fetch simulation
  const [data, setData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    // Simulate API delay
    const timeout = setTimeout(() => {
      setData({
        total_kategori: DUMMY_SUMMARY.totalKategori,
        total_barang: DUMMY_SUMMARY.totalBarang,
        total_warehouse: DUMMY_SUMMARY.totalWarehouse,
        total_rak: DUMMY_SUMMARY.totalRak,
        monthly_barang_masuk: DUMMY_MONTHLY_MASUK.map((count, i) => ({
          month: i + 1,
          count,
        })),
        monthly_barang_keluar: DUMMY_MONTHLY_KELUAR.map((count, i) => ({
          month: i + 1,
          count,
        })),
        weekly_barang_masuk: DUMMY_WEEKLY_MASUK.map((count, i) => ({
          week: i + 1,
          count,
        })),
        weekly_barang_keluar: DUMMY_WEEKLY_KELUAR.map((count, i) => ({
          week: i + 1,
          count,
        })),
        low_stock_items: DUMMY_LOW_STOCK,
        predicted_items: DUMMY_PREDICTIONS,
      });
      setIsFetching(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [year]);

  // === Summary Cards ===
  const summary = useMemo(() => {
    if (!data) return DUMMY_SUMMARY;
    return {
      totalKategori: data.total_kategori ?? 0,
      totalBarang: data.total_barang ?? 0,
      totalWarehouse: data.total_warehouse ?? 0,
      totalRak: data.total_rak ?? 0,
    };
  }, [data]);

  const cards = [
    {
      title: "Total Kategori",
      value: formatNumber(summary.totalKategori),
      icon: LayoutGrid,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Barang (SKU)",
      value: formatNumber(summary.totalBarang),
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Total Warehouse",
      value: formatNumber(summary.totalWarehouse),
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Rak",
      value: formatNumber(summary.totalRak),
      icon: Archive,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ] as const;

  // === Data Grafik (Bulanan/Mingguan) ===
  const chartData = useMemo(() => {
    const labels = chartView === "bulanan" ? monthLabels : weekLabels;
    let dataMasuk: number[] = [];
    let dataKeluar: number[] = [];

    if (chartView === "bulanan") {
      // Proses data bulanan dari API
      if (data?.monthly_barang_masuk) {
        const arr = Array(12).fill(0);
        for (const it of data.monthly_barang_masuk) {
          if (it.month >= 1 && it.month <= 12) arr[it.month - 1] = it.count ?? 0;
        }
        dataMasuk = arr;
      } else {
        dataMasuk = DUMMY_MONTHLY_MASUK;
      }

      if (data?.monthly_barang_keluar) {
        const arr = Array(12).fill(0);
        for (const it of data.monthly_barang_keluar) {
          if (it.month >= 1 && it.month <= 12) arr[it.month - 1] = it.count ?? 0;
        }
        dataKeluar = arr;
      } else {
        dataKeluar = DUMMY_MONTHLY_KELUAR;
      }
    } else {
      // Proses data mingguan dari API
      if (data?.weekly_barang_masuk) {
        const arr = Array(52).fill(0);
        for (const it of data.weekly_barang_masuk) {
          if (it.week >= 1 && it.week <= 52) arr[it.week - 1] = it.count ?? 0;
        }
        dataMasuk = arr;
      } else {
        dataMasuk = DUMMY_WEEKLY_MASUK;
      }

      if (data?.weekly_barang_keluar) {
        const arr = Array(52).fill(0);
        for (const it of data.weekly_barang_keluar) {
          if (it.week >= 1 && it.week <= 52) arr[it.week - 1] = it.count ?? 0;
        }
        dataKeluar = arr;
      } else {
        dataKeluar = DUMMY_WEEKLY_KELUAR;
      }
    }

    return { labels, dataMasuk, dataKeluar };
  }, [data, chartView]);

  // === Data Tabel ===
  const lowStockItems: LowStockItem[] = useMemo(
    () => data?.low_stock_items ?? DUMMY_LOW_STOCK,
    [data]
  );
  const predictedItems: PredictedItem[] = useMemo(
    () => data?.predicted_items ?? DUMMY_PREDICTIONS,
    [data]
  );

  // ===== Konfigurasi Grafik (Umum) =====
  const commonChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"line">): string => {
            const v = ctx.parsed.y ?? 0;
            return `${ctx.dataset.label ?? "Data"}: ${formatNumber(v)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) =>
            formatNumber(Number(tickValue)),
        },
      },
      x: {
        ticks: {
          // Hanya tampilkan beberapa label jika datanya mingguan (terlalu padat)
          callback: function (val, index) {
            if (chartView === "mingguan") {
              return index % 4 === 0 ? this.getLabelForValue(Number(val)) : "";
            }
            return this.getLabelForValue(Number(val));
          },
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  };

  // Konfigurasi Data Grafik Stok
  const stokChartData: ChartData<"line"> = useMemo(
    () => ({
      labels: chartData.labels,
      datasets: [
        {
          label: "Barang Masuk",
          data: chartData.dataMasuk,
          borderColor: "rgba(34, 197, 94, 1)", // Hijau
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
        {
          label: "Barang Keluar",
          data: chartData.dataKeluar,
          borderColor: "rgba(239, 68, 68, 1)", // Merah
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    }),
    [chartData]
  );

  // Opsi tahun (6 tahun terakhir)
  const yearOptions = useMemo(
    () => Array.from({ length: 6 }, (_, i) => currentYear - i),
    [currentYear]
  );

  useEffect(() => {
    if (!year) setYear(currentYear);
  }, [year, currentYear]);

  // Komponen Tabel Sederhana
  const SimpleTable = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        {children}
      </table>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Warehouse
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ringkasan data inventaris dan pergerakan stok
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Mingguan/Bulanan */}
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-md">
            <Button
              size="sm"
              variant={chartView === "bulanan" ? "default" : "ghost"}
              className="h-7 px-3"
              onClick={() => setChartView("bulanan")}
            >
              Bulanan
            </Button>
            <Button
              size="sm"
              variant={chartView === "mingguan" ? "default" : "ghost"}
              className="h-7 px-3"
              onClick={() => setChartView("mingguan")}
            >
              Mingguan
            </Button>
          </div>

          {/* Filter Tahun */}
          <select
            id="year"
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {isFetching && (
            <span className="text-xs text-gray-500">Memuat...</span>
          )}
        </div>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card
              key={i}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-md ${card.bgColor} ${card.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="mt-[-30px]">
                <div className="text-3xl font-bold text-gray-900">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Grafik Pergerakan Stok ({chartView}) - {year}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <Line data={stokChartData} options={commonChartOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Tabel Bawah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Stok Rendah */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg font-semibold">
              Barang Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <SimpleTable>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Nama Barang</th>
                  <th scope="col" className="px-6 py-3 text-right">Sisa</th>
                  <th scope="col" className="px-6 py-3 text-right">Min.</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="bg-white border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {item.nama}
                    </th>
                    <td className="px-6 py-4 text-right font-bold text-red-600">
                      {formatNumber(item.sisa_stok)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {formatNumber(item.min_stok)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </SimpleTable>
            {lowStockItems.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Semua stok aman.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Kolom Kanan: Prediksi Keluar */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg font-semibold">
              Prediksi Permintaan (Bulan Depan)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <SimpleTable>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Nama Barang</th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Prediksi Keluar
                  </th>
                </tr>
              </thead>
              <tbody>
                {predictedItems.map((item) => (
                  <tr key={item.id} className="bg-white border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-noww
                      rap"
                    >
                      {item.nama}
                    </th>
                    <td className="px-6 py-4 text-right font-bold text-gray-800">
                      {formatNumber(item.prediksi_keluar)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </SimpleTable>
            {predictedItems.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Tidak ada data prediksi.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}