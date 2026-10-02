import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import { useSelector } from "@/redux/store";
import {
  getTourLoadingById,
  getTourLoadingProducts,
  updateTourLoading,
  updateTourScheduleStatus,
} from "@/service/tour-service/tourLoading.service";
import {
  dataGridStockStyleMappers,
  focusDataGridStyle,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnGroupHeaderParams,
  GridColumnGroupingModel,
  gridColumnVisibilityModelSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { mapListToOptions } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getPrimaryWarehouseByDistributor } from "@/service/tour-service/tourUnloading.service";
import ConfirmChangeLoadingDialog from "@/components/popup/ConfirmChangeLoadingDialog";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

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

interface LoadingEditProps {
  setIsEditing: (value: boolean) => void;
  editLoadingId: number;
  schedule: any;
  distributorWarehouseUId: number;
  setTabValue: (value: string) => void;
}

const TourLoadingEdit: React.FC<LoadingEditProps> = ({
  setIsEditing,
  editLoadingId,
  schedule,
  distributorWarehouseUId,
  setTabValue,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [rows, setRows] = useState([] as any[]);
  const [loadingHasRows, setLoadingHasRows] = useState([] as any[]);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<ProductDetails | null>(null);
  const [open, setOpen] = useState(false);
  const [hasLoadingQty, setHasLoadingQty] = useState(false);
  const [previousRows, setPreviousRows] = useState<any[]>([]);
  const [newRows, setNewRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [isUpdateDraftSubmitting, setIsUpdateDraftSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TourLoadingByIdDetail = useSelector(
    (state) => state.tourScheduleSlice.TourLoadingById
  );

  const primaryWarehouseOptionsList = useSelector(
    (state) => state.tourUnloadingSlice.PrimaryWarehousesList
  );
  const productsOptionsList = useSelector(
    (state) => state.tourScheduleSlice.TourLoadingProducts
  );

  const filterProducts = productsOptionsList.filter(
    (product) => product.quantity > 0
  );

  const defaultValues = useMemo(
    () => ({
      distributorWarehouseUId: distributorWarehouseUId,
    }),
    [TourLoadingByIdDetail]
  );

  const methods = useForm<any>({
    mode: "all",
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState,
    setValue,
    control,
    watch,
    getValues,
    setError,
    clearErrors,
  } = methods;

  const warehouseID = getValues("distributorWarehouseUId");
  const productID = getValues("productUId");
  const quantity = getValues("quantity");

  const [previousWarehouseId, setPreviousWarehouseId] = useState(warehouseID);
  const [tempWarehouseId, setTempWarehouseId] = useState(warehouseID);
  const previousWarehouseRef = useRef(warehouseID);

  useWatch({
    control,
    name: ["distributorWarehouseUId", "productUId", "quantity"],
  });

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
  }, []);

  useEffect(() => {
    fetchLoadingById();
  }, [editLoadingId]);

  useEffect(() => {
    setLoadDetails();
  }, [TourLoadingByIdDetail]);

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
    if (
      warehouseID &&
      Array.isArray(filterProducts) &&
      filterProducts.length > 0
    ) {
      const rowsWithId = filterProducts.map((item, index) => {
        const matchingDetail = TourLoadingByIdDetail?.loadingDetails?.find(
          (detail: any) =>
            detail.productUId === item.productUId &&
            detail.mrp === item.mrp &&
            TourLoadingByIdDetail?.loadingHeader?.distributorWarehouseUId ===
            warehouseID
        );

        return {
          ...item,
          id: `${item.productUId}-${item.mrp}-${index}`,
          product: item.productName,
          productCategory: item.categoryName,
          productGroup: item.productGroupName,
          loadingQty: matchingDetail
            ? matchingDetail.loadingQuantity
            : item.loadingQty || 0.0,
        };
      });
      if (
        TourLoadingByIdDetail?.loadingHeader?.status === 1 ||
        TourLoadingByIdDetail?.loadingHeader?.status === 2
      ) {

        setRows(
          rowsWithId.filter((row) => row.loadingQty !== 0 && row.quantity >= 0)
        );
      } else {
        if (hasLoadingQty) {
          setRows(previousRows);
        } else {
          setRows(rowsWithId);
        }
        setNewRows(rowsWithId);
      }
    }
  }, [
    productsOptionsList,
    warehouseID,
    TourLoadingByIdDetail,
    distributorWarehouseUId,
  ]);

  const fetchLoadingById = async () => {
    setLoading(true);
    try {
      await getTourLoadingById(editLoadingId);
    } catch (error) {
      enqueueSnackbar(`Error in getting data`, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchTourLoadingProducts = async () => {
    setLoadingProducts(true);
    try {
      if (schedule.distributorUId) {
        await getTourLoadingProducts(schedule.distributorUId, warehouseID);
      }
    } catch (error) {
      enqueueSnackbar(`Error in getting data`, { variant: "error" });
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchTourLoadingWarehouses = async () => {
    await getPrimaryWarehouseByDistributor(schedule.distributorUId);
  };

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

  const setLoadDetails = () => {
    if (
      TourLoadingByIdDetail &&
      Array.isArray(TourLoadingByIdDetail.loadingDetails)
    ) {
      const mappedRows = TourLoadingByIdDetail.loadingDetails.map(
        (detail: any, index: any) => ({
          id: index + 1,
          product: detail.productName,
          productUId: detail.productID,
          productId: detail.productID,
          quantity: detail.availableQuantity,
          productCategory: detail.categoryName,
          productCategoryUId: detail.productCategoryUId,
          productGroup: detail.productGroupName,
          productGroupUId: detail.productGroupUId,
          mrp: detail.mrp,
          volume: detail.volume,
          loadingQty: detail.loadingQuantity,
        })
      );
      setRows(mappedRows);
    } else {
      console.error(
        "TourLoadingByIdDetail.loadingDetails is not an array:",
        TourLoadingByIdDetail
      );
    }
  };

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
      // Update existing product
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
      let lastElement = rows[rows.length - 1];

      const newProduct = {
        id: rows.length == 0 ? 1 : lastElement.id + 1,
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

  const totalLoadingQty = rows.reduce(
    (total, row) => total + (Number(row.loadingQty) || 0),
    0
  );

  const updateLoading = async () => {
    setIsUpdateDraftSubmitting(true);
    const filteredRows = rows.filter((row) => {
      const existingItem = TourLoadingByIdDetail?.loadingDetails?.find(
        (item: { productUId: number; mrp: number }) =>
          item.productUId === row.productUId && item.mrp === row.mrp
      );

      return (
        row.loadingQty > 0 || (existingItem && existingItem.loadingQuantity > 0)
      );
    });
    if (filteredRows.length > 0) {
      const payload = {
        loadingHeader: {
          distributorUId: schedule.distributorUId,
          distributorWarehouseUId: warehouseID,
          scheduleUId: schedule.uId,
          scheduleId: schedule.tourID,
          vehicleUId: schedule.vehicleUId,
          vehicleWarehouseUId: 0,
          status: 0,
          loadingId: TourLoadingByIdDetail?.loadingHeader?.loadingId,
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
          loadingHeaderUId: editLoadingId,
          updatedQuantity: 0,
          updatedValue: 0,
          updatedVolume: 0,
        })),
      };
      try {
        const responseMsg = await updateTourLoading(editLoadingId, payload);
        enqueueSnackbar(`${responseMsg}`, { variant: "success" });
        setIsEditing(false);
        setIsUpdateDraftSubmitting(false);
      } catch { }
      finally {
        setIsUpdateDraftSubmitting(false)
      }
    } else {
      enqueueSnackbar("Loading Quantity cannot be zero", { variant: "error" });
    }
  };

  const submitLoading = async () => {
    setIsSubmitting(true);
    const filteredRows = rows.filter((row) => {
      const existingItem = TourLoadingByIdDetail?.loadingDetails?.find(
        (item: { productUId: number; mrp: number }) =>
          item.productUId === row.productUId && item.mrp === row.mrp
      );

      return (
        row.loadingQty > 0 || (existingItem && existingItem.loadingQuantity > 0)
      );
    });
    if (filteredRows.length > 0) {
      const payload = {
        loadingHeader: {
          distributorUId: schedule.distributorUId,
          distributorWarehouseUId: warehouseID,
          scheduleUId: schedule.uId,
          scheduleId: schedule.tourID,
          vehicleUId: schedule.vehicleUId,
          vehicleWarehouseUId: 0,
          status: 1,
          loadingId: TourLoadingByIdDetail?.loadingHeader?.loadingId,
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
          loadingHeaderUId: editLoadingId,
          updatedQuantity: 0,
          updatedValue: 0,
          updatedVolume: 0,
          productName: "",
          productGroupName: "",
          categoryName: "",
        })),
      };
      try {
        const responseMsg = await updateTourLoading(editLoadingId, payload);
        enqueueSnackbar(`${responseMsg}`, { variant: "success" });
        setIsEditing(false);
        setIsSubmitting(false);
      } catch { }
      finally {
        setIsSubmitting(false);
      }
    } else {
      enqueueSnackbar("Loading Quantity cannot be zero", { variant: "error" });
    }
  };

  const handleBack = () => {
    setIsEditing(false);
  };

  const handleNext = async () => {
    setTabValue("3");
    await updateTourScheduleStatus(schedule.uId);
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
    { field: "productId", headerName: "ID", minWidth: 120, flex: 1 },
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
      editable:
        TourLoadingByIdDetail?.loadingHeader?.status !== 1 &&
        TourLoadingByIdDetail?.loadingHeader?.status !== 2,
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
  ];

  const handleWarehouseChange = () => {
    const currentWarehouse = getValues("distributorWarehouseUId");

    if (hasLoadingQty) {
      setOpen(true);
      setPreviousRows(rows);
      setTempWarehouseId(currentWarehouse);
    } else {
      setPreviousWarehouseId(currentWarehouse);
      previousWarehouseRef.current = currentWarehouse;
      fetchTourLoadingProducts();
    }
  };

  const handleConfirmChange = () => {
    setOpen(false);
    setHasLoadingQty(false);
    fetchTourLoadingProducts();
    setPreviousRows([]);
    setRows(newRows);
    setPreviousWarehouseId(tempWarehouseId);
    previousWarehouseRef.current = tempWarehouseId;
  };

  const handleCancelChange = () => {
    setOpen(false);
    setValue("distributorWarehouseUId", previousWarehouseRef.current);
    setRows(previousRows);
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
      {primaryWarehousesOptions ? (
        <>
          <FormProvider methods={methods}>
            <Card sx={{ backgroundColor: "#fff", minHeight: "60vh" }}>
              <CardContent>
                {loading || loadingProducts ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "170px",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: theme.palette.primary.main }}
                    >
                      Loading ID:{" "}
                      {TourLoadingByIdDetail?.loadingHeader?.loadingId}
                    </Typography>
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
                          disabled={
                            TourLoadingByIdDetail?.loadingHeader?.status ===
                            1 ||
                            TourLoadingByIdDetail?.loadingHeader?.status === 2
                          }
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
                          disabled={
                            !getValues("distributorWarehouseUId") ||
                            TourLoadingByIdDetail?.loadingHeader?.status ===
                            1 ||
                            TourLoadingByIdDetail?.loadingHeader?.status === 2
                          }
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <RHFTextField
                          name="quantity"
                          label="Quantity"
                          type="number"
                          InputLabelProps={
                            quantity ? { shrink: true } : { shrink: false }
                          }
                          disabled={!getValues("productUId")}
                          onKeyDown={(e) => {
                            if (
                              e.key === "-" ||
                              e.key === "+" ||
                              e.key === "e"
                            ) {
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
                      sx={{
                        ...dataGridStockStyleMappers,
                        ...focusDataGridStyle,
                      }}
                      rows={
                        showSelectedOnly
                          ? rows.filter(
                            (row) =>
                              row.loadingQty !== 0 && row.loadingQty !== ""
                          )
                          : rows
                      }
                      columns={getColumnsWithTooltip(columns)}
                      getRowId={(row) => row.id}
                      density="compact"
                      disableRowSelectionOnClick
                      experimentalFeatures={{ columnGrouping: true }}
                      columnGroupingModel={columnGroupingModel}
                      disableColumnMenu
                      processRowUpdate={handleProcessRowUpdate}
                      slots={{
                        toolbar: () => (
                          <QuickSearchToolbar
                            showSearch={false}
                            showSwitch={true}
                            checked={showSelectedOnly}
                            onCheckedChange={handleSwitchChange}
                            isDisabled={totalLoadingQty === 0}
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
                          onClick={() => handleBack()}
                          startIcon={<ArrowBackIosRoundedIcon />}
                        >
                          Back
                        </Button>
                        {TourLoadingByIdDetail?.loadingHeader?.status !== 1 &&
                          TourLoadingByIdDetail?.loadingHeader?.status !== 2 ? (
                          <>
                            <LoadingButton
                              variant="outlined"
                              color="primary"
                              onClick={updateLoading}
                              loading={isUpdateDraftSubmitting}
                              sx={{ mr: 2, height: 40 }}
                            >
                              Update as draft
                            </LoadingButton>
                            <LoadingButton
                              variant="contained"
                              color="primary"
                              loading={isSubmitting}
                              onClick={submitLoading}
                            >
                              Submit
                            </LoadingButton>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mr: 2, height: 40 }}
                            onClick={() => handleNext()}
                          >
                            Next
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </FormProvider>
          <ConfirmChangeLoadingDialog
            open={open}
            onClose={handleCancelChange}
            onConfirm={handleConfirmChange}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default TourLoadingEdit;
