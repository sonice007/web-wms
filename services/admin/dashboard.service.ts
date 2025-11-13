import { apiSlice } from "../base-query";
import type { DashboardHeader, DashboardPurchaseOrder, DashboardSalesOrder } from "@/types/admin/dashboard";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";

// Tipe data mentah dari API list
type GisWarehouse = {
  id: number;
  code: string;
  name: string;
  address: string;
  description: string | null;
  latitude: number;
  longitude: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  // Kita TIDAK LAGI berasumsi total_kategori ada di sini
};

// Tipe respons mentah dari API list
type GitWarehouseResponse = {
  code: number;
  message: string;
  data: GisWarehouse[];
} 

// Tipe format client yang kita inginkan
export type GisWarehouseClientFormat = {
  id: string;
  name: string;
  posisi: [number, number];
  totalKategori: number;
  totalBarang: number;
  items: []; // Selalu array kosong
}

// Tipe data mentah dari API by ID
type GisWarehouseById = {
  product: {
    total_product: number;
    total_value: number;
  };
  total_product_category: number;
};

// Tipe respons mentah dari API by ID
type GitWarehouseByIdResponse = {
  code: number;
  message: string;
  data: GisWarehouseById | null;
}

type DashboardHeaderResponse = {
  code: number;
  message: string;
  data: DashboardHeader;
};

type DashboardMonthlyPurchaseOrderResponse = {
  code: number;
  message: string;
  data: DashboardPurchaseOrder[];
};

type DashboardMonthlySalesOrderResponse = {
  code: number;
  message: string;
  data: DashboardSalesOrder[];
};

// Helper untuk mengambil baseQuery
// const getBaseQuery = (api: BaseQueryApi) => 
//   api.baseQuery as ReturnType<typeof apiSlice.endpoints.getGisWarehouse.Types.QueryDefinition<any, any, any, any>["query"]>;

export const dashboardAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ... (endpoint dashboard header tidak berubah)
    getDashboardHeader: builder.query<DashboardHeader, { year: string | number }>(
      {
        query: ({ year }) => ({
          url: `/dashboard/header`,
          method: "GET",
          params: { year },
        }),
        transformResponse: (response: DashboardHeaderResponse) => response.data,
      }
    ),
    // ... (endpoint PO tidak berubah)
    getDashboardMonthlyPurchaseOrder: builder.query<DashboardPurchaseOrder[], { year: string | number }>(
      {
        query: ({ year }) => ({
          url: `/dashboard/monthly-purchase-order`,
          method: "GET",
          params: { year },
        }),
        transformResponse: (response: DashboardMonthlyPurchaseOrderResponse) => response.data,
      }
    ),
    // ... (endpoint SO tidak berubah)
    getDashboardMonthlySalesOrder: builder.query<DashboardSalesOrder[], { year: string | number }>(
      {
        query: ({ year }) => ({
          url: `/dashboard/monthly-sales-order`,
          method: "GET",
          params: { year },
        }),
        transformResponse: (response: DashboardMonthlySalesOrderResponse) => response.data,
      }
    ),

    getGisWarehouse: builder.query<GisWarehouseClientFormat[], {}>(
      {
        // Hapus 'query' dan ganti dengan 'queryFn'
        async queryFn(_args, api, _extraOptions, baseQuery) {
          
          // 1. Panggil API pertama: Dapatkan list warehouse
          const listResult = await baseQuery({
            url: `/gis/warehouses`,
            method: "GET",
            params: {},
          });

          // Jika gagal, hentikan
          if (listResult.error) {
            return { error: listResult.error };
          }

          const rawResponse = listResult.data as GitWarehouseResponse;
          const warehouses = rawResponse.data; // Ini adalah GisWarehouse[]

          // 2. Buat array untuk menampung semua promise panggilan detail
          const detailPromises = warehouses.map((wh) => {
            return baseQuery({
              url: `/gis/warehouses/${wh.id}?forceRefresh=1`,
              method: 'GET',
              params: {},
            });
          });

          // 3. Jalankan semua panggilan detail secara paralel
          const detailResults = await Promise.all(detailPromises);

          // 4. Gabungkan hasil
          const mergedData: GisWarehouseClientFormat[] = warehouses.map((wh, index) => {
            // Ambil data detail untuk warehouse ini
            const detailData = (detailResults[index]?.data as GitWarehouseByIdResponse | undefined)?.data;

            // Ekstrak datanya dengan aman
            const totalKategori = detailData?.total_product_category ?? 0;
            const totalBarang = detailData?.product?.total_product ?? 0;

            // Format ke tipe client
            return {
              id: String(wh.id),
              name: wh.name,
              posisi: [wh.latitude, wh.longitude],
              totalKategori: totalKategori,
              totalBarang: totalBarang,
              items: [],
            };
          });

          // 5. Kembalikan data yang sudah digabung
          return { data: mergedData };
        }
      }
    ),
    // Endpoint ById tetap sama, karena 'queryFn' di atas menggunakannya
    getGisWarehouseById: builder.query<GisWarehouseById | null, { id: number }>(
      {
        query: ({ id }) => ({
          url: `/gis/warehouses/${id}?forceRefresh=1`,
          method: "GET",
          params: { },
        }),
        transformResponse: (response: GitWarehouseByIdResponse) => response.data,
      }
    ),
  }),
  overrideExisting: false,
});

export const { 
  useGetDashboardHeaderQuery,
  useGetDashboardMonthlyPurchaseOrderQuery,
  useGetDashboardMonthlySalesOrderQuery,
  useGetGisWarehouseQuery,
  useGetGisWarehouseByIdQuery
} = dashboardAdminApi;