import { request } from "@/utils/fetch";
import { useAsync } from "react-use";

const Items = () => {
  const { value: items, loading } = useAsync(() => request({ path: "/api/products" }), []);

  if (loading) {
    return <>"loading products"</>;
  }
  return <div>{JSON.stringify(items)}</div>;
};

export default Items;
