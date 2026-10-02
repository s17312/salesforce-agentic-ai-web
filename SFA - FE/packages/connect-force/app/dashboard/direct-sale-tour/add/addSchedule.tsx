"use client";

import React, { useEffect, useMemo, useRef } from "react";
import FormProvider, {
    RHFAutocompleteField,
} from "@/components/hook-form";
import {
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
import { LoadingButton } from "@mui/lab";
import { tourScheduleDirectSaleSchema } from "@/utils/schemas/tour/tourScheduleDirectSaleSchema";
import { getAllActiveOutletsByDistributorRepRoute, getTourDistributors, getTourRoutes, getTourSalesRep } from "@/service/direct-sale/tourSchedule.service";

type FormValuesPropsAsset = {
    scheduleDate: Date;
    distributorUId: number | undefined;
    representativeUId: number | undefined;
    routeUIds: number | undefined;
    outletUId: number | undefined;
};

interface ScheduleDirectSaleTourProps {
    handleScheduleStart: (data: any) => void;
    isEdit?: boolean;
}

const ScheduleDirectSaleTourAdd: React.FC<ScheduleDirectSaleTourProps> = ({
    handleScheduleStart,
    isEdit = false,
}) => {
    const theme = useTheme();
    const hasSelectedDistributor = useRef(false);

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

    const methods = useForm<FormValuesPropsAsset>({
        // @ts-ignore
        resolver: yupResolver(tourScheduleDirectSaleSchema),
        mode: "all",
        defaultValues: { scheduleDate: new Date() },
    });

    const { control, setValue, getValues, reset, handleSubmit, watch, formState } = methods;

    useWatch({
        control,
        name: [
            "scheduleDate",
            "distributorUId",
            "representativeUId",
            "routeUIds",
            "outletUId"
        ],
    });

    const {
        scheduleDate,
        distributorUId,
        representativeUId,
        routeUIds,
        outletUId
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
                    routeUIds: undefined,
                    outletUId: undefined,
                }));
                setValue("representativeUId", undefined);
                setValue("routeUIds", undefined);
                setValue("outletUId", undefined);
            }
            hasSelectedDistributor.current = true;
        } else {
            reset(
                (formValues: any) => ({
                    ...formValues,
                    representativeUId: undefined,
                    routeUIds: undefined,
                    outletUId: undefined,
                }),
                { keepErrors: true }
            );
            setValue("representativeUId", undefined);
            setValue("routeUIds", undefined);
            setValue("outletUId", undefined);
        }
    }, [distributorUId]);

    useEffect(() => {
        if (distributorUId && representativeUId) {
            fetchGetRoutes(representativeUId);
        } else {
            reset(
                (formValues: any) => ({
                    ...formValues,
                    routeUIds: undefined,
                    outletUId: undefined,
                }),
                { keepErrors: true }
            );
        }
    }, [representativeUId]);

    useEffect(() => {
        setValue("routeUIds", undefined);
        setValue("outletUId", undefined);
    }, [representativeUId]);

    useEffect(() => {
        if (distributorUId && representativeUId && routeUIds) {
            fetchGetOutlets(distributorUId, representativeUId, routeUIds);
        } else {
            if (!routeUIds) {
                setValue("outletUId", undefined);
            }
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

    const handleCreateSchedule = () => {
        const data = getValues();
        const payload = {
            ...data,
            scheduleDate: new Date(data.scheduleDate),
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
                            Direct Sale Details
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
                                <RHFAutocompleteField
                                    name="routeUIds"
                                    placeholder="Route*"
                                    options={routesOptions}
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
                                    disabled={!representativeUId || !distributorUId || !routeUIds}
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
                            <LoadingButton
                                variant="contained"
                                type="submit"
                                loading={formState.isSubmitting}
                                sx={{ ml: 1 }}
                                disabled={
                                    !distributorUId ||
                                    !representativeUId ||
                                    !routeUIds ||
                                    !outletUId ||
                                    !scheduleDate ||
                                    formState.isSubmitting
                                }
                            >
                                Create Invoice
                            </LoadingButton>
                        </Box>
                    </Box>
                </CardContent>
            </FormProvider>
        </Card>
    );
};

export default ScheduleDirectSaleTourAdd;
