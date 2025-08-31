import React from "react";
import "./header.scss";

type HeaderProps = {
  title: string;
  startSlot?: React.ReactNode;
  endSlot?: React.ReactNode;
};

export const Header = (props: HeaderProps) => {
  return (
    <div className="cpm-header">
      <div className="cpm-header__start">{props.startSlot}</div>
      <div className="cpm-header__title">{props.title}</div>
      <div className="cpm-header__end">{props.endSlot}</div>
    </div>
  );
};
