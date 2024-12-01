import { request } from "@/utils/fetch";
import { Button, Form, FormProps, Input, Toast } from "antd-mobile";
import { useNavigate, useParams } from "react-router-dom";
import { useAsync } from "react-use";
import "./register.css";

type RegisterProductFormProps = {
  value?: Partial<ProductInfo>;
  onSubmit: FormProps["onFinish"];
  onCancel: () => void;
};
type ProductInfo = {
  name: string;
  quantity: number;
  threashold: number;
};
const RegisterProductForm = (props: RegisterProductFormProps) => {
  return (
    <Form
      layout="vertical"
      className="register-form"
      initialValues={{ quantity: 1, threashold: 10, ...props.value }}
      onFinish={props.onSubmit}
      footer={
        <div className="form-footer">
          <Button color="default" type="button" size="large" onClick={props.onCancel}>
            Back
          </Button>
          <Button color="primary" type="submit" size="large">
            Submit
          </Button>
        </div>
      }
    >
      <Form.Header>Register new Product</Form.Header>
      <Form.Item
        label="Product Name"
        name="name"
        rules={[{ required: true, message: "Please input the product name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Quantity" description="Current item quantity" name="quantity">
        <Input />
      </Form.Item>
      <Form.Item label="Threashold" description="Minimum desired quantity for this item" name="threashold">
        <Input />
      </Form.Item>
    </Form>
  );
};

const RegisterProduct = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { loading, value } = useAsync(async () => {
    return request<ProductInfo>("/api/products/".concat(code!)).catch(() => ({}) as ProductInfo);
  }, [code]);

  const onSubmit: RegisterProductFormProps["onSubmit"] = (values) => {
    Toast.show({
      icon: "success",
      content: "Item registered",
    });
    console.log("[onSubmit]", values);
    navigate("/items");
  };

  const onCancel = () => navigate("/scan");

  if (loading) {
    return <>loading product information ...</>;
  }

  return <RegisterProductForm {...{ value, onSubmit, onCancel }} />;
};

export default RegisterProduct;
