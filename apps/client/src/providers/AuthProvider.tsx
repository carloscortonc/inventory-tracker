import React, { useContext } from "react";
import { request } from "@/utils/fetch";
import { useNavigate } from "react-router-dom";
import { useAsyncRetry } from "react-use";
import Loader from "@/components/loader";

type Props = {
  children: React.ReactNode;
};

type AuthContext = {
  username: string;
  refreshAuth: () => void;
};

const AuthContext = React.createContext<AuthContext>({} as AuthContext);

export const REDIRECT_TO = "redirect_to";

const getRedirectValue = () => {
  const sp = new URLSearchParams(window.location.search);
  if (window.location.pathname !== "/login" && !sp.has(REDIRECT_TO)) {
    sp.set(REDIRECT_TO, encodeURIComponent(window.location.pathname));
  }
  return sp.toString();
};

const AuthProvider = (props: Props) => {
  const navigate = useNavigate();
  const redirectTo = getRedirectValue();
  const { value, loading, retry } = useAsyncRetry(async () => {
    return request<Pick<AuthContext, "username">>("/api/auth").catch(() => {
      navigate(`/login?${redirectTo}`);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ username: value?.username!, refreshAuth: retry }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
