"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
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
import InventoryIcon from "@mui/icons-material/Inventory";
import React, { useEffect, useMemo, useRef, useState } from "react";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import {
  getAllActiveDistributors,
  getDistributorMappingReport,
} from "@/service/Report/distributor-mapping-report.service";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "@/redux/store";
import RHFRadioGroup from "@/components/hook-form/RHFRadioGroup";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useCSReportGeneration } from "./report/reportService";
import DistributorMappingTable from "./components/distributorMappingTable";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import DistributorMappingReportDialog from "./components/DistributorMappingReportDialog";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DistributorMappingStockView = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [expand1, setExpand1] = useState(true);
  const [selectedRadioValue, setSelectedRadioValue] = useState("Product");
  const [isDistributorSelected, setIsDistributorSelected] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);

  const activeDistributors = useSelector(
    (state) => state.distributorMappingReportSlice.activeDistributors
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const rowsWithTotal = useSelector(
    (state) => state.distributorMappingReportSlice.distributorMappingReport
  );

  const rowsWithUniqueKey = useMemo(() => {
    return rowsWithTotal.map((row: any, index: any) => ({
      ...row,
      key: `${row.distributorId}-${row.id}-${index}`, // Adjust based on your available unique field
    }));
  }, [rowsWithTotal]);

  const getchActiveDistributors = async () => {
    try {
      setIsLoading(true);
      await getAllActiveDistributors();
    } catch (error) {
      console.error("Error fetching distributors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getchActiveDistributors();
  }, []);

  const methods = useForm<any>({
    mode: "all",
  });
  const { control, getValues, reset } = methods;

  const distributorUIds = useWatch({
    control,
    name: "distributorUIds",
  });

  useEffect(() => {
    if (distributorUIds && distributorUIds.length > 0) {
      setIsDistributorSelected(true);
    } else {
      setIsDistributorSelected(false);
    }
  }, [distributorUIds]);

  useEffect(() => {
    setIsSearchClicked(false);
  }, [selectedRadioValue, distributorUIds]);

  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const activeDistributorsMap = useMemo(
    () => mapListToOptions(activeDistributors, "distributorName", "uId"),
    [activeDistributors, mapListToOptions]
  );

  const handleRadioChange = (value: any) => {
    setSelectedRadioValue(value);
  };

  const handleReset = () => {
    setIsDistributorSelected(false);
    reset(
      {
        distributorUIds: [],
      },
      {
        keepValues: false,
      }
    );
  };

  const handleSearch = () => {
    fetchDistributorMappingReport();
    setIsSearchClicked(true);
    setExpand1(false);
  };

  const fetchDistributorMappingReport = async () => {
    setIsLoading(true);
    const mappingItems = selectedRadioValue;
    const queryParams = {
      mappingItems: mappingItems,
      distributorUIds: getValues("distributorUIds") || [],
      offset: 1,
      count: 999999,
    };

    try {
      await getDistributorMappingReport(queryParams);
    } catch (error) {
      setServerDownError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const { distributorMappingInfo, open, setOpen, fileName, handleClose } =
    useCSReportGeneration(getValues, selectedRadioValue, activeDistributorsMap);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Mapping View"
        pageNavigation={[
          {
            pageName: "Mapping View",
          },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<InventoryIcon sx={{ color: theme.palette.primary.main }} />}
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
              Distributor Mapping Information
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
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="distributorUIds"
                    placeholder="Distributor"
                    options={activeDistributorsMap}
                    control={control}
                  />
                </Grid>
                <Grid item xs={9}>
                  <RHFRadioGroup
                    name="mappingItems"
                    options={[
                      { label: "Product", value: "Product" },
                      { label: "Outlet", value: "Outlet" },
                      { label: "Representative", value: "Rep" },
                      { label: "Route", value: "Route" },
                      { label: "Company", value: "Company" },
                    ]}
                    defaultValue={selectedRadioValue}
                    onChange={handleRadioChange}
                  />
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: "#e8eaef", mt: 2, mb: 1 }} />
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
                  disabled={!isDistributorSelected}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{ ml: 1 }}
                  startIcon={<VisibilityIcon />}
                  disabled={!isDistributorSelected}
                >
                  View Data
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <DistributorMappingTable
          rowsWithTotal={rowsWithUniqueKey}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          distributorMappingInfo={distributorMappingInfo}
          selectedRadioValue={selectedRadioValue}
        />
      </Container>
      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
      <DistributorMappingReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithUniqueKey}
        distributorMappingInfo={distributorMappingInfo}
        fileName={fileName}
        selectedRadioValue={selectedRadioValue}
        reportName={`Distributor Mapping View - ${selectedRadioValue}`}
      />
    </FsBox>
  );
};

export default DistributorMappingStockView;
