import React from "react";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import "./TextField.css";

interface CustomInputProps {
  type?: string;
  label?: string;
  value?: string | number;
  placeholder?: string;
  error?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
  warningText?: string;
  name?: string;
  required?: boolean;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  size?: "small" | "medium";
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
}

// Use React.forwardRef to pass ref to the input
const CustomTextField = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      type = "text",
      label,
      placeholder,
      icon,
      onChange,
      warningText,
      helperText,
      size = "medium",
      required = false,
      disabled = false,
      error,
      ...rest
    },
    ref
  ) => {
    return (
      <FormControl fullWidth>
        <TextField
          className="text-input"
          type={type}
          placeholder={placeholder}
          size={size}
          label={
            label ? (
              <span>
                {label} {required && <span style={{ color: "red" }}>*</span>}
              </span>
            ) : undefined
          }
          onChange={onChange}
          disabled={disabled}
          InputProps={{
            endAdornment: icon ? (
              <InputAdornment position="end">{icon}</InputAdornment>
            ) : null,
          }}
          error={!!error || !!warningText || !!helperText}
          helperText={helperText || warningText}
          inputRef={ref}
          {...rest}
        />
      </FormControl>
    );
  }
);

export default CustomTextField;
