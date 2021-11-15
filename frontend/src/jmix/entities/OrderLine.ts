import { Order } from "./Order_";
import { Product } from "./Product";
export class OrderLine {
  static NAME = "OrderLine";
  id?: string;
  order?: Order | null;
  product?: Product | null;
  count?: any | null;
}
export type OrderLineViewName = "_base" | "_instance_name" | "_local";
export type OrderLineView<V extends OrderLineViewName> = V extends "_base"
  ? Pick<OrderLine, "id" | "count">
  : V extends "_local"
  ? Pick<OrderLine, "id" | "count">
  : never;
