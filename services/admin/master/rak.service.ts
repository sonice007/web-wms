import { apiSlice } from "../../base-query";
import {
  Rak,
  RakResponse,
  CreateRakRequest,
  UpdateRakRequest,
} from "@/types/admin/master/rak";

export const rakApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Rak (with pagination)
    getRakList: builder.query<
      {
        data: Rak[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string; warehouse_id?: number }
    >({
      query: ({ page, paginate, search, warehouse_id }) => ({
        url: `/master/warehouse-storages`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
          warehouse_id,
        },
      }),
      transformResponse: (response: RakResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get Rak by ID
    getRakById: builder.query<Rak, number>({
      query: (id) => ({
        url: `/master/warehouse-storages/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Rak;
      }) => response.data,
    }),

    // ➕ Create Rak
    createRak: builder.mutation<
      Rak,
      CreateRakRequest
    >({
      query: (payload) => ({
        url: `/master/warehouse-storages`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Rak;
      }) => response.data,
    }),

    // ✏️ Update Rak by ID
    updateRak: builder.mutation<
      Rak,
      { id: number; payload: UpdateRakRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/master/warehouse-storages/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Rak;
      }) => response.data,
    }),

    // ❌ Delete Rak by ID
    deleteRak: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/warehouse-storages/${id}`,
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
  useGetRakListQuery,
  useGetRakByIdQuery,
  useCreateRakMutation,
  useUpdateRakMutation,
  useDeleteRakMutation,
} = rakApi;
