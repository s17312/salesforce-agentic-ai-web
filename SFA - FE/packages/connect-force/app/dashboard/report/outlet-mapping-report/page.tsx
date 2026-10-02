"use client";

import FormProvider, { RHFAutocompleteField } from "@/components/hook-form";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import PopupResponse from "@/components/popup/popup-response";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllCompany } from "@/service/company.service";
import {
  getAllActiveOutletsByRoutes,
  getAllActiveRepByDistriID,
  getAllActiveRouteBySalesRepID,
  getAllOutletMappingReportDetails,
  getDistributorsByCompanyUId,
} from "@/service/Report/outlet-mapping-report.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { outletMappingReportValidationSchema } from "@/utils/schemas/outletMappingReportValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
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
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import OutletMappingReportDialog from "./components/outletMappingReportDialog";
import OutletMappingReportTable from "./components/outletMappingReportTable";
import { useOutletMappingReportGenerate } from "./report/reportService";

const OutletMappingReport = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const theme = useTheme();

  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCompanySelected, setIsCompanySelected] = useState(false);
  const [isDistributorSelected, setIsDistributorSelected] = useState(false);
  const [isRepresentativeSelected, setIsRepresentativeSelected] =
    useState(false);
  const [isRouteSelected, setIsRouteSelected] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDownError, setServerDownError] = useState(false);

  const companyList = useSelector((state) => state.companySlice.companies);
  const distributorList = useSelector(
    (state) => state.outletMappingReportSlice.distributorView
  );
  const representativeList = useSelector(
    (state) => state.outletMappingReportSlice.repBydistri
  );
  const routeList = useSelector(
    (state) => state.outletMappingReportSlice.activeRoutes
  );
  const outletList = useSelector(
    (state) => state.outletMappingReportSlice.activeOutlets
  );
  const outletMappingDetails = useSelector(
    (state) => state.outletMappingReportSlice.outletMappingDetails
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const methods = useForm<any>({
    resolver: yupResolver(outletMappingReportValidationSchema),
    mode: "all",
    defaultValues: {
      company: "",
      distributor: "",
      representative: "",
      route: "",
      outlet: "",
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

  let companyId = getValues("companyUId");
  let distributorId = getValues("distributorUId");
  let representativeId = getValues("representativeUId");
  let routeId = getValues("routeUId");
  let outletId = getValues("outletUId");

  useEffect(() => {
    setValue("routeUId", null);
    setValue("outletUId", null);
  }, [representativeId]);

  useEffect(() => {
    setValue("outletUId", null);
  }, [routeId]);

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

  //fetch Route Options
  const fetchRouteOptions = async (representativeIds: number[]) => {
    try {
      await getAllActiveRouteBySalesRepID(representativeIds);
    } catch (error) {
      console.error("Error fetching route options:", error);
    }
  };

  //fetch Outlet Options
  const fetchOutletOptions = async (routeUIds: number[]) => {
    try {
      await getAllActiveOutletsByRoutes(routeUIds);
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
      fetchRouteOptions([representativeId]);
    }
  }, [representativeId]);

  useEffect(() => {
    if (routeId) {
      fetchOutletOptions([routeId]);
    }
  }, [routeId]);

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

  const routeOptions = useMemo(() => {
    const uniqueRoutesMap = new Map();
    routeList.forEach((route: { routeName: string }) => {
      if (!uniqueRoutesMap.has(route.routeName)) {
        uniqueRoutesMap.set(route.routeName, route);
      }
    });

    const uniqueRoutes = Array.from(uniqueRoutesMap.values());

    return mapListToOptions(uniqueRoutes, "routeName", "uId");
  }, [routeList, mapListToOptions]);

  const outletOptions = useMemo(() => {
    const uniqueOutletsMap = new Map();
    outletList.forEach((outlet: { name: string }) => {
      if (!uniqueOutletsMap.has(outlet.name)) {
        uniqueOutletsMap.set(outlet.name, outlet);
      }
    });

    const uniqueRoutes = Array.from(uniqueOutletsMap.values());

    return mapListToOptions(uniqueRoutes, "name", "uId");
  }, [outletList, mapListToOptions]);

  const handleCompanyChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    if (selectedCompany) {
      setIsCompanySelected(true);
      setIsDistributorSelected(false);
      setIsRepresentativeSelected(false);
      setIsRouteSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: null,
        representativeUId: null,
        routeUId: null,
        outletUId: null,
      });
    } else {
      setIsCompanySelected(false);
      setIsDistributorSelected(false);
      setIsRepresentativeSelected(false);
      setIsRouteSelected(false);
      reset({
        companyUId: null,
        distributorUId: null,
        representativeUId: null,
        routeUId: null,
        outletUId: null,
      });
    }
  };

  const handleDistributorChange = () => {
    setIsSearchClicked(false);
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    if (selectedDistributor) {
      setIsDistributorSelected(true);
      setIsRepresentativeSelected(false);
      setIsRouteSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        representativeUId: null,
        routeUId: null,
        outletUId: null,
      });
    } else {
      setIsDistributorSelected(false);
      setIsRepresentativeSelected(false);
      setIsRouteSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: null,
        representativeUId: null,
        routeUId: null,
        outletUId: null,
      });
    }
  };

  const handleReset = () => {
    setIsSearchClicked(false);
    setIsCompanySelected(false);
    setIsDistributorSelected(false);
    setIsRepresentativeSelected(false);
    setIsRouteSelected(false);
    reset({
      companyUId: null,
      distributorUId: null,
      representativeUId: null,
      routeUId: null,
      outletUId: null,
    });
  };

  const handleSearch = () => {
    fetchAllOutletMappingReportDetails();
    setIsSearchClicked(true);
    setExpand1(false);
  };

  const fetchAllOutletMappingReportDetails = async () => {
    setIsLoading(true);
    const requestData = {
      distributorUIds: distributorId ? [distributorId] : [],
      representativeUIds: representativeId ? [representativeId] : [],
      routeUIds: routeId ? [routeId] : [],
      outletUIds: outletId ? [outletId] : [],
    };
    try {
      await getAllOutletMappingReportDetails(requestData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const rowsWithTotal = outletMappingDetails.map((row: any, index: any) => ({
    ...row,
    id: `${index}-${row.distributorUId}-${row.representativeUId}-${row.routeUId}-${row.outletUId}`,
  }));

  const { outletMappingReportInfo, fileName, open, setOpen, handleClose } =
    useOutletMappingReportGenerate(
      getValues,
      companiesOptions,
      distributorsOptions,
      representativeOptions,
      routeOptions,
      outletOptions
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
        pageTitle="Outlet Mapping Report"
        pageNavigation={[
          {
            pageName: "Outlet Mapping Report",
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
              Outlet Mapping Report
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
                    <RHFAutocompleteCheckboxField
                      name="routeUId"
                      placeholder="Route"
                      // @ts-ignore
                      options={routeOptions}
                      control={control}
                      disabled={!isDistributorSelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteCheckboxField
                      name="outletUId"
                      placeholder="Outlet"
                      // @ts-ignore
                      options={outletOptions}
                      control={control}
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
                  disabled={!isCompanySelected || !distributorId}
                >
                  View Data
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <OutletMappingReportTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          outletMappingReportInfo={outletMappingReportInfo}
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
      <OutletMappingReportDialog
        rowsWithTotal={rowsWithTotal}
        outletMappingReportInfo={outletMappingReportInfo}
        fileName={fileName}
        open={open}
        handleClose={handleClose}
        reportName="Outlet Mapping Report"
      />
    </FsBox>
  );
};

export default OutletMappingReport;
