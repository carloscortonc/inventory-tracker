import React from "react";
import { createComponent } from "@lit/react";
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field";
import "./textfield.css";

// https://github.com/material-components/material-web/issues/4433

const Button = createComponent({
  tagName: "md-outlined-text-field",
  elementClass: MdOutlinedTextField,
  react: React,
  events: {
    onClick: "click",
  },
});

export default Button;
