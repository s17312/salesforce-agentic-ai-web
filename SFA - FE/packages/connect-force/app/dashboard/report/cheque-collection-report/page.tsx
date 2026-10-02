"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllCompany } from "@/service/company.service";
import {
  getAllActiveOutletsByRoute,
  getAllActiveRepByDistriID,
  getAllActiveRouteByRepID,
  getAllChequeCollectionReportDetails,
  getDistributorsByCompanyUId,
} from "@/service/Report/cheque-collection-report.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { useChequeCollectionReportGenerate } from "./report/reportService";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import PeopleIcon from "@mui/icons-material/People";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import FormProvider, { RHFAutocompleteField } from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import ChequeCollectionReportTable from "./components/chequeCollectionReportTable";
import PopupResponse from "@/components/popup/popup-response";
import ChequeCollectionReportDialog from "./components/chequeCollectionReportDialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { chequeCollectionValidationSchema } from "@/utils/schemas/chequeCollectionValidationSchema";

const ChequeCollectionReport = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const theme = useTheme();

  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const today = new Date();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [chequeDate, setChequeDate] = useState<Date | null>(null);
  const [isCompanySelected, setIsCompanySelected] = useState(false);
  const [isDistributorSelected, setIsDistributorSelected] = useState(false);
  const [isTourTypeSelected, setIsTourTypeSelected] = useState(false);
  const [isRepresentativeSelected, setIsRepresentativeSelected] =
    useState(false);
  const [isRouteSelected, setIsRouteSelected] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDownError, setServerDownError] = useState(false);

  const companyList = useSelector((state) => state.companySlice.companies);
  const distributorList = useSelector(
    (state) => state.chequeCollectionReportSlice.distributorView
  );
  const representativeList = useSelector(
    (state) => state.chequeCollectionReportSlice.repBydistri
  );
  const routeList = useSelector(
    (state) => state.chequeCollectionReportSlice.activeRoutes
  );
  const outletList = useSelector(
    (state) => state.chequeCollectionReportSlice.activeOutlets
  );
  const chequeCollectionDetails = useSelector(
    (state) => state.chequeCollectionReportSlice.chequeCollectionDetails
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const methods = useForm<any>({
    resolver: yupResolver(chequeCollectionValidationSchema),
    mode: "all",
    defaultValues: {
      fromDate: today,
      toDate: today,
      chequeDate: null,
      tourTypes: [],
      companyUId: "",
      distributorUId: "",
    },
  });
  const { control, getValues, reset, setValue } = methods;

  useWatch({
    control,
    name: [
      "companyUId",
      "distributorUId",
      "representativeUId",
      "routeUId",
      "outletUId",
    ],
  });

  const watchedFromDate = useWatch({ control, name: "fromDate" });
  const watchedToDate = useWatch({ control, name: "toDate" });
  const tourTypes = useWatch({ control, name: "tourTypes" });
  let companyId = getValues("companyUId");
  let distributorId = getValues("distributorUId");
  let representativeId = getValues("representativeUId");
  let routeId = getValues("routeUId");
  let outletId = getValues("outletUId");
  const watchedChequeDate = useWatch({ control, name: "chequeDate" });

  const fetchCompanyData = async () => {
    try {
      await getAllCompany(undefined, undefined, undefined, "uId", "desc", true);
    } catch (error) {
      console.error("error", error);
    }
  };

  // distributorOptions
  const fetchDistributorData = async (companyId: any) => {
    try {
      await getDistributorsByCompanyUId(companyId);
    } catch (error) {
      console.error("error", error);
    }
  };

  //fetch Representative Options
  const fetchRepOptions = async (distributorId: number) => {
    try {
      await getAllActiveRepByDistriID(distributorId);
    } catch (error) {
      console.error("Error fetching rep options:", error);
    }
  };

  //fetch Representative Options
  const fetchRouteOptions = async (
    distributorId: number,
    representativeId: number
  ) => {
    try {
      await getAllActiveRouteByRepID(distributorId, representativeId);
    } catch (error) {
      console.error("Error fetching route options:", error);
    }
  };

  //fetch Outlet Options
  const fetchOutletOptions = async (routeId: number) => {
    try {
      await getAllActiveOutletsByRoute(routeId);
    } catch (error) {
      console.error("Error fetching outlet options:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchDistributorData(companyId);
    }
  }, [companyId]);

  useEffect(() => {
    if (distributorId) {
      fetchRepOptions(distributorId);
    }
  }, [distributorId]);

  useEffect(() => {
    if (representativeId) {
      fetchRouteOptions(distributorId, representativeId);
    }
  }, [representativeId]);

  useEffect(() => {
    if (routeId) {
      fetchOutletOptions(routeId);
    }
  }, [routeId]);

  useEffect(() => {
    setIsTourTypeSelected(tourTypes && tourTypes.length > 0);
  }, [tourTypes]);

  useEffect(() => {
    setIsSearchClicked(false);
  }, [outletId, tourTypes, chequeDate]);

  const mapListToOptions = useCallback(
    (list: any[], labelKey: string, valueKey: string) =>
      list.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      })),
    []
  );

  const companiesOptions = useMemo(
    () => mapListToOptions(companyList, "companyName", "uId"),
    [companyList, mapListToOptions]
  );
  const distributorsOptions = useMemo(
    () =>
      mapListToOptions(distributorList, "distributorName", "distributorUId"),
    [distributorList, mapListToOptions]
  );
  const representativeOptions = useMemo(
    () => mapListToOptions(representativeList, "name", "uId"),
    [representativeList, mapListToOptions]
  );
  const routeOptions = useMemo(
    () => mapListToOptions(routeList, "routeName", "uId"),
    [routeList, mapListToOptions]
  );
  const outletOptions = useMemo(
    () => mapListToOptions(outletList, "name", "outletUId"),
    [outletList, mapListToOptions]
  );
  const tourTypesOptions = [
    { label: "Product Based Tour", value: 1 },
    { label: "Value Based Tour", value: 2 },
  ];

  const calculateColumnSum = (rows: any, field: any) => {
    return rows
      ?.reduce((acc: any, row: any) => acc + (row[field] || 0), 0);
  };

  const rowsWithTotal = useMemo(() => {
    if (!Array.isArray(chequeCollectionDetails)) {
      console.error(
        "cheque collection details is not an array:",
        chequeCollectionDetails
      );
      return [];
    }

    // Group by scheduleDate
    const groupedData = chequeCollectionDetails.reduce(
      (acc: any, item: any) => {
        const tourScheduleId = item.tourScheduleUId || "Unknown Tour Schedule";
        if (!acc[tourScheduleId]) acc[tourScheduleId] = [];
        acc[tourScheduleId].push(item);
        return acc;
      },
      {}
    );

    let finalRows: any[] = [];
    let grandTotals = {
      invoiceAmount: 0,
      paidAmount: 0,
      // balanceAmount: 0,
    };

    Object.keys(groupedData).forEach((date) => {
      const rows = groupedData[date];

      // Calculate subtotal for this date
      const subTotal = {
        id: `subtotal-${date}`,
        tourScheduleUId: `Subtotal - ${date}`,
        invoiceDate: "Sub Total",
        invoiceAmount: calculateColumnSum(rows, "invoiceAmount"),
        paidAmount: calculateColumnSum(rows, "paidAmount"),
        // balanceAmount: calculateColumnSum(rows, "balanceAmount")
      };

      // Add regular rows
      finalRows = [
        ...finalRows,
        ...rows.map((row: any, index: any) => ({
          ...row,
          invoiceDate:
            row.invoiceDate && !isNaN(Date.parse(row.invoiceDate))
              ? new Date(row.invoiceDate).toLocaleDateString()
              : row.invoiceDate,
          id: `${row.tourScheduleUId}-${index}`,
        })),
      ];

      // Add subtotal row
      finalRows.push(subTotal);

      // Add to grand total
      Object.keys(grandTotals).forEach((key) => {
        grandTotals[key as keyof typeof grandTotals] +=
          parseFloat(subTotal[key as keyof typeof grandTotals]) || 0;
      });
    });

    // Add Grand Total row at the end
    finalRows.push({
      id: "grand-total",
      tourScheduleUId: "Grand Total",
      invoiceDate: "Grand Total",
      invoiceAmount: grandTotals.invoiceAmount,
      paidAmount: grandTotals.paidAmount,
      // balanceAmount: grandTotals.balanceAmount.toFixed(2),
    });

    return finalRows;
  }, [chequeCollectionDetails]);

  useEffect(() => {
    // Avoid infinite loop by checking if the value is different
    if (watchedFromDate && watchedFromDate !== fromDate) {
      setFromDate(watchedFromDate);
    }
    if (watchedToDate && watchedToDate !== toDate) {
      setToDate(watchedToDate);
    }
    if (watchedChequeDate && watchedChequeDate !== chequeDate) {
      setChequeDate(watchedChequeDate);
    }
  }, [watchedFromDate, watchedToDate, watchedChequeDate]);

  const handleCompanyChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const currentFromDate = getValues("fromDate");
    const currentToDate = getValues("toDate");
    const tourTypes = getValues("tourTypes");
    if (selectedCompany) {
      setIsCompanySelected(true);
      setIsDistributorSelected(false);
      setIsRepresentativeSelected(false);
      setIsRouteSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: null,
        representativeUId: null,
        routeUId: null,
        outletUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsCompanySelected(false);
      setIsDistributorSelected(false);
      setIsRepresentativeSelected(false);
      setIsRouteSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: null,
        distributorUId: null,
        representativeUId: null,
        routeUId: null,
        outletUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    }
  };

  const handleDistributorChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    const currentFromDate = getValues("fromDate");
    const currentToDate = getValues("toDate");
    const tourTypes = getValues("tourTypes");
    if (selectedDistributor) {
      setIsDistributorSelected(true);
      setIsRepresentativeSelected(false);
      setIsRouteSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        representativeUId: null,
        routeUId: null,
        outletUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsDistributorSelected(false);
      setIsRepresentativeSelected(false);
      setIsRouteSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: null,
        representativeUId: null,
        routeUId: null,
        outletUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    }
  };

  const handleRepresentativeChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    const selectedRepresentative = getValues("representativeUId");
    const currentFromDate = getValues("fromDate");
    const currentToDate = getValues("toDate");
    const tourTypes = getValues("tourTypes");
    if (selectedRepresentative) {
      setIsRepresentativeSelected(true);
      setIsRouteSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        representativeUId: selectedRepresentative,
        routeUId: null,
        outletUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsRepresentativeSelected(false);
      setIsRouteSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        representativeUId: null,
        routeUId: null,
        outletUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    }
  };

  const handleRouteChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    const selectedRepresentative = getValues("representativeUId");
    const selectedRoute = getValues("routeUId");
    const currentFromDate = getValues("fromDate");
    const currentToDate = getValues("toDate");
    const tourTypes = getValues("tourTypes");
    if (selectedRoute) {
      setIsRouteSelected(true);
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        representativeUId: selectedRepresentative,
        routeUId: selectedRoute,
        outletUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsRouteSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        representativeUId: selectedRepresentative,
        routeUId: null,
        outletUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    }
  };

  const handleReset = () => {
    setIsSearchClicked(false);
    setIsCompanySelected(false);
    setIsDistributorSelected(false);
    reset({
      companyUId: null,
      distributorUId: null,
      representativeUId: null,
      vehicleUId: null,
    });
  };

  const handleSearch = () => {
    fetchAllChequeCollectionReportDetails();
    setIsSearchClicked(true);
  };

  const fetchAllChequeCollectionReportDetails = async () => {
    setIsLoading(true);
    let tourTypes = getValues("tourTypes");

    const mappedTourTypes = tourTypes
      ?.map((type: number) =>
        type === 1 ? "product" : type === 2 ? "value" : null
      )
      .filter(Boolean);

    const formatDateToLocal = (date: Date | null) => {
      if (!date) return "";
      const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust for timezone
      return offsetDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    };

    const requestData = {
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
      toDate: toDate ? toDate.toISOString().split("T")[0] : "",
      distributorUIds: distributorId ? [distributorId] : [],
      tourTypes: mappedTourTypes,
      representativeUIds: representativeId ? [representativeId] : [],
      routeUIds: routeId ? [routeId] : [],
      outletUIds: outletId ? [outletId] : [],
      chequeDate: formatDateToLocal(chequeDate),
    };
    
    try {
      await getAllChequeCollectionReportDetails(requestData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const { chequeCollectionReportInfo, fileName, open, setOpen, handleClose } =
    useChequeCollectionReportGenerate(
      getValues,
      companiesOptions,
      distributorsOptions,
      representativeOptions,
      routeOptions,
      outletOptions,
      tourTypesOptions
    );

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };
  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Cheque Collection Report"
        pageNavigation={[
          {
            pageName: "Cheque Collection Report",
          },
          { pageName: "View" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <Accordion
          expanded={expand1}
          onChange={() => setExpand1(!expand1)}
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
              borderBottomLeftRadius: expand1 ? "0px" : "9px",
              borderBottomRightRadius: expand1 ? "0px" : "9px",
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
              Cheque Collection Report
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: "white",
              borderTopLeftRadius: expand1 ? "0px" : "9px",
              borderTopRightRadius: expand1 ? "0px" : "9px",
              borderBottomLeftRadius: "9px",
              borderBottomRightRadius: "9px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
              <FormProvider methods={methods}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={3}>
                    <RHFDatePicker
                      name="fromDate"
                      label="From Date*"
                      disableFuture={true}
                      onChange={(date: any) => {
                        setValue("fromDate", date);
                      }}
                      format={
                        process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                      }
                      value={fromDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFDatePicker
                      name="toDate"
                      label="To Date*"
                      disableFuture={true}
                      onChange={(date: any) => {
                        setValue("toDate", date);
                      }}
                      format={
                        process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                      }
                      value={toDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteCheckboxField
                      name="tourTypes"
                      placeholder="Tour Type*"
                      // @ts-ignore
                      control={control}
                      options={tourTypesOptions}
                      rules={{ required: "Tour Type is required" }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="companyUId"
                      placeholder="Company*"
                      options={companiesOptions}
                      control={control}
                      onChange={handleCompanyChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="distributorUId"
                      placeholder="Distributor*"
                      // @ts-ignore
                      options={distributorsOptions}
                      control={control}
                      onChange={handleDistributorChange}
                      disabled={!isCompanySelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="representativeUId"
                      placeholder="Representative"
                      // @ts-ignore
                      options={representativeOptions}
                      control={control}
                      onChange={handleRepresentativeChange}
                      disabled={!isDistributorSelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="routeUId"
                      placeholder="Route"
                      // @ts-ignore
                      options={routeOptions}
                      control={control}
                      onChange={handleRouteChange}
                      disabled={!isRepresentativeSelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteCheckboxField
                      name="outletUId"
                      placeholder="Outlet"
                      // @ts-ignore
                      options={outletOptions}
                      control={control}
                      disabled={!isRouteSelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFDatePicker
                      name="chequeDate"
                      label="Cheque Date"
                      onChange={(date: any) => {
                        setValue("chequeDate", date);
                      }}
                      format={
                        process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                      }
                      value={chequeDate || null}
                      renderInput={(params) => <TextField {...params} />}
                      disabled={!isDistributorSelected}
                    />
                  </Grid>
                </Grid>
              </FormProvider>
              <Divider sx={{ borderColor: "#e8eaef", mt: 1, mb: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                  disabled={!isCompanySelected}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{ ml: 1 }}
                  startIcon={<VisibilityIcon />}
                  disabled={
                    !isCompanySelected || !distributorId || !isTourTypeSelected
                  }
                >
                  View Data
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <ChequeCollectionReportTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          chequeCollectionReportInfo={chequeCollectionReportInfo}
          expand={expand1}
        />
      </Container>
      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
      <ChequeCollectionReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithTotal}
        chequeCollectionReportInfo={chequeCollectionReportInfo}
        fileName={fileName}
        reportName="Cheque Collection Report"
      />
    </FsBox>
  );
};

export default ChequeCollectionReport;
