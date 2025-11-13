// Interface for the nested 'details' in the response
export interface BarangMasukDetail {
  id: number;
  purchase_order_id: number;
  inventory_id: number;
  warehouse_storage_id: number | null;
  product_id: number;
  description: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  discount_type: 'fixed' | 'percentage' | null;
  discount_rate: number;
  discount_value: number;
  tax_rate: number | null;
  tax_value: number;
  total: number;
  created_at: string;
  updated_at: string;
}

// Interface for the 'details' array in the create request
export interface CreateBarangMasukDetailRequest {
  product_id: number;
  warehouse_storage_id: number | null;
  description: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  discount_type: 'fixed' | 'percentage' | null;
  discount_rate: number | null; // Nullable, as it's only required for 'percentage'
  discount_value: number;
  tax_rate: number | null;
  tax_value: number;
  total: number;
}

// Base Transaction interface (for responses)
export interface BarangMasuk {
  id: number;
  warehouse_id: number;
  reference: string;
  ref_number: number;
  date: string;
  due_date: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  supplier: string | null; // Matched request (nullable)
  notes: string | null; // Matched request (nullable)
  created_at?: string;
  updated_at?: string;
  warehouse_name?: string;
  warehouse_code?: string;
  details: BarangMasukDetail[]; // Added based on full response
  warehouse?: {
    id: number;
    code: string;
    name: string;
    address: string;
    description: string | null;
    status: boolean;
    created_at: string;
    updated_at: string;
  }
}

export interface UpdateBarangMasukStatusRequest {
  id: string;
  email_verified_at: string; // Changed from number to boolean (as per original file)
}

// BarangMasuk list query parameters
export interface BarangMasukListParams {
  page?: number;
  paginate?: number;
  search?: string;
}

// Income Category list response structure
export interface BarangMasukListResponse {
  data: BarangMasuk[]; // This array might contain items *without* 'details' for performance
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Create BarangMasuk request (FIXED)
export interface CreateBarangMasukRequest {
  warehouse_id: number;
  date: string;
  due_date: string;
  supplier: string | null;
  notes: string | null;
  details: CreateBarangMasukDetailRequest[];
}

// Update BarangMasuk request (FIXED)
export interface UpdateBarangMasukRequest {
  warehouse_id?: number;
  date?: string;
  due_date?: string;
  supplier?: string | null;
  notes?: string | null;
  details?: CreateBarangMasukDetailRequest[];
}

// API response wrapper
// When getting a single item, use BarangMasukApiResponse<BarangMasuk>
// When creating an item, the response is BarangMasukApiResponse<BarangMasuk>
export interface BarangMasukApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}