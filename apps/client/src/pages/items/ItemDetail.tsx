import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lpick from "lodash.pick";
import Sidebar from "@/components/sidebar";
import { Item } from "@/types";
import TextField from "@/components/textfield";
import Button from "@/components/button";
import { request } from "@/utils/fetch";
import "./item-detail.scss";

type Props = Partial<Item> & { visible: boolean; editMode?: boolean; onClose: () => void };
export const ItemDetail = (props: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(lpick(props, ["code", "name", "quantity", "threshold"]) as Item);

  // Sync value when props change
  useEffect(() => {
    setValue(lpick(props, ["code", "name", "quantity", "threshold"]) as Item);
  }, [props.code]);

  const onSave = useCallback(
    (v: Item) => {
      setLoading(true);
      const r = props.editMode
        ? request<void>(`/products/${v.code}`, { method: "put", body: v })
        : request<void>("/products", { method: "post", body: v });

      r.then(() => {
        navigate("/items");
        props.onClose();
      })
        .catch(console.error)
        .finally(() => setLoading(false));
    },
    [setLoading],
  );

  return (
    <Sidebar
      height="60%"
      visible={props.visible}
      onClose={props.onClose}
      footer={
        <Button label="Save" onClick={() => onSave(value as Item)} loading={loading} className="item-detail__save" />
      }
      className="edit-item-sidebar"
    >
      <div className="item-detail">
        <div className="item-detail__image">{/* IMAGE PLACEHOLDER  if needed */}</div>
        <TextField
          label="Product Name"
          value={value.name}
          required
          onChange={(v) => setValue((curr) => ({ ...curr, name: v }))}
        />
        <TextField
          label="Quantity"
          type="number"
          value={value.quantity}
          onChange={(v) => setValue((curr) => ({ ...curr, quantity: parseInt(v) }))}
        />
        <TextField
          label="Threshold"
          type="number"
          value={value.threshold}
          onChange={(v) => setValue((curr) => ({ ...curr, threshold: parseInt(v) }))}
        />
      </div>
    </Sidebar>
  );
};
