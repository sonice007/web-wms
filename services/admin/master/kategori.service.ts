import { apiSlice } from "../../base-query";
import {
  Kategori,
  KategoriResponse,
  CreateKategoriRequest,
  UpdateKategoriRequest,
} from "@/types/admin/master/kategori";

export const kategoriApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Kategori (with pagination)
    getKategoriList: builder.query<
      {
        data: Kategori[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string; regency_id?: string }
    >({
      query: ({ page, paginate, search, regency_id }) => ({
        url: `/master/product-categories`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
          regency_id
        },
      }),
      transformResponse: (response: KategoriResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get Kategori by ID
    getKategoriById: builder.query<Kategori, number>({
      query: (id) => ({
        url: `/master/product-categories/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Kategori;
      }) => response.data,
    }),

    // ➕ Create Kategori
    createKategori: builder.mutation<
      Kategori,
      CreateKategoriRequest
    >({
      query: (payload) => ({
        url: `/master/product-categories`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Kategori;
      }) => response.data,
    }),

    // ✏️ Update Kategori by ID
    updateKategori: builder.mutation<
      Kategori,
      { id: number; payload: UpdateKategoriRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/master/product-categories/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Kategori;
      }) => response.data,
    }),

    // ❌ Delete Kategori by ID
    deleteKategori: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/product-categories/${id}`,
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
  useGetKategoriListQuery,
  useGetKategoriByIdQuery,
  useCreateKategoriMutation,
  useUpdateKategoriMutation,
  useDeleteKategoriMutation,
} = kategoriApi;
