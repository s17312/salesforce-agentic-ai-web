"use client";

import { Route } from "connect-force-api-client/models/route";
import { useSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { useForm} from "react-hook-form";
import { routeValidationSchema } from "@/utils/schemas/routeSchema";
import { createRoute, updateRoute } from "@/service/route.service";
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
import { setRouteError, setRouteMessage } from "@/redux/slices/route-slice";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toInteger } from "lodash";


type props = {
  currentRoute?: Route | undefined;
  isEdit?: boolean;
};

export type FormValuesProps = {
  routeId?: string | null;
  routeName?: string | null;
  description?: string | null;
  startPoint?: string | null;
  endPoint?: string | null;
  distance: string;
  estimateTime?: string | null;
};

export default function RouteAddEditForm({
  currentRoute,
  isEdit = false,
}: props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      routeId: currentRoute?.routeId || "",
      routeName: currentRoute?.routeName || "",
      description: currentRoute?.description || "",
      startPoint: currentRoute?.startPoint || "",
      endPoint: currentRoute?.endPoint || "",
      distance: currentRoute?.distance || "",
      estimateTime: currentRoute?.estimateTime || "",
    }),
    [currentRoute]
  );

  const responseMessage = useSelector((state) => state.routeSlice.message);

  const responseError = useSelector((state) => state.routeSlice.error);

  useEffect(() => {
    if (isEdit && currentRoute) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, []);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setRouteMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setRouteError(null));
    }
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesProps>({
    //@ts-ignore
    resolver: yupResolver(routeValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue, getValues } = methods;

  const handleCreateRoute = async (data: FormValuesProps) => {
    try {
      await createRoute(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.route.list);
    } catch (error: any) {}
  };

  const handleUpdateRoute = async (data: FormValuesProps) => {
    try {
      await updateRoute(currentRoute?.uId, data);
      router.push(PATH_DASHBOARD.route.list);
    } catch (error: any) {}
  };

  const formatTime = (input: any) => {
    let currentValue = getValues("estimateTime");
    let value = input.value.replace(/[^0-9]/g, ""); // Remove all non-numeric characters
    if (value.length >= 3) {
      let hours = value.substring(0, 2);
      let minutes = value.substring(2, 4);
      if (minutes > 59) {
        hours = toInteger(hours) + Math.floor(minutes / 60);
        minutes = minutes % 60;
      }
      if (hours.toString().length == 1) {
        hours = "0" + hours;
      }
      value = hours + ":" + minutes;
    }

    if (currentValue != value)
      setValue("estimateTime", value, {
        shouldDirty: true,
        shouldValidate: true,
      });
  };

  const formatDistance = (input: any) => {
    let currentValue = getValues("distance");
    let value = input.value;

    // Remove any non-digit and non-decimal point characters
    value = value.replace(/[^0-9.]/g, "");

    // Allow zero, one, or two decimal places
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (currentValue != value) {
          setValue("distance", value, { shouldDirty: true, shouldValidate: true });
      }
      }
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.route.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateRoute)
          : handleSubmit(handleUpdateRoute)
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
              Route Details
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
            <RHFTextField name="routeId" label="Code*" />
            <RHFTextField name="routeName" label="Name*" />
            <RHFTextField name="startPoint" label="Start Point*" />
            <RHFTextField name="endPoint" label="End Point*" />
            <RHFTextField
              name="distance"
              label="Distance"
              onChange={(e) => formatDistance(e.target)}
            />
            <RHFTextField
              name="estimateTime"
              label="Estimate Time"
              onChange={(e) => formatTime(e.target)}
            />
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
