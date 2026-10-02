"use client";

import { useSelector } from "@/redux/store";
import { getAllCompany } from "@/service/company.service";
import {
  getAllActiveOutletsByRoute,
  getAllActiveRepByDistriID,
  getAllActiveRouteByRepID,
  getAllAnnualSaleSummaryReportDetails,
  getDistributorsByCompanyUId,
} from "@/service/Report/annual-sale-summary-report.service";
import { annualSaleSummaryReportSchema } from "@/utils/schemas/annualSaleSummaryReportSchema";
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
import { useAnnualSaleSummaryReportGenerate } from "./report/reportService";
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
import dayjs from "dayjs";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import AnnualSaleSummaryReportTable from "./components/annualSaleSummaryReportTable";
import PopupResponse from "@/components/popup/popup-response";
import AnnualSaleSummaryReportDialog from "./components/annualSaleSummaryReportDialog";

const AnnualSaleSummaryReport = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const theme = useTheme();

  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
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
    (state) => state.annualSaleSummaryReportSlice.distributorView
  );
  const representativeList = useSelector(
    (state) => state.annualSaleSummaryReportSlice.repBydistri
  );
  const routeList = useSelector(
    (state) => state.annualSaleSummaryReportSlice.activeRoutes
  );
  const outletList = useSelector(
    (state) => state.annualSaleSummaryReportSlice.activeOutlets
  );
  const annualSaleSummaryDetails = useSelector(
    (state) => state.annualSaleSummaryReportSlice.annualSaleSummaryDetails
  );

  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const today = dayjs();
  const methods = useForm<any>({
    resolver: yupResolver(annualSaleSummaryReportSchema),
    mode: "all",
    defaultValues: {
      year: today,
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

  const watchedYear = useWatch({
    control,
    name: "year",
    defaultValue: today,
  });

  console.log("watchedYear", watchedYear);

  const tourTypes = useWatch({ control, name: "tourTypes" });
  let companyId = getValues("companyUId");
  let distributorId = getValues("distributorUId");
  let representativeId = getValues("representativeUId");
  let routeId = getValues("routeUId");
  let outletId = getValues("outletUId");

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
  }, [outletId]);

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

  const rowsWithTotal = useMemo(() => {
    const baseRows = (annualSaleSummaryDetails || []).map(
      (row: any, index: number) => ({
        ...row,
        id: `row-${index}`, // unique ID for each row
        jan: row.jan ?? 0,
        feb: row.feb ?? 0,
        mar: row.mar ?? 0,
        apr: row.apr ?? 0,
        may: row.may ?? 0,
        jun: row.jun ?? 0,
        jul: row.jul ?? 0,
        aug: row.aug ?? 0,
        sep: row.sep ?? 0,
        oct: row.oct ?? 0,
        nov: row.nov ?? 0,
        dec: row.dec ?? 0,
      })
    );

    const totalRow: any = {
      id: "total-row",
      outletUId: "Total",
      outletName: "",
      tourType: "",
      jan: baseRows.reduce((sum: any, r: any) => sum + (r.jan || 0), 0),
      feb: baseRows.reduce((sum: any, r: any) => sum + (r.feb || 0), 0),
      mar: baseRows.reduce((sum: any, r: any) => sum + (r.mar || 0), 0),
      apr: baseRows.reduce((sum: any, r: any) => sum + (r.apr || 0), 0),
      may: baseRows.reduce((sum: any, r: any) => sum + (r.may || 0), 0),
      jun: baseRows.reduce((sum: any, r: any) => sum + (r.jun || 0), 0),
      jul: baseRows.reduce((sum: any, r: any) => sum + (r.jul || 0), 0),
      aug: baseRows.reduce((sum: any, r: any) => sum + (r.aug || 0), 0),
      sep: baseRows.reduce((sum: any, r: any) => sum + (r.sep || 0), 0),
      oct: baseRows.reduce((sum: any, r: any) => sum + (r.oct || 0), 0),
      nov: baseRows.reduce((sum: any, r: any) => sum + (r.nov || 0), 0),
      dec: baseRows.reduce((sum: any, r: any) => sum + (r.dec || 0), 0),
    };

    return [...baseRows, totalRow];
  }, [annualSaleSummaryDetails]);

  const handleCompanyChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const currentYear = getValues("year");
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
        year: currentYear,
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
        year: currentYear,
      });
    }
  };

  const handleDistributorChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    const currentYear = getValues("year");
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
        year: currentYear,
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
        year: currentYear,
      });
    }
  };

  const handleRepresentativeChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    const selectedRepresentative = getValues("representativeUId");
    const currentYear = getValues("year");
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
        year: currentYear,
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
        year: currentYear,
      });
    }
  };

  const handleRouteChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    const selectedRepresentative = getValues("representativeUId");
    const selectedRoute = getValues("routeUId");
    const currentYear = getValues("year");
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
        year: currentYear,
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
        year: currentYear,
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
    fetchAllAnnualSaleSummaryReportDetails();
    setIsSearchClicked(true);
  };

  const fetchAllAnnualSaleSummaryReportDetails = async () => {
    setIsLoading(true);
    let tourTypes = getValues("tourTypes");

    const yearValue = getValues("year"); // Dayjs object
    const yearNumber = yearValue ? dayjs(yearValue).year() : today.year();
    console.log("Year Value", yearValue);

    const mappedTourTypes = tourTypes
      ?.map((type: number) =>
        type === 1 ? "product" : type === 2 ? "value" : null
      )
      .filter(Boolean);

    const requestData = {
      year: yearNumber ? yearNumber.toString() : "",
      distributorUIds: distributorId ? [distributorId] : [],
      tourTypes: mappedTourTypes,
      representativeUIds: representativeId ? [representativeId] : [],
      routeUIds: routeId ? [routeId] : [],
      outletUIds: outletId ? [outletId] : [],
    };
    try {
      await getAllAnnualSaleSummaryReportDetails(requestData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const { annualSaleSummaryReportInfo, fileName, open, setOpen, handleClose } =
    useAnnualSaleSummaryReportGenerate(
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
        pageTitle="Annual Sale Summary Report"
        pageNavigation={[
          {
            pageName: "Annual Sale Summary Report",
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
              Annual Sale Summary Report
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
                      name="year"
                      label="Year*"
                      views={["year"]}
                      openTo="year"
                      format="yyyy"
                      onChange={(date: dayjs.Dayjs | null) => {
                        if (date) setValue("year", date); // set Dayjs object
                      }}
                      value={watchedYear} // directly use Dayjs object
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
        <AnnualSaleSummaryReportTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          annualSaleSummaryReportInfo={annualSaleSummaryReportInfo}
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
      <AnnualSaleSummaryReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithTotal}
        annualSaleSummaryReportInfo={annualSaleSummaryReportInfo}
        fileName={fileName}
        reportName="Annual Sale Summary Report"
      />
    </FsBox>
  );
};

export default AnnualSaleSummaryReport;
