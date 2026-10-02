import FormProvider, { RHFTextField } from "@/components/hook-form";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setAssetTypeError,
  setAssetTypeMessage,
} from "@/redux/slices/asset-type-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { createAssetType, updateAssetType } from "@/service/assetType.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { AssetType, FormValuesPropsAssetType } from "@/types/assetType-types";
import { assetTypeValidationSchema } from "@/utils/schemas/assetTypeSchema";
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
  currentAssetType?: AssetType | undefined;
  isEdit?: boolean;
};

export default function AssetTypeForm({
  currentAssetType,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      assetTypeId: currentAssetType?.assetTypeId || "",
      assetTypeName: currentAssetType?.assetTypeName || "",
      description: currentAssetType?.description || "",
    }),
    [currentAssetType]
  );

  const responseMessage = useSelector((state) => state.assetTypeSlice.message);

  const responseError = useSelector((state) => state.assetTypeSlice.error);

  useEffect(() => {
    if (isEdit && currentAssetType) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentAssetType]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setAssetTypeMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setAssetTypeError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesPropsAssetType>({
    //@ts-ignore
    resolver: yupResolver(assetTypeValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState } = methods;

  const handleCreateAssetType = async (data: FormValuesPropsAssetType) => {
    try {
      await createAssetType(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.assetType.list);
    } catch (error: any) {}
  };

  const handleUpdateAssetType = async (data: FormValuesPropsAssetType) => {
    try {
      await updateAssetType(currentAssetType?.uId, data);
      router.push(PATH_DASHBOARD.assetType.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.assetType.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateAssetType)
          : handleSubmit(handleUpdateAssetType)
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
            aria-controls="Asset Type Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Asset Type Details
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
            <RHFTextField name="assetTypeId" label="Code*" />
            <RHFTextField name="assetTypeName" label="Name*" />
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
