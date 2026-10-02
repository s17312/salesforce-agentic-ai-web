import { TextField } from "@mui/material";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Controller, useFormContext } from "react-hook-form";

dayjs.extend(utc);

type Props = DatePickerProps<any, any> & {
  name: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  maxDate?: Date;
  minDate?: Date;
  format?: string;
  disabled?: boolean;
  views?: Array<"year" | "month" | "day">;
  openTo?: "year" | "month" | "day";
};

export default function RHFDatePicker({
  name,
  disableFuture,
  disablePast,
  maxDate,
  minDate,
  format,
  disabled,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          disabled={disabled}
          label={other.label}
          value={field.value}
          maxDate={maxDate && maxDate}
          minDate={minDate && minDate}
          inputFormat={
            format
              ? format
              : process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
          }
          disableFuture={disableFuture && disableFuture}
          disablePast={disablePast}
          views={other.views}
          openTo={other.openTo ?? "day"}
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          renderInput={(params: any) => (
            <TextField
              size="small"
              {...params}
              fullWidth
              onBlur={field.onBlur}
              inputProps={{
                ...params.inputProps,
                readOnly: false,
              }}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}
    />
  );
}
