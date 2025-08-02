import React from "react";
import "./badge.css";

export function Badge({ variant = "default", children, className, ...props }) {
  return (
    <span className={`badge badge-${variant} ${className || ""}`} {...props}>
      {children}
    </span>
  );
}
