import React from "react";
import "./footer.scss";

export const Footer = (props: { children: React.ReactNode }) => {
  return <div className="cpm-footer">{props.children}</div>;
};
