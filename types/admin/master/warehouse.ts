export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: boolean;
}

export interface WarehouseResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Warehouse[];
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

export interface CreateWarehouseRequest {
  code: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: number;
}

export interface UpdateWarehouseRequest {
  code: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: number;
}
