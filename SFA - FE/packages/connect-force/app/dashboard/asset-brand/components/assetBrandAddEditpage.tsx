import FormProvider, { RHFTextField } from "@/components/hook-form";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setAssetBrandError,
  setAssetBrandMessage,
} from "@/redux/slices/asset-brand-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createAssetBrand,
  updateAssetBrand,
} from "@/service/assetBrand.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  AssetBrand,
  FormValuesPropsAssetBrand,
} from "@/types/assetBrand-types";
import { assetBrandValidationSchema } from "@/utils/schemas/assetBrandSchema";
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
  currentAssetBrand?: AssetBrand | undefined;
  isEdit?: boolean;
};

export default function AssetBrandForm({
  currentAssetBrand,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      assetBrandId: currentAssetBrand?.assetBrandId || "",
      assetBrandName: currentAssetBrand?.assetBrandName || "",
      description: currentAssetBrand?.description || "",
    }),
    [currentAssetBrand]
  );

  const responseMessage = useSelector((state) => state.assetBrandSlice.message);

  const responseError = useSelector((state) => state.assetBrandSlice.error);

  useEffect(() => {
    if (isEdit && currentAssetBrand) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentAssetBrand]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setAssetBrandMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setAssetBrandError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesPropsAssetBrand>({
    //@ts-ignore
    resolver: yupResolver(assetBrandValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState } = methods;

  const handleCreateAssetBrand = async (data: FormValuesPropsAssetBrand) => {
    try {
      await createAssetBrand(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.assetBrand.list);
    } catch (error: any) {}
  };

  const handleUpdateAssetBrand = async (data: FormValuesPropsAssetBrand) => {
    try {
      await updateAssetBrand(currentAssetBrand?.uId, data);
      router.push(PATH_DASHBOARD.assetBrand.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.assetBrand.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateAssetBrand)
          : handleSubmit(handleUpdateAssetBrand)
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
            aria-controls="Asset Brand Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Asset Brand Details
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
            <RHFTextField name="assetBrandId" label="Code*" />
            <RHFTextField name="assetBrandName" label="Name*" />
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
