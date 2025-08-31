import Button from "@/components/button";
import { request } from "@/utils/fetch";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";

export const Delete = (props: { code: string }) => {
  const navigate = useNavigate();
  const [state, fn] = useAsyncFn(
    () => request<void>(`/products/${props.code}`, { method: "delete" }).then(() => navigate("/items")),
    [props.code],
  );
  return <Button label="Delete" danger loading={state.loading} onClick={fn} />;
};
