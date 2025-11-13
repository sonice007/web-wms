import { apiSlice } from "../../base-query";
import { 
  BarangMasuk, 
  BarangMasukListResponse,
  BarangMasukListParams,
  CreateBarangMasukRequest,
  UpdateBarangMasukRequest,
  BarangMasukApiResponse
} from "@/types/admin/transaksi/barang-masuk";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All BarangMasuks (with pagination)
    getBarangMasukList: builder.query<
      BarangMasukListResponse,
      BarangMasukListParams
    >({
      query: ({ page = 1, paginate = 10, search }) => ({
        url: `/inventory/purchase-orders`,
        method: "GET",
        params: {
          page,
          paginate,
          ...(search && { search }),
        },
      }),
      transformResponse: (response: BarangMasukApiResponse<BarangMasukListResponse>) => response.data,
    }),

    // 🔍 Get Income Category by ID
    getBarangMasukById: builder.query<BarangMasuk, number>({
      query: (id) => ({
        url: `/inventory/purchase-orders/${id}`,
        method: "GET",
      }),
      transformResponse: (response: BarangMasukApiResponse<BarangMasuk>) => response.data,
    }),

    // ➕ Create Income Category
    createBarangMasuk: builder.mutation<
      BarangMasuk,
      CreateBarangMasukRequest
    >({
      query: (payload) => ({
        url: `/inventory/purchase-orders`,
        method: "POST",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: BarangMasukApiResponse<BarangMasuk>) => response.data,
    }),

    // ✏️ Update Income Category by ID
    updateBarangMasuk: builder.mutation<
      BarangMasuk,
      { id: number; payload: UpdateBarangMasukRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/inventory/purchase-orders/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: BarangMasukApiResponse<BarangMasuk>) => response.data,
    }),

    // ❌ Delete Income Category by ID
    deleteBarangMasuk: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/inventory/purchase-orders/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: BarangMasukApiResponse<null>) => ({
        code: response.code,
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBarangMasukListQuery,
  useGetBarangMasukByIdQuery,
  useCreateBarangMasukMutation,
  useUpdateBarangMasukMutation,
  useDeleteBarangMasukMutation,
} = customerApi;
