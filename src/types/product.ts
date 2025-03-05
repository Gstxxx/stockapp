import { Sale } from "./sale";

export type Product = {
  id: number;
  name: string;
  price: number;
  priceCard?: number;
  stockQuantity: number;
  saleQuantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductWithSales = Product & {
  sales: Sale[];
};
