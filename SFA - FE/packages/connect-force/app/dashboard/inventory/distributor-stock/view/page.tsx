"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { dispatch, useSelector } from "@/redux/store";
import {
  getAllCurrentStockDetailByDistributorId,
  getProductByDistributorWarehouseProductCategoryGroupUId,
  getDistributorsByCompanyUId,
  getProductCategoriesByDistributorUIdAndWarehouseUId,
  getProductGroupsByDistributorUIdAndWarehouseUId,
  getDistriPriceListsById,
  getAllWarehouseCategoryDetails,
} from "@/service/inventory/distributor-stock.service";
import { getAllCompany } from "@/service/company.service";
import { getAllProductsByCompanyIdIsTrue } from "@/service/mapping-service/companyProduct.service";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { RHFAutocompleteField } from "@/components/hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { PATH_DASHBOARD } from "@/routes/paths";
import PopupResponse from "@/components/popup/popup-response";
import DistributorStockTable from "./components/distributorStockTable";
import { useDSReportGeneration } from "./report/reportService";
import DistributorStockReportDialog from "./components/DistributorStockReportDialog";
import RHFRadioGroup from "@/components/hook-form/RHFRadioGroup";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./components/DistributorStockView.css";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { getWarehousesByDistributorUIdAndWarehouseCatId } from "@/service/warehouse";

interface StockItem {
  stockDetailId: number;
  productUId: number | string;
  productId: string;
  productName: string;
  quantity: number;
  volume: number;
  value: number;
}

const DistributorStockView = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [isCompanySelected, setIsCompanySelected] = useState(false);
  const [isWarehouseCategorySelected, setIsWarehouseCategorySelected] =
    useState(false);
  const [isDistributorSelected, setIsDistributorSelected] = useState(false);
  const [isPriceListTypeSelected, setIsPriceListTypeSelected] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expand1, setExpand1] = useState(true);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedSummaryValue, setSelectedSummaryValue] = useState("Details");
  const [isWarehouseValid, setIsWarehouseValid] = useState(true);

  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const companyList = useSelector((state) => state.companySlice.companies);
  const distributorList = useSelector(
    (state) => state.distributorStockSlice.distributorView
  );
  const distributorOptionsList = useSelector(
    (state) => state.distributorStockSlice.distributorOptionsStockView
  );
  const filteredDistributorOptionsList = useMemo(
    () => distributorOptionsList.filter((row: any) => row.quantity !== 0),
    [distributorOptionsList]
  );
  const ds_PriceLists = useSelector(
    (state) => state.distributorStockSlice.priceLists
  );
  const warehouseOptionsList = useSelector(
    (state) => state.distributorStockSlice.warehouseOptionsStockView
  );
  const productCategoriesOptionsList = useSelector(
    (state) => state.distributorStockSlice.productCategoriesStockView
  );
  const productGroupsOptionsList = useSelector(
    (state) => state.distributorStockSlice.productGroupsStockView
  );
  const productsOptionsList = useSelector(
    (state) => state.distributorStockSlice.productsStockView
  );
  const warehouseCategoryOptionsList = useSelector(
    (state) => state.distributorStockSlice.warehouseCategories
  );
  const methods = useForm<any>({
    mode: "all",
  });
  const { control, getValues, reset } = methods;
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useWatch({
    control,
    name: [
      "companyUId",
      "distributorUId",
      "priceListUId",
      "warehouseUId",
      "productCategotiesUId",
      "productGroupsUId",
      "productUId",
      "warehouseCategoryUId",
    ],
  });

  const calculateColumnSum = (rows: any, field: any) => {
    return rows?.reduce((acc: any, row: any) => acc + (row[field] || 0), 0);
  };

  const combineRows = (rows: any, isSummary: boolean) => {
    const combinedRows = rows.reduce((acc: any, row: any) => {
      // If in Summary mode, omit the 'mrp' in the key
      const key = isSummary
        ? `${row.productUId}-${row.productName}-${row.productGroupName}-${row.productCategoryName}`
        : `${row.productUId}-${row.productName}-${row.productGroupName}-${row.productCategoryName}-${row.mrp}`;

      if (!acc[key]) {
        acc[key] = { ...row };
      } else {
        acc[key].quantity += row.quantity;
        acc[key].volume += row.volume;
        acc[key].totalValue += row.totalValue;
      }
      return acc;
    }, {});

    return Object.values(combinedRows);
  };

  const combinedDistributorOptionsList = useMemo(() => {
    const isSummary = selectedSummaryValue === "Summary";
    return combineRows(filteredDistributorOptionsList, isSummary) as StockItem[];
  }, [filteredDistributorOptionsList, selectedSummaryValue]);

  const totalQty = useMemo(
    () => calculateColumnSum(filteredDistributorOptionsList, "quantity"),
    [filteredDistributorOptionsList]
  );
  const totalVolume = useMemo(
    () => calculateColumnSum(filteredDistributorOptionsList, "volume"),
    [filteredDistributorOptionsList]
  );
  const totalValue = useMemo(
    () => calculateColumnSum(filteredDistributorOptionsList, "totalValue"),
    [filteredDistributorOptionsList]
  );

  const rowsWithTotal = useMemo(() => {
    const stockView = combinedDistributorOptionsList || [];
    const maxStockDetailId = stockView.reduce(
      (max, item) => Math.max(max, item.stockDetailId),
      0
    );

    return [
      ...stockView,
      {
        stockDetailId: maxStockDetailId + 1,
        productUId: "Total",
        quantity: totalQty,
        volume: totalVolume,
        totalValue: totalValue,
      },
    ];
  }, [combinedDistributorOptionsList, totalQty, totalVolume, totalValue]);

  let companyId = getValues("companyUId");
  let distributorId = getValues("distributorUId");
  let priceListTypeId = getValues("priceListUId");
  let warehouseCategoryId = getValues("warehouseCategoryUId");
  let warehouseId = getValues("warehouseUId");
  let productCategoriesId = getValues("productCategotiesUId");
  let productGroupsId = getValues("productGroupsUId");
  let productIds = getValues("productUId");

  const warehouseCategoryWatchId = useWatch({ control, name: "warehouseCategoryUId" });
  const warehouseWatchId = useWatch({ control, name: "warehouseUId" });

  useEffect(() => {
    const valid =
      !warehouseCategoryWatchId ||
      (warehouseCategoryWatchId && warehouseWatchId?.length > 0);

    setIsWarehouseValid(valid);
  }, [warehouseCategoryWatchId, warehouseWatchId]);

  // companyOptions
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

  // GET /getPriceList/{distributorId}
  const fetchGetPriceList = async (distributorId: number) => {
    try {
      await getDistriPriceListsById(distributorId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // warehouseOptions Vehicle
  const fetchNewWarehouseData = async (
    distributorId: any,
    warehouseCategoryId: any
  ) => {
    try {
      await getWarehousesByDistributorUIdAndWarehouseCatId(distributorId, warehouseCategoryId);
    } catch (error) {
      console.error("error", error);
    }
  };

  // productCategoriesOptions
  const fetchProductData = async () => {
    try {
      await getAllProductsByCompanyIdIsTrue(companyId);
    } catch (error) {
      console.error("error", error);
    }
  };

  // productCategoriesOptions
  const fetchGetProductCategoriesByDistributorUId = async () => {
    if (!distributorId) return;
    const requestData = {
      distributorId: distributorId,
      warehouseUIds: warehouseId ? [warehouseId] : [],
    };
    try {
      await getProductCategoriesByDistributorUIdAndWarehouseUId(requestData);
    } catch (error) {
      console.error("error", error);
    }
  };

  // productGroupsOptions
  const fetchGetProductGroupsByDistributorUId = async () => {
    if (!distributorId) return;
    const requestData = {
      distributorId: distributorId,
      warehouseUIds: warehouseId ? [warehouseId] : [],
    };
    try {
      await getProductGroupsByDistributorUIdAndWarehouseUId(requestData);
    } catch (error) {
      console.error("error", error);
    }
  };

  // productsOptions
  const fetchGetProductByDistributorWarehouseProductCategoryGroupUId =
    async () => {
      const requestData = {
        distributorId: distributorId,
        warehouseUIds: warehouseId ? [warehouseId] : [],
        productCategoryUIds: productCategoriesId ? [productCategoriesId] : [],
        productGroupUIds: productGroupsId ? [productGroupsId] : [],
      };
      try {
        await getProductByDistributorWarehouseProductCategoryGroupUId(
          requestData
        );
      } catch (error) {
        console.error("error", error);
      }
    };

  // WarehouseCategory Options
  const GetAllWarehouseCategoryDetails = async () => {
    try {
      await getAllWarehouseCategoryDetails(
        undefined,
        undefined,
        undefined,
        "uId",
        "desc"
      );
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchGetAllCurrentStockDetailByDistributorId = async () => {
    setIsLoading(true);
    const requestData = {
      stockRefIds: distributorId ? [distributorId] : [],
      priceListTypeIds: priceListTypeId ? [priceListTypeId] : [],
      wareHouseIds: warehouseId ? [warehouseId] : [],
      productIds: productIds ? [productIds] : [],
      productGroupIds: productGroupsId ? [productGroupsId] : [],
      productCategoryIds: productCategoriesId ? [productCategoriesId] : [],
    };
    
    try {
      await getAllCurrentStockDetailByDistributorId(requestData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
    GetAllWarehouseCategoryDetails();
  }, []);

  useEffect(() => {
    fetchProductData();
    if (companyId) {
      fetchDistributorData(companyId);
    }
    if (distributorId) {
      fetchGetProductCategoriesByDistributorUId();
      fetchGetProductGroupsByDistributorUId();
      fetchGetPriceList(distributorId);
    }
    if (warehouseCategoryId) {
      fetchNewWarehouseData(distributorId, warehouseCategoryId);
    }
  }, [companyId, distributorId, warehouseId, warehouseCategoryId]);

  useEffect(() => {
    fetchGetProductByDistributorWarehouseProductCategoryGroupUId();
  }, [distributorId, warehouseId, productCategoriesId, productGroupsId]);

  useEffect(() => {
    setIsSearchClicked(false);
  }, [
    companyId,
    distributorId,
    warehouseCategoryId,
    warehouseId,
    productCategoriesId,
    productGroupsId,
  ]);

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

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
  const priceListOptions = useMemo(() => {
    if (!Array.isArray(ds_PriceLists)) return [];

    return mapListToOptions(
      ds_PriceLists.filter((item: any) => item.priceListTypeName !== null),
      "priceListTypeName",
      "priceListTypeUId"
    );
  }, [ds_PriceLists, mapListToOptions]);
  const warehouseCategoryOptions = useMemo(
    () =>
      mapListToOptions(
        warehouseCategoryOptionsList.filter(
          (item: any) =>
            item.category === "Vehicle" || item.category === "Distributor"
        ),
        "category",
        "uId"
      ),
    [warehouseCategoryOptionsList, mapListToOptions]
  );

  const warehousesOptions = useMemo(
    () => mapListToOptions(warehouseOptionsList, "name", "uId"),
    [warehouseOptionsList, mapListToOptions]
  );
  const productCategoriesOptions = useMemo(
    () => mapListToOptions(productCategoriesOptionsList, "categoryName", "uId"),
    [productCategoriesOptionsList, mapListToOptions]
  );
  const productGroupsOptions = useMemo(
    () => mapListToOptions(productGroupsOptionsList, "productGroupName", "uId"),
    [productGroupsOptionsList, mapListToOptions]
  );
  const productsOptions = useMemo(
    () => mapListToOptions(productsOptionsList, "productName", "uId"),
    [productsOptionsList, mapListToOptions]
  );

  const handleRadioChange = (value: any) => {
    setSelectedSummaryValue(value);
  };

  const handleReset = () => {
    setIsCompanySelected(false);
    setIsWarehouseCategorySelected(false);
    setIsDistributorSelected(false);
    setIsPriceListTypeSelected(false);
    reset({
      companyUId: null,
      distributorUId: null,
      priceListUId: null,
      warehouseCategoryUId: null,
      warehouseUId: null,
      productUId: null,
      productCategotiesUId: null,
      productGroupsUId: null,
    });
    setIsSearchClicked(false);
  };

  const handleCompanyChange = () => {
    const selectedCompany = getValues("companyUId");
    if (!selectedCompany) {
      setIsCompanySelected(false);
      setIsDistributorSelected(false);
      setIsWarehouseCategorySelected(false);
      setIsPriceListTypeSelected(false);
      reset({
        companyUId: null,
        distributorUId: null,
        priceListUId: null,
        warehouseCategoryUId: null,
        warehouseUId: null,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    } else {
      setIsCompanySelected(true);
      setIsDistributorSelected(false);
      setIsWarehouseCategorySelected(false);
      setIsPriceListTypeSelected(false);
    }
  };

  const handleDistributorChange = () => {
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    if (selectedDistributor) {
      setIsDistributorSelected(true);
      reset({
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        warehouseCategoryUId: null,
        warehouseUId: null,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    } else {
      setIsDistributorSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: null,
        warehouseCategoryUId: null,
        warehouseUId: null,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    }
    setIsSearchClicked(false);
  };

  const handlePriceListChange = () => {
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    const selectedPriceList = getValues("priceListUId");
    const selectedWarehouseCategory = getValues("warehouseCategoryUId");
    const selectedWarehouse = getValues("warehouseUId");
    if (selectedPriceList) {
      setIsPriceListTypeSelected(true);
      reset({
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        priceListUId: selectedPriceList,
        warehouseCategoryUId: selectedWarehouseCategory,
        warehouseUId: selectedWarehouse,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    } else {
      setIsPriceListTypeSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        priceListUId: null,
        warehouseCategoryUId: selectedWarehouseCategory,
        warehouseUId: selectedWarehouse,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    }
    setIsSearchClicked(false);
  };

  const handleWarehouseCategoryChange = () => {
    const selectedCompany = getValues("companyUId");
    const selectedDistributor = getValues("distributorUId");
    const selectedPriceList = getValues("priceListUId");
    const selectedWarehouseCategory = getValues("warehouseCategoryUId");
    if (selectedWarehouseCategory) {
      setIsWarehouseCategorySelected(true);
      reset({
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        priceListUId: selectedPriceList,
        warehouseCategoryUId: selectedWarehouseCategory,
        warehouseUId: null,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    } else {
      setIsWarehouseCategorySelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        priceListUId: selectedPriceList,
        warehouseCategoryUId: null,
        warehouseUId: null,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    }
    setIsSearchClicked(false);
  };

  const handleSearch = () => {
    fetchGetAllCurrentStockDetailByDistributorId();
    setIsSearchClicked(true);
    setExpand1(false);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  // Report generation
  const { distributorInfo, open, setOpen, fileName, handleClose } =
    useDSReportGeneration(
      getValues,
      companiesOptions,
      distributorsOptions,
      priceListOptions,
      warehousesOptions,
      productCategoriesOptions,
      productGroupsOptions,
      productsOptions
    );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Stock View"
        pageNavigation={[
          {
            pageName: "Distributor Stock",
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
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
                ml: 1,
              }}
            >
              Distributor Stock Information
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
                    disabled={!isCompanySelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteField
                    name="priceListUId"
                    placeholder="Price List*"
                    options={priceListOptions}
                    control={control}
                    onChange={handlePriceListChange}
                    disabled={!isDistributorSelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteField
                    name="warehouseCategoryUId"
                    placeholder="Warehouse Category"
                    options={warehouseCategoryOptions}
                    control={control}
                    onChange={handleWarehouseCategoryChange}
                    disabled={!isDistributorSelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="warehouseUId"
                    placeholder="Warehouse"
                    // @ts-ignore
                    options={warehousesOptions}
                    control={control}
                    disabled={!isWarehouseCategorySelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="productCategotiesUId"
                    placeholder="Product Category"
                    // @ts-ignore
                    options={productCategoriesOptions}
                    control={control}
                    disabled={!isCompanySelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="productGroupsUId"
                    placeholder="Product Group"
                    // @ts-ignore
                    options={productGroupsOptions}
                    control={control}
                    disabled={!isCompanySelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="productUId"
                    placeholder="Product"
                    // @ts-ignore
                    options={productsOptions}
                    control={control}
                    disabled={!isCompanySelected}
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
                  disabled={
                    !isDistributorSelected ||
                    !isCompanySelected ||
                    !isPriceListTypeSelected ||
                    !isWarehouseValid
                  }
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{ ml: 1 }}
                  startIcon={<VisibilityIcon />}
                  disabled={
                    !isDistributorSelected ||
                    !isCompanySelected ||
                    !isPriceListTypeSelected ||
                    !isWarehouseValid
                  }
                >
                  View Data
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <DistributorStockTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          distributorInfo={distributorInfo}
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
      <DistributorStockReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithTotal}
        distributorInfo={distributorInfo}
        fileName={fileName}
        selectedSummaryValue={selectedSummaryValue}
        reportName={`Distributor Stock View Report - ${selectedSummaryValue}`}
      />
    </FsBox>
  );
};

export default DistributorStockView;
