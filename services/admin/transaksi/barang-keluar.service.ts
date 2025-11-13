import { apiSlice } from "../../base-query";
import { 
  BarangKeluar, 
  BarangKeluarListResponse,
  BarangKeluarListParams,
  CreateBarangKeluarRequest,
  UpdateBarangKeluarRequest,
  BarangKeluarApiResponse
} from "@/types/admin/transaksi/barang-keluar";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All BarangKeluars (with pagination)
    getBarangKeluarList: builder.query<
      BarangKeluarListResponse,
      BarangKeluarListParams
    >({
      query: ({ page = 1, paginate = 10, search }) => ({
        url: `/inventory/sales-orders`,
        method: "GET",
        params: {
          page,
          paginate,
          ...(search && { search }),
        },
      }),
      transformResponse: (response: BarangKeluarApiResponse<BarangKeluarListResponse>) => response.data,
    }),

    // 🔍 Get Income Category by ID
    getBarangKeluarById: builder.query<BarangKeluar, number>({
      query: (id) => ({
        url: `/inventory/sales-orders/${id}`,
        method: "GET",
      }),
      transformResponse: (response: BarangKeluarApiResponse<BarangKeluar>) => response.data,
    }),

    // ➕ Create Income Category
    createBarangKeluar: builder.mutation<
      BarangKeluar,
      CreateBarangKeluarRequest
    >({
      query: (payload) => ({
        url: `/inventory/sales-orders`,
        method: "POST",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: BarangKeluarApiResponse<BarangKeluar>) => response.data,
    }),

    // ✏️ Update Income Category by ID
    updateBarangKeluar: builder.mutation<
      BarangKeluar,
      { id: number; payload: UpdateBarangKeluarRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/inventory/sales-orders/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: BarangKeluarApiResponse<BarangKeluar>) => response.data,
    }),

    // ❌ Delete Income Category by ID
    deleteBarangKeluar: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/inventory/sales-orders/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: BarangKeluarApiResponse<null>) => ({
        code: response.code,
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBarangKeluarListQuery,
  useGetBarangKeluarByIdQuery,
  useCreateBarangKeluarMutation,
  useUpdateBarangKeluarMutation,
  useDeleteBarangKeluarMutation,
} = customerApi;
