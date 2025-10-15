import { apiSlice } from "../base-query";
import type { Anggota } from "@/types/admin/anggota";

export const anggotaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Anggota (with pagination)
    getAnggotaList: builder.query<
      {
        data: Anggota[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
        province_id?: string;
        regency_id?: string;
        district_id?: string;
        village_id?: string;
        level_id?: number;
      },
      { page: number; paginate: number; status?: number; province_id?: string; regency_id?: string; district_id?: string; village_id?: string; level_id?: number; }
    >({
      query: ({ page, paginate, status, province_id, regency_id, district_id, village_id, level_id }) => ({
        url: `/anggota/anggotas`,
        method: "GET",
        params: { page, paginate, ...(status && { status }), ...(province_id && { province_id }), ...(regency_id && { regency_id }), ...(district_id && { district_id }), ...(village_id && { village_id }), ...(level_id && { level_id }) },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Anggota[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get Anggota by ID
    getAnggotaById: builder.query<Anggota, number>({
      query: (id) => ({
        url: `/anggota/anggotas/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Anggota;
      }) => response.data,
    }),

    // ➕ Create Anggota
    createAnggota: builder.mutation<Anggota, FormData>({
      query: (payload) => ({
        url: `/anggota/anggotas`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Anggota;
      }) => response.data,
    }),

    // ✏️ Update Anggota by ID
    updateAnggota: builder.mutation<Anggota, { id: number; payload: FormData }>(
      {
        query: ({ id, payload }) => ({
          url: `/anggota/anggotas/${id}?_method=PUT`,
          method: "POST",
          body: payload,
        }),
        transformResponse: (response: {
          code: number;
          message: string;
          data: Anggota;
        }) => response.data,
      }
    ),

    // ❌ Delete Anggota by ID
    deleteAnggota: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/anggota/anggotas/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => ({ code: response.code, message: response.message }),
    }),

    // ✅ EXPORT Excel (body JSON: { from_date, to_date })
    exportAnggotaExcel: builder.mutation<
      { code: number; message: string },
      { from_date: string; to_date: string }
    >({
      query: ({ from_date, to_date }) => ({
        url: `/anggota/anggotas/export`,
        method: "POST",
        body: { from_date, to_date },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data?: string; // e.g. "Processing export request..."
      }) => ({
        code: response.code,
        message: response.message,
      }),
    }),

    // ✅ IMPORT Excel (body FormData: { file })
    importAnggotaExcel: builder.mutation<
      { code: number; message: string },
      { file: File }
    >({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/anggota/anggotas/import`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: {
        code: number;
        message: string;
        data?: unknown;
      }) => ({
        code: response.code,
        message: response.message,
      }),
    }),

    // 🆕 Public Register (mirip createAnggota, endpoint: /register)
    register: builder.mutation<Anggota, FormData>({
      query: (payload) => ({
        url: `/register`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Anggota;
      }) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAnggotaListQuery,
  useGetAnggotaByIdQuery,
  useCreateAnggotaMutation,
  useUpdateAnggotaMutation,
  useDeleteAnggotaMutation,
  useExportAnggotaExcelMutation,
  useImportAnggotaExcelMutation,
  useRegisterMutation,
} = anggotaApi;