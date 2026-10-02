import { borderColorDisable } from "@/styles/InputFeilds/textFeildStyles";
import { TextField } from "@mui/material";
import React from "react";
import { Control, RegisterOptions, useController } from "react-hook-form";

type CustomTextFieldProps = {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  label: string;
  disabled?: boolean;
  isReadOnly?: boolean;
};

const CustomTextField = ({
  name,
  label,
  control,
  rules,
  disabled,
  isReadOnly,
  ...rest
}: CustomTextFieldProps) => {
  const {
    field: { ref, ...inputProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    disabled,
    defaultValue: "",
  });

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((label === "Code" || label === "Reference Id") && event.key === " ") {
      event.preventDefault();
    }
  };

  return (
    <TextField
      label={label}
      {...rest}
      {...inputProps}
      inputRef={ref}
      error={!!error}
      helperText={error?.message}
      disabled={disabled}
      variant="outlined"
      InputProps={{
        readOnly: isReadOnly,
      }}
      onKeyPress={isReadOnly ? undefined : handleKeyPress}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: isReadOnly ? borderColorDisable : undefined,
          },
          "&:hover fieldset": {
            borderColor: isReadOnly ? borderColorDisable : undefined,
          },
          "&.Mui-focused fieldset": {
            borderColor: isReadOnly ? borderColorDisable : undefined,
          },
        },
        "&:hover": {
          cursor: isReadOnly ? "default" : "pointer",
        },
        ...(isReadOnly && {
          "& input": {
            cursor: "default",
          },
        }),
      }}
    />
  );
};

export default CustomTextField;
