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
import {
  createWarehouseStockTransfer,
  getAllActiveDistributors,
  getProductByDistributorWarehouseUId,
  getWarehousesByDistributorUId,
} from "@/service/warehouseStockTransfer.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStockStyleMappers,
  dataGridStockViewStyleMappers,
} from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { warehouseStockTransferSchema } from "@/utils/schemas/warehouseStockTransferSchema";
import { mapListToOptions } from "@/utils/sortUtils";
import { extractProductName } from "@/utils/wordFilters";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  Business as BusinessIcon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

const WarehouseStockTransferAddPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [isDistributorSelected, setIsDistributorSelected] = useState(false);
  const [isFromWarehouseSelected, setIsFromWarehouseSelected] = useState(false);
  const [rows, setRows] = useState([] as any[]);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<ProductDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const responseMessage = useSelector(
    (state) => state.warehouseStockTransferSlice.message
  );
  const responseError = useSelector(
    (state) => state.warehouseStockTransferSlice.error
  );

  const wst_DistributorList = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_Distributors
  );
  const wst_FromWarehouseList = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_FromWarehouses
  );
  const wst_RecivingWarehouseList = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_RecivingWarehouses
  );
  const wst_ProductList = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_Products
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const distributorList = useMemo(
    () => mapListToOptions(wst_DistributorList, "distributorName", "uId"),
    [wst_DistributorList, mapListToOptions]
  );
  const fromWarehouseList = useMemo(
    () => mapListToOptions(wst_FromWarehouseList, "name", "uId"),
    [wst_FromWarehouseList, mapListToOptions]
  );
  const recivingWarehouseList = useMemo(
    () => mapListToOptions(wst_RecivingWarehouseList, "name", "uId"),
    [wst_RecivingWarehouseList, mapListToOptions]
  );

  const productList = useMemo(() => {
    if (!Array.isArray(wst_ProductList)) return [];
    return wst_ProductList.map((product, index) => ({
      label: product.productName,
      value: `${product.productUID}-${product.mrp}`,
    }));
  }, [wst_ProductList]);

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(warehouseStockTransferSchema),
    defaultValues: {
      stockTransferId: "",
      stockTransferDate: dayjs().format("YYYY-MM-DD"),
      distributorUId: null,
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

  const distributor = useWatch({
    control,
    name: "distributorUId",
  });
  const fromWarehouse = useWatch({
    control,
    name: "fromWarehouseUId",
  });
  const recivingWarehouse = useWatch({
    control,
    name: "recivingWarehouseUId",
  });

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

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
    name: ["productUId", "quantity", "fromWarehouseUId", "distributorUId"],
  });

  const fromWUId = watch("fromWarehouseUId");
  const recivingWUId = watch("recivingWarehouseUId");

  const filteredFromWarehouseList = useMemo(() => {
    return fromWarehouseList.filter(
      (warehouse) => warehouse.value !== recivingWUId
    );
  }, [fromWarehouseList, recivingWUId]);

  // Filter options for "Receiving Warehouse"
  const filteredReceivingWarehouseList = useMemo(() => {
    return recivingWarehouseList.filter(
      (warehouse) => warehouse.value !== fromWUId
    );
  }, [recivingWarehouseList, fromWUId]);

  const fetchDistributorList = async () => {
    try {
      await getAllActiveDistributors();
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const fetchWarehouseByDistributor = async (DistributorId: number) => {
    try {
      await getWarehousesByDistributorUId(DistributorId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const fetchProductByDistributor = async (
    distributorId: number,
    warehouseId: number
  ) => {
    try {
      await getProductByDistributorWarehouseUId(distributorId, warehouseId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchDistributorList();
  }, []);

  useEffect(() => {
    setRows([]);
    reset({
      ...getValues(),
      fromWarehouseUId: null,
      recivingWarehouseUId: null,
    });
    if (distributor !== null) {
      fetchWarehouseByDistributor(distributor);
      setIsDistributorSelected(true);
    } else {
      setIsDistributorSelected(false);
    }
  }, [distributor]);

  useEffect(() => {
    setRows([]);
    setValue("productUId", null);
    setValue("quantity", "");
    const isFormValid = fromWarehouse && distributor && recivingWarehouse;
    setSubmitDisabled(!isFormValid);

    if (isFormValid) {
      fetchProductByDistributor(distributor, fromWarehouse);
      setIsFromWarehouseSelected(true);
    } else {
      setIsFromWarehouseSelected(false);
    }
  }, [fromWarehouse, distributor, recivingWarehouse]);

  useEffect(() => {
    setRows([]);
  }, [recivingWarehouse]);

  const getProductUId = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[0]);
  };

  // Function to get mrp from productUId
  const getProductMRP = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[1]);
  };

  const productIDstring = getValues("productUId");

  useEffect(() => {
    if (Array.isArray(wst_ProductList)) {
      const selectedProduct = wst_ProductList.find(
        (product) =>
          product.productUID === getProductUId(productIDstring) &&
          product.mrp === getProductMRP(productIDstring)
      );
      setSelectedProductDetails(selectedProduct);
    } else {
      setSelectedProductDetails(null);
    }
  }, [wst_ProductList, getValues("productUId")]);

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
    let totalReducedQuantity = 0;

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
    }

    if ((selectedProductDetails?.availableStock ?? 0) < currentQuantity) {
      enqueueSnackbar(
        `Quantity exceeds available stock for Product: ${selectedProductDetails?.productID}. Available stock: ${selectedProductDetails?.availableStock}, requested quantity: ${currentQuantity}.`,
        { variant: "error" }
      );
      return;
    }

    if (selectedProductDetails?.availableStock == 0) {
      enqueueSnackbar(
        `Product: ${selectedProductDetails.productID} is not available`,
        { variant: "error" }
      );
    } else if (
      (selectedProductDetails?.availableStock ?? 0) < totalReducedQuantity
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
        setRows([...rows, newProduct]);
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
      distributorUId: null,
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
        companyUId: null,
        distributorUId: formData.distributorUId,
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
      const responseMsg = await createWarehouseStockTransfer(payload);
      handleReset();
      router.push(
        PATH_DASHBOARD.distributorStock.distributorWarehouseStockTransfer.list
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
        companyUId: null,
        distributorUId: formData.distributorUId,
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
      const responseMsg = await createWarehouseStockTransfer(payload);
      handleReset();
      router.push(
        PATH_DASHBOARD.distributorStock.distributorWarehouseStockTransfer.list
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
        pageTitle="Distributor Warehouse Stock Transfer"
        pageNavigation={[
          {
            pageName: "Distributor Warehouse Stock Transfer",
            path: PATH_DASHBOARD.distributorStock
              .distributorWarehouseStockTransfer.list,
          },
          { pageName: "Add" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
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
                Distributor Warehouse Stock Transfer Details
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
                      name="distributorUId"
                      placeholder="Distributor*"
                      options={distributorList}
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
                      disabled={!isDistributorSelected}
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
                      disabled={!isDistributorSelected}
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
                  justifyContent="space-between"
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
                  autoHeight
                  rows={rows}
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
                  sx={{ mt: 2 }}
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
                                  label={`+${formatVolume3Decimals(totalVolumePlus)}`}
                                  size="small"
                                  variant="soft"
                                  color="success"
                                  sx={{ borderRadius: 1 }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`+${formatCurrency(totalValuePlus)}`}
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

export default WarehouseStockTransferAddPage;
