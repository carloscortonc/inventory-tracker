import { useState } from "react";
import { ItemDetail } from "../ItemDetail";
import { Item } from "@/types";
import Button from "@/components/button";

export const Edit = (props: Item & { onClose: () => void }) => {
  const [visible, setVisible] = useState(false);
  const onOpen = () => {
    setVisible(true);
    props.onClose();
  };

  return (
    <>
      <Button label="Edit" onClick={onOpen} />
      <ItemDetail {...props} visible={visible} editMode onClose={() => setVisible(false)} />
    </>
  );
};
