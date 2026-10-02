import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setProductCategoryError,
  setProductcategoryMessage,
} from "@/redux/slices/product-category-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createProductCategory,
  updateProductCategory,
} from "@/service/productCategory.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { productCategoryValidationSchema } from "@/utils/schemas/productCategorySchema";
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
import { ProductCategory } from "connect-force-api-client/models/product-category";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentProductCategory?: ProductCategory | undefined;
  isEdit?: boolean;
};

export type FormValuesProps = {
  categoryId?: string;
  categoryName?: string;
  description?: string;
};

export default function ProductCategoryAddForm({
  currentProductCategory,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      categoryId: currentProductCategory?.categoryId || "",
      categoryName: currentProductCategory?.categoryName || "",
      description: currentProductCategory?.description || "",
    }),
    [currentProductCategory]
  );

  const methods = useForm<FormValuesProps>({
    //@ts-ignore
    resolver: yupResolver(productCategoryValidationSchema),
    defaultValues,
    mode: "all",
  });

  const responseMessage = useSelector(
    (state) => state.productCategorySlice.message
  );

  const responseError = useSelector(
    (state) => state.productCategorySlice.error
  );

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.productCategory.list);
  };

  const { handleSubmit, reset, formState } = methods;

  useEffect(() => {
    if (isEdit && currentProductCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentProductCategory]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setProductcategoryMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setProductCategoryError(null));
    }
  }, [responseMessage, responseError]);

  const handleCreateProductCategory = async (data: FormValuesProps) => {
    try {
      await createProductCategory(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.productCategory.list);
    } catch (error: any) {}
  };

  const handleUpdateProductCategory = async (data: FormValuesProps) => {
    try {
      await updateProductCategory(currentProductCategory?.uId, data);
      router.push(PATH_DASHBOARD.productCategory.list);
    } catch (error: any) {}
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateProductCategory)
          : handleSubmit(handleUpdateProductCategory)
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
            aria-controls="Product Category Register"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Product Category Details
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
            <RHFTextField name="categoryId" label="Code*" />
            <RHFTextField name="categoryName" label="Name*" />
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
