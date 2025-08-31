import React from "react";
import Close from "./Close.icon.svg";
import cn from "classnames";
import Back from "./Back.icon.svg";
import "./icon.scss";

const icons = {
  close: Close,
  back: Back,
};

type Props = { name: keyof typeof icons } & React.HTMLAttributes<HTMLSpanElement>;
const Icon = ({name, className, ...props}: Props) => {
  const Icon = icons[name];

  return <span className={cn("cmp-icon", className)} {...props}>{<Icon />}</span>;
};

export default Icon;
