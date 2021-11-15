import { MenuProps } from "antd";
import React from "react";
import { VerticalMenu, MenuItem, SubMenuItem } from "@haulmont/jmix-react-ui";
import { BarsOutlined, HomeOutlined } from "@ant-design/icons";
import { tabs } from "@haulmont/jmix-react-core";

export interface AppMenuProps extends MenuProps {}

export const AppMenu = (props: AppMenuProps) => {
  return (
    <VerticalMenu {...props}>
      <MenuItem
        screenId="HomePage"
        icon={<HomeOutlined />}
        caption={"screen.home"}
        key={"home"}
      />
      <MenuItem
        screenId={"UserList"}
        icon={<BarsOutlined />}
        caption={"screen.UserList"}
        key={"f417ee99-b740-4e65-a14d-a6ed5094aee8"}
      />
      <MenuItem
        screenId={"CustomerList"}
        icon={<BarsOutlined />}
        caption={"screen.CustomerList"}
        key={"f048682c-ee08-40de-aba0-c4f4cc598b37"}
      />
      <MenuItem
        screenId={"OrderMasterDetail"}
        icon={<BarsOutlined />}
        caption={"screen.OrderMasterDetail"}
        key={"f048682c-ee08-40de-aba0-c4f4cc598b38"}
      />
      <MenuItem
        screenId={"ProductList"}
        icon={<BarsOutlined />}
        caption={"screen.ProductList"}
        key={"02782a30-5c51-455c-a0a5-0bdfa99a4b38"}
      />
    </VerticalMenu>
  );
};
