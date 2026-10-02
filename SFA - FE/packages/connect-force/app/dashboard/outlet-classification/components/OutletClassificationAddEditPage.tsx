"use client";

import { OutletClassification } from "connect-force-api-client/models/outlet-classification";
import { useSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { outletClassificationValidationSchema } from "@/utils/schemas/outletClassificationSchema";
import {
  createOutletClassification,
  updateOutletClassification,
} from "@/service/outletClassification.service";
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
import { dispatch, useSelector } from "@/redux/store";
import {
  setOutletClassificationError,
  setOutletClassificationMessage,
} from "@/redux/slices/outlet-classification-slice";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";

type props = {
  currentOutletClassification?: OutletClassification | undefined;
  isEdit?: boolean;
};

export type FormValuesProps = {
  classificationID?: string | null;
  classification?: string | null;
  description?: string | null;
};

export default function OutletClassificationAddEditForm({
  currentOutletClassification,
  isEdit = false,
}: props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      classificationID: currentOutletClassification?.classificationID || "",
      classification: currentOutletClassification?.classification || "",
      description: currentOutletClassification?.description || "",
    }),
    [currentOutletClassification]
  );

  const responseMessage = useSelector(
    (state) => state.outletClassificationSlice.message
  );

  const responseError = useSelector(
    (state) => state.outletClassificationSlice.error
  );

  useEffect(() => {
    if (isEdit && currentOutletClassification) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, []);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setOutletClassificationMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setOutletClassificationError(null));
    }
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesProps>({
    //@ts-ignore
    resolver: yupResolver(outletClassificationValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue } = methods;

  const handleCreateOutletClassification = async (data: FormValuesProps) => {
    try {
      await createOutletClassification(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.outletClassification.list);
    } catch (error: any) {}
  };

  const handleUpdateOutletClassification = async (data: FormValuesProps) => {
    try {
      await updateOutletClassification(currentOutletClassification?.uId, data);
      router.push(PATH_DASHBOARD.outletClassification.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.outletClassification.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateOutletClassification)
          : handleSubmit(handleUpdateOutletClassification)
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
              Outlet Classification Details
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
            <RHFTextField name="classificationID" label="Code*" />
            <RHFTextField name="classification" label="Name*" />
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
