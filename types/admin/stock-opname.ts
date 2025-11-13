/**
 * 1. Interface Data Utama (StockOpname)
 * Ini adalah bentuk data tunggal yang Anda terima dari server,
 * sesuai dengan contoh respons JSON yang Anda berikan.
 */
export interface StockOpname {
  id: number;
  inventory_id: number;
  date: string; // "2025-09-09"
  initial_stock: number;
  counted_stock: number;
  difference: number;
  cogs: number;
  total: number;
  notes: string | null;
  created_at: string; // "2025-11-12T04:38:10.000000Z"
  updated_at: string;

  // Data tambahan (hasil join)
  inventory_stock: number;
  warehouse_name: string;
  warehouse_code: string;
  warehouse_storage_name: string;
  warehouse_storage_code: string;
  product_name: string;
  product_sku: string;
}

/**
 * 2. Interface Respons Paginated (StockOpnameResponse)
 * Ini adalah wrapper respons dari server ketika Anda me-request
 * daftar/list data (biasanya dari framework seperti Laravel).
 */
export interface StockOpnameResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: StockOpname[]; // <-- Menggunakan interface StockOpname yang baru
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

/**
 * 3. Interface Request (Create/Submit)
 * Ini adalah data yang Anda *kirim* ke server untuk membuat
 * data stock opname baru, sesuai contoh "submit data" Anda.
 */
export interface CreateStockOpnameRequest {
  inventory_id: number;
  date: string; // "2025-09-09"
  initial_stock: number;
  counted_stock: number;
  difference: number;
  cogs: number;
  total: number;
  notes?: string; // Dibuat optional, karena bisa jadi tidak ada notes
}

/**
 * 4. Interface Request (Update)
 * Ini adalah data yang Anda kirim ke server untuk memperbarui
 * data stock opname yang sudah ada. Seringkali mirip dengan Create.
 */
export interface UpdateStockOpnameRequest {
  inventory_id: number;
  date: string;
  initial_stock: number;
  counted_stock: number;
  difference: number;
  cogs: number;
  total: number;
  notes?: string;
}