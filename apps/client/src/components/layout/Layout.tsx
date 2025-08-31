import React from "react";
import cn from "classnames";
import "./layout.scss";

export type Props = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};
const Layout = (props: Props) => {
  return (
    <div
      className={cn("cmp-layout", props.className, { "with-header": !!props.header, "with-footer": !!props.footer })}
    >
      {props.header && <div className="cmp-layout__header">{props.header}</div>}
      <div className="cmp-layout__content">{props.children}</div>
      {props.footer && <div className="cmp-layout__footer">{props.footer}</div>}
    </div>
  );
};

export default Layout;
