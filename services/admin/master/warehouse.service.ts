import { apiSlice } from "../../base-query";
import {
  Warehouse,
  WarehouseResponse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
} from "@/types/admin/master/warehouse";

export const warehouseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Warehouse (with pagination)
    getWarehouseList: builder.query<
      {
        data: Warehouse[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string }
    >({
      query: ({ page, paginate, search }) => ({
        url: `/master/warehouses`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
        },
      }),
      transformResponse: (response: WarehouseResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get Warehouse by ID
    getWarehouseById: builder.query<Warehouse, number>({
      query: (id) => ({
        url: `/master/warehouses/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Warehouse;
      }) => response.data,
    }),

    // ➕ Create Warehouse
    createWarehouse: builder.mutation<
      Warehouse,
      CreateWarehouseRequest
    >({
      query: (payload) => ({
        url: `/master/warehouses`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Warehouse;
      }) => response.data,
    }),

    // ✏️ Update Warehouse by ID
    updateWarehouse: builder.mutation<
      Warehouse,
      { id: number; payload: UpdateWarehouseRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/master/warehouses/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Warehouse;
      }) => response.data,
    }),

    // ❌ Delete Warehouse by ID
    deleteWarehouse: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/warehouses/${id}`,
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
  useGetWarehouseListQuery,
  useGetWarehouseByIdQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = warehouseApi;
