"use client";

import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import {
  setWarehouseStockTransferError,
  setWarehouseStockTransferMessage,
} from "@/redux/slices/warehouse-stock-transfer-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllCompany } from "@/service/company.service";
import {
  createCompanyWarehouseStockTransfer,
  getProductByCompanyANDWarehouseUId,
  getWarehousesByCompanyUId,
} from "@/service/companyStockTransfer.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStockViewStyleMappers } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { companyWarehouseStockTransferSchema } from "@/utils/schemas/companyWarehouseStockTransferSchema";
import { mapListToOptions } from "@/utils/sortUtils";
import { extractProductName } from "@/utils/wordFilters";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  Business as BusinessIcon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getStockColumns } from "../components/add/getStockColumns";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

interface ProductDetails {
  productUID: number;
  productID: string;
  productName: string;
  mrp: number;
  rate: number;
  batchNumber: string;
  availableStock: number;
  uom: string;
  uomQty: number;
  uId: number;
  isArchive: boolean;
  active: boolean;
  creationDate: string;
  modifiedDate: string;
  totalRecordCount: number;
  createdBy: number;
  modifiedBy: number;
}

const CompanyWarehouseStockTransferAddPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [isCompanySelected, setIsCompanySelected] = useState(false);
  const [isFromWarehouseSelected, setIsFromWarehouseSelected] = useState(false);
  const [rows, setRows] = useState([] as any[]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<ProductDetails | null>(null);
  const [expand1, setExpand1] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const responseMessage = useSelector(
    (state) => state.warehouseStockTransferSlice.message
  );
  const responseError = useSelector(
    (state) => state.warehouseStockTransferSlice.error
  );

  const companyList = useSelector((state) => state.companySlice.companies);

  const company_stock_FromWarehouseList = useSelector(
    (state) => state.warehouseStockTransferSlice.CompanyStockFromWarehouses
  );
  const company_stock_ReceivingWarehouseList = useSelector(
    (state) => state.warehouseStockTransferSlice.CompanyStockReceivingWarehouses
  );
  const company_Warehouse_ST_Products = useSelector(
    (state) => state.warehouseStockTransferSlice.Company_Warehouse_ST_Products
  );

  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const companyOptions = useMemo(
    () => mapListToOptions(companyList, "companyName", "uId"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companyList, mapListToOptions]
  );

  const fromWarehouseList = useMemo(
    () => mapListToOptions(company_stock_FromWarehouseList, "name", "uId"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [company_stock_FromWarehouseList, mapListToOptions]
  );
  const receivingWarehouseList = useMemo(
    () => mapListToOptions(company_stock_ReceivingWarehouseList, "name", "uId"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [company_stock_ReceivingWarehouseList, mapListToOptions]
  );

  const productList = useMemo(() => {
    if (!Array.isArray(company_Warehouse_ST_Products)) return [];
    return company_Warehouse_ST_Products.map((product, index) => ({
      label: product.productName,
      value: `${product.productUID}-${product.mrp}`,
    }));
  }, [company_Warehouse_ST_Products]);

  // Function to get productUId from productUId
  const getProductUId = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[0]);
  };

  // Function to get mrp from productUId
  const getProductMRP = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[1]);
  };

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(companyWarehouseStockTransferSchema),
    defaultValues: {
      stockTransferId: "",
      stockTransferDate: dayjs().format("YYYY-MM-DD"),
      companyUId: null,
      fromWarehouseUId: null,
      recivingWarehouseUId: null,
      totalVolume: "",
      totalValue: "",
      productUId: null,
      quantity: "",
    },
  });

  const {
    control,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const fromWarehouseUId = watch("fromWarehouseUId");
  const recivingWarehouseUId = watch("recivingWarehouseUId");
  const productIDstring = getValues("productUId");

  const filteredFromWarehouseList = useMemo(() => {
    return fromWarehouseList.filter(
      (warehouse) => warehouse.value !== recivingWarehouseUId
    );
  }, [fromWarehouseList, recivingWarehouseUId]);

  // Filter options for "Receiving Warehouse"
  const filteredReceivingWarehouseList = useMemo(() => {
    return receivingWarehouseList.filter(
      (warehouse) => warehouse.value !== fromWarehouseUId
    );
  }, [receivingWarehouseList, fromWarehouseUId]);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const company = useWatch({
    control,
    name: "companyUId",
  });
  const fromWarehouse = useWatch({
    control,
    name: "fromWarehouseUId",
  });
  const receivingWarehouse = useWatch({
    control,
    name: "recivingWarehouseUId",
  });

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setWarehouseStockTransferMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setWarehouseStockTransferError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  useWatch({
    control,
    name: ["productUId", "quantity", "fromWarehouseUId", "companyUId"],
  });

  const fetchCompanyData = async () => {
    try {
      await Promise.all([
        getAllCompany(
          undefined,
          undefined,
          undefined,
          "companyName",
          "asc",
          true
        ),
      ]);
    } catch (error) {
      enqueueSnackbar(`Error in getting company data`, { variant: "error" });
    }
  };

  const fetchWarehouseByCompany = async (CompanyId: number) => {
    try {
      await getWarehousesByCompanyUId(CompanyId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const fetchProductByCompanyANDWarehouse = async (
    companyId: number,
    warehouseId: number
  ) => {
    try {
      await getProductByCompanyANDWarehouseUId(companyId, warehouseId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    setRows([]);
    reset({
      ...getValues(),
      fromWarehouseUId: null,
      recivingWarehouseUId: null,
    });
    if (company !== null) {
      fetchWarehouseByCompany(company);
      setIsCompanySelected(true);
    } else {
      setIsCompanySelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  useEffect(() => {
    setRows([]);
    setValue("productUId", null);
    setValue("quantity", "");
    const isFormValid = fromWarehouse && company && receivingWarehouse;
    setSubmitDisabled(!isFormValid);

    if (isFormValid) {
      fetchProductByCompanyANDWarehouse(company, fromWarehouse);
      setIsFromWarehouseSelected(true);
    } else {
      setIsFromWarehouseSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromWarehouse, company, receivingWarehouse]);

  useEffect(() => {
    setRows([]);
  }, [receivingWarehouse]);

  useEffect(() => {
    if (Array.isArray(company_Warehouse_ST_Products)) {
      const selectedProduct = company_Warehouse_ST_Products.find(
        (product) =>
          product.productUID === getProductUId(productIDstring) &&
          product.mrp === getProductMRP(productIDstring)
      );
      setSelectedProductDetails(selectedProduct);
    } else {
      setSelectedProductDetails(null);
    }
  }, [getValues("productUId"), company_Warehouse_ST_Products]);

  const totalVolumePlus = parseFloat(
    rows
      .reduce((acc, row) => {
        const value = parseFloat(row.volume);
        return value > 0 ? acc + value : acc;
      }, 0.0)
      .toFixed(2)
  );

  const totalValuePlus = parseFloat(
    rows
      .reduce((acc, row) => {
        return row.value > 0 ? acc + parseFloat(row.value) : acc;
      }, 0.0)
      .toFixed(2)
  );

  const handleAddProduct = () => {
    const currentQuantity = getValues("quantity");
    let stockUpdate = parseFloat(currentQuantity);
    let volume = (selectedProductDetails?.uomQty ?? 0) * stockUpdate;
    let value = (selectedProductDetails?.mrp ?? 0) * stockUpdate;

    const existingProduct = rows.find(
      (row) =>
        row.uId === selectedProductDetails?.productUID &&
        row.mrp === selectedProductDetails?.mrp
    );
    const alreadyAddedQty = existingProduct?.stockUpdate ?? 0;
    const totalRequestedQty = alreadyAddedQty + Number(currentQuantity);

    if (selectedProductDetails?.availableStock === 0) {
      enqueueSnackbar(
        `Product: ${selectedProductDetails?.productID} is not available in stock.`,
        { variant: "error" }
      );
      return;
    } else if (
      (selectedProductDetails?.availableStock ?? 0) < currentQuantity
    ) {
      enqueueSnackbar(
        `Product: ${selectedProductDetails?.productID} available stock is less than quantity`,
        { variant: "error" }
      );
    } else if (
      (selectedProductDetails?.availableStock ?? 0) < totalRequestedQty
    ) {
      enqueueSnackbar(
        `Product: ${selectedProductDetails?.productID} available stock is less than quantity.`,
        { variant: "error" }
      );
      return;
    } else {
      const existingProductIndex = rows.findIndex(
        (row) =>
          row.uId === selectedProductDetails?.productUID &&
          row.mrp === selectedProductDetails?.mrp
      );
      if (existingProductIndex !== -1) {
        // Update existing product
        const updatedRows = rows.map((row, index) => {
          if (index === existingProductIndex) {
            return {
              ...row,
              stockUpdate: row.stockUpdate + stockUpdate,
              volume: row.volume + volume,
              value: row.value + value,
            };
          }
          return row;
        });
        setRows(updatedRows);
      } else {
        const uniqueId = `${selectedProductDetails?.productUID}-${selectedProductDetails?.mrp
          }-${Date.now()}`;
        const newProduct = {
          id: uniqueId,
          uId: selectedProductDetails?.productUID,
          productID: selectedProductDetails?.productID,
          productName: extractProductName(
            selectedProductDetails?.productName || ""
          ),
          availableStock: selectedProductDetails?.availableStock,
          uom: selectedProductDetails?.uom,
          uomQty: selectedProductDetails?.uomQty,
          mrp: selectedProductDetails?.mrp,
          rate: selectedProductDetails?.rate,
          stockUpdate: stockUpdate,
          volume: volume,
          value: value,
        };
        setRows([newProduct, ...rows]);
      }

      reset({
        ...getValues(),
        productUId: null,
        quantity: "",
      });
    }
  };

  const handleDelete = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleReset = () => {
    reset({
      stockTransferId: "",
      stockTransferDate: dayjs().format("YYYY-MM-DD"),
      companyUId: null,
      fromWarehouseUId: null,
      recivingWarehouseUId: null,
      totalVolume: "",
      totalValue: "",
      productUId: null,
      quantity: "",
    });
    setRows([]);
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const payload = {
      warehouseStockTransferHeader: {
        companyUId: formData.companyUId,
        distributorUId: null,
        stockTransferId: "string",
        stockTransferDate: formData.stockTransferDate,
        fromWarehouseUId: formData.fromWarehouseUId,
        recivingWarehouseUId: formData.recivingWarehouseUId,
        totalVolume: totalVolumePlus,
        totalValue: totalValuePlus,
        status: 0,
      },
      warehouseStockTransferDetails: rows.map((row) => ({
        productUId: row.uId,
        productName: row.productName,
        mrp: row.mrp,
        stockAvailable: row.availableStock,
        transferQuantity: parseFloat(row.stockUpdate),
        volume: parseFloat(row.volume),
        value: parseFloat(row.value),
      })),
    };

    try {
      await createCompanyWarehouseStockTransfer(payload);
      handleReset();
      router.push(
        PATH_DASHBOARD.companyStock.companyWarehouseStockTransfer.list
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      handleReset();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const payload = {
      warehouseStockTransferHeader: {
        companyUId: formData.companyUId,
        distributorUId: null,
        stockTransferId: "string",
        stockTransferDate: formData.stockTransferDate,
        fromWarehouseUId: formData.fromWarehouseUId,
        recivingWarehouseUId: formData.recivingWarehouseUId,
        totalVolume: totalVolumePlus,
        totalValue: totalValuePlus,
        status: 1,
      },
      warehouseStockTransferDetails: rows.map((row) => ({
        productUId: row.uId,
        productName: row.productName,
        mrp: row.mrp,
        stockAvailable: row.availableStock,
        transferQuantity: parseFloat(row.stockUpdate),
        volume: parseFloat(row.volume),
        value: parseFloat(row.value),
      })),
    };
    try {
      await createCompanyWarehouseStockTransfer(payload);
      handleReset();
      router.push(
        PATH_DASHBOARD.companyStock.companyWarehouseStockTransfer.list
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      handleReset();
    }
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Company Warehouse Stock Transfer"
        pageNavigation={[
          {
            pageName: "Company Warehouse Stock Transfer",
            path: PATH_DASHBOARD.companyStock.companyWarehouseStockTransfer
              .list,
          },
          { pageName: "Add" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        icon={<BusinessIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <FormProvider methods={methods} onSubmit={handleSubmit}>
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
                  flexGrow: 1,
                }}
              >
                Company Warehouse Stock Transfer Details
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
                    <RHFTextField
                      name="stockTransferDate"
                      label="Date*"
                      disabled
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  mt={2}
                >
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="companyUId"
                      placeholder="Company*"
                      options={companyOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autoComplete: "off",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="fromWarehouseUId"
                      placeholder="From Warehouse*"
                      options={filteredFromWarehouseList}
                      control={control}
                      inputProps={{
                        form: {
                          autoComplete: "off",
                        },
                      }}
                      disabled={!isCompanySelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="recivingWarehouseUId"
                      placeholder="Receiving Warehouse*"
                      options={filteredReceivingWarehouseList}
                      control={control}
                      inputProps={{
                        form: {
                          autoComplete: "off",
                        },
                      }}
                      disabled={!isCompanySelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={handleReset}
                        startIcon={<RestartAltIcon />}
                      >
                        Reset
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Card
            sx={{
              backgroundColor: "#fff",
              minHeight: !expand1 ? "80vh" : "65vh",
            }}
          >
            <CardContent>
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2, alignItems: "stretch" }}
                >
                  <Grid item xs={8}>
                    <RHFAutocompleteField
                      name="productUId"
                      placeholder="Select Product"
                      options={productList}
                      control={control}
                      inputProps={{
                        form: {
                          autoComplete: "off",
                        },
                      }}
                      disabled={!isFromWarehouseSelected}
                    />
                  </Grid>
                  <Grid item xs={2.5}>
                    <RHFTextField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      disabled={!getValues("productUId")}
                      onKeyDown={(e) => {
                        if (
                          e.key === "-" ||
                          e.key === "+" ||
                          e.key === "e" ||
                          e.key === "," ||
                          e.key === "."
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleAddProduct}
                      disabled={!!errors.quantity || !getValues("quantity")}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>

                <DataGrid
                  sx={{
                    ...dataGridStockViewStyleMappers,
                  }}
                  rows={rows}
                  autoHeight
                  columns={getColumnsWithTooltip(getStockColumns(handleDelete))}
                  density="compact"
                  hideFooter
                  disableRowSelectionOnClick
                  disableColumnMenu
                />

                <Grid
                  container
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                  sx={{ mt: 10 }}
                >
                  <Grid item xs={2.5}>
                    <Box sx={{ width: "100%", borderRadius: 1 }}>
                      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#F3EFFF" }}>
                              <TableCell align="center">
                                <Typography fontSize={13} color="textSecondary">
                                  <strong>Total Volume</strong>
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography fontSize={13} color="textSecondary">
                                  <strong>Total Value</strong>
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell align="center">
                                <Chip
                                  label={`${formatVolume3Decimals(totalVolumePlus)}`}
                                  size="small"
                                  variant="soft"
                                  color="success"
                                  sx={{ borderRadius: 1 }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${formatCurrency(totalValuePlus)}`}
                                  size="small"
                                  variant="soft"
                                  color="success"
                                  sx={{ borderRadius: 1 }}
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ mt: 2 }}
                  justifyContent={"right"}
                  alignItems={"right"}
                >
                  <Grid item xs={5} sx={{ mr: 2 }}></Grid>
                  <Grid item>
                    <LoadingButton
                      variant="outlined"
                      color="primary"
                      loading={isSubmitting}
                      onClick={handleSaveDraft}
                      sx={{ mr: 2, height: 40 }}
                      disabled={rows.length === 0 || submitDisabled}
                    >
                      Save as Draft
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      loading={isSubmitting}
                      onClick={handleSubmit}
                      disabled={rows.length === 0 || submitDisabled}
                    >
                      Submit
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </FormProvider>
      </Container>
      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
    </FsBox>
  );
};

export default CompanyWarehouseStockTransferAddPage;
