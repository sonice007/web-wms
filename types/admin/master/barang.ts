export interface Inventory {
  id: number;
  min_stock: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  status: boolean;
  stock: number;
  updated_at: string;
  created_at: string;
  warehouse_code: string;
  warehouse_name: string;
  warehouse_id: number;
  warehouse_storage_id: number;
  warehouse_storage_name: string;
}

export interface InventoryResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Inventory[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface Barang {
  id: number;
  product_category_id: number;
  category_name?: string;
  sku: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  min_stock?: number;
  unit: string;
  status: boolean;
}

export interface BarangResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Barang[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface CreateBarangRequest {
  product_category_id: number;
  sku: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  min_stock?: number;
  unit: string;
  status: number;
}

export interface UpdateBarangRequest {
  product_category_id: number;
  sku: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  min_stock?: number;
  unit: string;
  status: number;
}
