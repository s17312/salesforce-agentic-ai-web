import * as React from "react";
import { Controller, Control, Path, FieldValues, RegisterOptions } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

interface RHFAutocompleteMultipleFieldProps<
  O extends { value: number; label: string },
  TField extends FieldValues
> {
  control: Control<TField>;
  name: Path<TField>;
  options: O[];
  placeholder?: string;
  getAllData?: () => void;
  rules?: RegisterOptions;
  onChange?: (newValue: number[]) => void;
  disabled?: boolean;
}

const RHFAutocompleteMultipleField = <
  O extends { value: number; label: string },
  TField extends FieldValues
>(
  props: RHFAutocompleteMultipleFieldProps<O, TField>
) => {
  const { control, options, name, getAllData, rules, onChange: handleChange, disabled } = props;

  return (
    <Controller
      name={name}
      control={control}
      // rules={rules}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ref } = field;
        return (
          <>
            <Autocomplete
              multiple
              value={
                value
                  ? options.filter((option) => value.includes(option.value))
                  : []
              }
              getOptionLabel={(option) => option.label}
              onChange={(event, newValue) => {
                const newValues = newValue.map((option) => option.value);
                onChange(newValues);
                if (handleChange) handleChange(newValues);
              }}
              options={options}
              onBlur={field.onBlur}
              disabled={disabled}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={props.placeholder}
                  onChange={getAllData}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                  size="small"
                />
              )}
            />
          </>
        );
      }}
    />
  );
};

export default RHFAutocompleteMultipleField;