import React from "react";
import { Form, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react";
import { FormattedMessage } from "react-intl";
import {
  createAntdFormValidationMessages,
  createUseAntdForm,
  createUseAntdFormValidation,
  RetryDialog,
  Field,
  GlobalErrorsAlert,
  Spinner,
  useMasterDetailEditor,
  EntityEditorProps,
  useCreateAntdResetForm
} from "@haulmont/jmix-react-ui";
import { gql } from "@apollo/client";
import "../../app/App.css";
import { Order } from "../../jmix/entities/Order_";

const ENTITY_NAME = "Order_";
const ROUTING_PATH = "/orderMasterDetail";

const LOAD_ORDER_ = gql`
  query Order_ById($id: String = "", $loadItem: Boolean!) {
    Order_ById(id: $id) @include(if: $loadItem) {
      id
      _instanceName
      customer {
        id
        _instanceName
        firstName
        lastName
        telephoneNumber
      }
      total
    }
    CustomerList {
      id
      _instanceName
    }
  }
`;

const UPSERT_ORDER_ = gql`
  mutation Upsert_Order_($order: inp_Order_!) {
    upsert_Order_(order: $order) {
      id
    }
  }
`;

const OrderEditor = observer((props: EntityEditorProps<Order>) => {
  const {
    onCommit,
    entityInstance,
    submitBtnCaption = "common.submit"
  } = props;

  const [form] = useForm();

  const {
    relationOptions,
    executeLoadQuery,
    loadQueryResult: { loading: queryLoading, error: queryError },
    upsertMutationResult: { loading: upsertLoading },
    serverValidationErrors,
    intl,
    handleSubmit,
    handleSubmitFailed,
    handleCancelBtnClick
  } = useMasterDetailEditor<Order>({
    loadQuery: LOAD_ORDER_,
    upsertMutation: UPSERT_ORDER_,
    entityName: ENTITY_NAME,
    routingPath: ROUTING_PATH,
    onCommit,
    entityInstance,
    useEntityEditorForm: createUseAntdForm(form),
    useEntityEditorFormValidation: createUseAntdFormValidation(form),
    resetEntityEditorForm: useCreateAntdResetForm(form)
  });

  if (queryLoading) {
    return <Spinner />;
  }

  if (queryError != null) {
    console.error(queryError);
    return <RetryDialog onRetry={executeLoadQuery} />;
  }

  return (
    <Form
      onFinish={handleSubmit}
      onFinishFailed={handleSubmitFailed}
      layout="vertical"
      form={form}
      validateMessages={createAntdFormValidationMessages(intl)}
    >
      <Field
        entityName={ENTITY_NAME}
        propertyName="customer"
        associationOptions={relationOptions?.get("Customer")}
        formItemProps={{
          style: { marginBottom: "12px" },
          rules: [{ required: true }]
        }}
      />

      <Field
        entityName={ENTITY_NAME}
        propertyName="total"
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
      </Form.Item>
    </Form>
  );
});

export default OrderEditor;
