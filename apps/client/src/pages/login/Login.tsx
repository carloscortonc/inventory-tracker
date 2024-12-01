import React, { useState } from "react";
import type { FormProps } from "antd";
import { request } from "@/utils/fetch";
import { Navigate, useNavigate } from "react-router-dom";
import { REDIRECT_TO, useAuth } from "@/providers/AuthProvider";
import Button from "@/components/button";
import "./login.css";
import Textfield from "@/components/textfield";

type FormValues = {
  username?: string;
  password?: string;
  remember?: string;
};

const Login: React.FC = () => {
  const { username, onLoginSuccess } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const onLogin = (values: FormValues) => {
    request("/api/auth/user", { method: "post", body: values })
      .then(() => {
        onLoginSuccess();
        const redirectPath = new URLSearchParams(window.location.search).get(REDIRECT_TO);
        navigate(redirectPath ? decodeURIComponent(redirectPath) : "/");
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  if (username) {
    return <Navigate to="/" />;
  }

  return (
    <form
      className="login"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.target as HTMLFormElement);
        const values = [...fd.entries()].reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as FormValues);
        onLogin(values);
      }}
    >
      <Textfield name="username" type="text" placeholder="Username" required value={"user"} onChange={console.log} />
      <Textfield
        name="password"
        type="password"
        placeholder="Password"
        required
        value={"test"}
        onChange={console.log}
      />
      {error}
      <Button type="submit">Log in</Button>
    </form>
  );
};

export default Login;
