import FormProvider from "@/components/hook-form/FormProvider";
import { PATH_DASHBOARD } from "@/routes/paths";
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
import RHFTextField from "@/components/hook-form/RHFTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createOutletStatus,
  updateOutletStatus,
} from "@/service/outletStatus.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { dispatch, useSelector } from "@/redux/store";
import {
  setOutletStatusError,
  setOutletStatusMessage,
} from "@/redux/slices/outlet-status-slice";
import { outletStatusValidationSchema } from "@/utils/schemas/outletStatusSchema";
import { OutletStatus } from "connect-force-api-client/models/outlet-status";

type Props = {
  currentOutletStatus?: OutletStatus | undefined;
  isEdit?: boolean;
};

export type FromValuesProps = {
  outletStatusID?: string;
  statusName?: string;
  description?: string;
};

export default function OutletStatusAddEditpage({
  currentOutletStatus,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      outletStatusID: currentOutletStatus?.outletStatusID || "",
      statusName: currentOutletStatus?.statusName || "",
      description: currentOutletStatus?.description || "",
    }),
    [currentOutletStatus]
  );

  const methods = useForm<FromValuesProps>({
    //@ts-ignore
    resolver: yupResolver(outletStatusValidationSchema),
    defaultValues,
    mode: "all",
  });

  const responseMessage = useSelector(
    (state) => state.outletStatusSlice.message
  );

  const responseError = useSelector((state) => state.outletStatusSlice.error);

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.outletstatus.list);
  };

  const { handleSubmit, reset, formState } = methods;

  useEffect(() => {
    if (isEdit && currentOutletStatus) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentOutletStatus]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setOutletStatusMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setOutletStatusError(null));
    }
  }, [responseMessage, responseError]);

  const handleCreateOutletStatus = async (data: FromValuesProps) => {
    try {
      await createOutletStatus(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.outletstatus.list);
    } catch (error: any) {}
  };

  const handleUpdateOutletStatus = async (data: FromValuesProps) => {
    try {
      await updateOutletStatus(currentOutletStatus?.uId, data);
      router.push(PATH_DASHBOARD.outletstatus.list);
    } catch (error: any) {}
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateOutletStatus)
          : handleSubmit(handleUpdateOutletStatus)
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
            aria-controls="Outlet Status Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Outlet Status Details
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
            <RHFTextField name="outletStatusID" label="Code*" />
            <RHFTextField name="statusName" label="Name*" />
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
