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
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getAllActiveRepByDistriID,
  getDistributorsByCompanyUId,
  getItemWiseSummaryDetails,
} from "@/service/Report/item-wise-sale-summary-report.service";
import { invoiceDetailValidationSchema } from "@/utils/schemas/invoiceDetailValidationSchema";
import { useItemWiseSaleSummaryReportGenerate } from "./report/reportService";
import ItemWiseSaleSummaryReportDialog from "./components/itemWiseSaleSummaryReportDialog";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import {
  getDistriPriceListsById,
  getProductByDistributorWarehouseProductCategoryGroupUId,
  getProductCategoriesByDistributorUIdAndWarehouseUId,
  getProductGroupsByDistributorUIdAndWarehouseUId,
} from "@/service/inventory/distributor-stock.service";
import ItemWiseSaleSummaryReportTable from "./components/itemWiseSaleSummaryReportTable";

const ItemWiseSaleSummaryReport = () => {
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
  const [isRepresentativeSelected, setIsRepresentativeSelected] =
    useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDownError, setServerDownError] = useState(false);

  const companyList = useSelector((state) => state.companySlice.companies);
  const ds_PriceLists = useSelector(
    (state) => state.distributorStockSlice.priceLists
  );
  const distributorList = useSelector(
    (state) => state.itemWiseSalesSummaryReportSlice.distributorView
  );
  const representativeList = useSelector(
    (state) => state.itemWiseSalesSummaryReportSlice.repBydistri
  );
  const itemWiseDetails = useSelector(
    (state) => state.itemWiseSalesSummaryReportSlice.itemWiseDetails
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
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const methods = useForm<any>({
    resolver: yupResolver(invoiceDetailValidationSchema),
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
    name: [
      "companyUId",
      "distributorUId",
      "representativeUId",
      "productCategotiesUId",
      "productGroupsUId",
      "productUId",
    ],
  });

  const watchedFromDate = useWatch({ control, name: "fromDate" });
  const watchedToDate = useWatch({ control, name: "toDate" });
  let companyId = getValues("companyUId");
  let distributorId = getValues("distributorUId");
  let representativeId = getValues("representativeUId");
  let productCategoriesId = getValues("productCategotiesUId");
  let productGroupsId = getValues("productGroupsUId");
  let productUIds = getValues("productUId");

  const fetchCompanyData = async () => {
    try {
      await getAllCompany(undefined, undefined, undefined, "uId", "desc", true);
    } catch (error) {
      console.error("error", error);
    }
  };

  //fetch PriceListTypes
  const fetchGetPriceList = async (distributorId: number) => {
    try {
      await getDistriPriceListsById(distributorId);
    } catch (error) {
      setServerDownError(true);
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

  // productCategoriesOptions
  const fetchGetProductByDistributorWarehouseProductCategoryGroupUId =
    async () => {
      const requestData = {
        distributorId: distributorId,
        warehouseUIds: [],
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

  // productCategoriesOptions
  const fetchGetProductCategoriesByDistributorUId = async () => {
    if (!distributorId) return;
    const requestData = {
      distributorId: distributorId,
      warehouseUIds: [],
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
      warehouseUIds: [],
    };
    try {
      await getProductGroupsByDistributorUIdAndWarehouseUId(requestData);
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
      fetchGetPriceList(distributorId);
    }
    fetchGetProductByDistributorWarehouseProductCategoryGroupUId();
  }, [productGroupsId, productCategoriesId, distributorId]);

  useEffect(() => {
    if (distributorId) {
      fetchRepOptionsTo(distributorId);
      fetchGetProductCategoriesByDistributorUId();
      fetchGetProductGroupsByDistributorUId();
    }
  }, [distributorId]);

  useEffect(() => {
    setIsSearchClicked(false);
  }, [representativeId, productCategoriesId, productGroupsId, productUIds]);

  const calculateColumnSum = (rows: any, field: any) => {
    return rows?.reduce((acc: any, row: any) => acc + (row[field] || 0), 0);
  };

  const totalSaleQuantity = useMemo(
    () => calculateColumnSum(itemWiseDetails, "totalSaleQuantity"),
    [itemWiseDetails]
  );

  const totalDiscountQty = useMemo(
    () => calculateColumnSum(itemWiseDetails, "totalDiscountQty"),
    [itemWiseDetails]
  );

  const totalReturnValue = useMemo(
    () => calculateColumnSum(itemWiseDetails, "totalReturnValue"),
    [itemWiseDetails]
  );

  const netQty = useMemo(
    () => calculateColumnSum(itemWiseDetails, "netQty"),
    [itemWiseDetails]
  );

  const totalValue = useMemo(
    () => calculateColumnSum(itemWiseDetails, "totalValue"),
    [itemWiseDetails]
  );

  const totalVolume = useMemo(
    () => calculateColumnSum(itemWiseDetails, "totalVolume"),
    [itemWiseDetails]
  );

  const rowsWithTotal = useMemo(() => {
    const formattedItemWiseDetails = itemWiseDetails.map(
      (item: any, index: number) => ({
        id: index + 1,
        ...item,
      })
    );
    return [
      ...formattedItemWiseDetails,
      {
        id: formattedItemWiseDetails.length + 1,
        productID: "Total",
        totalSaleQuantity: totalSaleQuantity,
        totalDiscountQty: totalDiscountQty,
        totalReturnValue: totalReturnValue,
        netQty: netQty,
        totalValue: totalValue,
        totalVolume: totalVolume,
      },
    ];
  }, [itemWiseDetails]);

  const mapListToOptions = useCallback(
    (list: any[], labelKey: string, valueKey: string, prefixKey?: string) =>
      list.map((item) => ({
        label: prefixKey
          ? `${item[prefixKey]} - ${item[labelKey]}`
          : item[labelKey],
        value: item[valueKey],
      })),
    []
  );

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
  const distributorsOptions = useMemo(
    () =>
      mapListToOptions(distributorList, "distributorName", "distributorUId"),
    [distributorList, mapListToOptions]
  );
  const representativeOptions = useMemo(
    () => mapListToOptions(representativeList, "name", "uId"),
    [representativeList, mapListToOptions]
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
    () =>
      mapListToOptions(productsOptionsList, "productName", "uId", "productID"),
    [productsOptionsList, mapListToOptions]
  );

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
      setIsRepresentativeSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: null,
        representativeUId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    } else {
      setIsCompanySelected(false);
      setIsDistributorSelected(false);
      setIsRepresentativeSelected(false);
      reset({
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
    if (selectedDistributor) {
      setIsDistributorSelected(true);
      setIsRepresentativeSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: selectedDistributor,
        representativeId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
      });
    } else {
      setIsDistributorSelected(false);
      setIsRepresentativeSelected(false);
      reset({
        companyUId: selectedCompany,
        distributorUId: null,
        representativeId: null,
        fromDate: currentFromDate,
        toDate: currentToDate,
        productUId: null,
        productCategotiesUId: null,
        productGroupsUId: null,
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
      productUId: null,
      productCategotiesUId: null,
      productGroupsUId: null,
    });
  };

  const handleSearch = () => {
    fetchAllInvoiceDetails();
    setIsSearchClicked(true);
    setExpand1(false);
  };

  const fetchAllInvoiceDetails = async () => {
    setIsLoading(true);

    const requestData = {
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
      toDate: toDate ? toDate.toISOString().split("T")[0] : "",
      distributorUIds: distributorId ? [distributorId] : [],
      representativeUIds: representativeId ? [representativeId] : [],
      productUIds: productUIds ? [productUIds] : [],
    };
    try {
      await getItemWiseSummaryDetails(requestData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const {
    itemWiseSaleSummaryReportInfo,
    open,
    setOpen,
    fileName,
    handleClose,
  } = useItemWiseSaleSummaryReportGenerate(
    getValues,
    companiesOptions,
    distributorsOptions,
    representativeOptions,
    productsOptions
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
        pageTitle="Item Wise Sale Summary Report"
        pageNavigation={[
          {
            pageName: "Item Wise Sale Summary Report",
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
              Invoice Detail Information
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
                      placeholder="Product*"
                      // @ts-ignore
                      options={productsOptions}
                      control={control}
                      disabled={!isCompanySelected}
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
                    (((productCategoriesId?.length ?? 0) > 0 ||
                      (productGroupsId?.length ?? 0) > 0) &&
                      (productUIds?.length ?? 0) === 0)
                  }
                >
                  View Data
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <ItemWiseSaleSummaryReportTable
          rowsWithTotal={rowsWithTotal}
          isLoading={isLoading}
          isSearchClicked={isSearchClicked}
          fileName={fileName}
          setOpen={setOpen}
          invoiceDetailReportInfo={itemWiseSaleSummaryReportInfo}
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
      <ItemWiseSaleSummaryReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={rowsWithTotal}
        itemWiseSaleSummaryReportInfo={itemWiseSaleSummaryReportInfo}
        fileName={fileName}
        reportName="Item Wise Sale Summary Report"
      />
    </FsBox>
  );
};

export default ItemWiseSaleSummaryReport;
