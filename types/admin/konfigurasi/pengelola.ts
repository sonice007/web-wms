// Base Transaction interface (for responses)
export interface Pengelola {
  id: number;
  role_id: number;
  name: string;
  // phone: number;
  email: string;
  email_verified_at?: string;
  password: string;
  password_confirmation: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  roles?: [];
}

export interface UpdatePengelolaStatusRequest {
  id: string;
  email_verified_at: string; // Changed from number to boolean
}

// Pengelola list query parameters
export interface PengelolaListParams {
  page?: number;
  paginate?: number;
  search?: string;
}

// Income Category list response structure
export interface PengelolaListResponse {
  data: Pengelola[];
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

// Create Pengelola request
export interface CreatePengelolaRequest {
  role_id: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  status: number;
}

// Update Pengelola request
export interface UpdatePengelolaRequest {
  role_id: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  status: number;
}

// API response wrapper
export interface PengelolaApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
