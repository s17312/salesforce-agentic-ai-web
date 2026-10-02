"use client";

import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import { dispatch, useSelector } from "@/redux/store";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Tab,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import SaleTable from "./components/saleTable";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter, useSearchParams } from "next/navigation";
import DescriptionIcon from "@mui/icons-material/Description";
import { enqueueSnackbar } from "notistack";
import {
  getPriceListTypesByOutlet,
  getSaleInvoiceProducts,
  getSalesInvoiceByID,
  getTourScheduleById_sale,
  submitSale,
} from "@/service/tour-service/sale.service";
import SearchIcon from "@mui/icons-material/Search";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { mapListToOptions } from "@/utils/sortUtils";
import PaymentTable from "./components/paymentTable";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { getOutletBalance } from "@/service/tour-service/invoicePayment.service";
import ReturnTable from "./components/returnTable";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import DiscountTable from "./components/discountTable";
import { setReturnByInvoiceId } from "@/redux/slices/tour/tour-sales-return";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SaleSubmitPopup from "@/components/popup/SaleSubmitPopup";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import InvoiceSummeryPopup from "@/components/popup/InvoiceSummeryPopup";
import { disabledTourTabViewStyles } from "@/styles/tabViewStyles/tourTabViewStyles";
import InvoicePrintPopup from "@/components/popup/InvoicePrintPopup";
import ViewSaleTable from "./components/viewSaleTable";

const SalesInvoice = () => {
  const theme = useTheme();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [printIncoiceOpen, setPrintIncoiceOpen] = useState(false);
  const scheduleId = searchParams.get("scheduleId");
  const routeName = searchParams.get("routeName");
  const outlet = searchParams.get("outlet");
  const outletID = Number(searchParams.get("outletID"));
  const paymentMode = searchParams.get("paymentMode");
  const saleStatus = Number(searchParams.get("saleStatus"));
  const saleViewUId = searchParams.get("saleViewUId");

  const [tabValue, setTabValue] = useState("1");
  const [pageTitle, setPageTitle] = useState("Rep Route");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaleLoading, setIsSaleLoading] = useState(false);
  const [isSaleSubmitting, setIsSaleSubmitting] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const tourSaleData = useSelector(
    (state) => state.tourSalesInvoiceSlice.TourScheduleById_invoice
  );
  const priceListTypes = useSelector(
    (state) => state.tourSalesInvoiceSlice.SalesInvoicePriceListType
  );
  const outStandingAmount = useSelector(
    (state) => state.tourSalesPaymentSlice.outStanding
  );
  const existingSalesInvoice = useSelector(
    (state) => state.tourSalesInvoiceSlice.SalesInvoiceByID
  );
  const rowData = useSelector((state) => state.tourSalesSlice.TourSalesCall);

  useEffect(() => {
    dispatch(setReturnByInvoiceId({}));
  }, []);

  const saleInvoiceHeader = existingSalesInvoice?.saleInvoiceHeader;
  const saleInvoiceDetail = existingSalesInvoice?.saleInvoiceDetail;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const defaultValues = useMemo(() => {
    const defaultPriceList = Array.isArray(priceListTypes)
      ? priceListTypes.find((item: any) => item.isDefaultId)
        ?.priceListTypeUId || 0
      : 0;

    return {
      invoiceDate: saleInvoiceHeader?.invoiceDate,
      invoiceIDOrLostCallID: saleInvoiceHeader?.invoiceId || null,
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

  let invoiceDate = getValues("invoiceDate");

  const titles = {
    "1": "Sale",
    "2": "Discount",
    "3": "Return",
    "4": "Payment",
  };

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

  useEffect(() => {
    if (saleInvoiceHeader?.invoiceDate) {
      setValue("invoiceDate", saleInvoiceHeader.invoiceDate);
    }
  }, [saleInvoiceHeader?.invoiceDate, setValue]);

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

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
  };

  const handleSearch = () => {
    fetchProducts();
    setIsSearchClicked(true);
    setExpanded(false);
  };

  const fetchProducts = async () => {
    setIsSaleLoading(true);
    try {
      await getSaleInvoiceProducts(
        saleInvoiceHeader
          ? saleInvoiceHeader?.priceListTypeUId
          : getValues("priceList"),
        tourSaleData.vehicle.uId,
        Number(outletID)
      );
    } catch (error) {
      enqueueSnackbar("Error fetching products", { variant: "error" });
    } finally {
      setIsSaleLoading(false);
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

  const handleSubmitConfirmation = () => {
    setOpen(true);
  };

  const handleViewSummery = () => {
    setSummaryOpen(true);
  };

  const handlePrintInvoice = () => {
    setPrintIncoiceOpen(true);
  };

  const handleSubmitClick = async () => {
    setIsSaleSubmitting(true);
    try {
      const response = await submitSale(
        rowData?.tourSchedule.vehicleUId,
        saleViewUId
      );
      enqueueSnackbar(`${response.message}`, { variant: "success" });
      router.push(`${PATH_DASHBOARD.repTour.repTour}/${scheduleId}`);
    } catch (error) {
      enqueueSnackbar("Error updating sales invoice", { variant: "error" });
    } finally {
      setIsSaleSubmitting(false);
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

  const priceListTypesOptions = useMemo(() => {
    if (!Array.isArray(priceListTypes)) return [];

    return mapListToOptions(
      priceListTypes.filter((item: any) => item.priceListTypeName !== null),
      "priceListTypeName",
      "priceListTypeUId"
    );
  }, [priceListTypes, mapListToOptions]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "45vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
                          label="Invoice ID"
                          value={
                            saleInvoiceHeader?.invoiceId ||
                            localStorage.getItem("invoiceID")
                          }
                          disabled
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        {/* @ts-ignore */}
                        <RHFDatePicker
                          name="invoiceDate"
                          label="Date*"
                          disableFuture={true}
                          disablePast={false}
                          onChange={(date: any) => {
                            setValue("invoiceDate", date);
                          }}
                          format={
                            process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                          }
                          renderInput={(params) => <TextField {...params} />}
                          disabled={saleStatus == 2 || saleInvoiceDetail && saleInvoiceDetail.length > 0 ? true : false}
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
                      {tabValue !== "3" && (
                        <Grid item xs={3}>
                          <RHFAutocompleteField
                            name="priceList"
                            placeholder="Price List*"
                            options={priceListTypesOptions}
                            control={control}
                            inputProps={{
                              form: {
                                autocomplete: "off",
                              },
                            }}
                            disabled={existingSalesInvoice ? true : false}
                          />
                        </Grid>
                      )}
                      <Grid item xs={3}>
                        <RHFTextField
                          name="manualInvoiceNumber"
                          label="Manual Invoice Number"
                          disabled={saleStatus == 2}
                          value={
                            defaultValues.manualInvoiceNumber
                              ? defaultValues.manualInvoiceNumber
                              : null
                          }
                        />
                      </Grid>
                      {tabValue === "4" && (
                        <Grid item xs={3}>
                          <RHFTextField
                            name="outStanding"
                            label="Outstanding Balance"
                            value={outStandingAmount.outletBalance}
                            disabled
                          />
                        </Grid>
                      )}
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
                        variant="text"
                        onClick={handlePrintInvoice}
                        sx={{ ml: 1 }}
                        startIcon={<LocalPrintshopRoundedIcon />}
                        disabled={
                          saleStatus != 2 || existingSalesInvoice == null
                        }
                      >
                        Print Invoice
                      </Button>
                      <Button
                        variant="text"
                        onClick={handleViewSummery}
                        sx={{ ml: 1 }}
                        startIcon={<SummarizeIcon />}
                      >
                        Invoice summery
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{ ml: 1 }}
                        startIcon={<SearchIcon />}
                        disabled={
                          !getValues("priceList") || existingSalesInvoice
                        }
                      >
                        Search
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </FormProvider>
            </AccordionDetails>
          </Accordion>
          <TabContext value={tabValue}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TabList onChange={handleChange} aria-label="Sales Invoice Tabs">
                <Tab label="Sale" value="1" />
                <Tab
                  label="Discount"
                  value="2"
                  disabled={!invoiceIDFromStorage}
                  sx={disabledTourTabViewStyles}
                />
                <Tab
                  label="Return"
                  value="3"
                  disabled={!invoiceIDFromStorage}
                  sx={disabledTourTabViewStyles}
                />
                <Tab
                  label="Payment"
                  value="4"
                  disabled={
                    rowData.saleStatus === 1 || rowData.saleStatus == null
                  }
                  sx={disabledTourTabViewStyles}
                />
              </TabList>
              <LoadingButton
                variant="contained"
                color="primary"
                loading={isSaleSubmitting}
                startIcon={<ChecklistIcon />}
                disabled={saleStatus == 2 || existingSalesInvoice == null}
                onClick={handleSubmitConfirmation}
              >
                Submit Invoice
              </LoadingButton>
            </Box>
            {/**************** Sale *****************/}
            <TabPanel
              value="1"
              sx={{
                padding: 2,
                marginTop: 0,
                paddingBottom: 0,
              }}
            >
              {rowData?.saleStatus === 2 ?
                <ViewSaleTable saleInvoiceDetail={saleInvoiceDetail} />
                :
                <SaleTable
                  isSearchClicked={isSearchClicked}
                  setTabValue={setTabValue}
                  priceListTypeId={getValues("priceList")}
                  manualInvoiceNumber={getValues("manualInvoiceNumber")}
                  fetchProducts={fetchProducts}
                  invoiceID={rowData.invoiceIDOrLostCallID}
                  invoiceDate={invoiceDate}
                />
              }
            </TabPanel>
            {/**************** Discount *****************/}
            <TabPanel
              value="2"
              sx={{
                padding: 2,
                marginTop: 0,
                paddingBottom: 0,
              }}
            >
              <DiscountTable existingSalesInvoice={existingSalesInvoice} />
            </TabPanel>
            {/**************** Return *****************/}
            <TabPanel
              value="3"
              sx={{
                padding: 2,
                marginTop: 0,
                paddingBottom: 0,
              }}
            >
              <ReturnTable
                distributorID={tourSaleData.distributorUId}
                invoiceIDOrLostCallID={rowData.invoiceIDOrLostCallID}
              />
            </TabPanel>
            {/**************** Payment *****************/}
            <TabPanel
              value="4"
              sx={{
                padding: 2,
                marginTop: 0,
                paddingBottom: 0,
              }}
            >
              <PaymentTable />
            </TabPanel>
          </TabContext>
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
      <SaleSubmitPopup
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleSubmitClick}
        invoiceIDOrLostCallID={rowData.invoiceIDOrLostCallID}
        isSubmitting={isSaleSubmitting}
      />
      <InvoiceSummeryPopup
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        invoiceIDOrLostCallID={rowData.invoiceIDOrLostCallID}
      />
      <InvoicePrintPopup
        open={printIncoiceOpen}
        onClose={() => setPrintIncoiceOpen(false)}
        invoiceIDOrLostCallID={rowData.invoiceIDOrLostCallID}
        fileName={saleInvoiceHeader?.invoiceId}
        reportName="Sales Invoice"
      />
    </FsBox>
  );
};

export default SalesInvoice;
