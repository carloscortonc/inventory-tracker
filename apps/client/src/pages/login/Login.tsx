import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { request } from "@/utils/fetch";
import "./styles.css";
import { Navigate, useNavigate } from "react-router-dom";
import { REDIRECT_TO, useAuth } from "@/providers/AuthProvider";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const Login: React.FC = () => {
  const { username, onLoginSuccess } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    request({
      path: "/api/auth/user",
      method: "post",
      body: JSON.stringify(values),
      headers: { "content-type": "application/json" },
    })
      .then(() => {
        onLoginSuccess();
        const redirectPath = new URLSearchParams(window.location.search).get(REDIRECT_TO);
        navigate(redirectPath ? decodeURIComponent(redirectPath) : "/");
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (username) {
    return <Navigate to="/" />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        {error}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
