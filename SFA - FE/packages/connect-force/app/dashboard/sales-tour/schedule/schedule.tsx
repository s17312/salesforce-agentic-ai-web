"use client";

import React, { useEffect, useMemo } from "react";
import FormProvider, {
  RHFAutocompleteField,
  RHFCheckbox,
  RHFTextField,
} from "@/components/hook-form";
import {
  Alert,
  Box,
  Button,
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
import {
  getTourDistributors,
  getTourRoutes,
  getTourSalesRep,
  getTourVehicles,
} from "@/service/tour-service/tourSchedule.service";
import { useSelector } from "@/redux/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { tourScheduleSchema } from "@/utils/schemas/tour/tourSheduleSchema";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import { format } from "date-fns";
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import MobileFriendlyRoundedIcon from '@mui/icons-material/MobileFriendlyRounded';

interface ScheduleRepTourProps {
  handleScheduleStart: (data: any) => void;
  schedule: any;
}

const ScheduleRepTour: React.FC<ScheduleRepTourProps> = ({
  handleScheduleStart,
  schedule,
}) => {
  const theme = useTheme();

  const distributors_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedule_Distributors
  );
  const rep_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedule_Rep
  );
  const routes_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedule_Routes
  );
  const vehicle_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedule_Vehicles
  );

  const defaultValues = useMemo(
    () => ({
      scheduleDate: schedule?.scheduleDate || "",
      distributorUId: schedule?.distributorUId || "",
      representativeUId: schedule?.representativeUId || "",
      routeUIds:
        schedule?.routeUIds?.replace(/,$/, "").split(",").map(Number) || [],
      vehicleUId: schedule?.vehicleUId || "",
      startMilage: schedule?.startMilage || "",
      driverName: schedule?.driverName || "",
      porterName: schedule?.porterName || "",
      targetValue: schedule?.targetValue || "",
      targetVolume: schedule?.targetVolume || "",
      isMobile: schedule?.isMobile || false,
    }),
    [schedule]
  );

  const methods = useForm<any>({
    // @ts-ignore
    resolver: yupResolver(tourScheduleSchema),
    defaultValues,
    mode: "all",
  });

  const { control, setValue, getValues, reset, handleSubmit } = methods;

  useWatch({
    control,
    name: [
      "scheduleDate",
      "distributorUId",
      "representativeUId",
      "routeUIds",
      "vehicleUId",
      "startMilage",
      "driverName",
      "porterName",
      "targetValue",
      "targetVolume",
      "isMobile",
    ],
  });

  const {
    scheduleDate,
    distributorUId,
    representativeUId,
    routeUIds,
    vehicleUId,
    startMilage,
    driverName,
    isMobile,
  } = getValues();

  useEffect(() => {
    fetchGetDistributors();
  }, []);

  useEffect(() => {
    if (distributorUId) {
      fetchGetSalesRep(distributorUId);
      reset((formValues: any) => ({
        ...formValues,
        representativeUId: undefined,
        vehicleUId: undefined
      }));

    } else {
      reset((formValues: any) => ({
        ...formValues,
        representativeUId: undefined,
        routeUIds: [],
        vehicleUId: undefined
      }));
      setValue("representativeUId", undefined);
      setValue("routeUIds", []);
      setValue("vehicleUId", undefined);
    }
  }, [distributorUId]);

  useEffect(() => {
    if (distributorUId && representativeUId) {
      fetchGetRoutes(representativeUId);
      fetchGetVehicles(distributorUId, representativeUId);
    } else {
      reset((formValues: any) => ({
        ...formValues,
        vehicleUId: undefined,
      }));
    }
  }, [representativeUId]);

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

  const fetchGetVehicles = async (distributorID: any, repID: any) => {
    try {
      await getTourVehicles(distributorID, repID);
    } catch (error) {
      enqueueSnackbar("Error fetching vehicles", { variant: "error" });
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
  const vehicleOptions = useMemo(
    () => mapListToOptions(vehicle_list, "plateNumber", "uId"),
    [vehicle_list, mapListToOptions]
  );

  const handleStart = () => {
    const data = getValues();
    const payLoad = {
      ...data,
      scheduleDate: format(new Date(data.scheduleDate), "yyyy-MM-dd"),
      porterName: data.porterName || "",
      targetValue: data.targetValue || 0,
      targetVolume: data.targetVolume || 0,
      isMobile: data.isMobile || false,
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
              Tour Details
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
                <RHFAutocompleteCheckboxField
                  name="routeUIds"
                  placeholder="Route*"
                  options={routesOptions}
                  control={control}
                  disabled={
                    !representativeUId ||
                    !distributorUId ||
                    schedule.statusUId !== 1
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <RHFAutocompleteField
                  name="vehicleUId"
                  placeholder="Vehicle*"
                  options={vehicleOptions}
                  control={control}
                  inputProps={{
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  disabled={
                    !representativeUId ||
                    !distributorUId ||
                    schedule.statusUId !== 1
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <RHFTextField
                  name="startMilage"
                  label="Start Mileage*"
                  type="number"
                  inputProps={{ min: 0 }}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "+" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  disabled={schedule.statusUId !== 1}
                />
              </Grid>
              {/* <Grid item xs={3}>
                <Box>
                  <RHFCheckbox name="isMobile" label="Is Mobile Tour" disabled={schedule.statusUId !== 1} />
                </Box>
              </Grid> */}
            </Grid>

            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
                mt: 4,
              }}
            >
              Driver Details
            </Typography>
            <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={3}>
                <RHFTextField
                  name="driverName"
                  label="Driver*"
                  disabled={schedule.statusUId !== 1}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFTextField
                  name="porterName"
                  label="Porter"
                  disabled={schedule.statusUId !== 1}
                />
              </Grid>
            </Grid>

            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
                mt: 4,
              }}
            >
              Target Details
            </Typography>
            <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={3}>
                <RHFTextField
                  name="targetValue"
                  label="Target Value"
                  type="number"
                  inputProps={{ min: 0 }}
                  disabled={schedule.statusUId !== 1}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "+" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFTextField
                  name="targetVolume"
                  label="Target Volume"
                  type="number"
                  inputProps={{ min: 0 }}
                  disabled={schedule.statusUId !== 1}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "+" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
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
              {(schedule.statusUId === 1 || schedule.statusUId === 7) ? (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ ml: 1 }}
                  disabled={
                    !distributorUId ||
                    !representativeUId ||
                    !routeUIds.length ||
                    !vehicleUId ||
                    !scheduleDate ||
                    !startMilage ||
                    !driverName
                  }
                  endIcon={
                    schedule.statusUId === 1 ? <PlayCircleOutlineRoundedIcon /> : < LocalShippingRoundedIcon />
                  }
                >
                  {schedule.statusUId === 1 ? "Start" : "Initiate Loading"}
                </Button>
              ) : (
                <Alert severity="success" icon={schedule.statusUId >= 8 ? <MobileFriendlyRoundedIcon /> : null}>
                  {schedule.statusUId >= 8 ? "This mobile tour schedule has been created" : "This tour schedule has been started"}
                </Alert>
              )}
            </Box>
          </Box>
        </CardContent>
      </FormProvider>
    </Card>
  );
};

export default ScheduleRepTour;
