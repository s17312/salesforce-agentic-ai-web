"use client";

import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { useForm, useWatch } from "react-hook-form";
import FormProvider, { RHFAutocompleteField } from "@/components/hook-form";
import { getAllCompany } from "@/service/company.service";
import { useSelector } from "@/redux/store";
import {
  getAllActiveRepByDistriID,
  getAllTourSummaryDetails,
  getDistributorsByCompanyUId,
} from "@/service/Report/tour-summary-report.service";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import { useTourSummaryReportGenerate } from "./report/reportService";
import TourSummaryReportTable from "./components/tourSummaryReportTable";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import TourSummaryReportDialog from "./components/tourSummaryReportDialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { tourSummaryValidationSchema } from "@/utils/schemas/tourSummaryValidationSchema";
import RHFRadioGroup from "@/components/hook-form/RHFRadioGroup";

const TourSummaryReport = () => {
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
  const [isTourTypeSelected, setIsTourTypeSelected] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDownError, setServerDownError] = useState(false);
  const [selectedSummaryValue, setSelectedSummaryValue] = useState("Details");

  const companyList = useSelector((state) => state.companySlice.companies);
  const distributorList = useSelector(
    (state) => state.tourSummaryReportSlice.distributorView
  );
  const representativeList = useSelector(
    (state) => state.tourSummaryReportSlice.repBydistri
  );
  const tourSummaryDetails = useSelector(
    (state) => state.tourSummaryReportSlice.tourSummaryDetails
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const methods = useForm<any>({
    resolver: yupResolver(tourSummaryValidationSchema),
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
      "representativeUId"
    ],
  });

  const watchedFromDate = useWatch({ control, name: "fromDate" });
  const watchedToDate = useWatch({ control, name: "toDate" });
  const tourTypes = useWatch({ control, name: "tourTypes" });
  let companyId = getValues("companyUId");
  let distributorId = getValues("distributorUId");
  let representativeId = getValues("representativeUId");

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
  const fetchRepOptionsTo = async (distributorId: number) => {
    try {
      await getAllActiveRepByDistriID(distributorId);
    } catch (error) {
      console.error("Error fetching rep options:", error);
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
      fetchRepOptionsTo(distributorId);
    }
  }, [distributorId]);

  useEffect(() => {
    setIsTourTypeSelected(tourTypes && tourTypes.length > 0);
  }, [tourTypes]);

  useEffect(() => {
    setIsSearchClicked(false);
  }, [representativeId]);

  const tourSummaryView = useMemo(() => {
    if (!Array.isArray(tourSummaryDetails)) {
      console.error("tourSummaryDetails is not an array:", tourSummaryDetails);
      return [];
    }

    return tourSummaryDetails.map((item: any, index: number) => ({
      id: index + 1,
      ...item,
    }));
  }, [tourSummaryDetails]);

  const calculateColumnSum = (rows: any, field: any) => {
    return rows
      ?.reduce((acc: any, row: any) => acc + (row[field] || 0), 0);
  };

  const rowsWithTotal = useMemo(() => {
    if (!Array.isArray(tourSummaryDetails)) {
      console.error("tourSummaryDetails is not an array:", tourSummaryDetails);
      return [];
    }

    // Group by scheduleDate
    const groupedData = tourSummaryDetails.reduce((acc: any, item: any) => {
      const tourScheduleId = item.tourID || "Unknown Tour Schedule";
      if (!acc[tourScheduleId]) acc[tourScheduleId] = [];
      acc[tourScheduleId].push(item);
      return acc;
    }, {});

    let finalRows: any[] = [];
    let grandTotals = {
      invoiceAmount: 0,
      discountAmount: 0,
      returnAmount: 0,
      totalAmount: 0,
      cashAmount: 0,
      creditAmount: 0,
      chequeAmount: 0,
    };

    Object.keys(groupedData).forEach((tourId) => {
      const rows = groupedData[tourId];

      // Calculate subtotal for this date
      const subTotal = {
        id: `subtotal-${tourId}`,
        tourScheduleUId: `Subtotal - ${tourId}`,
        scheduleDate: rows[0]?.scheduleDate || "",
        tourID: selectedSummaryValue === "Summary" ? tourId : "Sub Total",
        invoiceAmount: calculateColumnSum(rows, "invoiceAmount"),
        discountAmount: calculateColumnSum(rows, "discountAmount"),
        returnAmount: calculateColumnSum(rows, "returnAmount"),
        totalAmount: calculateColumnSum(rows, "totalAmount"),
        cashAmount: calculateColumnSum(rows, "cashAmount"),
        creditAmount: calculateColumnSum(rows, "creditAmount"),
        chequeAmount: calculateColumnSum(rows, "chequeAmount"),
      };

      if (selectedSummaryValue === "Details") {
        // Push regular rows only in details mode
        finalRows = [
          ...finalRows,
          ...rows.map((row: any, index: any) => ({
            ...row,
            scheduleDate: row.scheduleDate
              ? new Date(row.scheduleDate).toLocaleDateString()
              : "",
            id: `${row.tourScheduleUId}-${index}`, // Unique id for regular rows
          })),
        ];
      }

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
      tourID: "Grand Total",
      invoiceAmount: grandTotals.invoiceAmount.toFixed(2),
      discountAmount: grandTotals.discountAmount.toFixed(2),
      returnAmount: grandTotals.returnAmount.toFixed(2),
      totalAmount: grandTotals.totalAmount.toFixed(2),
      cashAmount: grandTotals.cashAmount.toFixed(2),
      creditAmount: grandTotals.creditAmount.toFixed(2),
      chequeAmount: grandTotals.chequeAmount.toFixed(2),
    });

    return finalRows;
  }, [tourSummaryDetails, selectedSummaryValue]);

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
      reset({
        companyUId: selectedCompany,
        tourTypes: tourTypes,
        distributorUId: null,
        representativeUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsCompanySelected(false);
      setIsDistributorSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: null,
        distributorUId: null,
        representativeUId: null,
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
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        representativeId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsDistributorSelected(false);
      reset({
        tourTypes: tourTypes,
        companyUId: selectedCompany,
        distributorUId: null,
        representativeId: null,
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
      representativeUId: null
    });
  };

  const handleRadioChange = (value: any) => {
    setSelectedSummaryValue(value);
  };

  const handleSearch = () => {
    fetchAllTourSummaryDetails();
    setIsSearchClicked(true);
    setExpand1(false);
  };

  const fetchAllTourSummaryDetails = async () => {
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
      tourTypes: mappedTourTypes,
      distributorUIds: distributorId ? [distributorId] : [],
      representativeUIds: representativeId ? [representativeId] : [],
    };
    try {
      await getAllTourSummaryDetails(requestData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const { tourSummaryReportInfo, open, setOpen, fileName, handleClose } =
    useTourSummaryReportGenerate(
      getValues,
      companiesOptions,
      distributorsOptions,
      representativeOptions,
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
        pageTitle="Tour Summary Report"
        pageNavigation={[
          {
            pageName: "Tour Summary Report",
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
              Tour Summary Information
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
                    <RHFAutocompleteCheckboxField
                      name="representativeUId"
                      placeholder="Representative"
                      // @ts-ignore
                      options={representativeOptions}
                      control={control}
                      disabled={!isDistributorSelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFRadioGroup
                      name="summaryOrDetail"
                      options={[
                        { label: "Details", value: "Details" },
                        { label: "Summary", value: "Summary" },
                      ]}
                      defaultValue={selectedSummaryValue}
                      onChange={handleRadioChange}
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
                    !isCompanySelected ||
                    !isDistributorSelected ||
                    !isTourTypeSelected
                  }
                >
                  View Data
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <TourSummaryReportTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          tourSummaryReportInfo={tourSummaryReportInfo}
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
      <TourSummaryReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithTotal}
        tourSummaryReportInfo={tourSummaryReportInfo}
        fileName={fileName}
        reportName="Tour Summary Report"
      />
    </FsBox>
  );
};

export default TourSummaryReport;
