import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";
import { Control, Controller, RegisterOptions } from "react-hook-form";

export interface MUIPhoneProps extends BaseTextFieldProps {
  value: string;
  onChange: (phone: string) => void;
  readOnly?: boolean;
  isRequired?: boolean;
  control?: Control<any>;
  name: string;
  rules?: RegisterOptions;
  label: string;
}

export const RHFMuiPhone: React.FC<MUIPhoneProps> = ({
  value,
  onChange,
  readOnly = false,
  isRequired = false,
  control,
  name,
  rules,
  label,
  ...restProps
}) => {

  const { phone, handlePhoneValueChange, inputRef, country, setCountry, inputValue } = usePhoneInput({
    defaultCountry: "",
    value,
    forceDialCode: true,
    disableFormatting: true,
    countries: defaultCountries,
    onChange: (data) => {
      onChange(data.phone);
    },
  });

  const handleCountryChange = (e: any) => {
    setCountry(e.target.value as CountryIso2);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
      }
    }, 0);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...restProps}
          size="small"
          variant="outlined"
          label={label}
          color="primary"
          placeholder={label}
          value={inputValue}
          onChange={(e) => {
            handlePhoneValueChange(e);
            field.onChange(e);
          }}
          onBlur={field.onBlur}
          type="tel"
          inputRef={inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" style={{ marginRight: "2px", marginLeft: "-8px" }}>
                <Select
                  MenuProps={{
                    style: {
                      height: "300px",
                      width: "360px",
                      top: "10px",
                      left: "-34px",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  }}
                  sx={{
                    width: "max-content",
                    fieldset: {
                      display: "none",
                    },
                    '&.Mui-focused:has(div[aria-expanded="false"])': {
                      fieldset: {
                        display: "block",
                      },
                    },
                    ".MuiSelect-select": {
                      padding: "4px",
                      paddingRight: "24px !important",
                    },
                    svg: {
                      right: 0,
                      display: readOnly ? "none" : "block",
                    },
                  }}
                  value={country}
                  onChange={handleCountryChange}
                  renderValue={(value) => (
                    <FlagImage
                      iso2={country.iso2}
                      style={{
                        width: "20px",
                        height: "auto",
                        marginRight: readOnly ? "-0.78rem" : "0.2rem",
                        marginTop: "0.1rem",
                        display: "flex",
                        justifyContent: "center"
                      }}
                    />
                  )}
                  disabled={readOnly}
                >
                  {defaultCountries.map((c) => {
                    const country = parseCountry(c);
                    return (
                      <MenuItem key={country.iso2} value={country.iso2}>
                        <FlagImage
                          iso2={country.iso2}
                          style={{
                            width: "15px",
                            height: "auto",
                            marginRight: readOnly ? "-0.78rem" : "0.2rem",
                            display: "flex",
                            justifyContent: "center"
                          }}
                        />
                        <Typography marginRight="8px">{country.name}</Typography>
                        <Typography color="gray">+{country.dialCode}</Typography>
                      </MenuItem>
                    );
                  })}
                </Select>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ required: isRequired }}
          error={fieldState.invalid}
          helperText={fieldState.error ? fieldState.error.message : ""}
          inputProps={{ readOnly, required: isRequired }}
        />
      )}
    />
  );
};

