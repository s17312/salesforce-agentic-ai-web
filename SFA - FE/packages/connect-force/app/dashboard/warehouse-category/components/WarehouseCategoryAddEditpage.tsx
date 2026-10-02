import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setWarehouseCategoryError,
  setWarehouseCategoryMessage,
} from "@/redux/slices/warehouse-category-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createWarehouseCategories,
  updateWarehouseCategories,
} from "@/service/warehouse-category.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  FormValuesPropsWarehouseCategory,
  WarehouseCategory,
} from "@/types/warehousecaregory-types";
import { warehouseCategoryValidationSchema } from "@/utils/schemas/warehouseCategorySchema";
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
  currentWarehouseCategory?: WarehouseCategory | undefined;
  isEdit?: boolean;
};

export default function WarehouseCategoryAddForm({
  currentWarehouseCategory,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      categoryID: currentWarehouseCategory?.categoryID || "",
      category: currentWarehouseCategory?.category || "",
      description: currentWarehouseCategory?.description || "",
    }),
    [currentWarehouseCategory]
  );

  const responseMessage = useSelector(
    (state) => state.warehouseCategorySlice.message
  );

  const responseError = useSelector(
    (state) => state.warehouseCategorySlice.error
  );

  useEffect(() => {
    if (isEdit && currentWarehouseCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentWarehouseCategory]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setWarehouseCategoryMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setWarehouseCategoryError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesPropsWarehouseCategory>({
    //@ts-ignore
    resolver: yupResolver(warehouseCategoryValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState } = methods;

  const handleCreateWarehouseCategory = async (
    data: FormValuesPropsWarehouseCategory
  ) => {
    try {
      await createWarehouseCategories(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.warehouseCategory.list);
    } catch (error: any) {}
  };

  const handleUpdateWarehouseCategory = async (
    data: FormValuesPropsWarehouseCategory
  ) => {
    try {
      await updateWarehouseCategories(currentWarehouseCategory?.uId, data);

      router.push(PATH_DASHBOARD.warehouseCategory.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.warehouseCategory.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateWarehouseCategory)
          : handleSubmit(handleUpdateWarehouseCategory)
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
            aria-controls="Warehouse Category Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Warehouse Category Details
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
