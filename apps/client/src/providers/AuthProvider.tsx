import { request } from "@/utils/fetch";
import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAsync, useAsyncRetry } from "react-use";

type Props = {
  children: React.ReactNode;
};

type AuthContext = {
  username: string;
  onLoginSuccess: () => void;
};

const AuthContext = React.createContext<AuthContext>({} as AuthContext);

export const REDIRECT_TO = "redirect_to";

const AuthProvider = (props: Props) => {
  const navigate = useNavigate();
  const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
  const { value, loading, retry } = useAsyncRetry(async () => {
    return request<Pick<AuthContext, "username">>({ path: "/api/auth" }).catch(() => {
      navigate(`/login?${REDIRECT_TO}=${redirectTo}`);
    });
  }, []);

  if (loading) {
    return <>loading</>;
  }

  return (
    <AuthContext.Provider value={{ username: value?.username!, onLoginSuccess: retry }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
