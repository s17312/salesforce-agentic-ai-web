import { borderColorDisable } from "@/styles/InputFeilds/textFeildStyles";
import { TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { Control, RegisterOptions, useController } from "react-hook-form";

type CustomTextAreaProps = TextFieldProps & {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  label: string;
  disabled?: boolean;
  isReadOnly?: boolean;
  numberOfRows?: number;
};

const RHFTextArea = ({
  name,
  label,
  control,
  rules,
  disabled,
  isReadOnly,
  numberOfRows,
  ...rest
}: CustomTextAreaProps) => {
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
      multiline
      rows={numberOfRows ? numberOfRows : 4}
      {...rest}
      {...inputProps}
      inputRef={ref}
      error={!!error}
      helperText={error?.message}
      disabled={disabled}
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
        "&.Mui-disabled": {
          cursor: "default",
        },
      }}
    />
  );
};

export default RHFTextArea;
