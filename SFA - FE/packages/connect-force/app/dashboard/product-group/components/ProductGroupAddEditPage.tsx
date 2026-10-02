import FormProvider from "@/components/hook-form/FormProvider";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ProductGroup } from "connect-force-api-client";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { RHFTextField } from "@/components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productGroupSchema } from "@/utils/schemas/productGroupSchema";
import {
  createProductGroup,
  updateProductGroup,
} from "@/service/productGroup.service";
import { useSnackbar } from "notistack";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { dispatch, useSelector } from "@/redux/store";
import {
  setProductGroupError,
  setProductGroupMessage,
} from "@/redux/slices/product-group-slice";

type props = {
  currentProductGroup?: ProductGroup | undefined;
  isEdit?: boolean;
};
export type FormValuesProps = {
  productGroupId?: string | null;
  productGroupName?: string | null;
  description?: string | null;
};

const ProductGroupAddEditPage = ({
  currentProductGroup,
  isEdit = false,
}: props) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      productGroupId: currentProductGroup?.productGroupId || "",
      productGroupName: currentProductGroup?.productGroupName || "",
      description: currentProductGroup?.description || "",
    }),
    [currentProductGroup]
  );

  const responseMessage = useSelector(
    (state) => state.productGroupSlice.message
  );

  const responseError = useSelector((state) => state.productGroupSlice.error);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setProductGroupMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setProductGroupError(null));
    }
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesProps>({
    //@ts-ignore
    resolver: yupResolver(productGroupSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState } = methods;

  const handleCreateProductGroup = async (data: FormValuesProps) => {
    try {
      await createProductGroup(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.productGroup.list);
    } catch (error: any) {}
  };

  const handleUpdateProductGroup = async (data: FormValuesProps) => {
    try {
      await updateProductGroup(currentProductGroup?.uId, data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.productGroup.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.productGroup.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateProductGroup)
          : handleSubmit(handleUpdateProductGroup)
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
              Product Group Details
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
            <RHFTextField name="productGroupId" label="Code*" />
            <RHFTextField name="productGroupName" label="Name*" />
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
};

export default ProductGroupAddEditPage;
