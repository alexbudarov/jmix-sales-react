import React from "react";
import { observer } from "mobx-react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Tooltip, notification } from "antd";
import {EntityPermAccessControl, useMainStore} from "@haulmont/jmix-react-core";
import {
  DataTable,
  RetryDialog,
  useEntityList,
  EntityListProps,
  registerEntityList
} from "@haulmont/jmix-react-ui";
import { User } from "../../jmix/entities/User";
import { FormattedMessage } from "react-intl";
import {FetchResult, gql, useMutation} from "@apollo/client";
import {ApolloError} from "@apollo/client/errors";

const ENTITY_NAME = "User";
const ROUTING_PATH = "/userList";

const USER_LIST = gql`
  query UserList(
    $limit: Int
    $offset: Int
    $orderBy: inp_UserOrderBy
    $filter: [inp_UserFilterCondition]
  ) {
    UserCount(filter: $filter)
    UserList(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      id
      active
      email
      firstName
      lastName
      timeZoneId
      username
    }
  }
`;

const UserList = observer((props: EntityListProps<User>) => {
  const { entityList, onEntityListChange } = props;

  const {
    items,
    count,
    relationOptions,
    executeListQuery,
    listQueryResult: { loading, error },
    handleSelectionChange,
    handleFilterChange,
    handleSortOrderChange,
    handlePaginationChange,
    handleDeleteBtnClick,
    handleCreateBtnClick,
    handleEditBtnClick,
    goToParentScreen,
    entityListState
  } = useEntityList<User>({
    listQuery: USER_LIST,
    entityName: ENTITY_NAME,
    routingPath: ROUTING_PATH,
    entityList,
    onEntityListChange
  });

  const mainStore = useMainStore();

  const [executeDeactivateUserMutation] = useMutation(gql`
    mutation deactivateUser($user: inp_User) {
      deactivateUser(user: $user) {
        id
        firstName
        lastName
      }
    }
  `);

  if (error != null) {
    console.error(error);
    return <RetryDialog onRetry={executeListQuery} />;
  }

  function handleDeactivateBtnClick(event: React.MouseEvent) {
    let selectedEntityId = entityListState.selectedEntityId;

    const selectedUser = items?.find(i => i.id === selectedEntityId);
    if (!selectedUser) {
      console.log("selected user is null")
      return;
    }

    executeDeactivateUserMutation({
      variables: {
        user: selectedUser
      }
    })
      .then(onDeactivateUserResponse)
      .catch(onDeactivateUserError);
  }

  function onDeactivateUserResponse(response: FetchResult<any>) {
    // handle response
    let user: User = response.data.deactivateUser
    notification.success({
      message: 'Success',
      description: 'User "' + user.firstName + ' ' + user.lastName + '" has been deactivated'
    });
    executeListQuery()
  }

  function onDeactivateUserError(error: ApolloError) {
    // on error
    notification.error({
      message: 'Error',
      description: error.message
    });
  }

  function isDeactivateButtonDisabled() {
    let selectedEntityId = entityListState.selectedEntityId;
    const user = items?.find(i => i.id === selectedEntityId);

    let currentUserName = mainStore.userName
    return user == null || !user.active|| user.username === currentUserName
  }

  const buttons = [
    <EntityPermAccessControl
      entityName={ENTITY_NAME}
      operation="create"
      key="create"
    >
      <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateBtnClick}
      >
        <span>
          <FormattedMessage id="common.create" />
        </span>
      </Button>
    </EntityPermAccessControl>,
    <EntityPermAccessControl
      entityName={ENTITY_NAME}
      operation="update"
      key="update"
    >
      <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        disabled={entityListState.selectedEntityId == null}
        type="default"
        onClick={handleEditBtnClick}
      >
        <FormattedMessage id="common.edit" />
      </Button>
    </EntityPermAccessControl>,
    <EntityPermAccessControl
      entityName={ENTITY_NAME}
      operation="delete"
      key="delete"
    >
      <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        disabled={entityListState.selectedEntityId == null}
        onClick={handleDeleteBtnClick}
        key="remove"
        type="default"
      >
        <FormattedMessage id="common.remove" />
      </Button>
    </EntityPermAccessControl>,
    <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        disabled={isDeactivateButtonDisabled()}
        onClick={handleDeactivateBtnClick}
        key="deactivate"
        type="default"
    >
      <FormattedMessage id="users.deactivate"/>
    </Button>
  ];

  if (entityList != null) {
    buttons.unshift(
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
    );
  }

  return (
    <DataTable
      items={items}
      count={count}
      relationOptions={relationOptions}
      current={entityListState.pagination?.current}
      pageSize={entityListState.pagination?.pageSize}
      entityName={ENTITY_NAME}
      loading={loading}
      error={error}
      enableFiltersOnColumns={entityList != null ? [] : undefined}
      enableSortingOnColumns={entityList != null ? [] : undefined}
      columnDefinitions={[
        "username",
        "firstName",
        "lastName",
        "email",
        "active",
        "timeZoneId"
      ]}
      onRowSelectionChange={handleSelectionChange}
      onFilterChange={handleFilterChange}
      onSortOrderChange={handleSortOrderChange}
      onPaginationChange={handlePaginationChange}
      hideSelectionColumn={true}
      buttons={buttons}
    />
  );
});

registerEntityList({
  component: UserList,
  caption: "screen.UserList",
  screenId: "UserList",
  entityName: ENTITY_NAME,
  menuOptions: {
    pathPattern: `${ROUTING_PATH}/:entityId?`,
    menuLink: ROUTING_PATH
  }
});

export default UserList;
