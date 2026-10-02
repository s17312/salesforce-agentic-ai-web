"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import InventoryIcon from "@mui/icons-material/Inventory";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { RHFAutocompleteField } from "@/components/hook-form";
import { mapListToOptions } from "@/utils/sortUtils";
import { useSelector } from "@/redux/store";
import { useForm, useWatch } from "react-hook-form";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import AssetStockTable from "./components/assetStockTable";
import AssetStockReportDialog from "./components/AssetStockReportDialog";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllAssetTypeDetails } from "@/service/assetType.service";
import { getAllAssetBrandDetails } from "@/service/assetBrand.service";
import { getAllAssetModelDetails } from "@/service/assetModel.service";
import { getAllAssetAllocationTypeDetails } from "@/service/assetAllocationType.service";
import { getDistributorMapping } from "@/service/distributor.service";
import { getAllOutlets } from "@/service/outlet.service";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { getAllAssetStock } from "@/service/inventory/asset-stock.service";
import { useAssetStockReportGeneration } from "./report/reportService";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AssetStockView = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [serverDownError, setServerDownError] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const assetTypeList = useSelector(
    (state) => state.assetTypeSlice.assetTypeDetails
  );
  const assetBrandList = useSelector(
    (state) => state.assetBrandSlice.assetBrandDetails
  );
  const assetModelList = useSelector(
    (state) => state.assetModelSlice.assetModelDetails
  );
  const allocationTypeList = useSelector(
    (state) => state.assetAllocatioTypeSlice.assetAllocationTypeDetails
  );
  const distributorList = useSelector(
    (state) => state.distributorSlice.distributorMapping
  );
  const outletList = useSelector((state) => state.outlet.outlets);
  // const repairCenterList = useSelector((state) => state.repairCenterSlice.repairCenterDetails);
  // const disposalCenterList = useSelector((state) => state.disposalCenterSlice.disposalCenterDetails);
  const assetOptionsList = useSelector(
    (state) => state.assetStockSlice.assetStock
  );

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };
  const handleReset = () => {
    reset(
      {
        assetTypeIds: [],
        assetBrandIds: [],
        assetModelIds: [],
        assignStatus: null,
        allocationTypeIds: [],
        distributorIds: [],
        outletIds: [],
        repairCenterIds: [],
        disposalCenterIds: [],
      },
      {
        keepValues: false,
      }
    );
    setIsSearchClicked(false);
  };

  const handleSearch = () => {
    fetchAssetsStock();
    setIsSearchClicked(true);
  };

  const fetchAssetsStock = async () => {
    setIsLoading(true);
    const assignStatusValue = getValues("assignStatus");
    const queryParams = {
      assignStatus: assignStatusValue ? assignStatusValue : undefined,
      assetTypeUIds: getValues("assetTypeIds") || [],
      assetModelUIds: getValues("assetModelIds") || [],
      assetBrandUIds: getValues("assetBrandIds") || [],
      allocationTypeUIds: getValues("allocationTypeIds") || [],
      distributorUIds: getValues("distributorIds") || [],
      outletUIds: getValues("outletIds") || [],
      repairCenterUIds: getValues("repairCenterIds") || [],
      disposalCenterUIds: getValues("disposalCenterIds") || [],
      offset: 1,
      count: 999999,
    };

    try {
      await getAllAssetStock(queryParams);
    } catch (error) {
      console.error("Error fetching assets data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const methods = useForm<any>({
    mode: "all",
  });
  const { control, getValues, reset } = methods;

  const watchedValues = useWatch({
    control,
    name: [
      "assetTypeIds",
      "assetBrandIds",
      "assetModelIds",
      "assignStatus",
      "allocationTypeIds",
      "distributorIds",
      "outletIds",
      "repairCenterIds",
      "disposalCenterIds",
    ],
  });

  useEffect(() => {
    setIsSearchClicked(false);
  }, [JSON.stringify(watchedValues)]);

  const calculateColumnSum = (rows: any, field: any) => {
    return rows
      ?.reduce((acc: any, row: any) => acc + (row[field] || 0), 0)
      .toFixed(2);
  };

  const combineRows = (rows: any) => {
    const combinedRows = rows.reduce((acc: any, row: any) => {
      const key = `${row.assetId}-${row.assetName}-${row.serialNumber}`;
      if (!acc[key]) {
        acc[key] = { ...row };
      } else {
        acc[key].quantity += row.quantity;
        acc[key].volume += row.volume;
        acc[key].value += row.value;
      }
      return acc;
    }, {});

    return Object.values(combinedRows);
  };

  const combinedAssetOptionsList = combineRows(assetOptionsList);

  const totalQty = useMemo(
    () => calculateColumnSum(assetOptionsList, "quantity"),
    [assetOptionsList]
  );
  const totalVolume = useMemo(
    () => calculateColumnSum(assetOptionsList, "volume"),
    [assetOptionsList]
  );
  const totalValue = useMemo(
    () => calculateColumnSum(assetOptionsList, "value"),
    [assetOptionsList]
  );

  const rowsWithTotal = useMemo(() => {
    const stockView = combinedAssetOptionsList || [];
    return [
      ...stockView,
      {
        stockDetailId: stockView.length + 1,
        assetId: "Total",
        quantity: totalQty,
        volume: totalVolume,
        value: totalValue,
      },
    ];
  }, [combinedAssetOptionsList, totalQty, totalVolume, totalValue]);

  const assignStatus = getValues("assignStatus");
  const allocationTypeUIds = getValues("allocationTypeIds") || [];

  const fetchAssetTypeData = async () => {
    try {
      await getAllAssetTypeDetails(
        undefined,
        undefined,
        undefined,
        "AssetTypeName",
        "asc",
        true
      );
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchAssetBrandData = async () => {
    try {
      await getAllAssetBrandDetails(
        undefined,
        undefined,
        undefined,
        "AssetBrandName",
        "asc",
        true
      );
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchAssetModelData = async () => {
    try {
      await getAllAssetModelDetails(
        undefined,
        undefined,
        undefined,
        "AssetModelName",
        "asc",
        true
      );
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    fetchAssetTypeData();
    fetchAssetBrandData();
    fetchAssetModelData();
    fetchAssetAllocationTypeData();
    fetchDistributorData();
    fetchOutletData();
  }, []);

  const fetchAssetAllocationTypeData = async () => {
    try {
      getAllAssetAllocationTypeDetails(
        undefined,
        undefined,
        undefined,
        "allocationType",
        "asc",
        true
      );
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchDistributorData = async () => {
    try {
      await getDistributorMapping();
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchOutletData = async () => {
    try {
      await getAllOutlets(undefined, undefined, undefined, "name", "asc", true);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const assetTypeOptions = useMemo(
    () => mapListToOptions(assetTypeList, "assetTypeName", "uId"),
    [assetTypeList, mapListToOptions]
  );
  const assetBrandOptions = useMemo(
    () => mapListToOptions(assetBrandList, "assetBrandName", "uId"),
    [assetBrandList, mapListToOptions]
  );
  const assetModelOptions = useMemo(
    () => mapListToOptions(assetModelList, "assetModelName", "uId"),
    [assetModelList, mapListToOptions]
  );
  const assignStatusOptions = useMemo(
    () => [
      { label: "Company", value: 0 },
      { label: "Allocated", value: 1 },
      { label: "Transferred", value: 2 },
    ],
    []
  );
  const allocationTypeOptions = useMemo(
    () => mapListToOptions(allocationTypeList, "allocationType", "uId"),
    [allocationTypeList, mapListToOptions]
  );
  const filteredAllocationTypeMap = allocationTypeOptions.slice(1);
  const distributorsOptions = useMemo(
    () => mapListToOptions(distributorList, "distributorName", "uId"),
    [distributorList, mapListToOptions]
  );
  const outletsOptions = useMemo(
    () => mapListToOptions(outletList, "name", "uId"),
    [outletList, mapListToOptions]
  );

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const { assetInfo, open, setOpen, fileName, handleClose } =
    useAssetStockReportGeneration(
      getValues,
      assetTypeOptions,
      assetModelOptions,
      assetBrandOptions,
      assignStatusOptions,
      allocationTypeOptions,
      distributorsOptions,
      outletsOptions,
      [],
      []
    );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Asset Stock View"
        pageNavigation={[
          {
            pageName: "Asset Stock",
          },
          { pageName: "View" },
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
            <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
                ml: 1,
              }}
            >
              Asset Stock Information
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
            <Box
              sx={{
                marginLeft: 2,
                marginRight: 2,
                marginBottom: 2,
              }}
            >
              <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="assetTypeIds"
                    placeholder="Asset Type"
                    options={assetTypeOptions}
                    control={control}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="assetBrandIds"
                    placeholder="Asset Brand"
                    options={assetBrandOptions}
                    control={control}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="assetModelIds"
                    placeholder="Asset Model"
                    options={assetModelOptions}
                    control={control}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteField
                    name="assignStatus"
                    placeholder="Assign Status"
                    options={assignStatusOptions}
                    control={control}
                    inputProps={{
                      form: {
                        autocomplete: "off",
                      },
                    }}
                  />
                </Grid>
              </Grid>
              {assignStatus === 1 || assignStatus === 2 ? (
                <>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      mt: 2,
                    }}
                  >
                    Asset Allocation/ Transfer Information
                  </Typography>
                  <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
                </>
              ) : null}
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {assignStatus === 1 || assignStatus === 2 ? (
                  <Grid item xs={3}>
                    <RHFAutocompleteCheckboxField
                      name="allocationTypeIds"
                      placeholder="Allocation Type"
                      options={filteredAllocationTypeMap}
                      control={control}
                    />
                  </Grid>
                ) : null}
                {allocationTypeUIds.includes(2) && (
                  <Grid item xs={3}>
                    <RHFAutocompleteCheckboxField
                      name="distributorIds"
                      placeholder="Distributor"
                      options={distributorsOptions}
                      control={control}
                    />
                  </Grid>
                )}
                {allocationTypeUIds.includes(3) && (
                  <Grid item xs={3}>
                    <RHFAutocompleteCheckboxField
                      name="outletIds"
                      placeholder="Outlet"
                      options={outletsOptions}
                      control={control}
                    />
                  </Grid>
                )}
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
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{ ml: 1 }}
                  startIcon={<VisibilityIcon />}
                >
                  View Data
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <AssetStockTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          assetInfo={assetInfo}
          expand={expand1}
        />
      </Container>
      {PopupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
      <AssetStockReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithTotal}
        assetInfo={assetInfo}
        fileName={fileName}
        reportName="Asset Stock View Report"
      />
    </FsBox>
  );
};

export default AssetStockView;
