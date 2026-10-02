import FormProvider, { RHFTextField } from "@/components/hook-form";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setVehicleCategoryError,
  setVehicleCategoryMessage,
} from "@/redux/slices/vehicle-category-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createVehicleCategories,
  updateVehicleCategories,
} from "@/service/vehicleCategory.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  FormValuesPropsVehicleCategory,
  VehicleCategory,
} from "@/types/vehicle-category-types";
import { vehicleCategoryValidationSchema } from "@/utils/schemas/vehicleCategorySchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentVehicleCategory?: VehicleCategory | undefined;
  isEdit?: boolean;
};

export default function VehicleCategoryForm({
  currentVehicleCategory,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      categoryID: currentVehicleCategory?.categoryID || "",
      category: currentVehicleCategory?.category || "",
      description: currentVehicleCategory?.description || "",
    }),
    [currentVehicleCategory]
  );

  const responseMessage = useSelector(
    (state) => state.vehicleCategorySlice.message
  );

  const responseError = useSelector(
    (state) => state.vehicleCategorySlice.error
  );

  useEffect(() => {
    if (isEdit && currentVehicleCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentVehicleCategory]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setVehicleCategoryMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setVehicleCategoryError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesPropsVehicleCategory>({
    //@ts-ignore
    resolver: yupResolver(vehicleCategoryValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState } = methods;

  const handleCreateVehicleCategory = async (
    data: FormValuesPropsVehicleCategory
  ) => {
    try {
      await createVehicleCategories(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.vehicleCategory.list);
    } catch (error: any) {}
  };

  const handleUpdateVehicleCategory = async (
    data: FormValuesPropsVehicleCategory
  ) => {
    try {
      await updateVehicleCategories(currentVehicleCategory?.uId, data);

      router.push(PATH_DASHBOARD.vehicleCategory.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.vehicleCategory.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateVehicleCategory)
          : handleSubmit(handleUpdateVehicleCategory)
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
            aria-controls="Vehicle Category Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Vehicle Category Details
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
            <RHFTextField name="categoryID" label="Code*" />
            <RHFTextField name="category" label="Name*" />
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
