export interface DashboardHeader {
  total_category: number;
  total_product: number;
  total_warehouse: number;
  total_warehouse_storage: number;
}

export interface DashboardPurchaseOrder {
  month: number;
  total_product: string | number;
  total: number;
}

export interface DashboardSalesOrder {
  month: number;
  total_product: string | number;
  total: number;
}
