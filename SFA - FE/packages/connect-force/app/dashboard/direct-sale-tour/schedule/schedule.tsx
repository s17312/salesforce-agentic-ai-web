"use client";

import React, { useEffect, useMemo } from "react";
import FormProvider, {
  RHFAutocompleteField,
} from "@/components/hook-form";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { mapListToOptions } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "@/redux/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { LoadingButton } from "@mui/lab";
import { tourScheduleDirectSaleSchema } from "@/utils/schemas/tour/tourScheduleDirectSaleSchema";
import { getAllActiveOutletsByDistributorRepRoute, getTourDistributors, getTourRoutes, getTourSalesRep } from "@/service/direct-sale/tourSchedule.service";

interface ScheduleDirectSaleTourProps {
  handleScheduleStart: (data: any) => void;
  schedule: any;
}

const ScheduleDirectSaleTour: React.FC<ScheduleDirectSaleTourProps> = ({
  handleScheduleStart,
  schedule,
}) => {
  const theme = useTheme();

  const distributors_list = useSelector(
    (state) => state.tourScheduleDirectSlice.TourSchedule_Distributors
  );
  const rep_list = useSelector(
    (state) => state.tourScheduleDirectSlice.TourSchedule_Rep
  );
  const routes_list = useSelector(
    (state) => state.tourScheduleDirectSlice.TourSchedule_Routes
  );
  const outlet_list = useSelector(
    (state) => state.tourScheduleDirectSlice.TourSchedule_Outlets
  );

  const defaultValues = useMemo(
    () => ({
      scheduleDate: schedule?.scheduleDate || "",
      distributorUId: schedule?.distributorUId || "",
      representativeUId: schedule?.representativeUId || "",
      routeUIds: schedule?.routeUIds ? Number(schedule.routeUIds) : "",
      outletUId: schedule?.outletUId || ""
    }),
    [schedule]
  );

  const methods = useForm<any>({
    // @ts-ignore
    resolver: yupResolver(tourScheduleDirectSaleSchema),
    defaultValues,
    mode: "all",
  });

  const { control, setValue, getValues, reset, handleSubmit, formState, watch } = methods;

  const scheduleDate = watch("scheduleDate");
  const distributorUId = watch("distributorUId");
  const representativeUId = watch("representativeUId");
  const routeUIds = watch("routeUIds");
  const outletUId = watch("outletUId");

  useEffect(() => {
    fetchGetDistributors();
  }, []);

  // 2. Load reps when distributor changes
  useEffect(() => {
    if (distributorUId) {
      fetchGetSalesRep(distributorUId);
    } else {
      setValue("representativeUId", "");
      setValue("routeUIds", "");
      setValue("outletUId", "");
    }
  }, [distributorUId]);

  // 3. Load routes when rep changes
  useEffect(() => {
    if (distributorUId && representativeUId) {
      fetchGetRoutes(representativeUId);
    }
  }, [representativeUId]);

  // 4. Load outlets when route changes
  useEffect(() => {
    if (distributorUId && representativeUId && routeUIds) {
      fetchGetOutlets(distributorUId, representativeUId, routeUIds);
    }
  }, [routeUIds, distributorUId, representativeUId]);

  const fetchGetDistributors = async () => {
    try {
      await getTourDistributors();
    } catch (error) {
      enqueueSnackbar("Error fetching distributors", { variant: "error" });
    }
  };

  const fetchGetSalesRep = async (distributorID: any) => {
    try {
      await getTourSalesRep(distributorID);
    } catch (error) {
      enqueueSnackbar("Error fetching sales rep", { variant: "error" });
    }
  };

  const fetchGetRoutes = async (repID: any) => {
    try {
      await getTourRoutes(repID);
    } catch (error) {
      enqueueSnackbar("Error fetching routes", { variant: "error" });
    }
  };

  const fetchGetOutlets = async (distributorID: any, repID: any, routeID: any) => {
    try {
      await getAllActiveOutletsByDistributorRepRoute(distributorID, repID, routeID);
    } catch (error) {
      enqueueSnackbar("Error fetching outlets", { variant: "error" });
    }
  };

  // AutoComplete options
  const distributorOptions = useMemo(
    () => mapListToOptions(distributors_list, "distributorName", "uId"),
    [distributors_list, mapListToOptions]
  );
  const repOptions = useMemo(
    () => mapListToOptions(rep_list, "name", "uId"),
    [rep_list, mapListToOptions]
  );
  const routesOptions = useMemo(
    () => mapListToOptions(routes_list, "routeName", "routeUId"),
    [routes_list, mapListToOptions]
  );
  const outletOptions = useMemo(
    () => mapListToOptions(outlet_list, "name", "uId"),
    [outlet_list, mapListToOptions]
  );

  const handleStart = () => {
    const data = {
        scheduleDate,
        distributorUId,
        representativeUId,
        routeUIds,
        outletUId
    };
    const payLoad = {
      ...data,
      scheduleDate: format(new Date(data.scheduleDate), "yyyy-MM-dd")
    };

    handleScheduleStart(payLoad);
  };

  return (
    <Card sx={{ backgroundColor: "#fff", mb: 2 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleStart)}>
        <CardContent>
          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
              }}
            >
              Direct Sale
            </Typography>
            <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={3}>
                <RHFDatePicker
                  name="scheduleDate"
                  label="Date*"
                  disableFuture={false}
                  disablePast={false}
                  onChange={(date: any) => {
                    setValue("scheduleDate", date);
                  }}
                  format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
                  value={null}
                  disabled={schedule.statusUId !== 1}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFAutocompleteField
                  name="distributorUId"
                  placeholder="Distributor*"
                  options={distributorOptions}
                  control={control}
                  inputProps={{
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  disabled={schedule.statusUId !== 1 || true}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFAutocompleteField
                  name="representativeUId"
                  placeholder="Sales Rep*"
                  options={repOptions}
                  control={control}
                  inputProps={{
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  disabled={!distributorUId || schedule.statusUId !== 1 || true}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFAutocompleteField
                  name="routeUIds"
                  placeholder="Route*"
                  options={routesOptions}
                  control={control}
                  disabled={
                    !representativeUId ||
                    !distributorUId ||
                    schedule.statusUId !== 1 || true
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <RHFAutocompleteField
                  name="outletUId"
                  placeholder="Outlet*"
                  options={outletOptions}
                  control={control}
                  inputProps={{
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  disabled={
                    !representativeUId ||
                    !distributorUId ||
                    !routeUIds ||
                    schedule.statusUId !== 1
                  }
                />
              </Grid>
            </Grid>

            <Divider sx={{ borderColor: "#e8eaef", mt: 1, mb: 1 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {schedule.statusUId === 1 ? (
                <LoadingButton
                  variant="contained"
                  loading={formState.isSubmitting}
                  type="submit"
                  sx={{ ml: 1 }}
                  disabled={
                    !distributorUId ||
                    !representativeUId ||
                    !routeUIds ||
                    !outletUId ||
                    !scheduleDate
                  }
                >
                  Create Invoice
                </LoadingButton>
              ) : (
                <Alert severity="success">
                  This schedule has been started
                </Alert>
              )}
            </Box>
          </Box>
        </CardContent>
      </FormProvider>
    </Card>
  );
};

export default ScheduleDirectSaleTour;
