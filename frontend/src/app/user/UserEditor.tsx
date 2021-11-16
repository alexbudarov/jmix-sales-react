import React, {useContext, useState} from "react";
import {Form, Alert, Button, Card, Modal, Row, Col, Input, notification} from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { FormattedMessage } from "react-intl";
import {
  createAntdFormValidationMessages,
  createUseAntdForm,
  createUseAntdFormValidation,
  RetryDialog,
  Field,
  GlobalErrorsAlert,
  Spinner,
  useEntityEditor,
  EntityEditorProps,
  registerEntityEditor
} from "@haulmont/jmix-react-ui";
import {FetchResult, gql, useMutation} from "@apollo/client";
import "../../app/App.css";
import { User } from "../../jmix/entities/User";
import {ApolloError} from "@apollo/client/errors";

const ENTITY_NAME = "User";
const ROUTING_PATH = "/userEditor";

const LOAD_USER = gql`
  query UserById($id: String = "", $loadItem: Boolean!) {
    UserById(id: $id) @include(if: $loadItem) {
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

const UPSERT_USER = gql`
  mutation Upsert_User($user: inp_User!) {
    upsert_User(user: $user) {
      id
    }
  }
`;

const UserEditor = observer((props: EntityEditorProps<User>) => {
  const {
    onCommit,
    entityInstance,
    submitBtnCaption = "common.submit"
  } = props;

  const [form] = useForm();
  const [isChangePassDialogVisible, setChangePassDialogVisible] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    executeLoadQuery,
    item,
    loadQueryResult: { loading: queryLoading, error: queryError },
    upsertMutationResult: { loading: upsertLoading },
    serverValidationErrors,
    intl,
    handleSubmit,
    handleSubmitFailed,
    handleCancelBtnClick
  } = useEntityEditor<User>({
    loadQuery: LOAD_USER,
    upsertMutation: UPSERT_USER,
    entityName: ENTITY_NAME,
    routingPath: ROUTING_PATH,
    onCommit,
    entityInstance,
    useEntityEditorForm: createUseAntdForm(form),
    useEntityEditorFormValidation: createUseAntdFormValidation(form)
  });

  const [executeChangePassword] = useMutation(gql`
    mutation changePassword($user: inp_User, $newPassword: String!) {
      changePassword(user: $user, newPassword: $newPassword) {
        id
        firstName
        lastName
      }
    }
  `);

  if (queryLoading) {
    return <Spinner />;
  }

  if (queryError != null) {
    console.error(queryError);
    return <RetryDialog onRetry={executeLoadQuery} />;
  }

  function onChangePasswordClick(event: React.MouseEvent) {
    console.log("Item: " + (item ? Object.keys(item as any) : "null"))
    setChangePassDialogVisible(true)
  }

  function handleChangePasswordOk() {
    if (passwordValue == null || passwordValue.length == 0) {
      notification.warn({
        message: 'Validation',
        description: "Specify new password"
      });
      return;
    }

    executeChangePassword({
      variables: {
        user: item,
        newPassword: passwordValue
      }
    })
      .then(onChangePasswordResponse)
      .catch(onChangePasswordError);
  }

  function onChangePasswordResponse(response: FetchResult<any>) {
    // handle response
    notification.success({
      message: 'Success',
      description: 'Password for the user "' + item.firstName + ' ' + item.lastName + '" has been changed'
    });
    setChangePassDialogVisible(false)
  }

  function onChangePasswordError(error: ApolloError) {
    // on error
    notification.error({
      message: 'Error',
      description: error.message
    });
  }

  function handleChangePasswordCancel() {
    setChangePassDialogVisible(false)
  }

  return (
    <Card className="narrow-layout">
      <Form
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        layout="vertical"
        form={form}
        validateMessages={createAntdFormValidationMessages(intl)}
      >
        <Field
          entityName={ENTITY_NAME}
          propertyName="username"
          formItemProps={{
            style: { marginBottom: "12px" },
            rules: [{ required: true }]
          }}
        />

        <Field
          entityName={ENTITY_NAME}
          propertyName="firstName"
          formItemProps={{
            style: { marginBottom: "12px" }
          }}
        />

        <Field
          entityName={ENTITY_NAME}
          propertyName="lastName"
          formItemProps={{
            style: { marginBottom: "12px" }
          }}
        />

        <Field
          entityName={ENTITY_NAME}
          propertyName="email"
          formItemProps={{
            style: { marginBottom: "12px" }
          }}
        />

        <Field
          entityName={ENTITY_NAME}
          propertyName="active"
          formItemProps={{
            style: { marginBottom: "12px" },
            valuePropName: "checked"
          }}
        />

        <Field
          entityName={ENTITY_NAME}
          propertyName="timeZoneId"
          formItemProps={{
            style: { marginBottom: "12px" }
          }}
        />

        <GlobalErrorsAlert serverValidationErrors={serverValidationErrors} />

        <Form.Item style={{ textAlign: "center" }}>
          <Button htmlType="button" onClick={handleCancelBtnClick}>
            <FormattedMessage id="common.cancel" />
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={upsertLoading}
            style={{ marginLeft: "8px" }}
          >
            <FormattedMessage id={submitBtnCaption} />
          </Button>
          <Button
            key="changePasswordBtn"
            type={"dashed"}
            htmlType="button"
            disabled={item == null || item.id == null}
            style={{ marginLeft: "8px" }} onClick={onChangePasswordClick}>
            <FormattedMessage id={"users.changePassword"}/>
          </Button>
        </Form.Item>
      </Form>
      <Modal title={"Change password for user \"" + item?.username + "\""} visible={isChangePassDialogVisible}
             onOk={handleChangePasswordOk}
             onCancel={handleChangePasswordCancel}>
        <Row gutter={16}>
          <Col flex="none">New password:</Col>
          <Col flex="auto">
            <Input.Password
              key="newPassword"
              value={passwordValue}
              onChange={(event) => setPasswordValue(event.target.value)}
              visibilityToggle={false}/>
          </Col>
        </Row>
      </Modal>
    </Card>
  );
});

registerEntityEditor({
  component: UserEditor,
  caption: "screen.UserEditor",
  screenId: "UserEditor",
  entityName: ENTITY_NAME,
  menuOptions: {
    pathPattern: ROUTING_PATH,
    menuLink: ROUTING_PATH
  }
});

export default UserEditor;
