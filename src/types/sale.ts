import { Product } from "./product";

export type Sale = {
  id: number;
  productId: number;
  quantity: number;
  totalValue: number;
  paymentMethod: string;
  date: Date;
};

export type SaleWithProduct = Sale & {
  product: Product;
};

export type SaleSummary = {
  totalSales: number;
  totalRevenue: number;
  totalQuantity: number;
};
