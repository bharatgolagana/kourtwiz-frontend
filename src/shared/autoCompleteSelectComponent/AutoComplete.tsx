/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Autocomplete, TextField } from "@mui/material";

interface AutocompleteSelectProps<T> {
  options?: T[];
  getOptionLabel?: (option: T) => string;
  onChange?: (event: React.SyntheticEvent, value: T | null) => void;
  value?: T | null;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  helperText?: string;
  warningText?: string;
  successText?: string;
  size?: "small" | "medium";
  error?: boolean;
}

const AutocompleteSelect = React.forwardRef<
  HTMLInputElement,
  AutocompleteSelectProps<any>
>(
  (
    {
      options = [],
      getOptionLabel = (option) => option.toString(),
      onChange,
      value,
      label,
      placeholder,
      isLoading = false,
      disabled = false,
      helperText,
      warningText,
      successText,
      size = "medium",
      error,
    },
    ref
  ) => {
    return (
      <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        onChange={onChange}
        value={value}
        loading={isLoading}
        disabled={disabled}
        disableClearable={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            variant="outlined"
            disabled={disabled}
            error={!!error || !!warningText}
            helperText={helperText || successText || warningText}
            size={size}
            inputRef={ref}
          />
        )}
      />
    );
  }
);

export default AutocompleteSelect;
