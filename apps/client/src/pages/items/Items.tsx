import { useMemo, useState } from "react";
import { request } from "@/utils/fetch";
import { useAsync } from "react-use";
import Button from "@/components/button";
import Loader from "@/components/loader";
import Layout, { Footer, Header } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import Textfield from "@/components/textfield";
import { useLongPress } from "use-long-press";
import { ItemDetail } from "./ItemDetail";
import { Delete, Edit } from "./actions";
import type { Item } from "@/types";
import "./items.scss";
import Sidebar from "@/components/sidebar";

const Items = () => {
  const navigate = useNavigate();
  const { value: items, loading, error } = useAsync(() => request<Item[]>("/products"), []);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => items?.filter((e) => e.name.includes(search)), [items, search]);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div
        className="error"
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        Error: {error.message}
      </div>
    );
  }
  return (
    <Layout
      header={<Header title="Inventory" />}
      footer={<Footer children={<Button label="Scan" className="scan-btn" onClick={() => navigate("/scan")} />} />}
    >
      <Textfield label="Search" value={search} onChange={setSearch} />
      {filtered!.map((i) => (
        <Item {...i} />
      ))}
    </Layout>
  );
};

const Item = (props: Item) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const longPresshandler = useLongPress(() => setMenuVisible(true));
  return (
    <div className="item" {...longPresshandler()}>
      <div className="item__left"></div>
      <div className="item__right">
        <span>{props.name}</span>
        <span className="detail">Quantity: {props.quantity}</span>
      </div>
      <ItemActions {...props} visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </div>
  );
};

const ItemActions = (props: Item & { visible: boolean; onClose: () => void }) => {
  return (
    <Sidebar height={180} visible={props.visible} onClose={props.onClose}>
      <div className="item-actions">
        <Edit {...props} onClose={props.onClose} />
        <Delete code={props.code} />
      </div>
    </Sidebar>
  );
};

export default Items;
