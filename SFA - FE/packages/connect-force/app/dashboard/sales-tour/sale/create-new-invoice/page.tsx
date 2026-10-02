"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import DescriptionIcon from "@mui/icons-material/Description";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { useForm, useWatch } from "react-hook-form";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useSelector } from "@/redux/store";
import {
  getTourRoutes,
  getTourScheduleById,
} from "@/service/tour-service/tourSchedule.service";
import { enqueueSnackbar } from "notistack";
import { mapListToOptions } from "@/utils/sortUtils";
import { createNewSalesView } from "@/service/tour-service/sale.service";
import { getAllActivePaymentModes } from "@/service/paymentMode.service";
import { createValueSaleInvoiceView } from "@/service/value-sale/valueSaleinvoice.service";
import { getAllOutletsByRouteIdIsTrue } from "@/service/mapping-service/routeOutlet.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { saleInvoiceSchema } from "@/utils/schemas/saleInvoiceSchema";

const CreateNewInvoiceJourny = ({
  params,
}: {
  params: { scheduleId: number };
}) => {
  const theme = useTheme();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const scheduleData = useSelector(
    (state) => state.tourScheduleSlice.TourScheduleById
  );
  const routes_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedule_Routes
  );
  const outlets_list = useSelector(
    (state) => state.routeOutletsSlice.routeOutletsIsTrue
  );
  const paymentModeList = useSelector(
    (state) => state.paymentModeSlice.paymentModes
  );

  const searchParams = useSearchParams();
  const scheduleId = Number(searchParams.get("scheduleId"));

  const methods = useForm<any>({
    // @ts-ignore
    resolver: yupResolver(saleInvoiceSchema),
    mode: "all",
  });

  const { control, setValue, getValues, reset } = methods;

  useWatch({
    control,
    name: ["routeUid", "outletUid", "paymentTypeUid"],
  });

  useEffect(() => {
    fetchGetTourScheduleById();
    fetchGetAllActivePaymentModes();
  }, []);

  useEffect(() => {
    if (scheduleData?.representativeUId) {
      fetchGetRoutes(scheduleData?.representativeUId);
    }
  }, [scheduleData]);

  let invoiceDate = new Date();
  let distributorUId = scheduleData?.distributorUId;
  let repUId = scheduleData?.representativeUId;
  let routeUId = getValues("routeUid");
  let outletUId = getValues("outletUid");
  let paymentTypeUId = getValues("paymentTypeUid");

  useEffect(() => {
    if (routeUId) {
      fetchOutletOptionsFrom(distributorUId, repUId, routeUId);
    }
    reset({
      ...getValues(),
      outletUid: null,
    },
    {
        keepErrors: true,
        keepDirty: true,
        keepTouched: true,
      });
  }, [routeUId]);

  const fetchGetTourScheduleById = async () => {
    try {
      await getTourScheduleById(scheduleId);
    } catch (error) {
      enqueueSnackbar("Error fetching schedule data", { variant: "error" });
    }
  };

  const fetchGetRoutes = async (repID: any) => {
    try {
      await getTourRoutes(repID);
    } catch (error) {
      enqueueSnackbar("Error fetching routes", { variant: "error" });
    }
  };

  const fetchOutletOptionsFrom = async (
    distributorId: number,
    repId: number,
    routeId: number
  ) => {
    try {
      await getAllOutletsByRouteIdIsTrue(routeId);
    } catch (error) {
      console.error("Error fetching outlet list:", error);
    }
  };

  const fetchGetAllActivePaymentModes = async () => {
    await getAllActivePaymentModes();
  };

  const routesOptions = useMemo(
    () => mapListToOptions(routes_list, "routeName", "routeUId"),
    [routes_list, mapListToOptions]
  );
  const outletOptions = useMemo(
    () => mapListToOptions(outlets_list, "name", "outletUId"),
    [outlets_list, mapListToOptions]
  );
  const paymentModeOptions = useMemo(
    () => mapListToOptions(paymentModeList, "paymentModeType", "uId"),
    [paymentModeList, mapListToOptions]
  );

  const handleAddNewInvoice = async () => {
    const payload = {
      salesDate: invoiceDate,
      tourScheduleUId: scheduleData?.uId,
      invoiceIDOrLostCallID: null,
      paymentModeUId: paymentTypeUId,
      manualInvoiceNumber: null,
      repUId: repUId,
      routeUId: routeUId,
      outletUId: outletUId,
      invoiceAmount: 0,
      discountAmount: 0,
      returnAmount: 0,
      totalAmount: 0,
      saleStatus: 0,
      saleInvoiceTypeUId: 2,
    };

    try {
      const resMsg = await createValueSaleInvoiceView(payload);
      enqueueSnackbar(resMsg, { variant: "success" });
      router.push(`${PATH_DASHBOARD.salesTour.salesTour}/${scheduleId}`);
    } catch (error) {
      enqueueSnackbar("Error creating new sales view", { variant: "error" });
    }
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Add Sales Invoice"
        pageNavigation={[
          {
            pageName: "Sales Tour - Sales",
            path: `${PATH_DASHBOARD.salesTour.salesTour}/${scheduleId}`,
          },
          { pageName: "Sales Invoice" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<DescriptionIcon sx={{ color: theme.palette.primary.main }} />}
      />

      <Container>
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          sx={{
            mb: 2,
            borderRadius: "9px",
            backgroundColor: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              flexDirection: "row-reverse",
              alignItems: "center",
              borderTopLeftRadius: "9px",
              borderTopRightRadius: "9px",
              borderBottomLeftRadius: expanded ? "0px" : "9px",
              borderBottomRightRadius: expanded ? "0px" : "9px",
              backgroundColor: "white",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
                ml: 1,
              }}
            >
              New Sales Invoice Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: "white",
              borderTopLeftRadius: expanded ? "0px" : "9px",
              borderTopRightRadius: expanded ? "0px" : "9px",
              borderBottomLeftRadius: "9px",
              borderBottomRightRadius: "9px",
            }}
          >
            <FormProvider methods={methods}>
              <CardContent
                sx={{ pt: "0px", pb: "24px", pl: "24px", pr: "24px" }}
              >
                <Box sx={{ width: "100%" }}>
                  <Divider sx={{ borderColor: "#e8eaef", mb: 2 }} />
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={3}>
                      <RHFDatePicker
                        name="invoiceDate"
                        label="Date*"
                        disableFuture={false}
                        disablePast={true}
                        disabled={true}
                        onChange={(date: any) => {
                          setValue("invoiceDate", date);
                        }}
                        format={
                          process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                        }
                        value={new Date()}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="distributorUid"
                        label="Distributor"
                        value={scheduleData.distributor?.distributorName}
                        disabled
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="salesRepUid"
                        label="Sales Rep"
                        value={scheduleData.representative?.name}
                        disabled
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFAutocompleteField
                        name="routeUid"
                        placeholder="Route*"
                        options={routesOptions}
                        control={control}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFAutocompleteField
                        name="outletUid"
                        placeholder="Outlet*"
                        options={outletOptions}
                        control={control}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFAutocompleteField
                        name="paymentTypeUid"
                        placeholder="Payment Type*"
                        options={paymentModeOptions}
                        control={control}
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
                      onClick={handleAddNewInvoice}
                      sx={{ ml: 1 }}
                      disabled={!routeUId || !outletUId || !paymentTypeUId}
                    >
                      Add new sales invoice
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </FormProvider>
          </AccordionDetails>
        </Accordion>
      </Container>
    </FsBox>
  );
};

export default CreateNewInvoiceJourny;
