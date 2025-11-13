import { apiSlice } from "../../base-query";
import {
  Klasifikasi,
  KlasifikasiResponse,
  CreateKlasifikasiRequest,
  UpdateKlasifikasiRequest,
} from "@/types/admin/konfigurasi/klasifikasi";

export const klasifikasiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Klasifikasi (with pagination)
    getKlasifikasiList: builder.query<
      {
        data: Klasifikasi[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string; }
    >({
      query: ({ page, paginate, search }) => ({
        url: `/master/clasifications`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
        },
      }),
      transformResponse: (response: KlasifikasiResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get Klasifikasi by ID
    getKlasifikasiById: builder.query<Klasifikasi, number>({
      query: (id) => ({
        url: `/master/clasifications/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Klasifikasi;
      }) => response.data,
    }),

    // ➕ Create Klasifikasi
    createKlasifikasi: builder.mutation<
      Klasifikasi,
      CreateKlasifikasiRequest
    >({
      query: (payload) => ({
        url: `/master/clasifications`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Klasifikasi;
      }) => response.data,
    }),

    // ✏️ Update Klasifikasi by ID
    updateKlasifikasi: builder.mutation<
      Klasifikasi,
      { id: number; payload: UpdateKlasifikasiRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/master/clasifications/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Klasifikasi;
      }) => response.data,
    }),

    // ❌ Delete Klasifikasi by ID
    deleteKlasifikasi: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/clasifications/${id}`,
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
  useGetKlasifikasiListQuery,
  useGetKlasifikasiByIdQuery,
  useCreateKlasifikasiMutation,
  useUpdateKlasifikasiMutation,
  useDeleteKlasifikasiMutation,
} = klasifikasiApi;
