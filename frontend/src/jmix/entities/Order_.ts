import { Customer } from "./Customer";
import { OrderLine } from "./OrderLine";
export class Order {
  static NAME = "Order_";
  id?: string;
  customer?: Customer | null;
  total?: any | null;
  lines?: OrderLine[] | null;
}
export type OrderViewName = "_base" | "_instance_name" | "_local";
export type OrderView<V extends OrderViewName> = V extends "_base"
  ? Pick<Order, "id" | "total">
  : V extends "_local"
  ? Pick<Order, "id" | "total">
  : never;
