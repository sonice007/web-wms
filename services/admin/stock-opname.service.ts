import { apiSlice } from "../base-query";
import {
  StockOpname,
  StockOpnameResponse,
  CreateStockOpnameRequest,
  UpdateStockOpnameRequest,
} from "@/types/admin/stock-opname";

export const stockOpnameApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All StockOpname (with pagination)
    getStockOpnameList: builder.query<
      {
        data: StockOpname[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string; regency_id?: string }
    >({
      query: ({ page, paginate, search, regency_id }) => ({
        url: `/inventory/stock-opnames`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
          regency_id
        },
      }),
      transformResponse: (response: StockOpnameResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get StockOpname by ID
    getStockOpnameById: builder.query<StockOpname, number>({
      query: (id) => ({
        url: `/inventory/stock-opnames/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: StockOpname;
      }) => response.data,
    }),

    // ➕ Create StockOpname
    createStockOpname: builder.mutation<
      StockOpname,
      CreateStockOpnameRequest
    >({
      query: (payload) => ({
        url: `/inventory/stock-opnames`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: StockOpname;
      }) => response.data,
    }),

    // ✏️ Update StockOpname by ID
    updateStockOpname: builder.mutation<
      StockOpname,
      { id: number; payload: UpdateStockOpnameRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/inventory/stock-opnames/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: StockOpname;
      }) => response.data,
    }),

    // ❌ Delete StockOpname by ID
    deleteStockOpname: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/inventory/stock-opnames/${id}`,
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
  useGetStockOpnameListQuery,
  useGetStockOpnameByIdQuery,
  useCreateStockOpnameMutation,
  useUpdateStockOpnameMutation,
  useDeleteStockOpnameMutation,
} = stockOpnameApi;
