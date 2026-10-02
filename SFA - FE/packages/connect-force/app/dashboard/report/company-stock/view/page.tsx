"use client";

import { RHFAutocompleteField } from "@/components/hook-form";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import RHFRadioGroup from "@/components/hook-form/RHFRadioGroup";
import PopupResponse from "@/components/popup/popup-response";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllCompany } from "@/service/company.service";
import {
  getAllCurrentStockDetailByCompanyId,
  getCompanyPriceLists,
  getProductByCompanyWarehouseProductCategoryGroupUId,
  getProductCategoriesByCompanyUIdAndWarehouseUId,
  getProductGroupsByCompanyUIdAndWarehouseUId,
  getWarehousesByCompanyUId,
} from "@/service/inventory/company-stock.service";
import { getAllProductsByCompanyIdIsTrue } from "@/service/mapping-service/companyProduct.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InventoryIcon from "@mui/icons-material/Inventory";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import CompanyStockReportDialog from "./components/CompanyStockReportDialog";
import "./components/CompanyStockView.css";
import CompanyStockTable from "./components/companyStockTable";
import { useCSReportGeneration } from "./report/reportService";
import { setPopupResponse } from "@/redux/slices/layout-slice";

interface StockItem {
  stockDetailId: number;
  productUId: number | string;
  productId: string;
  productName: string;
  quantity: number;
  volume: number;
  value: number;
}

const CompanyStockView = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [isCompanySelected, setIsCompanySelected] = useState(false);
  const [isPriceListTypeSelected, setIsPriceListTypeSelected] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedSummaryValue, setSelectedSummaryValue] = useState("Details");
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const companyList = useSelector((state) => state.companySlice.companies);
  const companyOptionsList = useSelector(
    (state) => state.companyStockSlice.companyOptionsStockView
  );
  const ds_PriceLists = useSelector(
    (state) => state.companyStockSlice.csPriceList
  );
  const warehouseOptionsList = useSelector(
    (state) => state.companyStockSlice.warehouseOptionsStockView
  );
  const productCategoriesOptionsList = useSelector(
    (state) => state.companyStockSlice.productCategoriesStockView
  );
  const productGroupsOptionsList = useSelector(
    (state) => state.companyStockSlice.productGroupsStockView
  );
  const productsOptionsList = useSelector(
    (state) => state.companyStockSlice.productsStockView
  );

  const methods = useForm<any>({
    mode: "all",
  });
  const { control, getValues, reset } = methods;

  useWatch({
    control,
    name: [
      "companyUId",
      "priceListUId",
      "warehouseUId",
      "productCategotiesUId",
      "productGroupsUId",
      "productUId",
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

  const totalQty = useMemo(
    () => calculateColumnSum(companyOptionsList, "quantity"),
    [companyOptionsList]
  );
  const totalVolume = useMemo(
    () => calculateColumnSum(companyOptionsList, "volume"),
    [companyOptionsList]
  );
  const totalValue = useMemo(
    () => calculateColumnSum(companyOptionsList, "totalValue"),
    [companyOptionsList]
  );

  const combinedCompanyOptionsList = useMemo(() => {
    const isSummary = selectedSummaryValue === "Summary";
    return combineRows(companyOptionsList, isSummary) as StockItem[];
  }, [companyOptionsList, selectedSummaryValue]);

  const rowsWithTotal = useMemo(() => {
    const stockView = combinedCompanyOptionsList || [];
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
  }, [combinedCompanyOptionsList, totalQty, totalVolume, totalValue]);

  let companyId = getValues("companyUId");
  let priceListTypeId = getValues("priceListUId");
  let warehouseId = getValues("warehouseUId");
  let productCategoriesId = getValues("productCategotiesUId");
  let productGroupsId = getValues("productGroupsUId");
  let productIds = getValues("productUId");

  const fetchCompanyData = async () => {
    try {
      await getAllCompany(undefined, undefined, undefined, "uId", "desc", true);
    } catch (error) {
      console.error("error", error);
    }
  };

  // GET /getPriceList/{distributorId}
  const fetchGetPriceList = async (companyId: number) => {
    try {
      await getCompanyPriceLists(companyId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const fetchWarehouseData = async (companyId: any) => {
    if (!companyId) return;
    try {
      await getWarehousesByCompanyUId(companyId);
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchProductData = async () => {
    if (!companyId) return;
    try {
      await getAllProductsByCompanyIdIsTrue(companyId);
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchGetProductCategoriesByCompanyUIdAndWarehouseUId = async () => {
    if (!companyId) return;
    const requestData = {
      companyId: companyId,
      warehouseUIds: warehouseId ? [warehouseId] : [],
    };
    try {
      await getProductCategoriesByCompanyUIdAndWarehouseUId(requestData);
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchGetProductGroupsByCompanyUIdAndWarehouseUId = async () => {
    if (!companyId) return;
    const requestData = {
      companyId: companyId,
      warehouseUIds: warehouseId ? [warehouseId] : [],
    };
    try {
      await getProductGroupsByCompanyUIdAndWarehouseUId(requestData);
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchGetProductByCompanyWarehouseProductCategoryGroupUId = async () => {
    if (!companyId) return;
    const requestData = {
      companyId: companyId,
      warehouseUIds: warehouseId ? [warehouseId] : [],
      productCategoryUIds: productCategoriesId ? [productCategoriesId] : [],
      productGroupUIds: productGroupsId ? [productGroupsId] : [],
    };
    try {
      await getProductByCompanyWarehouseProductCategoryGroupUId(requestData);
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchGetAllCurrentStockDetailByCompanyId = async () => {
    if (!companyId) return;
    setIsLoading(true);
    const requestData = {
      stockRoleTypeUId: 1,
      stockRefIds: companyId ? [companyId] : [],
      priceListTypeIds: priceListTypeId ? [priceListTypeId] : [],
      productIds: productIds ? [productIds] : [],
      wareHouseIds: warehouseId ? [warehouseId] : [],
      productGroupIds: productGroupsId ? [productGroupsId] : [],
      productCategoryIds: productCategoriesId ? [productCategoriesId] : [],
    };

    try {
      await getAllCurrentStockDetailByCompanyId(requestData);
    } catch (error) {
      setServerDownError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (isCompanySelected) {
      fetchProductData();
      fetchWarehouseData(companyId);
    } else setIsSearchClicked(false);
  }, [companyId]);

  useEffect(() => {
    if (isCompanySelected) {
      fetchGetProductCategoriesByCompanyUIdAndWarehouseUId();
      fetchGetProductGroupsByCompanyUIdAndWarehouseUId();
      fetchGetPriceList(companyId);
    } else setIsSearchClicked(false);
  }, [companyId, warehouseId]);

  useEffect(() => {
    fetchGetProductByCompanyWarehouseProductCategoryGroupUId();
  }, [companyId, warehouseId, productCategoriesId, productGroupsId]);

  useEffect(() => {
    setIsSearchClicked(false);
  }, [companyId, warehouseId, productCategoriesId, productGroupsId]);

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const companiesOptions = useMemo(
    () => mapListToOptions(companyList, "companyName", "uId"),
    [companyList, mapListToOptions]
  );
  const priceListOptions = useMemo(() => {
    if (!Array.isArray(ds_PriceLists)) return [];

    return mapListToOptions(
      ds_PriceLists.filter((item: any) => item.priceListTypeName !== null),
      "priceListTypeName",
      "priceListTypeUId"
    );
  }, [ds_PriceLists, mapListToOptions]);
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
    reset({
      companyUId: null,
      priceListUId: null,
      warehouseUId: null,
      productUId: null,
      productCategotiesUId: null,
      productGroupsUId: null,
    });
    setIsSearchClicked(false);
  };

  const handleCompanyChange = () => {
    const selectedCompany = getValues("companyUId");
    if (selectedCompany) {
      setIsCompanySelected(true);
      reset({
        companyUId: selectedCompany,
        priceListUId: null,
        warehouseUId: null,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    } else {
      setIsCompanySelected(false);
      reset({
        companyUId: null,
        priceListUId: null,
        warehouseUId: null,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    }
  };

  const handlePriceListChange = () => {
    const selectedCompany = getValues("companyUId");
    const selectedPriceList = getValues("priceListUId");
    if (selectedPriceList) {
      setIsPriceListTypeSelected(true);
      reset({
        companyUId: selectedCompany,
        priceListUId: selectedPriceList,
        warehouseUId: null,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    } else {
      setIsPriceListTypeSelected(false);
      reset({
        companyUId: selectedCompany,
        priceListUId: null,
        warehouseUId: null,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    }
  };

  const handleSearch = () => {
    fetchGetAllCurrentStockDetailByCompanyId();
    setIsSearchClicked(true);
    setExpand1(false);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const { companyInfo, open, setOpen, fileName, handleClose } =
    useCSReportGeneration(
      getValues,
      companiesOptions,
      priceListOptions,
      warehousesOptions,
      productCategoriesOptions,
      productGroupsOptions,
      productsOptions
    );

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Company Stock View"
        pageNavigation={[
          {
            pageName: "Company Stock",
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
              Company Stock Information
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
                    name="priceListUId"
                    placeholder="Price List*"
                    options={priceListOptions}
                    control={control}
                    onChange={handlePriceListChange}
                    disabled={!isCompanySelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="warehouseUId"
                    placeholder="Warehouse"
                    options={warehousesOptions}
                    control={control}
                    disabled={!isCompanySelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="productCategotiesUId"
                    placeholder="Product Category"
                    options={productCategoriesOptions}
                    control={control}
                    disabled={!isCompanySelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="productGroupsUId"
                    placeholder="Product Group"
                    options={productGroupsOptions}
                    control={control}
                    disabled={!isCompanySelected}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteCheckboxField
                    name="productUId"
                    placeholder="Product"
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
                  disabled={!isCompanySelected || !isPriceListTypeSelected}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{ ml: 1 }}
                  startIcon={<VisibilityIcon />}
                  disabled={!isCompanySelected || !isPriceListTypeSelected}
                >
                  View Data
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <CompanyStockTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          companyInfo={companyInfo}
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
      <CompanyStockReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithTotal}
        companyInfo={companyInfo}
        fileName={fileName}
        selectedSummaryValue={selectedSummaryValue}
        reportName={`Company Stock View Report - ${selectedSummaryValue}`}
      />
    </FsBox>
  );
};

export default CompanyStockView;
