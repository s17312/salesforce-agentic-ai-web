"use client";

import React, { useEffect, useMemo, useRef } from "react";
import FormProvider, {
  RHFAutocompleteField,
  RHFCheckbox,
  RHFTextField,
} from "@/components/hook-form";
import {
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

type FormValuesPropsAsset = {
  scheduleDate: Date;
  distributorUId: number | undefined;
  representativeUId: number | undefined;
  routeUIds: any[];
  vehicleUId: number | undefined;
  startMilage: number;
  driverName: string;
  porterName: string;
  targetValue: number;
  targetVolume: number;
  isMobile: boolean;
};

interface ScheduleRepTourProps {
  handleScheduleStart: (data: any) => void;
  isEdit?: boolean;
}

const ScheduleRepTourAdd: React.FC<ScheduleRepTourProps> = ({
  handleScheduleStart,
  isEdit = false,
}) => {
  const theme = useTheme();
  const hasSelectedDistributor = useRef(false);

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

  const methods = useForm<FormValuesPropsAsset>({
    // @ts-ignore
    resolver: yupResolver(tourScheduleSchema),
    mode: "all",
    defaultValues: { scheduleDate: new Date(), isMobile: false },
  });

  const { control, setValue, getValues, reset, handleSubmit, watch } = methods;

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
  } = getValues();

  useEffect(() => {
    fetchGetDistributors();
  }, []);

  useEffect(() => {
    if (distributorUId) {
      fetchGetSalesRep(distributorUId);
      if (hasSelectedDistributor.current) {
        reset((formValues: any) => ({
          ...formValues,
          representativeUId: undefined,
          routeUIds: [],
          vehicleUId: undefined,
          startMilage: null,
          driverName: "",
          porterName: "",
          targetValue: null,
          targetVolume: null,
        }));
        setValue("representativeUId", undefined);
        setValue("routeUIds", []);
        setValue("vehicleUId", undefined);
      }
      hasSelectedDistributor.current = true;
    } else {
      reset(
        (formValues: any) => ({
          ...formValues,
          representativeUId: undefined,
          routeUIds: [],
          vehicleUId: undefined,
          startMilage: null,
          driverName: "",
          porterName: "",
          targetValue: null,
          targetVolume: null,
        }),
        { keepErrors: true }
      );
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
      reset(
        (formValues: any) => ({
          ...formValues,
          routeUIds: [],
          vehicleUId: undefined,
          startMilage: "",
          driverName: "",
          porterName: "",
          targetValue: "",
          targetVolume: "",
        }),
        { keepErrors: true }
      );
    }
  }, [representativeUId]);

  useEffect(() => {
    setValue("routeUIds", []);
    setValue("vehicleUId", undefined);
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

  const handleCreateSchedule = () => {
    const data = getValues();
    const payload = {
      ...data,
      scheduleDate: new Date(data.scheduleDate),
      porterName: data.porterName || "",
      targetValue: data.targetValue || 0,
      targetVolume: data.targetVolume || 0,
    };

    handleScheduleStart(payload);
  };

  return (
    <Card sx={{ backgroundColor: "#fff", mb: 2 }}>
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(handleCreateSchedule)}
      >
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
                  disabled={!distributorUId}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFAutocompleteCheckboxField
                  name="routeUIds"
                  placeholder="Route*"
                  options={routesOptions}
                  control={control}
                  disabled={!representativeUId || !distributorUId}
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
                  disabled={!representativeUId || !distributorUId}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFTextField
                  name="startMilage"
                  label="Start Mileage*"
                  type="number"
                  inputProps={{ min: 0 }}
                  InputLabelProps={{
                    shrink: !!watch("startMilage"),
                  }}
                 onKeyDown={(e) => {
                    if (["-", "+", "e", "E", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData("text");
                    console.log(pasteData, 'pasteData');

                    if (/[eE\+\-\.]/.test(pasteData)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>
              {/* <Grid item xs={3}>
                <Box>
                  <RHFCheckbox name="isMobile" label="Is Mobile Tour" />
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
                  InputLabelProps={{
                    shrink: !!watch("driverName"),
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFTextField
                  name="porterName"
                  label="Porter"
                  InputLabelProps={{
                    shrink: !!watch("porterName"),
                  }}
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
                  InputLabelProps={{
                    shrink: !!watch("targetValue"),
                  }}
                  inputProps={{ min: 0 }}
                  onKeyDown={(e) => {
                    if (["-", "+", "e", "E", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData("text");
                    if (/[eE\+\-\.]/.test(pasteData)) {
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
                  InputLabelProps={{
                    shrink: !!watch("targetVolume"),
                  }}
                  inputProps={{ min: 0 }}
                  onKeyDown={(e) => {
                    if (["-", "+", "e", "E", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData("text");
                    if (/[eE\+\-\.]/.test(pasteData)) {
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
              >
                Create Schedule
              </Button>
            </Box>
          </Box>
        </CardContent>
      </FormProvider>
    </Card>
  );
};

export default ScheduleRepTourAdd;
