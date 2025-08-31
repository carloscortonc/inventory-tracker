import React, { useState } from "react";
import { request } from "@/utils/fetch";
import { Navigate, useNavigate } from "react-router-dom";
import { REDIRECT_TO, useAuth } from "@/providers/AuthProvider";
import Button from "@/components/button";
import Textfield from "@/components/textfield";
import Loader from "@/components/loader";
import "./login.css";

type FormValues = {
  username?: string;
  password?: string;
  remember?: string;
};

const Login: React.FC = () => {
  const { username, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<{ error?: string; loading: boolean }>({ loading: false });
  const onLogin = (values: FormValues) => {
    setState({ loading: true });
    request("/auth/user", { method: "post", body: values })
      .then(() => {
        refreshAuth();
        const redirectPath = new URLSearchParams(window.location.search).get(REDIRECT_TO);
        navigate(redirectPath ? decodeURIComponent(redirectPath) : "/");
      })
      .catch((e) => {
        setState({ error: e.message, loading: false });
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
      <Textfield name="username" type="text" label="Username" required defaultValue={"user"} />
      <Textfield name="password" type="password" label="Password" required defaultValue={"test"} />
      <div className="login-error">{state.error}</div>
      <Button type="submit" label="Log in" disabled={state.loading} loading={state.loading} className="login-btn" />
    </form>
  );
};

export default Login;
