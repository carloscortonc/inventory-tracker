import React from "react";
import cn from "classnames";
import "./textfield.scss";

type Props = {
  label: string;
  defaultValue?: any;
  onChange?: (e: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

const TextField = (props: Props) => {
  const [_value, _setValue] = React.useState(props.defaultValue);
  const onChange: Props["onChange"] = props.onChange || _setValue;
  const value = props.value ?? _value;

  return (
    <div className="cmp-input">
      <input
        {...props}
        id={props.name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("cpm-textfield", props.className)}
        placeholder={props.label}
      />
      {props.label && (value || value === 0) ? <label htmlFor={props.name} children={props.label} /> : <></>}
    </div>
  );
};

export default TextField;
