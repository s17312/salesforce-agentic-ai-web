"use client";

import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import ConfirmTableClearDialog from "@/components/popup/ConfirmTableClearDialog";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllDistributors } from "@/service/distributor.service";
import { getDamageWarehousesByDistributorUId } from "@/service/inventory/distributor-stock-adjustment.service";
import {
  getDistributorStockReturnTransferById,
  getProductByDistributorIDAndWarehouseID,
  submitDistributorStockReturnTransfer,
  updateDistributorStockReturnTransfer,
} from "@/service/inventory/distributor-stock-return-transfer.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStockViewStyleMappers } from "@/styles/tableStyles/tableStyle";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { DistributorWarehouseProducts } from "@/types/inventory/distributor-stock-return-transfer-types";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { distributorStockReturnTransferValidationSchema } from "@/utils/schemas/distributorStockReturnTransferSchema";
import { mapListToOptions } from "@/utils/sortUtils";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  Business as BusinessIcon,
  DeleteOutline as DeleteOutlineIcon,
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
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import "../../components/StockReturnTransfer.css";
import TotalPlusTableRows from "../../components/total-table";
import { clearDistributorStockReturnTransfer } from "@/redux/slices/inventory/distributor-stock-return-transfer-slice";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

const DistributorStockReturnTransferEditForm = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [isDistributorSelected, setIsDistributorSelected] = useState(true);
  const [expand1, setExpand1] = useState(true);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<DistributorWarehouseProducts | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([] as any[]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const distributorList = useSelector(
    (state) => state.distributor.distributors
  );
  const ds_Warehouses = useSelector(
    (state) => state.distributorStockAdjustmentSlice.DS_Warehouses
  );
  const distributorWarehouseProducts = useSelector(
    (state) =>
      state.distributorStockReturnTransferSlice.distributorWarehouseProducts
  );
  const DS_ReturnTransfer = useSelector(
    (state) => state.distributorStockReturnTransferSlice.DS_ReturnTransfer
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const distributorStockReturnHeader = DS_ReturnTransfer?.stockReturnHeader;
  const distributorStockReturnDetail = DS_ReturnTransfer?.stockReturnDetail;

  const defaultValues = useMemo(() => {
    return {
      stockReturnDate: distributorStockReturnHeader?.stockReturnDate
        ? dayjs(distributorStockReturnHeader.stockReturnDate).format(
          "YYYY-MM-DD"
        )
        : "",
      distributorUId: distributorStockReturnHeader?.distributorUId || "",
      wareHouseUId: distributorStockReturnHeader?.wareHouseUId || "",
      productUId: null,
      quantity: "",
      stockReturnNo: distributorStockReturnHeader?.stockReturnNo || "",
    };
  }, [distributorStockReturnHeader]);

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(distributorStockReturnTransferValidationSchema),
    defaultValues,
  });

  const {
    control,
    getValues,
    reset,
    formState: { errors },
  } = methods;

  const fetchGetAllActiveDistributors = async () => {
    try {
      await getAllDistributors(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      );
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const fetchGetWarehousesByDistributorUId = async (distributorId: number) => {
    try {
      await getDamageWarehousesByDistributorUId(distributorId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const fetchGetStockReturnTransferById = async () => {
    try {
      await getDistributorStockReturnTransferById(params.id);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchGetStockReturnTransferById();
    fetchGetAllActiveDistributors();
  }, []);

  const distributorId = getValues("distributorUId");
  const warehouseId = getValues("wareHouseUId");

  useEffect(() => {
    if (distributorId) {
      fetchGetWarehousesByDistributorUId(distributorId);
      if (distributorId && warehouseId) {
        fetchGetProductByDistributorIDAndWarehouseID(
          distributorId,
          warehouseId
        );
      }
    }
  }, [warehouseId, distributorId]);

  useEffect(() => {
    if (distributorStockReturnHeader) {
      reset(defaultValues);
    }

    if (Array.isArray(distributorStockReturnDetail)) {
      const mappedProducts = distributorStockReturnDetail.map(
        (detail, index) => ({
          id: index + 1,
          uId: detail.productUId,
          productID: detail.productID,
          stockReturnDetailId: detail.stockReturnDetailId,
          productName: detail.productName,
          availableStock: detail.stockAvailable,
          mrp: detail.mrp,
          returnQuantity: detail.returnQuantity,
          volume: detail.volume,
          value: detail.value,
        })
      );

      setRows(mappedProducts);
    }
  }, [
    distributorStockReturnHeader,
    DS_ReturnTransfer,
    distributorStockReturnDetail,
    reset,
    defaultValues,
  ]);

  useEffect(() => {
    dispatch(clearDistributorStockReturnTransfer());
  }, [dispatch]);

  const fetchGetProductByDistributorIDAndWarehouseID = async (
    distributorId: number,
    warehouseId: number
  ) => {
    try {
      await getProductByDistributorIDAndWarehouseID(distributorId, warehouseId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const distributorOptions = useMemo(
    () => mapListToOptions(distributorList, "distributorName", "uId"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [distributorList, mapListToOptions]
  );

  const warehouseOptions = useMemo(
    () => mapListToOptions(ds_Warehouses, "name", "uId"),
    [ds_Warehouses, mapListToOptions]
  );

  const productOptions = useMemo(() => {
    if (!Array.isArray(distributorWarehouseProducts)) return [];
    return distributorWarehouseProducts.map((product, index) => ({
      label: product.productName,
      value: `${product.productUID}-${product.mrp}`,
    }));
  }, [distributorWarehouseProducts]);

  // Function to get productUId  from
  const getProductUId = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[0]);
  };

  // Function to get mrp from productUId
  const getProductMRP = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[1]);
  };

  const productIDstring = getValues("productUId");

  useWatch({
    control,
    name: ["distributorUId", "wareHouseUId", "quantity", "productUId"],
  });

  useEffect(() => {
    if (Array.isArray(distributorWarehouseProducts)) {
      const selectedProduct = distributorWarehouseProducts.find(
        (product) =>
          product.productUID === getProductUId(productIDstring) &&
          product.mrp === getProductMRP(productIDstring)
      );
      setSelectedProductDetails(selectedProduct || null);
    } else {
      setSelectedProductDetails(null);
    }
  }, [getValues("productUId"), distributorWarehouseProducts]);

  const totalStockUpdatePlus = rows.reduce((acc, row) => {
    const value = parseFloat(row.returnQuantity);
    return value > 0 ? acc + value : acc;
  }, 0);

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

  const summaryRow = {
    id: "",
    productID: "Total",
    productName: "",
    mrp: "",
    availableStock: "",
    rate: "",
    returnQuantity: totalStockUpdatePlus,
    volume: totalVolumePlus,
    uom: "",
    value: totalValuePlus,
    action: "",
  };

  const rowsWithSummary = [...rows, summaryRow];

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const payload = {
      distributorStockReturn: {
        distributorStockReturnHeader: {
          stockReturnNo: distributorStockReturnHeader?.stockReturnNo,
          stockReturnDate: formData.stockReturnDate,
          distributorUId: formData.distributorUId,
          wareHouseUId: formData.wareHouseUId,
          totalQuantity: totalStockUpdatePlus,
          totalVolume: totalVolumePlus,
          totalValue: totalValuePlus,
        },
        distributorStockReturnDetail: rows.map((row) => ({
          stockReturnDetailId: row.stockReturnDetailId,
          productUId: row.uId,
          stockAvailable: row.availableStock,
          mrp: row.mrp,
          transferQuantity: parseFloat(row.returnQuantity),
          volume: parseFloat(row.volume),
          value: row.value,
        })),
      },
    };
    try {
      const responseMsg = await updateDistributorStockReturnTransfer(
        params.id,
        payload
      );
      enqueueSnackbar(`${responseMsg.message} | ${responseMsg.number}`, {
        variant: "success",
      });
      router.push(PATH_DASHBOARD.distributorStock.stockReturnTransfer.list);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const payload = {
      distributorStockReturnHeader: {
        submitType: 2,
        stockReturnNo: distributorStockReturnHeader?.stockReturnNo,
        stockReturnDate: formData.stockReturnDate,
        distributorUId: formData.distributorUId,
        wareHouseUId: formData.wareHouseUId,
        totalQuantity: totalStockUpdatePlus,
        totalVolume: totalVolumePlus,
        totalValue: totalValuePlus,
      },
      distributorStockReturnDetail: rows.map((row) => ({
        productUId: row.uId,
        stockAvailable: row.availableStock,
        mrp: row.mrp,
        transferQuantity: parseFloat(row.returnQuantity),
        volume: parseFloat(row.volume),
        value: row.value,
      })),
    };
    try {
      const responseMsg = await submitDistributorStockReturnTransfer(payload);
      enqueueSnackbar(`${responseMsg.message} | ${responseMsg.number}`, {
        variant: "success",
      });
      router.push(PATH_DASHBOARD.distributorStock.stockReturnTransfer.list);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDistributorChange = () => {
    const currentValues = getValues();
    setIsDistributorSelected(false);
    reset({
      ...currentValues,
      wareHouseUId: null,
      productUId: null,
    });
  };

  const handleAddProduct = () => {
    const currentQuantity = getValues("quantity");

    const existingProduct = rows.find(
      (row) =>
        row.uId === selectedProductDetails?.productUID &&
        row.mrp === selectedProductDetails?.mrp
    );

    const alreadyAddedQty = existingProduct?.returnQuantity ?? 0;
    const totalRequestedQty = alreadyAddedQty + Number(currentQuantity);

    if (selectedProductDetails?.availableStock == 0) {
      enqueueSnackbar(
        `Product: ${selectedProductDetails.productID} is not available`,
        { variant: "error" }
      );
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
      let returnQuantity = parseFloat(currentQuantity);

      let volume = (selectedProductDetails?.uomQty ?? 0) * returnQuantity;
      let value = (selectedProductDetails?.mrp ?? 0) * returnQuantity;
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
              returnQuantity: row.returnQuantity + returnQuantity,
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
          productName: selectedProductDetails?.productName,
          availableStock: selectedProductDetails?.availableStock,
          uom: selectedProductDetails?.uom,
          uomQty: selectedProductDetails?.uomQty,
          mrp: selectedProductDetails?.mrp,
          returnQuantity: returnQuantity,
          volume: volume,
          value: value,
          baseUnitId: selectedProductDetails?.baseUnitId,
          baseUnitName: selectedProductDetails?.baseUnitName,
        };
        setRows([newProduct, ...rows]);
      }
      reset({
        ...getValues(),
        productUId: "",
        quantity: "",
      });
    }
  };

  const handleDelete = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleDistributorFocus = () => {
    if (rows.length === 0) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const confirmTableClean = () => {
    setRows([]);
    setOpen(false);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const handleRowUpdate = (newRow: GridRowModel) => {
    const id = newRow.id;
    const stockUpdate = parseInt(newRow.stockUpdate, 10);
    const volume = parseFloat(newRow.uomQty ?? 1) * stockUpdate;
    const value = parseFloat(newRow.mrp ?? 1) * stockUpdate;
    const updatedRow = {
      ...newRow,
      id,
      stockUpdate,
      volume,
      value,
    };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );

    return updatedRow;
  };

  const columns: GridColDef[] = [
    {
      field: "productID",
      headerName: "Product ID",
      width: 80,
      sortable: false,
      flex: 1,
    },
    {
      field: "productName",
      headerName: "Product Name",
      width: 120,
      flex: 1,
      sortable: false,
    },
    {
      field: "mrp",
      headerName: "MRP",
      width: 110,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>;
        }
        const formattedValue = params.value.toFixed(2);
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "availableStock",
      headerName: "Available Stock",
      width: 150,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "returnQuantity",
      headerName: "Transfer Stock",
      width: 150,
      headerAlign: "right",
      align: "right",
      editable: true,
      type: "number",
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>;
        }
        const formattedValue = params.value;
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "value",
      headerName: "Value",
      width: 120,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>;
        }
        const formattedValue = formatCurrency(params.value);
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "volume",
      headerName: "Volume",
      width: 150,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>;
        }
        const formattedValue = formatVolume3Decimals(params.value);
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => {
        if (!params.row.id) {
          return <span></span>;
        }
        return (
          <IconButton
            size="small"
            sx={{ color: "red" }}
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        );
      },
    },
  ];

  const groupRowsByBaseUnit = (rows: any) => {
    return rows.reduce((acc: any, row: any) => {
      const baseUnit = row.baseUnitName || "Unknown";
      if (!acc[baseUnit]) {
        acc[baseUnit] = [];
      }
      acc[baseUnit].push(row);
      return acc;
    }, {});
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Stock Return Transfer Edit"
        pageNavigation={[
          {
            pageName: "Distributor Stock Return Transfer",
            path: PATH_DASHBOARD.distributorStock.stockReturnTransfer.list,
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
                Distributor Stock Return Transfer Information
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
                      name="stockReturnDate"
                      label="Date"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="distributorUId"
                      placeholder="Distributor*"
                      options={distributorOptions}
                      control={control}
                      onChange={handleDistributorChange}
                      onFocus={handleDistributorFocus}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="wareHouseUId"
                      placeholder="Warehouse*"
                      options={warehouseOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled={isDistributorSelected}
                    />
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Card
            sx={{
              backgroundColor: "#fff",
              minHeight: !expand1 ? "80vh" : "75vh",
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
                      placeholder=" Select Product"
                      options={productOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled={
                        !getValues("distributorUId") ||
                        !getValues("wareHouseUId")
                      }
                    />
                  </Grid>
                  <Grid item xs={2.5}>
                    <RHFTextField
                      name="quantity"
                      label="Quantity"
                      type="number"
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
                      disabled={!getValues("productUId")}
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
                {/* DataGrid with Flex Height */}
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <DataGrid
                    sx={{
                      ...dataGridStockViewStyleMappers,
                    }}
                    rows={rowsWithSummary}
                    columns={getColumnsWithTooltip(columns)}
                    density="compact"
                    getRowClassName={(params) =>
                      params.row.productID === "Total" ? "total-row" : ""
                    }
                    hideFooter
                    disableRowSelectionOnClick
                    disableColumnMenu
                    processRowUpdate={handleRowUpdate}
                  />
                </Box>

                {/* Additional Components Below DataGrid */}
                <Grid container justifyContent={"space-between"} sx={{ mt: 5 }}>
                  <Grid item xs={5} alignItems={"left"}>
                    {/* <RHFTextArea
                      name="createdRemark"
                      label="Remark"
                      control={control}
                      numberOfRows={3}
                    /> */}
                  </Grid>
                  <Grid item xs={5} alignItems={"right"}>
                    <Box sx={{ width: "100%", borderRadius: 1 }}>
                      <TotalPlusTableRows
                        groupedRows={groupRowsByBaseUnit(rows)}
                        edit={true}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{ mt: 5 }}
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
                      disabled={rows.length === 0}
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
      <ConfirmTableClearDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirmTableClean}
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

export default DistributorStockReturnTransferEditForm;
