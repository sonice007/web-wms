export interface Klasifikasi {
  id: number;
  name: string;
  amount: string;
  description: string | null;
}

export interface KlasifikasiResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Klasifikasi[];
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

export interface CreateKlasifikasiRequest {
  name: string;
  amount: string;
  description?: string;
}

export interface UpdateKlasifikasiRequest {
  name: string;
  amount: string;
  description?: string;
}
