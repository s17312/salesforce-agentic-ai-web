import * as React from "react";
import { Controller, Control, Path, FieldValues, RegisterOptions } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

type RHFAutocompleteFieldProps<O extends { value: number | string; label: string }, TField extends FieldValues> = TextFieldProps & {
  control: Control<TField>;
  name: Path<TField>;
  options: O[];
  placeholder?: string;
  getAllData?: () => void;
  rules?: RegisterOptions;
  onChange?: (newValue: number | null | string) => void;
  onFocus?: () => void;
  disabled?: boolean; // Added disabled prop
  disableClearable?: boolean;
}

const RHFAutocompleteField = <
  O extends { value: number | string; label: string },
  TField extends FieldValues
>(
  props: RHFAutocompleteFieldProps<O, TField>
) => {
  const { control, options, name, getAllData, rules, onChange: handleChange, onFocus, disabled, disableClearable } = props; // Destructuring disabled prop
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
              size="small"
              disableClearable={disableClearable}
              value={
                value
                  ? options.find((option) => {
                    return value === option.value;
                  }) ?? null
                  : null
              }
              getOptionLabel={(option) => {
                return option.label;
              }}
              onChange={(event: any, newValue) => {
                const newVal = newValue ? newValue.value : null;
                onChange(newVal);
                if (handleChange) handleChange(newVal);
              }}
              onBlur={field.onBlur}
              id="controllable-states-demo"
              options={options}
              disabled={disabled} // Pass disabled prop to Autocomplete component
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={props.placeholder}
                  onChange={getAllData}
                  onFocus={onFocus}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </>
        );
      }}
    />
  );
};

export default RHFAutocompleteField;
