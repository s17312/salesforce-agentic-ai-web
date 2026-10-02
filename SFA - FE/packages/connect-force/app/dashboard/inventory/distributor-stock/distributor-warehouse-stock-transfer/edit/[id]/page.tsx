"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
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
import { useRouter } from "next/navigation";
import { Business as BusinessIcon } from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { warehouseStockTransferSchema } from "@/utils/schemas/warehouseStockTransferSchema";
import { useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import {
  getAllActiveDistributors,
  getProductByDistributorWarehouseUId,
  getWarehousesByDistributorUId,
  getWarehouseStockTransferById,
  updateWarehouseStockTransfer,
} from "@/service/warehouseStockTransfer.service";
import { enqueueSnackbar } from "notistack";
import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import { dispatch, useSelector } from "@/redux/store";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { mapListToOptions } from "@/utils/sortUtils";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { extractProductName } from "@/utils/wordFilters";
import { dataGridStockViewStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getStockColumns } from "../../components/add/getStockColumns";
import { DataGrid } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import PopupResponse from "@/components/popup/popup-response";
import {
  resetWSTDetail,
  setWarehouseStockTransferError,
  setWarehouseStockTransferMessage,
} from "@/redux/slices/warehouse-stock-transfer-slice";
import ConfirmWHStockTableClearDialog from "@/components/popup/confirmWHTableClearDialog";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

interface ProductDetails {
  productUID: number;
  productID: string;
  productName: string;
  priceListUID: number;
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

const DistributorWarehouseStockTransferEdit = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [rows, setRows] = useState([] as any[]);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<ProductDetails | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDistributorSelected, setIsDistributorSelected] = useState(false);
  const [isFromWarehouseSelected, setIsFromWarehouseSelected] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [changedField, setChangedField] = useState<string | null>(null);
  const [warehouseLoading, setWarehouseLoading] = useState(true);
  const [fromWarehouseUId, setFromWarehouseUId] = useState<number | null>(null);
  const [expand1, setExpand1] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [recivingWarehouseUId, setRecivingWarehouseUId] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wst_DistributorList = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_Distributors
  );
  const wst_FromWarehouseList = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_FromWarehouses
  );
  const wst_RecivingWarehouseList = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_RecivingWarehouses
  );
  const wst_detail = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_Detail
  );
  const wst_ProductList = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_Products
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const responseMessage = useSelector(
    (state) => state.warehouseStockTransferSlice.message
  );
  const responseError = useSelector(
    (state) => state.warehouseStockTransferSlice.error
  );

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

  const wstDetailHeader = wst_detail?.warehouseStockTransferHeader;
  const wstDetail = wst_detail?.warehouseStockTransferDetails;

  const defaultValues = useMemo(() => {
    return {
      stockTransferId: wstDetailHeader?.stockTransferId || "",
      stockTransferDate: wstDetailHeader?.stockTransferDate
        ? dayjs(wstDetailHeader?.stockTransferDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      distributorUId: wstDetailHeader?.distributorUId || null,
      totalVolume: wstDetailHeader?.totalVolume || null,
      totalValue: wstDetailHeader?.totalValue || null,
      productUId: null,
      quantity: "",
      fromWarehouseUId,
      recivingWarehouseUId,
    };
  }, [wstDetailHeader]);

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(warehouseStockTransferSchema),
    defaultValues,
  });

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

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const {
    control,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = methods;

  useWatch({
    control,
    name: ["productUId", "quantity", "fromWarehouseUId", "distributorUId"],
  });

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

  const fetchWSTDetailById = async () => {
    setIsLoading(true);
    try {
      await getWarehouseStockTransferById(params.id);
    } catch (error) {
      console.error("Error while fetching WST detail by id", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDistributorList = async () => {
    try {
      await getAllActiveDistributors();
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const fetchWarehouseByDistributor = async (DistributorId: number) => {
    setWarehouseLoading(true);
    try {
      await getWarehousesByDistributorUId(DistributorId);
      setFromWarehouseUId(wstDetailHeader?.fromWarehouseUId || null);
      setRecivingWarehouseUId(wstDetailHeader?.recivingWarehouseUId || null);

      setValue("fromWarehouseUId", wstDetailHeader?.fromWarehouseUId || null);
      setValue(
        "recivingWarehouseUId",
        wstDetailHeader?.recivingWarehouseUId || null
      );
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    } finally {
      setWarehouseLoading(false);
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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setWarehouseLoading(true);
        await Promise.all([fetchDistributorList(), fetchWSTDetailById()]);
      } catch (error) {
        setServerDownError(true);
      } finally {
        setWarehouseLoading(false);
      }
    };
    fetchAllData();

    return () => {
      dispatch(resetWSTDetail());
    };
  }, [params.id, dispatch]);

  useEffect(() => {
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
    setValue("productUId", null);
    setValue("quantity", "");
    const isFormValid = fromWarehouse && distributor && recivingWarehouse;

    if (isFormValid) {
      fetchProductByDistributor(distributor, fromWarehouse);
      setIsFromWarehouseSelected(true);
    } else {
      setIsFromWarehouseSelected(false);
    }
  }, [fromWarehouse, distributor, recivingWarehouse]);

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

  useEffect(() => {
    if (wstDetailHeader) {
      reset(defaultValues);
    }

    if (Array.isArray(wstDetail)) {
      const mappedProducts = wstDetail.map((detail, index) => ({
        id: index + 1,
        uId: detail.productUId,
        productID: detail.productID,
        stockTransferId: detail.productUId,
        productName: detail.productName,
        availableStock: detail.stockAvailable,
        mrp: detail.mrp,
        rate: detail.rate,
        stockUpdate: detail.transferQuantity,
        volume: detail.volume,
        value: detail.value,
        action: "",
      }));

      setRows(mappedProducts);
    }
  }, [wstDetailHeader, wst_detail, wstDetail, reset, defaultValues]);

  const handleDistributorChange = () => {
    const currentValues = getValues();
    setIsDistributorSelected(false);
    reset({
      ...currentValues,
      fromWarehouseUId: null,
      recivingWarehouseUId: null,
      productUId: null,
    });
  };

  const handleFieldFocus = (fieldName: string) => {
    if (rows.length === 0) {
      setOpenWarningDialog(false);
    } else {
      setChangedField(fieldName);
      setOpenWarningDialog(true);
    }
  };

  const handleConfirmChange = () => {
    setRows([]);
    setOpenWarningDialog(false);
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

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
      setValue("productUId", null);
      setValue("quantity", "");
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
        stockTransferId: formData.stockTransferId,
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
      await updateWarehouseStockTransfer(params.id, payload);
      router.push(
        PATH_DASHBOARD.distributorStock.distributorWarehouseStockTransfer.list
      );
    } catch (error) {
      console.error(error);
    }finally{
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const payload = {
      warehouseStockTransferHeader: {
        companyUId: null,
        distributorUId: formData.distributorUId,
        stockTransferId: formData.stockTransferId,
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
      await updateWarehouseStockTransfer(params.id, payload);
      handleReset();
      router.push(
        PATH_DASHBOARD.distributorStock.distributorWarehouseStockTransfer.list
      );
    } catch (error) {
      console.error(error);
    }finally{
      setIsSubmitting(false);
    }
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  if (isLoading || !wstDetail || warehouseLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          marginTop: "170px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Warehouse Stock Transfer Edit"
        pageNavigation={[
          {
            pageName: "Distributor Warehouse Stock Transfer",
            path: PATH_DASHBOARD.distributorStock
              .distributorWarehouseStockTransfer.list,
          },
          { pageName: "Edit" },
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
                      defaultValue={dayjs(
                        wstDetailHeader?.stockTransferDate ?? ""
                      ).format("YYYY-MM-DD")}
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
                      disableClearable
                      onChange={handleDistributorChange}
                      onFocus={() => handleFieldFocus("distributor")}
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
                      onFocus={() => handleFieldFocus("from Warehouse")}
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
                      onFocus={() => handleFieldFocus("Receiving Warehouse")}
                    />
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
                      placeholder=" Select Product"
                      options={productList}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled={
                        !getValues("distributorUId") ||
                        !getValues("fromWarehouseUId") ||
                        !getValues("recivingWarehouseUId")
                      }
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
                  loading={isLoading}
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
                  alignContent={"center"}
                  justifyContent={"space-between"}
                >
                  <Grid item xs={5} sx={{ mr: 2 }}></Grid>
                  <Grid item>
                    <LoadingButton
                      variant="outlined"
                      color="primary"
                      loading={isSubmitting}
                      onClick={handleSaveDraft}
                      sx={{ mr: 2, height: 40 }}
                      disabled={rows.length === 0 || !isDirty}
                    >
                      Update as draft
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      loading={isSubmitting}
                      onClick={handleSubmit}
                      disabled={rows.length === 0}
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
      <ConfirmWHStockTableClearDialog
        open={openWarningDialog}
        onClose={() => setOpenWarningDialog(false)}
        onConfirm={handleConfirmChange}
        message={`If the selected ${changedField} changes, the Product table will be cleared. Are you sure you want to continue?`}
      />
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

export default DistributorWarehouseStockTransferEdit;
