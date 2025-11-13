import { apiSlice } from "../../base-query";
import { 
  Pengelola, 
  PengelolaListResponse,
  PengelolaListParams,
  CreatePengelolaRequest,
  UpdatePengelolaRequest,
  PengelolaApiResponse
} from "@/types/admin/konfigurasi/pengelola";

export const pengelolaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Pengelolas (with pagination)
    getPengelolaList: builder.query<
      PengelolaListResponse,
      PengelolaListParams
    >({
      query: ({ page = 1, paginate = 10, search }) => ({
        url: `/user`,
        method: "GET",
        params: {
          page,
          paginate,
          ...(search && { search }),
        },
      }),
      transformResponse: (response: PengelolaApiResponse<PengelolaListResponse>) => response.data,
    }),

    // 🔍 Get Income Category by ID
    getPengelolaById: builder.query<Pengelola, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      transformResponse: (response: PengelolaApiResponse<Pengelola>) => response.data,
    }),

    // ➕ Create Income Category
    createPengelola: builder.mutation<
      Pengelola,
      CreatePengelolaRequest
    >({
      query: (payload) => ({
        url: `/user`,
        method: "POST",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: PengelolaApiResponse<Pengelola>) => response.data,
    }),

    // ✏️ Update Income Category by ID
    updatePengelola: builder.mutation<
      Pengelola,
      { id: number; payload: UpdatePengelolaRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: PengelolaApiResponse<Pengelola>) => response.data,
    }),

    // ❌ Delete Income Category by ID
    deletePengelola: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: PengelolaApiResponse<null>) => ({
        code: response.code,
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPengelolaListQuery,
  useGetPengelolaByIdQuery,
  useCreatePengelolaMutation,
  useUpdatePengelolaMutation,
  useDeletePengelolaMutation,
} = pengelolaApi;
