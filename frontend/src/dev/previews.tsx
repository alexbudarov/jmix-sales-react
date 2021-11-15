import React from "react";
import ProductEdit from "../app/product/ProductEdit";
import ProductList from "../app/product/ProductList";
import OrderMasterDetail from "../app/order/OrderMasterDetail";
import CustomerEdit from "../app/customer/CustomerEdit";
import CustomerList from "../app/customer/CustomerList";
import UserList from "../app/user/UserList";
import UserEditor from "../app/user/UserEditor";
import { Previews, ComponentPreview } from "@haulmont/react-ide-toolbox";

export const ComponentPreviews = () => {
  return (
    <Previews>
      <ComponentPreview path="/UserEditor">
        <UserEditor />
      </ComponentPreview>
      <ComponentPreview path="/UserList">
        <UserList />
      </ComponentPreview>
      <ComponentPreview path="/CustomerList">
        <CustomerList />
      </ComponentPreview>
      <ComponentPreview path="/CustomerEdit">
        <CustomerEdit />
      </ComponentPreview>
      <ComponentPreview path="/OrderMasterDetail">
        <OrderMasterDetail />
      </ComponentPreview>
      <ComponentPreview path="/ProductList">
        <ProductList />
      </ComponentPreview>
      <ComponentPreview path="/ProductEdit">
        <ProductEdit />
      </ComponentPreview>
    </Previews>
  );
};
