// src/CustomButton.tsx
import "./Button.css";
import React from "react";
import { Button, ButtonProps as MUIButtonProps } from "@mui/material";
import clsx from "clsx";

type CustomButtonProps = MUIButtonProps & {
  loading?: boolean;
  danger?: boolean;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "info";
  type?: "button" | "submit" | "reset";
};

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ loading = false, children, variant, className, ...rest }, ref) => {
    const buttonClass = clsx(className, {
      "btn-loading": loading,
    });

    return (
      <Button
        type={rest.type}
        color={rest.color}
        variant={variant}
        ref={ref}
        className={`btn ${buttonClass}`}
        disabled={loading || rest.disabled}
        {...rest}
      >
        {loading ? <span className="custom-btn-spinner" /> : children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
