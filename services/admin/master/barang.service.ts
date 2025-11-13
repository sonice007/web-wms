import { apiSlice } from "../../base-query";
import {
  Barang,
  BarangResponse,
  CreateBarangRequest,
  UpdateBarangRequest,
  Inventory,
  InventoryResponse,
} from "@/types/admin/master/barang";

export const barangApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // kartu stok
    getInventoryList: builder.query<
      {
        data: Inventory[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string; product_id?: number; warehouse_id?: number; warehouse_storage_id?: number; low_stock?: boolean }
    >({
      query: ({ page, paginate, search, product_id, warehouse_id, warehouse_storage_id, low_stock }) => ({
        url: `/inventory/inventories`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
          product_id,
          warehouse_id,
          warehouse_storage_id,
          low_stock
        },
      }),
      transformResponse: (response: InventoryResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),
    getKartuStokList: builder.query<
      {
        data: Barang[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string; product_id?: number; inventory_id?: number }
    >({
      query: ({ page, paginate, search, product_id, inventory_id }) => ({
        url: `/inventory/inventory-stocks`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
          product_id,
          inventory_id: inventory_id,
        },
      }),
      transformResponse: (response: BarangResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get All Barang (with pagination)
    getBarangList: builder.query<
      {
        data: Barang[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string; regency_id?: string }
    >({
      query: ({ page, paginate, search, regency_id }) => ({
        url: `/master/products`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
          regency_id
        },
      }),
      transformResponse: (response: BarangResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get Barang by ID
    getBarangById: builder.query<Barang, number>({
      query: (id) => ({
        url: `/master/products/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Barang;
      }) => response.data,
    }),

    // ➕ Create Barang
    createBarang: builder.mutation<
      Barang,
      CreateBarangRequest
    >({
      query: (payload) => ({
        url: `/master/products`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Barang;
      }) => response.data,
    }),

    // ✏️ Update Barang by ID
    updateBarang: builder.mutation<
      Barang,
      { id: number; payload: UpdateBarangRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/master/products/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Barang;
      }) => response.data,
    }),

    // ❌ Delete Barang by ID
    deleteBarang: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/products/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInventoryListQuery,
  useGetKartuStokListQuery,
  useGetBarangListQuery,
  useGetBarangByIdQuery,
  useCreateBarangMutation,
  useUpdateBarangMutation,
  useDeleteBarangMutation,
} = barangApi;
