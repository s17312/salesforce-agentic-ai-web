"use client";

import FormProvider, { RHFTextField } from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getOutletBalance } from "@/service/tour-service/invoicePayment.service";
import { getReturnInvoiceDetailsByReturnId } from "@/service/tour-service/return.service";
import {
  getPriceListTypesByOutlet,
  getSalesInvoiceByID,
  getTourScheduleById_sale,
} from "@/service/tour-service/sale.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import ReturnTable from "../components/returnTable";

export default function ReturnPage() {
  const theme = useTheme();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");
  const routeName = searchParams.get("routeName");
  const outlet = searchParams.get("outlet");
  const outletID = Number(searchParams.get("outletID"));
  const paymentMode = searchParams.get("paymentMode");
  const invoiceIDOrLostCallID = searchParams.get("invoiceIDOrLostCallID");
  const saleStatus = Number(searchParams.get("saleStatus"));

  const [isLoading, setIsLoading] = useState(false);
  const tourSaleData = useSelector(
    (state) => state.tourSalesInvoiceSlice.TourScheduleById_invoice
  );
  const priceListTypes = useSelector(
    (state) => state.tourSalesInvoiceSlice.SalesInvoicePriceListType
  );
  const existingSalesInvoice = useSelector(
    (state) => state.tourSalesInvoiceSlice.SalesInvoiceByID
  );
  const rowData = useSelector((state) => state.tourSalesSlice.TourSalesCall);

  const saleInvoiceHeader = existingSalesInvoice?.saleInvoiceHeader;
  const returnByInvoiceId = useSelector(
    (state) => state.tourSalesReturnSlice.ReturnByInvoiceId
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const rawDate = returnByInvoiceId?.saleInvoiceReturnHeader?.returnDate;
  const status = returnByInvoiceId?.saleInvoiceReturnHeader?.status;

  const formattedDate = rawDate
    ? new Date(new Date(rawDate).getTime() + 8 * 60 * 60 * 1000)
        .toISOString()
        .replace("Z", "")
        .slice(0, 21)
    : "";

  const defaultValues = useMemo(() => {
    const defaultPriceList = Array.isArray(priceListTypes)
      ? priceListTypes.find((item: any) => item.isDefaultId)
          ?.priceListTypeUId || 0
      : 0;

    return {
      invoiceDate: formattedDate || new Date(),
      invoiceIDOrLostCallID: invoiceIDOrLostCallID
        ? invoiceIDOrLostCallID
        : saleInvoiceHeader?.invoiceId,
      priceList: saleInvoiceHeader?.priceListTypeUId ?? defaultPriceList,
      manualInvoiceNumber: saleInvoiceHeader?.manualInvoiceNumber || null,
    };
  }, [existingSalesInvoice, priceListTypes]);

  const methods = useForm<any>({
    mode: "all",
    defaultValues,
  });

  const { control, setValue, getValues } = methods;

  useWatch({
    control,
    name: ["invoiceDate", "manualInvoiceNumber", "priceList"],
  });

  let invoiceIDFromStorage = localStorage.getItem("invoiceID");

  useEffect(() => {
    fetchExistingSalesInvoice();
    fetchTourScheduleID();
    fetchGetPriceListTypesByOutlet();
    fetchGetOutletBalance();
  }, []);

  useEffect(() => {
    const defaultPriceList = Array.isArray(priceListTypes)
      ? priceListTypes.find((item: any) => item.isDefaultId)
          ?.priceListTypeUId || 0
      : 0;

    if (saleInvoiceHeader?.priceListTypeUId) {
      setValue("priceList", saleInvoiceHeader?.priceListTypeUId);
    } else {
      setValue("priceList", defaultPriceList);
    }
  }, [priceListTypes, saleInvoiceHeader, setValue]);

  const fetchTourScheduleID = async () => {
    try {
      setIsLoading(true);
      await getTourScheduleById_sale(scheduleId);
    } catch (error) {
      enqueueSnackbar("Error fetching tour schedule", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGetPriceListTypesByOutlet = async () => {
    try {
      await getPriceListTypesByOutlet(outletID);
    } catch (error) {
      enqueueSnackbar("Error fetching price list types", { variant: "error" });
    }
  };

  const fetchGetOutletBalance = async () => {
    try {
      await getOutletBalance(outletID);
    } catch (error) {
      enqueueSnackbar("Error while fetching outlet balance", {
        variant: "error",
      });
    }
  };

  const fetchExistingSalesInvoice = async () => {
    try {
      await getSalesInvoiceByID(
        rowData.invoiceIDOrLostCallID
          ? rowData.invoiceIDOrLostCallID
          : invoiceIDFromStorage
      );
    } catch (error) {
      enqueueSnackbar("Error fetching existing sales invoice", {
        variant: "error",
      });
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

  let invoiceDate = getValues("invoiceDate");

  useEffect(() => {
    if (formattedDate) {
      setValue("invoiceDate", formattedDate);
    } else {
      setValue("invoiceDate", new Date());
    }
  }, [formattedDate, setValue]);

  const fetchGetReturnInvoiceDetails = async () => {
    try {
      await getReturnInvoiceDetailsByReturnId(
        invoiceIDOrLostCallID
          ? invoiceIDOrLostCallID
          : localStorage.getItem("invoiceID")
      );
    } catch (error) {
      enqueueSnackbar("Failed to fetch return invoice details", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchGetReturnInvoiceDetails();
  }, []);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Sales Invoice"
        pageNavigation={[
          {
            pageName: "Sales Tour - Sales",
            path: `${PATH_DASHBOARD.repTour.repTour}/${scheduleId}`,
          },
          { pageName: "Sales Invoice" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<DescriptionIcon sx={{ color: theme.palette.primary.main }} />}
      />
      {!isLoading ? (
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
                Sales Invoice Details
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
                        <RHFTextField
                          name="invoiceIDOrLostCallID"
                          label="Return ID"
                          value={
                            saleInvoiceHeader?.invoiceId ||
                            localStorage.getItem("invoiceID") ||
                            invoiceIDOrLostCallID
                          }
                          disabled
                          InputLabelProps={{
                            shrink: Boolean(
                              saleInvoiceHeader?.invoiceId ||
                                localStorage.getItem("invoiceID") ||
                                invoiceIDOrLostCallID
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        {/* @ts-ignore */}
                        <RHFDatePicker
                          name="invoiceDate"
                          label="Date*"
                          disableFuture={false}
                          disablePast={false}
                          onChange={(date: any) => {
                            setValue("invoiceDate", date);
                          }}
                          disabled={status === 2}
                          format={
                            process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <RHFTextField
                          name="distributor"
                          label="Distributor"
                          value={tourSaleData.distributor?.distributorName}
                          disabled
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <RHFTextField
                          name="salesRep"
                          label="Sales Rep"
                          value={tourSaleData.representative?.name}
                          disabled
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <RHFTextField
                          name="route"
                          label="Route"
                          value={routeName}
                          disabled
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <RHFTextField
                          name="outlet"
                          label="Outlet"
                          value={outlet}
                          disabled
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <RHFTextField
                          name="paymentType"
                          label="Payment Type"
                          value={paymentMode}
                          disabled
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </FormProvider>
            </AccordionDetails>
          </Accordion>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></Box>
          <ReturnTable
            distributorID={tourSaleData.distributorUId}
            invoiceIDOrLostCallID={rowData.invoiceIDOrLostCallID}
            isReturnOnly
            invoiceDate={invoiceDate}
          />
        </Container>
      ) : (
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "170px",
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      )}
    </FsBox>
  );
}
