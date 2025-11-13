// Interface for the nested 'details' in the response
export interface BarangKeluarDetail {
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
export interface CreateBarangKeluarDetailRequest {
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
export interface BarangKeluar {
  id: number;
  warehouse_id: number;
  reference: string;
  ref_number: number;
  date: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  partner: string | null; // Matched request (nullable)
  notes: string | null; // Matched request (nullable)
  created_at?: string;
  updated_at?: string;
  warehouse_name?: string;
  warehouse_code?: string;
  details: BarangKeluarDetail[]; // Added based on full response
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

export interface UpdateBarangKeluarStatusRequest {
  id: string;
  email_verified_at: string; // Changed from number to boolean (as per original file)
}

// BarangKeluar list query parameters
export interface BarangKeluarListParams {
  page?: number;
  paginate?: number;
  search?: string;
}

// Income Category list response structure
export interface BarangKeluarListResponse {
  data: BarangKeluar[]; // This array might contain items *without* 'details' for performance
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

// Create BarangKeluar request (FIXED)
export interface CreateBarangKeluarRequest {
  warehouse_id: number;
  date: string;
  partner: string | null;
  notes: string | null;
  details: CreateBarangKeluarDetailRequest[];
}

// Update BarangKeluar request (FIXED)
export interface UpdateBarangKeluarRequest {
  warehouse_id?: number;
  date?: string;
  partner?: string | null;
  notes?: string | null;
  details?: CreateBarangKeluarDetailRequest[];
}

// API response wrapper
// When getting a single item, use BarangKeluarApiResponse<BarangKeluar>
// When creating an item, the response is BarangKeluarApiResponse<BarangKeluar>
export interface BarangKeluarApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}