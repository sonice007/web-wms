export interface StockOpnameForm {
  barang_id: number | undefined;
  tanggal: string;
  stock_sistem: number;
  stock_fisik: number;
  selisih: number;
  keterangan: string;
}