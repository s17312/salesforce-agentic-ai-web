import { Controller, Control, useFormContext } from "react-hook-form";
// @mui
import { FormHelperText } from "@mui/material";
//
import { UploadAvatar, Upload, UploadBox, UploadProps } from "../upload";

// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, "file"> {
  name: string;
  multiple?: boolean;
  control: Control<any>;
  isClear?: boolean;
}

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, accept, control, ...other }: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const isError = !!error && !field.value;

        return (
          <div>
            <UploadAvatar
              accept={accept}
              error={isError}
              file={field.value}
              {...other}
              onFileChange={(file: any) => {
                field.onChange(file);
                field.onBlur();
              }}
            />

            {isError && (
              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

export function RHFUploadBox({
  name,
  accept,
  control,
  ...other
}: Props) {

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const isError = !!error && !field.value?.length;

        return (
          <UploadBox
            accept={accept}
            error={isError}
            files={field.value}
            {...other}
            onFileChange={(files: any) => {
              field.onChange(files);
              field.onBlur();
            }}
          />
        );
      }}
    />
  );
}

export function RHFUpload({
  name,
  multiple,
  accept,
  control,
  isClear,
  ...other
}: Props) {

  const { setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const isErrorWithSingle = !!error && !field.value;

        const isErrorWithMultiple = !!error && !field.value?.length;

        return multiple ? (
          <Upload
            multiple
            accept={accept}
            files={field.value}
            error={isErrorWithMultiple}
            onFileChange={(files: any) => {
              setValue(field.name, files, { shouldDirty: true });
              field.onChange(files);
              field.onBlur();
            }}
            isClear={isClear}
            helperText={
              isErrorWithMultiple && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={accept}
            file={field.value}
            error={isErrorWithSingle}
            onFileChange={(file: any) => {
              field.onChange(file);
              field.onBlur();
            }}
            isClear={isClear}
            helperText={
              isErrorWithSingle && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}
