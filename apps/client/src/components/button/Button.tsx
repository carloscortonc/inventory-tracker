import React from "react";
import cn from "classnames";
import "./button.scss";

type Props = {
  label: string;
  className?: string;
  loading?: boolean;
  secondary?: boolean;
  danger?: boolean;
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick" | "disabled">;

const Button = ({ className, ...props }: Props) => {
  return (
    <button
      {...props}
      className={cn("cmp-button", className, {
        secondary: props.secondary,
        disabled: props.disabled,
        danger: props.danger,
      })}
    >
      {props.loading ? <div className="cmp-button__loading" /> : props.label}
    </button>
  );
};

export default Button;
