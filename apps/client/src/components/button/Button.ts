import React from "react";
import { createComponent } from "@lit/react";
import { MdFilledButton } from "@material/web/button/filled-button.js";

// https://github.com/material-components/material-web/issues/4433

const Button = createComponent({
  tagName: "md-filled-button",
  elementClass: MdFilledButton,
  react: React,
  events: {
    onClick: "click",
  },
});

export default Button;
