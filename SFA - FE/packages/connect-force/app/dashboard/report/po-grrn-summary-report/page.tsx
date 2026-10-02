"use client";

import { useSelector } from "@/redux/store";
import { getAllCompany } from "@/service/company.service";
import {
  getAllPOGRNReportDetails,
  getDistributorsByCompanyUId,
  getPriceListsById,
} from "@/service/Report/po-grn-report.service";
import { poGRNReportValidationSchema } from "@/utils/schemas/poGRNReportValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { useForm, useWatch } from "react-hook-form";
import { usePOGRNReportGeneration } from "./report/reportService";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import PeopleIcon from "@mui/icons-material/People";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import FormProvider, { RHFAutocompleteField } from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import POGRNReportTable from "./components/poGRNReportTable";
import PopupResponse from "@/components/popup/popup-response";
import POGRNReportDialog from "./components/poGRNReportDialog";
import RHFRadioGroup from "@/components/hook-form/RHFRadioGroup";

const POGRNSummaryReport = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const theme = useTheme();

  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const today = new Date();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [isCompanySelected, setIsCompanySelected] = useState(false);
  const [isDistributorSelected, setIsDistributorSelected] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDownError, setServerDownError] = useState(false);
  const [selectedSummaryValue, setSelectedSummaryValue] = useState("Details");

  const companyList = useSelector((state) => state.companySlice.companies);
  const distributorList = useSelector(
    (state) => state.poGRNSummaryReportSlice.distributorView
  );
  const priceListTypeList = useSelector(
    (state) => state.poGRNSummaryReportSlice.priceListView
  );
  const poGRNReportDetails = useSelector(
    (state) => state.poGRNSummaryReportSlice.poGRNSummaryDetails
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const methods = useForm<any>({
    resolver: yupResolver(poGRNReportValidationSchema),
    mode: "all",
    defaultValues: {
      fromDate: today,
      toDate: today,
      companyUId: "",
      distributorUId: "",
    },
  });
  const { control, getValues, reset, setValue } = methods;

  useWatch({
    control,
    name: ["companyUId", "distributorUId", "priceListUId"],
  });

  const watchedFromDate = useWatch({ control, name: "fromDate" });
  const watchedToDate = useWatch({ control, name: "toDate" });
  let companyId = getValues("companyUId");
  let distributorId = getValues("distributorUId");
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
      fetchPriceListData(distributorId);
    }
  }, [distributorId]);

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

  const calculateColumnSum = (rows: any, field: any) => {
    return rows?.reduce((acc: any, row: any) => acc + (row[field] || 0), 0);
  };

  const rowsWithTotal = useMemo(() => {
  if (!Array.isArray(poGRNReportDetails)) {
    console.error("po grn details is not an array:", poGRNReportDetails);
    return [];
  }

  let groupedData: Record<string, any[]> = {};

  if (selectedSummaryValue === "Details") {
    // Group by poNo
    groupedData = poGRNReportDetails.reduce((acc: any, item: any) => {
      const key = item.poNo;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  } else {
    // Group by productUId + mrp + rate
    groupedData = poGRNReportDetails.reduce((acc: any, item: any) => {
      const key = `${item.productUId}-${item.mrp}-${item.rate}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  let finalRows: any[] = [];
  let grandTotals = {
    requestedQunatity: 0,
    approvedQuantity: 0,
    acceptedQuantity: 0,
    totalValue: 0,
    totalVolume: 0,
  };

  Object.keys(groupedData).forEach((key) => {
    const rows = groupedData[key];

    // Subtotal row
    const subTotal = {
      id: `subtotal-${key}`,
      poNo: selectedSummaryValue === "Details" ? "Sub Total" : "Product Total",
      productUId: selectedSummaryValue === "Details" ? "-" : rows[0].productUId,
      productID: selectedSummaryValue === "Details" ? "-" : rows[0].productID,
      productName: selectedSummaryValue === "Details" ? "-" : rows[0].productName,
      mrp: selectedSummaryValue === "Details" ? 0 : rows[0].mrp,
      rate: selectedSummaryValue === "Details" ? 0 : rows[0].rate,
      requestedQunatity: calculateColumnSum(rows, "requestedQunatity"),
      approvedQuantity: calculateColumnSum(rows, "approvedQuantity"),
      acceptedQuantity: calculateColumnSum(rows, "acceptedQuantity"),
      totalValue: calculateColumnSum(rows, "totalValue"),
      totalVolume: calculateColumnSum(rows, "totalVolume"),
    };

    if (selectedSummaryValue === "Details") {
      // Push all rows + subtotal under each PO
      finalRows = [
        ...finalRows,
        ...rows.map((row: any, index: any) => ({
          ...row,
          id: `${row.poNo}-${row.productUId}-${index}`,
        })),
        subTotal,
      ];
    } else {
      // Only subtotal per product+mrp+rate
      finalRows.push(subTotal);
    }

    // Add to grand total
    Object.keys(grandTotals).forEach((col) => {
      grandTotals[col as keyof typeof grandTotals] +=
        parseFloat(subTotal[col as keyof typeof grandTotals]) || 0;
    });
  });

  // Add Grand Total row
  finalRows.push({
    id: "grand-total",
    poNo: "Grand Total",
    requestedQunatity: grandTotals.requestedQunatity,
    approvedQuantity: grandTotals.approvedQuantity,
    acceptedQuantity: grandTotals.acceptedQuantity,
    totalValue: grandTotals.totalValue,
    totalVolume: grandTotals.totalVolume,
  });

  return finalRows;
}, [poGRNReportDetails, selectedSummaryValue]);


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
    if (selectedCompany) {
      setIsCompanySelected(true);
      setIsDistributorSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: null,
        priceListUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsCompanySelected(false);
      setIsDistributorSelected(false);
      reset({
        companyUId: null,
        distributorUId: null,
        priceListUId: null,
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
    if (selectedDistributor) {
      setIsDistributorSelected(true);
      reset({
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        priceListUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    } else {
      setIsDistributorSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: null,
        priceListUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
    }
  };

  const handleRadioChange = (value: any) => {
    setSelectedSummaryValue(value);
  };

  const handleReset = () => {
    setIsSearchClicked(false);
    setIsCompanySelected(false);
    setIsDistributorSelected(false);
    reset({
      companyUId: null,
      distributorUId: null,
      priceListUId: null,
    });
  };

  const handleSearch = () => {
    fetchAllDailyCollectionReportDetails();
    setIsSearchClicked(true);
  };

  const fetchAllDailyCollectionReportDetails = async () => {
    setIsLoading(true);

    const requestData = {
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
      toDate: toDate ? toDate.toISOString().split("T")[0] : "",
      companyUId: companyId ? companyId : 0,
      distributorUId: distributorId ? distributorId : 0,
      priceListTypeUId: priceListId ? priceListId : 0,
    };
    try {
      await getAllPOGRNReportDetails(requestData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const { poGRNReportInfo, fileName, open, setOpen, handleClose } =
    usePOGRNReportGeneration(
      getValues,
      companiesOptions,
      distributorsOptions,
      priceListOptions
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
        pageTitle="PO GRN Summary Report"
        pageNavigation={[
          {
            pageName: "PO GRN Summary Report",
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
              PO GRN Summary Report
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
                      options={distributorsOptions}
                      control={control}
                      onChange={handleDistributorChange}
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
                  disabled={!isCompanySelected || !isDistributorSelected}
                >
                  View Data
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <POGRNReportTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          poGRNReportInfo={poGRNReportInfo}
          expand={expand1}
          selectedSummaryValue={selectedSummaryValue}
        />
      </Container>
      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
      <POGRNReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithTotal}
        poGRNReportInfo={poGRNReportInfo}
        fileName={fileName}
        reportName="PO GRN Summary Report"
        selectedSummaryValue={selectedSummaryValue}
      />
    </FsBox>
  );
};

export default POGRNSummaryReport;
