// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField, TextFieldProps } from "@mui/material";

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  children: React.ReactNode;
  focused?: boolean;
};

export default function RHFSelect({
  name,
  children,
  focused = false,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native: true,
            sx: {
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px", // Match border radius
                "& fieldset": {
                  borderColor: "#BDC1E4", // Initial border color
                },
                "&:hover fieldset": {
                  borderColor: "#3f51b5", // Hover color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3f51b5", // Focus color
                },
              },
            },
          }}
          error={!!error}
          helperText={error?.message}
          {...other}
          focused={focused}
        >
          {children}
        </TextField>
      )}
    />
  );
}
