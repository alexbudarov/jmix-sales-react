import React from "react";
import OrderEditor from "./OrderEditor";
import OrderList from "./OrderList";
import {
  registerEntityList,
  MasterDetailManager
} from "@haulmont/jmix-react-ui";
import { observer } from "mobx-react";

const ENTITY_NAME = "Order_";
const ROUTING_PATH = "/orderMasterDetail";

const OrderMasterDetail = observer(() => {
  return (
    <MasterDetailManager editor={<OrderEditor />} browser={<OrderList />} />
  );
});

registerEntityList({
  component: OrderMasterDetail,
  caption: "screen.OrderMasterDetail",
  screenId: "OrderMasterDetail",
  entityName: ENTITY_NAME,
  menuOptions: {
    pathPattern: `${ROUTING_PATH}/:entityId?`,
    menuLink: ROUTING_PATH
  }
});

export default OrderMasterDetail;
