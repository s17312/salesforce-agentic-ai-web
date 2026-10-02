import FormProvider from "@/components/hook-form/FormProvider";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createBusinessCategorys,
  updateBusinessCategory,
} from "@/service/businessCategory.service";
import { businessCategoryValidationSchema } from "@/utils/schemas/businessCategorySchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import {
  BusinessCategory,
  FormValuesPropsBusiness as FormValuesProps,
} from "connect-force-api-client/models/business-category";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import RHFTextField from "@/components/hook-form/RHFTextField";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dispatch, useSelector } from "@/redux/store";
import {
  setBusinessCategoryError,
  setBusinesscategoryMessage,
} from "@/redux/slices/business-category-slice";

type Props = {
  currentBusinessCategory?: BusinessCategory | undefined;
  isEdit?: boolean;
};

export default function BusinessCategoryAddForm({
  currentBusinessCategory,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      categoryId: currentBusinessCategory?.categoryId || "",
      category: currentBusinessCategory?.category || "",
      description: currentBusinessCategory?.description || "",
    }),
    [currentBusinessCategory]
  );

  const responseMessage = useSelector(
    (state) => state.businessCategorySlice.message
  );

  const responseError = useSelector(
    (state) => state.businessCategorySlice.error
  );

  useEffect(() => {
    if (isEdit && currentBusinessCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentBusinessCategory]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setBusinesscategoryMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setBusinessCategoryError(null));
    }
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesProps>({
    //@ts-ignore
    resolver: yupResolver(businessCategoryValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState } = methods;

  const handleCreateBusinessCategory = async (data: FormValuesProps) => {
    try {
      await createBusinessCategorys(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.businesscategory.list);
    } catch (error: any) {}
  };

  const handleUpdateBusinessCategory = async (data: FormValuesProps) => {
    try {
      const formatResponse = {
        businessCategory: {
          categoryId: data.categoryId,
          category: data.category,
          description: data.description,
        },
      };
      
      await updateBusinessCategory(currentBusinessCategory?.uId, formatResponse);
      router.push(PATH_DASHBOARD.businesscategory.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.businesscategory.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateBusinessCategory)
          : handleSubmit(handleUpdateBusinessCategory)
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
            aria-controls="Business Category Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Business Category Details
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
