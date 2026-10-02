"use client";

import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import FormProvider, { RHFAutocompleteField } from "@/components/hook-form";
import { useForm, useWatch } from "react-hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { useSelector } from "@/redux/store";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import { getAllCompany } from "@/service/company.service";
import {
  getAllActiveRepByDistriID,
  getAllLoadingUnloadingSummaryDetails,
  getDistributorsByCompanyUId,
  getPriceListsById,
  getTourVehicles,
} from "@/service/Report/loading-unloading-summary-report.service";
import LoadingUnloadingReportTable from "./components/loadingUnloadingSummaryReportTable";
import { useLoadingUnloadingSummaryReportGenerate } from "./report/reportService";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import LoadingUnloadingReportDialog from "./components/loadingUnloadingSummaryReportDialog";
import { loadingUnloadingValidationSchema } from "@/utils/schemas/loadingUnloadingReportValidationsSchema";
import { yupResolver } from "@hookform/resolvers/yup";

const LoadingUnloadingSummaryReport = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const theme = useTheme();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [expand1, setExpand1] = useState(true);
  const today = new Date();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [isCompanySelected, setIsCompanySelected] = useState(false);
  const [isDistributorSelected, setIsDistributorSelected] = useState(false);
  const [isRepSelected, setIsRepSelected] = useState(false);
  const [isTourTypeSelected, setIsTourTypeSelected] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDownError, setServerDownError] = useState(false);

  const companyList = useSelector((state) => state.companySlice.companies);
  const distributorList = useSelector(
    (state) => state.loadingUnloadingSummaryReportSlice.distributorView
  );
  const priceListTypeList = useSelector(
    (state) => state.loadingUnloadingSummaryReportSlice.priceListView
  );
  const representativeList = useSelector(
    (state) => state.loadingUnloadingSummaryReportSlice.repBydistri
  );
  const tourAssignedVehicleList = useSelector(
    (state) => state.loadingUnloadingSummaryReportSlice.tourAssignedVehicles
  );
  const loadingUnloadingSummaryDetails = useSelector(
    (state) =>
      state.loadingUnloadingSummaryReportSlice.loadingUnloadingSummaryDetails
  );

  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const methods = useForm<any>({
    resolver: yupResolver(loadingUnloadingValidationSchema),
    mode: "all",
    defaultValues: {
      fromDate: today,
      toDate: today,
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
      "vehicleUId",
      "priceListUId"
    ],
  });

  const watchedFromDate = useWatch({ control, name: "fromDate" });
  const watchedToDate = useWatch({ control, name: "toDate" });
  const tourTypes = useWatch({ control, name: "tourTypes" });
  let companyId = getValues("companyUId");
  let distributorId = getValues("distributorUId");
  let representativeId = getValues("representativeUId");
  let vehicleId = getValues("vehicleUId");
  let priceListId = getValues("priceListUId");

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

  // distributorOptions
  const fetchPriceListData = async (distributorId: any) => {
    try {
      await getPriceListsById(distributorId);
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
  const fetchVehicleOptions = async (distributorId: number, repID: number) => {
    try {
      await getTourVehicles(distributorId, repID);
    } catch (error) {
      console.error("Error fetching vehicle options:", error);
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
      fetchPriceListData(distributorId);
    }
  }, [distributorId]);

  useEffect(() => {
    if (distributorId != null && representativeId != null) {
      fetchVehicleOptions(distributorId, representativeId);
    }
  }, [representativeId]);

  useEffect(() => {
    setIsTourTypeSelected(tourTypes && tourTypes.length > 0);
  }, [tourTypes]);

  useEffect(() => {
    setIsSearchClicked(false);
  }, [vehicleId]);

  // const loadingUnloadingSummaryView = useMemo(() => {
  //   if (!Array.isArray(loadingUnloadingSummaryDetails)) {
  //     console.error(
  //       "loadingUnloadingSummaryDetails is not an array:",
  //       loadingUnloadingSummaryDetails
  //     );
  //     return [];
  //   }

  //   return loadingUnloadingSummaryDetails.map((item: any, index: number) => ({
  //     id: item.id ?? index + 1,
  //     ...item,
  //   }));
  // }, [loadingUnloadingSummaryDetails]);

  const calculateColumnSum = (rows: any, field: any) => {
    return rows
      ?.reduce((acc: any, row: any) => acc + (row[field] || 0), 0)
      .toFixed(2);
  };

  const rowsWithTotal = useMemo(() => {
    if (!Array.isArray(loadingUnloadingSummaryDetails)) {
      console.error(
        "loading unloading details is not an array:",
        loadingUnloadingSummaryDetails
      );
      return [];
    }

    // Group by scheduleDate
    const groupedData = loadingUnloadingSummaryDetails.reduce(
      (acc: any, item: any) => {
        const tourScheduleId = item.tourScheduleId || "Unknown Tour Schedule";
        if (!acc[tourScheduleId]) acc[tourScheduleId] = [];
        acc[tourScheduleId].push(item);
        return acc;
      },
      {}
    );

    let finalRows: any[] = [];
    let grandTotals = {
      loadingQuantity: 0,
      saleQuantity: 0,
      discountQuantity: 0,
      sellableQuantity: 0,
      nonSellableQuantity: 0,
      totalGoodQuantity: 0,
      totalNonSellableQuantity: 0,
    };

    Object.keys(groupedData).forEach((date) => {
      const rows = groupedData[date];

      // Calculate subtotal for this date
      const subTotal = {
        id: `subtotal-${date}`,
        tourScheduleId: `Subtotal - ${date}`,
        unloadingDate: "Sub Total",
        loadingQuantity: calculateColumnSum(rows, "loadingQuantity"),
        saleQuantity: calculateColumnSum(rows, "saleQuantity"),
        discountQuantity: calculateColumnSum(rows, "discountQuantity"),
        sellableQuantity: calculateColumnSum(rows, "sellableQuantity"),
        nonSellableQuantity: calculateColumnSum(rows, "nonSellableQuantity"),
        totalGoodQuantity: calculateColumnSum(rows, "totalGoodQuantity"),
        totalNonSellableQuantity: calculateColumnSum(
          rows,
          "totalNonSellableQuantity"
        ),
      };

      // Add regular rows
      finalRows = [
        ...finalRows,
        ...rows.map((row: any, index: any) => ({
          ...row,
          unloadingDate:
            row.unloadingDate && !isNaN(Date.parse(row.unloadingDate))
              ? new Date(row.unloadingDate).toLocaleDateString()
              : row.unloadingDate,
          id: `${row.tourScheduleId}-${index}`,
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
      tourScheduleId: "Grand Total",
      unloadingDate: "Grand Total",
      loadingQuantity: grandTotals.loadingQuantity.toFixed(2),
      saleQuantity: grandTotals.saleQuantity.toFixed(2),
      discountQuantity: grandTotals.discountQuantity.toFixed(2),
      sellableQuantity: grandTotals.sellableQuantity.toFixed(2),
      nonSellableQuantity: grandTotals.nonSellableQuantity.toFixed(2),
      totalGoodQuantity: grandTotals.totalGoodQuantity.toFixed(2),
      totalNonSellableQuantity: grandTotals.totalNonSellableQuantity.toFixed(2),
    });

    return finalRows;
  }, [loadingUnloadingSummaryDetails]);

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
  const priceListOptions = useMemo(
    () =>
      mapListToOptions(
        priceListTypeList,
        "priceListTypeName",
        "priceListTypeUId"
      ),
    [priceListTypeList, mapListToOptions]
  );
  const representativeOptions = useMemo(
    () => mapListToOptions(representativeList, "name", "uId"),
    [representativeList, mapListToOptions]
  );
  const vehicleOptions = useMemo(
    () => mapListToOptions(tourAssignedVehicleList, "plateNumber", "uId"),
    [tourAssignedVehicleList, mapListToOptions]
  );
  const tourTypesOptions = [
    { label: "Product Based Tour", value: 1 },
    { label: "Value Based Tour", value: 2 },
  ];

  useEffect(() => {
    // Avoid infinite loop by checking if the value is different
    if (watchedFromDate && watchedFromDate !== fromDate) {
      setFromDate(watchedFromDate);
    }
    if (watchedToDate && watchedToDate !== toDate) {
      setToDate(watchedToDate);
    }
  }, [watchedFromDate, watchedToDate]);

  const handleCompanyChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const currentFromDate = getValues("fromDate");
    const currentToDate = getValues("toDate");
    const tourTypes = getValues("tourTypes");
    if (selectedCompany) {
      setIsCompanySelected(true);
      setIsDistributorSelected(false);
      setIsRepSelected(false);
      reset({
        companyUId: selectedCompany,
        tourTypes: tourTypes,
        distributorUId: null,
        priceListUId: null,
        representativeUId: null,
        vehicleId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsCompanySelected(false);
      setIsDistributorSelected(false);
      setIsRepSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: null,
        distributorUId: null,
        priceListUId: null,
        representativeUId: null,
        vehicleId: null,
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
      setIsRepSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        priceListUId: null,
        tourTypes: tourTypes,
        representativeId: null,
        vehicleId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsDistributorSelected(false);
      setIsRepSelected(false);
      reset({
        companyUId: selectedCompany,
        tourTypes: tourTypes,
        distributorUId: null,
        priceListUId: null,
        representativeId: null,
        vehicleId: null,
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
      setIsRepSelected(true);
      setValue("representativeUId", selectedRepresentative);
    } else {
      setIsRepSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        priceListUId: null,
        representativeUId: null,
        vehicleUId: null,
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
      priceListUId: null,
    });
  };

  const handleSearch = () => {
    fetchAllLoadingUnloadingSummaryDetails();
    setIsSearchClicked(true);
    setExpand1(false);
  };

  const fetchAllLoadingUnloadingSummaryDetails = async () => {
    setIsLoading(true);
    let tourTypes = getValues("tourTypes");

    const mappedTourTypes = tourTypes
      ?.map((type: number) =>
        type === 1 ? "product" : type === 2 ? "value" : null
      )
      .filter(Boolean);

    const requestData = {
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
      toDate: toDate ? toDate.toISOString().split("T")[0] : "",
      distributorUIds: distributorId ? [distributorId] : [],
      priceListTypeUId: priceListId ? priceListId : 0,
      tourTypes: mappedTourTypes,
      representativeUIds: representativeId ? [representativeId] : [],
      vehicleUIds: vehicleId ? [vehicleId] : [],
    };
    try {
      await getAllLoadingUnloadingSummaryDetails(requestData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const {
    loadingUnloadingSummaryReportInfo,
    open,
    setOpen,
    fileName,
    handleClose,
  } = useLoadingUnloadingSummaryReportGenerate(
    getValues,
    companiesOptions,
    distributorsOptions,
    priceListOptions,
    representativeOptions,
    vehicleOptions,
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
        pageTitle="Loading Unloading Summary Report"
        pageNavigation={[
          {
            pageName: "Loading Unloading Summary Report",
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
              Loading Unloading Summary Information
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
                      name="priceListUId"
                      placeholder="Price List Type"
                      options={priceListOptions}
                      control={control}
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
                    <RHFAutocompleteCheckboxField
                      name="vehicleUId"
                      placeholder="Vehicle"
                      // @ts-ignore
                      options={vehicleOptions}
                      control={control}
                      disabled={!isRepSelected}
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
        <LoadingUnloadingReportTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          loadingUnloadingSummaryReportInfo={loadingUnloadingSummaryReportInfo}
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
      <LoadingUnloadingReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithTotal}
        loadingUnloadingSummaryReportInfo={loadingUnloadingSummaryReportInfo}
        fileName={fileName}
        reportName="Loading Unloading Summary Report"
      />
    </FsBox>
  );
};

export default LoadingUnloadingSummaryReport;
