export class Customer {
  static NAME = "Customer";
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  telephoneNumber?: string | null;
}
export type CustomerViewName = "_base" | "_instance_name" | "_local";
export type CustomerView<V extends CustomerViewName> = V extends "_base"
  ? Pick<Customer, "id" | "firstName" | "lastName" | "telephoneNumber">
  : V extends "_instance_name"
  ? Pick<Customer, "id" | "firstName" | "lastName">
  : V extends "_local"
  ? Pick<Customer, "id" | "firstName" | "lastName" | "telephoneNumber">
  : never;
