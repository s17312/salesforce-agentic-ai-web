"use client";

import { useSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { warehouseTypeValidationSchema } from "@/utils/schemas/warehouseTypeSchema";
import { PATH_DASHBOARD } from "@/routes/paths";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { RHFTextField } from "@/components/hook-form";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  RegisterWarehouseType,
  WarehouseTypeProps,
} from "@/types/warehouse-types";
import {
  createWarehouseType,
  updateWarehouseType,
} from "@/service/warehouseType.service";

export default function WarehouseTypeAddEditForm({
  currentWarehouseType,
  isEdit = false,
}: WarehouseTypeProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      warehouseTypeId: currentWarehouseType?.warehouseTypeId || "",
      warehouseTypeName: currentWarehouseType?.warehouseTypeName || "",
      description: currentWarehouseType?.description || "",
    }),
    [currentWarehouseType]
  );

  useEffect(() => {
    if (isEdit && currentWarehouseType) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, []);

  const methods = useForm<RegisterWarehouseType>({
    //@ts-ignore
    resolver: yupResolver(warehouseTypeValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setFocus } = methods;

  const onError = (errors: any) => {
    const firstErrorField: any = Object.keys(errors)[0];
    setFocus(firstErrorField);
  };

  const handleCreateWarehouseType = async (data: RegisterWarehouseType) => {
    await createWarehouseType(data);
    enqueueSnackbar("Warehouse type successfully registered", {
      variant: "success",
    });
    reset(defaultValues);
    router.push(PATH_DASHBOARD.warehouseType.list);
  };

  const handleUpdateWarehouseType = async (data: RegisterWarehouseType) => {
    await updateWarehouseType(currentWarehouseType?.uId, data);
    enqueueSnackbar("Warehouse type successfully updated", {
      variant: "success",
    });
    router.push(PATH_DASHBOARD.warehouseType.list);
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.warehouseType.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateWarehouseType, onError)
          : handleSubmit(handleUpdateWarehouseType, onError)
      }
    >
      <Grid item xs={12} sx={{ mb: 3, position: "relative" }}>
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
              Warehouse Type Details
            </Typography>
          </AccordionSummary>

          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField name="warehouseTypeId" label="Code*"  />
            <RHFTextField name="warehouseTypeName" label="Name*"  />
            <RHFTextField name="description" label="Description" />
          </Box>
        </Accordion>

        <Box
          sx={{
            width: "100%",
            bgcolor: "#E5E0F5",
            height: "10vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #FFFFFF",
            borderRadius: "15px",
            mt: "15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={formState.isSubmitting}
              startIcon={<SaveIcon />}
              disabled={!formState.isDirty}
              sx={{
                color: "#FFFFFF",
                height: "44px",
                px: 4,
                borderRadius: "15px",
                mr: 3,
                border: "2px solid #9fa4d4",
                background: "#070E4D",
                "&:hover": {
                  background: "#2D3675",
                },
              }}
            >
              {isEdit ? "Update" : "Save"}
            </LoadingButton>
            {!isEdit ? (
              <Button
                type="reset"
                variant="outlined"
                onClick={() => reset(defaultValues)}
                sx={{
                  height: "44px",
                  px: 4,
                  borderRadius: "15px",
                  background: "#f7f4fe",
                  border: "2px solid #fbf9ff",
                  "&:hover": {
                    background: "#DED8F2",
                    border: "2px solid #f4f1fc",
                  },
                }}
              >
                Clear
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  height: "44px",
                  px: 4,
                  borderRadius: "15px",
                  background: "#f7f4fe",
                  border: "2px solid #fbf9ff",
                  "&:hover": {
                    background: "#DED8F2",
                    border: "2px solid #f4f1fc",
                  },
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Grid>
    </FormProvider>
  );
}
