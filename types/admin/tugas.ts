export interface Tugas {
  id: number;
  level_id: number;
  level_name?: string;
  task_category_id: number;
  task_category_name?: string;
  name: string;
  start_date: Date;
  end_date: Date;
  target: number;
  bonus: number;
  status: number;
}

export interface TugasResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Tugas[];
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

export interface CreateTugasRequest {
  level_id: number;
  task_category_id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  target: number;
  bonus: number;
  status: number;
}

export interface UpdateTugasRequest {
  level_id: number;
  task_category_id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  target: number;
  bonus: number;
  status: number;
}
