import React from "react";
import { observer } from "mobx-react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  LeftOutlined
} from "@ant-design/icons";
import { Button, List, Tooltip } from "antd";
import {
  EntityInstance,
  getFields,
  EntityPermAccessControl
} from "@haulmont/jmix-react-core";
import {
  EntityProperty,
  Paging,
  Spinner,
  RetryDialog,
  useEntityList,
  EntityListProps,
  registerEntityList
} from "@haulmont/jmix-react-ui";
import { Customer } from "../../jmix/entities/Customer";
import { FormattedMessage } from "react-intl";
import { gql } from "@apollo/client";

const ENTITY_NAME = "Customer";
const ROUTING_PATH = "/customerList";

const CUSTOMER_LIST = gql`
  query CustomerList(
    $limit: Int
    $offset: Int
    $orderBy: inp_CustomerOrderBy
    $filter: [inp_CustomerFilterCondition]
  ) {
    CustomerCount(filter: $filter)
    CustomerList(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      id
      firstName
      lastName
      telephoneNumber
    }
  }
`;

const CustomerList = observer((props: EntityListProps<Customer>) => {
  const { entityList, onEntityListChange } = props;

  const {
    items,
    count,
    executeListQuery,
    listQueryResult: { loading, error },
    handleDeleteBtnClick,
    handleCreateBtnClick,
    handleEditBtnClick,
    handlePaginationChange,
    goToParentScreen,
    entityListState
  } = useEntityList<Customer>({
    listQuery: CUSTOMER_LIST,
    entityName: ENTITY_NAME,
    routingPath: ROUTING_PATH,
    entityList,
    onEntityListChange
  });

  if (error != null) {
    console.error(error);
    return <RetryDialog onRetry={executeListQuery} />;
  }

  if (loading || items == null) {
    return <Spinner />;
  }

  return (
    <div className="narrow-layout">
      <div style={{ marginBottom: "12px" }}>
        {entityList != null && (
          <Tooltip title={<FormattedMessage id="common.back" />}>
            <Button
              htmlType="button"
              style={{ margin: "0 12px 12px 0" }}
              icon={<LeftOutlined />}
              onClick={goToParentScreen}
              key="back"
              type="default"
              shape="circle"
            />
          </Tooltip>
        )}

        <EntityPermAccessControl entityName={ENTITY_NAME} operation="create">
          <span>
            <Button
              htmlType="button"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateBtnClick}
            >
              <span>
                <FormattedMessage id="common.create" />
              </span>
            </Button>
          </span>
        </EntityPermAccessControl>
      </div>

      <List
        itemLayout="horizontal"
        bordered
        dataSource={items}
        renderItem={(item: EntityInstance<Customer>) => (
          <List.Item
            actions={[
              <EntityPermAccessControl
                entityName={ENTITY_NAME}
                operation="delete"
              >
                <DeleteOutlined
                  key="delete"
                  onClick={(event?: React.MouseEvent) =>
                    handleDeleteBtnClick(event, item.id)
                  }
                />
              </EntityPermAccessControl>,
              <EntityPermAccessControl
                entityName={ENTITY_NAME}
                operation="update"
              >
                <EditOutlined
                  key="edit"
                  onClick={(event?: React.MouseEvent) =>
                    handleEditBtnClick(event, item.id)
                  }
                />
              </EntityPermAccessControl>
            ]}
          >
            <div style={{ flexGrow: 1 }}>
              {getFields(item).map(p => (
                <EntityProperty
                  entityName={ENTITY_NAME}
                  propertyName={p}
                  value={item[p]}
                  key={p}
                />
              ))}
            </div>
          </List.Item>
        )}
      />

      <div style={{ margin: "12px 0 12px 0", float: "right" }}>
        <Paging
          paginationConfig={entityListState.pagination ?? {}}
          onPagingChange={handlePaginationChange}
          total={count}
        />
      </div>
    </div>
  );
});

registerEntityList({
  component: CustomerList,
  caption: "screen.CustomerList",
  screenId: "CustomerList",
  entityName: ENTITY_NAME,
  menuOptions: {
    pathPattern: `${ROUTING_PATH}/:entityId?`,
    menuLink: ROUTING_PATH
  }
});

export default CustomerList;
