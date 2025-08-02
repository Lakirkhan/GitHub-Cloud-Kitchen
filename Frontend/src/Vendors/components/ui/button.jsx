import React from "react";
import "./button.css";

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}) {
  return (
    <button
      className={`button button-${variant} button-${size} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
