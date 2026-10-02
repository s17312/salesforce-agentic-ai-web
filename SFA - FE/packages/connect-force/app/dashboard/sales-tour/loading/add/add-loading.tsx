import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import ConfirmChangeLoadingDialog from "@/components/popup/ConfirmChangeLoadingDialog";
import { useSelector } from "@/redux/store";
import {
  createTourLoading,
  getTourLoadingProducts,
} from "@/service/tour-service/tourLoading.service";
import { getPrimaryWarehouseByDistributor } from "@/service/tour-service/tourUnloading.service";
import {
  dataGridStockStyleMappers,
  focusDataGridStyle,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridColumnGroupHeaderParams,
  GridColumnGroupingModel,
  gridColumnVisibilityModelSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import QuickSearchToolbar from "@/components/data-grid/search-filter";

interface ProductDetails {
  productUId: number;
  mrp: number;
  qty: number;
  quantity: number;
  volume: number;
  value: number;
  productId: string;
  productName: string;
  productGroupName: string;
  productGroupUId: number;
  categoryName: string;
  productCategoryUId: number;
}

interface LoadingRepTourProps {
  setIsNewLoadingSelected: (value: boolean) => void;
  schedule: any;
}

const TourLoadingAdd: React.FC<LoadingRepTourProps> = ({
  setIsNewLoadingSelected,
  schedule,
}) => {
  const [rows, setRows] = useState([] as any[]);
  const [loadingHasRows, setLoadingHasRows] = useState([] as any[]);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<ProductDetails | null>(null);
  const [open, setOpen] = useState(false);
  const [hasLoadingQty, setHasLoadingQty] = useState(false);
  const [previousRows, setPreviousRows] = useState<any[]>([]);
  const [newRows, setNewRows] = useState<any[]>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const primaryWarehouseOptionsList = useSelector(
    (state) => state.tourUnloadingSlice.PrimaryWarehousesList
  );

  const productsOptionsList = useSelector(
    (state) => state.tourScheduleSlice.TourLoadingProducts
  );

  const filterProducts = productsOptionsList.filter(
    (product) => product.quantity > 0
  );

  const methods = useForm<any>({ mode: "all" });

  const { reset, control, getValues, setError, clearErrors, setValue } =
    methods;

  useWatch({
    control,
    name: ["distributorWarehouseUId", "productUId", "quantity"],
  });

  const warehouseID = getValues("distributorWarehouseUId");
  const productID = getValues("productUId");

  const [previousWarehouseId, setPreviousWarehouseId] = useState(warehouseID);
  const [tempWarehouseId, setTempWarehouseId] = useState(warehouseID);
  const previousWarehouseRef = useRef(warehouseID);

  // Function to get productUId  from
  const getProductUId = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[0]);
  };

  // Function to get mrp from productUId
  const getProductMRP = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[1]);
  };

  useEffect(() => {
    fetchTourLoadingWarehouses();
  }, [schedule]);

  useEffect(() => {
    if (warehouseID) {
      reset({
        ...getValues(),
        productUId: null,
        quantity: "",
      });
      fetchTourLoadingProducts();
    }
    setRows([]);
  }, [warehouseID]);

  useEffect(() => {
    if (Array.isArray(filterProducts)) {
      const selectedProduct = filterProducts.find(
        (product) =>
          product.productUId === getProductUId(productID) &&
          product.mrp === getProductMRP(productID)
      );
      setSelectedProductDetails(selectedProduct);
    } else {
      setSelectedProductDetails(null);
    }
  }, [productID]);

  useEffect(() => {
    if (warehouseID) {
      if (Array.isArray(filterProducts) && filterProducts.length > 0) {
        const rowsWithId = filterProducts.map((item, index) => ({
          ...item,
          id: `${item.productUId}-${item.mrp}-${index}`,
          product: item.productName,
          productCategory: item.categoryName,
          productGroup: item.productGroupName,
          loadingQty: item.loadingQty || 0.0,
        }));
        setNewRows(rowsWithId);
        if (hasLoadingQty) {
          setRows(previousRows);
        } else {
          setRows(rowsWithId);
        }
      }
    }
  }, [productsOptionsList]);

  const fetchTourLoadingProducts = async () => {
    if (schedule.distributorUId) {
      await getTourLoadingProducts(schedule.distributorUId, warehouseID);
    }
  };

  const fetchTourLoadingWarehouses = async () => {
    await getPrimaryWarehouseByDistributor(schedule.distributorUId);
  };

  // Option data for Loading
  const primaryWarehousesOptions = useMemo(
    () =>
      mapListToOptions(
        primaryWarehouseOptionsList,
        "warehouseName",
        "warehouseUId"
      ),
    [primaryWarehouseOptionsList, mapListToOptions]
  );

  const formattedProductsList = filterProducts.map((item) => ({
    ...item,
    productName: `${item.productId}-${item.productName}##${item.mrp.toFixed(
      2
    )}##${item.quantity}`,
  }));

  const productsOptions = useMemo(() => {
    return formattedProductsList.map((product, index) => ({
      label: product.productName,
      value: `${product.productUId}-${product.mrp}`,
    }));
  }, [formattedProductsList]);

  const addLoading = () => {
    const currentQuantity = getValues("quantity");
    const requestedQty = parseFloat(currentQuantity) || 0;

    if (requestedQty < 0) {
      setError("quantity", {
        type: "manual",
        message: "Quantity cannot be negative",
      });
      return;
    } else {
      clearErrors("quantity");
    }

    const existingProductIndex = rows.findIndex(
      (row) =>
        row.product === selectedProductDetails?.productName &&
        row.productCategory === selectedProductDetails?.categoryName &&
        row.productGroup === selectedProductDetails?.productGroupName &&
        row.mrp === selectedProductDetails?.mrp
    );

    if (currentQuantity == 0) {
      enqueueSnackbar("Loading quantity can't be 0", { variant: "error" });
      return;
    }

    if ((selectedProductDetails?.quantity ?? 0) < currentQuantity) {
      enqueueSnackbar("Requested quantity exceeds available stock", {
        variant: "error",
      });
      return;
    }

    if (selectedProductDetails?.quantity == 0) {
      enqueueSnackbar("Product out of stock", { variant: "error" });
      return;
    }

    // Get the total current loading quantity of the product
    const currentLoadingQty =
      existingProductIndex !== -1
        ? rows[existingProductIndex].loadingQty || 0
        : 0;
    const totalRequestedQty = currentLoadingQty + requestedQty;

    if (totalRequestedQty > (selectedProductDetails?.quantity ?? 0)) {
      enqueueSnackbar("Requested quantity exceeds available stock", {
        variant: "error",
      });
      return;
    }

    if (existingProductIndex !== -1) {
      const updatedRows = rows.map((row, index) => {
        if (index === existingProductIndex) {
          const prevLoadingQty = row.loadingQty || 0;
          return {
            ...row,
            loadingQty: prevLoadingQty + requestedQty,
          };
        }
        return row;
      });
      setRows(updatedRows);
    } else {
      const lastElement = rows[rows.length - 1];
      const newProduct = {
        id: rows.length === 0 ? 1 : lastElement.id + 1,
        uId: selectedProductDetails?.productUId,
        productId: selectedProductDetails?.productId,
        product: selectedProductDetails?.productName,
        productUId: selectedProductDetails?.productUId,
        productCategory: selectedProductDetails?.categoryName,
        productCategoryUId: selectedProductDetails?.productCategoryUId,
        productGroup: selectedProductDetails?.productGroupName,
        productGroupUId: selectedProductDetails?.productGroupUId,
        mrp: selectedProductDetails?.mrp,
        volume: selectedProductDetails?.qty,
        loadingQty: requestedQty,
      };

      setRows([...rows, newProduct]);
    }
    setHasLoadingQty(true);
    reset({
      ...getValues(),
      productUId: null,
      quantity: "",
    });
  };

  const handleLoadProducts = () => {
    // add available Qtys to Loading quantityes for selected rows
    const updatedRows = rows.map((row) => {
      if (selectedRows.includes(row.id)) {
        const availableQty = row.quantity || 0;

        return {
          ...row,
          loadingQty: availableQty > 0 ? availableQty : row.loadingQty,
        };
      }
      return row;
    });   
    setHasLoadingQty(true);
    setRows(updatedRows);
  };

  const totalLoadingQty = rows.reduce(
    (total, row) => total + (Number(row.loadingQty) || 0),
    0
  );

  const createLoading = async () => {
    setIsDraftSubmitting(true);
    const filteredRows = rows.filter((row) => row.loadingQty > 0);
    const payload = {
      loadingHeader: {
        distributorUId: schedule.distributorUId,
        distributorWarehouseUId: warehouseID,
        scheduleUId: schedule.uId,
        scheduleId: schedule.tourID,
        vehicleUId: schedule.vehicleUId,
        vehicleWarehouseUId: 0,
        status: 0,
        loadingId: "loading001",
        total: totalLoadingQty.toString(),
        mobileStatusUId: 0,
      },
      loadingDetails: filteredRows.map((row) => ({
        productUId: row.productUId,
        productGroupUId: row.productGroupUId,
        productCategoryUId: row.productCategoryUId,
        mrp: row.mrp,
        loadingQuantity: Number(row.loadingQty) || 0,
        value: row.mrp * (Number(row.loadingQty) || 0),
        volume: row.volume * (Number(row.loadingQty) || 0),
        loadingHeaderUId: 0,
        updatedQuantity: 0,
        updatedValue: 0,
        updatedVolume: 0,
      })),
    };

    try {
      const responseMsg = await createTourLoading(payload);
      enqueueSnackbar(`${responseMsg}`, { variant: "success" });
      setIsNewLoadingSelected(false);
      setIsDraftSubmitting(false);
    } catch {}
    finally {
      setSelectedRows([]);
      setIsDraftSubmitting(false);
    }
  };

  const submitLoading = async () => {
    setIsSubmitting(true);
    const filteredRows = rows.filter((row) => row.loadingQty > 0);
    const payload = {
      loadingHeader: {
        distributorUId: schedule.distributorUId,
        distributorWarehouseUId: warehouseID,
        scheduleUId: schedule.uId,
        scheduleId: schedule.tourID,
        vehicleUId: schedule.vehicleUId,
        vehicleWarehouseUId: 0,
        status: 1,
        loadingId: "loading001",
        total: totalLoadingQty.toString(),
        mobileStatusUId: 0,
      },
      loadingDetails: filteredRows.map((row) => ({
        productUId: row.productUId,
        productGroupUId: row.productGroupUId,
        productCategoryUId: row.productCategoryUId,
        mrp: row.mrp,
        loadingQuantity: Number(row.loadingQty) || 0,
        value: row.mrp * (Number(row.loadingQty) || 0),
        volume: row.volume * (Number(row.loadingQty) || 0),
        loadingHeaderUId: 0,
        updatedQuantity: Number(row.loadingQty) || 0,
        updatedValue: row.mrp * (Number(row.loadingQty) || 0),
        updatedVolume: row.volume * (Number(row.loadingQty) || 0),
      })),
    };
    try {
      const responseMsg = await createTourLoading(payload);
      enqueueSnackbar(`${responseMsg}`, { variant: "success" });
      setIsNewLoadingSelected(false);
      setIsSubmitting(false)
    } catch {}
    finally {
      setSelectedRows([]);
      setIsSubmitting(false);
    }
  };

  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    const requestedQty = newRow.loadingQty;
    const updatedRows = rows.map((row) =>
      row.id === oldRow.id ? { ...row, loadingQty: requestedQty } : row
    );

    setRows(updatedRows);
    if (updatedRows.some((row) => row.loadingQty > 0)) {
      setHasLoadingQty(true);
    } else {
      setHasLoadingQty(false);
    }
    return { ...oldRow, loadingQty: requestedQty };
  };

  const columns: GridColDef[] = [
    { field: "productId", headerName: "Product ID", minWidth: 120, flex: 1 },
    { field: "product", headerName: "Product", minWidth: 300, flex: 1 },
    {
      field: "productCategory",
      headerName: "Product Category",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "productGroup",
      headerName: "Product Group",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "mrp",
      headerName: "MRP",
      align: "right",
      headerAlign: "right",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Available Qty",
      align: "right",
      headerAlign: "right",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "loadingQty",
      headerName: "Loading Qty",
      align: "right",
      headerAlign: "right",
      minWidth: 100,
      flex: 1,
      type: "number",
      editable: true,
      cellClassName: "editable-cell",
      preProcessEditCellProps: (params) => {
        const requestedQty = params.props.value;
        const currentLoadingQty = params.row.quantity;
        if (
          requestedQty === null ||
          requestedQty === undefined ||
          requestedQty === ""
        ) {
          enqueueSnackbar("Quantity cannot be empty", { variant: "error" });
          return { ...params.props, error: true };
        }
        if (requestedQty > currentLoadingQty) {
          enqueueSnackbar("Requested quantity exceeds available stock", {
            variant: "error",
          });
          return { ...params.props, error: true };
        }
        if (
          params.props.value < 0 ||
          params.props.value.toString().includes("e")
        ) {
          return { ...params.props, error: true };
        }
        return { ...params.props, error: false };
      },
    },
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 100,
    },
  ];

  const handleClickBack = () => {
    setIsNewLoadingSelected(false);
    setRows([]);
  };

  const handleWarehouseChange = () => {
    const currentWarehouse = getValues("distributorWarehouseUId");

    if (hasLoadingQty) {
      setOpen(true);
      if (!previousRows.length) {
        setPreviousRows(rows);
      }
      if (!previousWarehouseRef.current) {
        previousWarehouseRef.current = warehouseID;
      }
      setTempWarehouseId(currentWarehouse);
    } else {
      setPreviousWarehouseId(currentWarehouse);
      previousWarehouseRef.current = currentWarehouse;
      confirmTableClean();
    }
  };

  const confirmTableClean = () => {
    setOpen(false);
    setHasLoadingQty(false);
    setPreviousRows([]);
    setPreviousWarehouseId(tempWarehouseId);
    previousWarehouseRef.current = tempWarehouseId;
    setRows(newRows);
  };

  const handleClose = () => {
    setOpen(false);
    if (previousWarehouseRef.current) {
      setValue("distributorWarehouseUId", previousWarehouseRef.current);
    }

    if (previousRows.length) {
      setRows(previousRows);
    }
  };

  const COLLAPSIBLE_COLUMN_GROUPS: Record<string, Array<string>> = {
    collapseColumn: ["productCategory", "productGroup"],
  };

  const ColumnGroupRoot = styled("div")({
    overflow: "hidden",
    display: "flex",
    alignItems: "left",
  });

  const ColumnGroupTitle = styled("span")({
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: "bold",
    color: "#212b36",
  });

  function CollapsibleHeaderGroup({
    groupId,
    headerName,
  }: GridColumnGroupHeaderParams) {
    const apiRef = useGridApiContext();
    const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);

    if (!groupId) {
      return null;
    }

    const isCollapsible = Boolean(COLLAPSIBLE_COLUMN_GROUPS[groupId]);
    const isGroupCollapsed = COLLAPSIBLE_COLUMN_GROUPS[groupId].every(
      (field: any) => columnVisibilityModel[field] === false
    );

    return (
      <ColumnGroupRoot>
        <ColumnGroupTitle>{headerName ?? groupId}</ColumnGroupTitle>{" "}
        {isCollapsible && (
          <IconButton
            sx={{ ml: 0.5 }}
            onClick={() => {
              const newModel = { ...columnVisibilityModel };
              COLLAPSIBLE_COLUMN_GROUPS[groupId].forEach((field: any) => {
                newModel[field] = !!isGroupCollapsed;
              });
              apiRef.current.setColumnVisibilityModel(newModel);
            }}
          >
            {isGroupCollapsed ? (
              <KeyboardArrowRightIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </ColumnGroupRoot>
    );
  }

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "collapseColumn",
      headerName: "Collapse Columns",
      headerAlign: "left",
      renderHeaderGroup: (params) => <CollapsibleHeaderGroup {...params} />,
      children: [
        { field: "productId" },
        { field: "product" },
        { field: "productCategory" },
        { field: "productGroup" },
      ],
    },
  ];

  const handleSwitchChange = (checked: boolean) => {
    setShowSelectedOnly(checked);
  };

  return (
    <>
      {schedule.statusUId === 1 ? (
        <Alert severity="info">
          Please start the tour schedule to proceed with loading
        </Alert>
      ) : (
        <>
          <FormProvider methods={methods}>
            <Card sx={{ backgroundColor: "#fff", minHeight: "60vh" }}>
              <CardContent>
                <Box sx={{ width: "100%" }}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Grid item xs={3}>
                      <RHFAutocompleteField
                        name="distributorWarehouseUId"
                        placeholder="Warehouse"
                        // @ts-ignore
                        options={primaryWarehousesOptions}
                        control={control}
                        onChange={handleWarehouseChange}
                      />
                    </Grid>
                    <Grid item xs={5.5}>
                      <RHFAutocompleteField
                        name="productUId"
                        placeholder="Product"
                        // @ts-ignore
                        options={productsOptions}
                        control={control}
                        disabled={!getValues("distributorWarehouseUId")}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <RHFTextField
                        name="quantity"
                        label="Quantity"
                        type="number"
                        inputProps={{ min: 0 }}
                        disabled={!getValues("productUId")}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "+" || e.key === "e") {
                            e.preventDefault();
                          }
                        }}
                        error={!!methods.formState.errors.quantity}
                      />
                    </Grid>
                    <Grid item xs={1.5}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={addLoading}
                        disabled={!getValues("quantity")}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <DataGrid
                    sx={{ ...dataGridStockStyleMappers, ...focusDataGridStyle }}
                    rows={
                      showSelectedOnly
                        ? rows.filter(
                            (row) =>
                              row.loadingQty !== 0 && row.loadingQty !== ""
                          )
                        : rows
                    }
                    columns={getColumnsWithTooltip(columns)}
                    density="compact"
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    experimentalFeatures={{ columnGrouping: true }}
                    columnGroupingModel={columnGroupingModel}
                    disableColumnMenu
                    processRowUpdate={handleProcessRowUpdate}
                    checkboxSelection
                    rowSelectionModel={selectedRows}
                    onRowSelectionModelChange={(newSelection) => {
                      const newSel = Array.isArray(newSelection)
                        ? newSelection
                        : [];
                      // Determine which ids were deselected
                      const deselected = selectedRows.filter(
                        (id: any) => !newSel.includes(id)
                      );

                      if (deselected.length > 0) {
                        const updatedRows = rows.map((row) =>
                          deselected.includes(row.id)
                            ? { ...row, loadingQty: 0 }
                            : row
                        );
                        setRows(updatedRows);
                        setHasLoadingQty(
                          updatedRows.some((r) => Number(r.loadingQty) > 0)
                        );
                      }

                      setSelectedRows(newSel);
                    }}
                    slots={{
                      toolbar: () => (
                        <QuickSearchToolbar
                          showSearch={false}
                          showSwitch={true}
                          checked={showSelectedOnly}
                          onCheckedChange={handleSwitchChange}
                          isDisabled={!hasLoadingQty}
                          handleTableBtnClick={handleLoadProducts}
                          tableBtnText="Load Products from warehouse"
                          isTableBtnDisabled={selectedRows.length === 0}
                        />
                      ),
                    }}
                  />
                  <Grid
                    container
                    alignContent={"center"}
                    justifyContent={"space-between"}
                    sx={{ mt: 2 }}
                  >
                    <Grid item xs={5} sx={{ mr: 2 }}></Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mr: 2, height: 40 }}
                        onClick={handleClickBack}
                      >
                        Back
                      </Button>
                      <LoadingButton
                        variant="outlined"
                        color="primary"
                        loading={isDraftSubmitting}
                        onClick={createLoading}
                        sx={{ mr: 2, height: 40 }}
                        disabled={!hasLoadingQty}
                      >
                        Save as draft
                      </LoadingButton>
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        loading = {isSubmitting}
                        onClick={submitLoading}
                        disabled={!hasLoadingQty}
                      >
                        Submit
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </FormProvider>
          <ConfirmChangeLoadingDialog
            open={open}
            onClose={handleClose}
            onConfirm={confirmTableClean}
          />
        </>
      )}
    </>
  );
};

export default TourLoadingAdd;
