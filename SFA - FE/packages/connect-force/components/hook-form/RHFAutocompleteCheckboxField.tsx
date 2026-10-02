import * as React from "react";
import {
  Controller,
  Control,
  Path,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface RHFAutocompleteCheckboxProps<
  O extends { value: number; label: string },
  TField extends FieldValues
> {
  control: Control<TField>;
  name: Path<TField>;
  options: O[];
  placeholder?: string;
  rules?: RegisterOptions;
  disabled?: boolean;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const RHFAutocompleteCheckboxField = <
  O extends { value: number; label: string },
  TField extends FieldValues
>(
  props: RHFAutocompleteCheckboxProps<O, TField>
) => {
  const { control, options, name, placeholder, rules, disabled } = props;

  const allOptions = [{ label: "Select All", value: 0 }, ...options];

  return (
    <Controller
      name={name}
      control={control}
      //rules={rules}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ref } = field;

        const allSelected = value?.length === options.length;

        const handleSelectAllToggle = (selected: boolean) => {
          if (selected) {
            // Select all options
            onChange(options.map((option) => option.value));
          } else {
            // Deselect all options
            onChange([]);
          }
        };

        return (
          <Autocomplete
            size="small"
            multiple
            disableCloseOnSelect
            disabled={disabled}
            value={
              allSelected
                ? [allOptions[0]]
                : allOptions.filter((option) => value?.includes(option.value))
            }
            getOptionLabel={(option) => option.label}
            onChange={(event, newValue, reason, details) => {
              if (reason === "clear") {
                onChange([]);
                return;
              }
              const clickedOption = details?.option;
              const clickedValue = clickedOption?.value;
              if (clickedValue === 0) {
                const isAllSelected = value?.length === options.length;
                if (isAllSelected) {
                  onChange([]);
                } else {
                  onChange(options.map((opt) => opt.value));
                }
                return;
              }
              const isAlreadySelected = value?.includes(clickedValue);
              onChange(newValue.map((option) => option.value));
              if (isAlreadySelected) {
                onChange(value.filter((val: number) => val !== clickedValue));
              } else {
                onChange([...value, clickedValue]);
              }
            }}
            onBlur={field.onBlur}
            options={allOptions}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              const isChecked = allSelected || selected;
              return (
                <li
                  key={key}
                  {...optionProps}
                  style={{ padding: "2px 4px", fontSize: "0.875rem" }}
                >
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 0 }}
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: 10 },
                    }}
                    checked={isChecked}
                    size="small"
                  />
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={placeholder}
                inputRef={ref}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        );
      }}
    />
  );
};

export default RHFAutocompleteCheckboxField;
