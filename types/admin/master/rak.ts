export interface Rak {
  id: number;
  warehouse_id: number;
  warehouse_name?: string;
  code: string;
  type: string;
  name: string;
  description: string;
  capacity: string;
  status: boolean;
}

export interface RakResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Rak[];
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

export interface CreateRakRequest {
  warehouse_id: number;
  code: string;
  type: string;
  name: string;
  description: string;
  capacity: string;
  status: number;
}

export interface UpdateRakRequest {
  warehouse_id: number;
  code: string;
  type: string;
  name: string;
  description: string;
  capacity: string;
  status: number;
}
