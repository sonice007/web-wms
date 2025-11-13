"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Building2,
  Archive,
  LayoutGrid,
  AlertTriangle,
  TrendingUp,
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

import {
  useGetInventoryListQuery
} from "@/services/admin/master/barang.service";

import {
  useGetDashboardHeaderQuery,
  useGetDashboardMonthlyPurchaseOrderQuery,
  useGetDashboardMonthlySalesOrderQuery,
} from "@/services/admin/dashboard.service";
import { Button } from "@/components/ui/button";

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

// ===== Data Dummy (HANYA untuk FALLBACK) =====
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

  const { data: headerData, isFetching: isHeaderFetching } =
    useGetDashboardHeaderQuery({ year });
  const { data: monthlyPOData, isFetching: isMonthlyPOFetching } =
    useGetDashboardMonthlyPurchaseOrderQuery({ year });
  const { data: monthlySOData, isFetching: isMonthlySOFetching } =
    useGetDashboardMonthlySalesOrderQuery({ year });

  const isFetching = isHeaderFetching || isMonthlyPOFetching || isMonthlySOFetching;

  const summary = useMemo(() => {
    return {
      totalKategori: headerData?.total_category || DUMMY_SUMMARY.totalKategori,
      totalBarang: headerData?.total_product || DUMMY_SUMMARY.totalBarang,
      totalWarehouse: headerData?.total_warehouse || DUMMY_SUMMARY.totalWarehouse,
      totalRak: headerData?.total_warehouse_storage || DUMMY_SUMMARY.totalRak,
    };
  }, [headerData]);

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

  const chartData = useMemo(() => {
    const labels = chartView === "bulanan" ? monthLabels : weekLabels;
    let dataMasuk: number[] = [];
    let dataKeluar: number[] = [];

    if (chartView === "bulanan") {
      // Proses data bulanan MASUK (dari monthlyPOData)
      if (monthlyPOData && monthlyPOData.length > 0) {
        const arr = Array(12).fill(0);
        for (const it of monthlyPOData) {
          if (it.month >= 1 && it.month <= 12) arr[it.month - 1] = it.total_product ?? 0;
        }
        dataMasuk = arr;
      } else {
        dataMasuk = DUMMY_MONTHLY_MASUK; // Fallback ke dummy
      }

      // Proses data bulanan KELUAR (dari monthlySOData)
      if (monthlySOData && monthlySOData.length > 0) {
        const arr = Array(12).fill(0);
        for (const it of monthlySOData) {
          if (it.month >= 1 && it.month <= 12) arr[it.month - 1] = it.total_product ?? 0;
        }
        dataKeluar = arr;
      } else {
        dataKeluar = DUMMY_MONTHLY_KELUAR; // Fallback ke dummy
      }
    } else {
      // Data mingguan (tidak ada API, langsung pakai dummy)
      dataMasuk = DUMMY_WEEKLY_MASUK;
      dataKeluar = DUMMY_WEEKLY_KELUAR;
    }

    return { labels, dataMasuk, dataKeluar };
  }, [chartView, monthlyPOData, monthlySOData]); // Dependensi diubah

  const predictedItems: PredictedItem[] = DUMMY_PREDICTIONS;
  const [query, setQuery] = useState("");

  const { data, isLoading, refetch } = useGetInventoryListQuery({
    page: 1,
    paginate: 10,
    search: query,
    low_stock: true,
  });
  const barangList = useMemo(() => data?.data || [], [data]);
  const filteredData = useMemo(() => {
      if (!query) return barangList;
      return barangList.filter(
        (item) =>
          item.warehouse_name.toLowerCase().includes(query.toLowerCase())
      );
    }, [barangList, query]);

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
          {/* --- DIPERBARUI --- */}
          {/* Gunakan `isFetching` gabungan dari RTK Query */}
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
                {/* Tampilkan loading skeleton sederhana jika fetching */}
                {isFetching ? (
                  <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mt-1.5" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </div>
                )}
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
            {isFetching ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">Memuat data grafik...</span>
              </div>
            ) : (
              <Line data={stokChartData} options={commonChartOptions} />
            )}
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
                  <th className="px-4 py-2">Warehouse</th>
                  <th className="px-4 py-2">Rak</th>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Stok</th>
                  <th className="px-4 py-2">Min. Stok</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2 font-medium">{item.warehouse_name}</td>
                    <td className="px-4 py-2 font-medium">{item.warehouse_storage_name}</td>
                    <td className="px-4 py-2 font-medium">{item.product_sku}</td>
                    <td className="px-4 py-2 font-medium">{item.product_name}</td>
                    <td className="px-4 py-2 font-medium">{item.stock}</td>
                    <td className="px-4 py-2 font-medium">{item.min_stock}</td>
                  </tr>
                ))
              )}
              </tbody>
            </SimpleTable>
          </CardContent>
        </Card>

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
                {isFetching ? (
                  <tr>
                    <td colSpan={2} className="text-center p-4 text-gray-500">
                      Memuat...
                    </td>
                  </tr>
                ) : predictedItems.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center p-4 text-gray-500">
                      Tidak ada data prediksi.
                    </td>
                  </tr>
                ) : (
                  predictedItems.map((item) => (
                    <tr key={item.id} className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {item.nama}
                      </th>
                      <td className="px-6 py-4 text-right font-bold text-gray-800">
                        {formatNumber(item.prediksi_keluar)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </SimpleTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}