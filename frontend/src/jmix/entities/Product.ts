export class Product {
  static NAME = "Product";
  id?: string;
  name?: string | null;
  special?: boolean | null;
  price?: any | null;
  photo?: any | null;
}
export type ProductViewName = "_base" | "_instance_name" | "_local";
export type ProductView<V extends ProductViewName> = V extends "_base"
  ? Pick<Product, "id" | "name" | "special" | "price" | "photo">
  : V extends "_instance_name"
  ? Pick<Product, "id" | "name">
  : V extends "_local"
  ? Pick<Product, "id" | "name" | "special" | "price" | "photo">
  : never;
