"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import {
  setValueUnloadingDetails,
  setValueUnloadingHeader,
} from "@/redux/slices/tour/tour-value-sales-slice";
import { dispatch, useSelector } from "@/redux/store";
import {
  getDamageWarehouseByDistributor,
  getPrimaryWarehouseByDistributor,
} from "@/service/tour-service/tourUnloading.service";
import {
  getPriceListsByDistributorIdValueInvoice,
  getReturnProductsValueUnloading,
  getValueUnloadingByScheduleId,
  submitValueUnloading,
} from "@/service/value-sale/valueUnloading.service";
import { focusDataGridStyle } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
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
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridColumnGroupingModel,
  GridEventListener,
  GridRowModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import "../../../../styles/tableStyles/editableTableStyles.css";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

interface UnloadingRepTourProps {
  schedule: any;
  fetchTourScheduleID: () => void;
}

const UnloadingRepTour: React.FC<UnloadingRepTourProps> = ({
  schedule,
  fetchTourScheduleID,
}) => {
  const theme = useTheme();
  const [rows, setRows] = React.useState([] as any[]);
  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(true);
  const [isPriceListSelected, setIsPriceListSelected] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unloadingHeader = useSelector(
    (state) => state.tourValueSalesSlice.ValueUnloadingHeader
  );
  const unloadingDetails = useSelector(
    (state) => state.tourValueSalesSlice.ValueUnloadingDetails
  );
  const priceListTypes = useSelector(
    (state) => state.tourValueSalesSlice.PriceListsByDistributorId
  );
  const returnProductsList = useSelector(
    (state) => state.tourValueSalesSlice.UnloadingProducts
  );

  const primaryWarehouseOptionsList = useSelector(
    (state) => state.tourUnloadingSlice.PrimaryWarehousesList
  );

  const DamageWarehouseOptionsList = useSelector(
    (state) => state.tourUnloadingSlice.DamageWarehousesList
  );

  const columnNames = [
    { field: "productId", headerName: "PID" },
    { field: "productName", headerName: "Product Name" },
    { field: "mrp", headerName: "MRP" },
    { field: "loadingQuantity", headerName: "Loading" },
    { field: "saleQuantity", headerName: "Sale" },
    { field: "discountQuantity", headerName: "Discount" },
    { field: "sellableQuantity", headerName: "Salable Return" },
    { field: "nonSellableQuantity", headerName: "Non Salable Return" },
    { field: "goodsQuantity", headerName: "System Unloading Goods" },
    { field: "damagedQuantity", headerName: "System Unloading Returns" },
    { field: "repGoodsQuantity", headerName: "Rep Unloading Goods" },
    { field: "repDamagedQuantity", headerName: "Rep Unloading Returns" },
    { field: "disGoodsQuantity", headerName: "Distributor Unloading Goods" },
    {
      field: "disDamagedQuantity",
      headerName: "Distributor Unloading Returns",
    },
    { field: "varianceGoodsQuantity", headerName: "Unloading Variance Goods" },
    {
      field: "varianceDamagedQuantity",
      headerName: "Unloading Variance Returns",
    },
  ];

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rows, columnNames);

  const defaultValues = useMemo(
    () => ({
      distributorPrimaryWarehouseUId:
        unloadingHeader?.distributorWarehouseUId || null,
      distributorDamageWarehouseUId:
        unloadingHeader?.damagedWarehouseUId || null,
    }),
    [unloadingHeader, unloadingDetails]
  );

  const methods = useForm<any>({
    mode: "all",
    defaultValues,
  });

  const {
    reset,
    control,
    getValues,
    formState: { errors },
  } = methods;

  useWatch({
    control,
    name: [
      "distributorPrimaryWarehouseUId",
      "distributorDamageWarehouseUId",
      "priceList",
      "productUId",
      "quantity",
      "returnType",
    ],
  });

  const priceListID = getValues("priceList");

  useEffect(() => {
    fetchGetTourUnloadingByScheduleId();
    fetchTourLoadingWarehouses();
    fetchGetPriceListTypesByOutlet();
  }, [schedule]);

  useEffect(() => {
    if (priceListID) {
      fetchGetReturnProducts();
    }
  }, [priceListID]);

  //Set the unloading details when unloading arrives
  useEffect(() => {
    if (unloadingDetails) {
      if (unloadingHeader?.statusId == 2) {
        const mappedRows = unloadingDetails.map((detail: any, index: any) => ({
          ...detail,
          id: index + 1,
          disGoodsQuantity: detail.goodsQuantity,
          disDamagedQuantity: detail.damagedQuantity,
        }));

        setRows(mappedRows);
      } else {
        const mappedRows = unloadingDetails.map((detail: any, index: any) => ({
          ...detail,
          id: index + 1,
          disGoodsQuantity: detail.repGoodsQuantity,
          disDamagedQuantity: detail.repDamagedQuantity,
        }));

        setRows(mappedRows);
      }
    }
  }, [unloadingHeader, unloadingDetails]);

  useEffect(() => {
    if (
      unloadingHeader?.distributorWarehouseUId !== 0 ||
      unloadingHeader?.damagedWarehouseUId !== 0
    ) {
      reset({
        distributorPrimaryWarehouseUId:
          unloadingHeader?.distributorWarehouseUId,
        distributorDamageWarehouseUId: unloadingHeader?.damagedWarehouseUId,
      });
    }
  }, [unloadingHeader, unloadingDetails]);

  const fetchGetTourUnloadingByScheduleId = async () => {
    dispatch(setValueUnloadingHeader({}));
    dispatch(setValueUnloadingDetails([]));
    try {
      await getValueUnloadingByScheduleId(schedule.uId);
    } catch {
      enqueueSnackbar("Error fetching tour unloading", { variant: "error" });
    }
  };

  const fetchTourLoadingWarehouses = async () => {
    await getPrimaryWarehouseByDistributor(schedule.distributorUId);
    await getDamageWarehouseByDistributor(schedule.distributorUId);
  };

  const fetchGetPriceListTypesByOutlet = async () => {
    try {
      await getPriceListsByDistributorIdValueInvoice(schedule.distributorUId);
    } catch (error) {
      enqueueSnackbar("Error fetching price list types", { variant: "error" });
    }
  };

  const fetchGetReturnProducts = async () => {
    try {
      await getReturnProductsValueUnloading(
        priceListID,
        schedule?.distributorUId
      );
    } catch (error) {
      enqueueSnackbar("Failed to fetch return products", { variant: "error" });
    }
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

  const damageWarehousesOptions = useMemo(
    () =>
      mapListToOptions(
        DamageWarehouseOptionsList,
        "warehouseName",
        "warehouseUId"
      ),
    [DamageWarehouseOptionsList, mapListToOptions]
  );

  const handleRowUpdate = (
    newRow: GridRowModel
  ): GridValidRowModel | Promise<GridValidRowModel> => {
    // Find the existing row from the state
    const existingRow = rows.find((row) => row.id === newRow.id);

    // If the existing row is not found, return the newRow as is
    if (!existingRow) {
      return newRow;
    }

    // Find the corresponding unloadingDetails entry
    const unloadingDetail = unloadingDetails.find(
      (detail) =>
        detail.productUId === newRow.productUId && detail.mrp === newRow.mrp
    );

    // If unloadingDetail is not found, return the newRow as is
    if (!unloadingDetail) {
      return newRow;
    }

    // Initialize the updated row with the new values
    const updatedRow = { ...newRow };

    // Check if saleQuantity has changed
    if (Number(existingRow.saleQuantity) !== Number(newRow.saleQuantity)) {
      updatedRow.goodsQuantity =
        Number(unloadingDetail.goodsQuantity) -
        Number(newRow.saleQuantity) -
        Number(newRow.discountQuantity) +
        Number(newRow.sellableQuantity);

        if(Number(updatedRow.goodsQuantity) !== Number(unloadingDetail.goodsQuantity)){
          if(!schedule.isMobile){
            updatedRow.repGoodsQuantity = updatedRow.goodsQuantity;
          }
          updatedRow.disGoodsQuantity = updatedRow.goodsQuantity;
        }
    }

    // Check if discountQuantity has changed
    if (
      Number(existingRow.discountQuantity) !== Number(newRow.discountQuantity)
    ) {
      updatedRow.goodsQuantity =
        Number(unloadingDetail.goodsQuantity) -
        Number(newRow.saleQuantity) -
        Number(newRow.discountQuantity) +
        Number(newRow.sellableQuantity);

        if(Number(updatedRow.goodsQuantity) !== Number(unloadingDetail.goodsQuantity)){
          if(!schedule.isMobile){
            updatedRow.repGoodsQuantity = updatedRow.goodsQuantity;
          }
          updatedRow.disGoodsQuantity = updatedRow.goodsQuantity;
        }
    }

    // Check if sellableQuantity has changed
    if (
      Number(existingRow.sellableQuantity) !== Number(newRow.sellableQuantity)
    ) {
      updatedRow.goodsQuantity =
        Number(unloadingDetail.goodsQuantity) -
        Number(newRow.saleQuantity) -
        Number(newRow.discountQuantity) +
        Number(newRow.sellableQuantity);

        if(Number(updatedRow.goodsQuantity) !== Number(unloadingDetail.goodsQuantity)){
          if(!schedule.isMobile){
            updatedRow.repGoodsQuantity = updatedRow.goodsQuantity;
          }
          updatedRow.disGoodsQuantity = updatedRow.goodsQuantity;
        }
    }

    // Check if nonSellableQuantity has changed
    if (
      Number(existingRow.nonSellableQuantity) !== Number(newRow.nonSellableQuantity)
    ) {
      updatedRow.damagedQuantity =
        Number(unloadingDetail.damagedQuantity) +
        Number(newRow.nonSellableQuantity);

      if(Number(updatedRow.damagedQuantity) !== Number(unloadingDetail.damagedQuantity)){
        if(!schedule.isMobile){
          updatedRow.repDamagedQuantity = updatedRow.damagedQuantity;
        }
        updatedRow.disDamagedQuantity = updatedRow.damagedQuantity;
      }
    }

    // Check if DistributorGoodQuantity has changed
    if (
      Number(existingRow.disGoodsQuantity) !== Number(newRow.disGoodsQuantity) 
    ) {
      updatedRow.varianceGoodsQuantity =
        Number(newRow.disGoodsQuantity) - Number(updatedRow.goodsQuantity);
    }

    // Check if DistributorDamageQuantity has changed
    if (
      Number(existingRow.disDamagedQuantity) !== Number(newRow.disDamagedQuantity) 
    ) {
      updatedRow.varianceDamagedQuantity =
        Number(newRow.disDamagedQuantity) - Number(updatedRow.damagedQuantity);
    }

    // Check if goodsQuantity is negative
    if (updatedRow.goodsQuantity < 0) {
      enqueueSnackbar("Total Good couldn't be negative", { variant: "error" });
      return Promise.reject(new Error("Total Good couldn't be negative"));
    }

    // Update the rows state
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );

    // Return the updated row
    return updatedRow;
  };

  let disPrimaryWarehouseUId = getValues("distributorPrimaryWarehouseUId");
  let disSecondaryWarehouseUId = getValues("distributorDamageWarehouseUId");

  const handleSubmitForm = async () => {
    setIsSubmitting(true)
    const invalidRow = rows.find(
      (row) => row.goodsQuantity === null || row.damagedQuantity === null
    );

    if (invalidRow) {
      enqueueSnackbar("Please fill all required fields before submitting.", {
        variant: "error",
      });
      return;
    }
    const unloadingDetail = rows.map((row) => ({
      productUId: row.productUId,
      mrp: row.mrp,
      uom: row.uom || null,
      unitVolume: row.unitVolume,
      loadingQuantity: row.loadingQuantity,
      saleQuantity: row.saleQuantity ?? 0,
      discountQuantity: row.discountQuantity,
      sellableQuantity: row.sellableQuantity ?? 0,
      nonSellableQuantity: row.nonSellableQuantity ?? 0,
      goodsQuantity: row.disGoodsQuantity,
      damagedQuantity: row.disDamagedQuantity,
      goodsValue: row.goodsQuantity * row.mrp,
      damagedValue: row.damagedQuantity * row.mrp,
      goodsVolume: Number((row.goodsQuantity * row.unitVolume).toFixed(2)),
      damagedVolume: Number((row.damagedQuantity * row.unitVolume).toFixed(2)),
      returnTypeUId: row.returnTypeUId || 0,
      repGoodsQuantity: row.repGoodsQuantity ?? 0,
      repGoodsValue: row.repGoodsValue ?? 0,
      repGoodsVolume: row.repGoodsVolume ?? 0,
      repDamagedQuantity: row.repDamagedQuantity ?? 0,
      repDamagedValue: row.repDamagedValue ?? 0,
      repDamagedVolume: row.repDamagedVolume ?? 0,
      varianceGoodsQuantity: row.varianceGoodsQuantity ?? 0,
      varianceGoodsValue: row.varianceGoodsValue ?? 0,
      varianceGoodsVolume: row.varianceGoodsVolume ?? 0,
      varianceDamagedQuantity: row.varianceDamagedQuantity ?? 0,
      varianceDamagedValue: row.varianceDamagedValue ?? 0,
      varianceDamagedVolume: row.varianceDamagedVolume ?? 0,
    }));        

    const payload = {
      unloadingHeader: {
        unloadingDate: new Date().toISOString().split("T")[0],
        tourScheduleUId: schedule.uId,
        vehicleUId: schedule.vehicleUId,
        disPrimaryWarehouseUId: disPrimaryWarehouseUId,
        disSecondaryWarehouseUId: disSecondaryWarehouseUId,
        mobileStatusUId: schedule.isMobile ? 5 : 5,
        distributorUId: schedule.distributorUId,
      },
      unloadingDetail: unloadingDetail,
    };

    let response;

    try {
      response = await submitValueUnloading(payload);
      enqueueSnackbar(
        `${response.data.result.message} | ${response.data.result.number}`,
        {
          variant: "success",
        }
      );
      fetchGetTourUnloadingByScheduleId();
      setIsPriceListSelected(false);
      fetchTourScheduleID();
    } catch (error) {
      enqueueSnackbar(response?.data[0].description, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductChange = (e: any) => {
    const product = returnProductsList.find((item) => item.productUId === e);
    setSelectedProduct(product);
  };

  let returnTypeUId = getValues("returnType");
  let quantity = Number(getValues("quantity"));
  let volume = Number((selectedProduct?.unitVolume * quantity).toFixed(2));

  const handleAddProduct = () => {
    const existingProductIndex = rows.findIndex(
      (row) =>
        row.productUId === selectedProduct.productUId &&
        row.mrp === selectedProduct.mrp
    );

    if (existingProductIndex !== -1) {
      // Update existing product
      const updatedRows = rows.map((row, index) => {
        if (index === existingProductIndex) {
          return {
            ...row,
            unitVolume: selectedProduct.unitVolume,
            sellableQuantity:
              returnTypeUId === 1
                ? Number(row.sellableQuantity) + quantity
                : row.sellableQuantity,
            nonSellableQuantity:
              returnTypeUId === 2
                ? Number(row.nonSellableQuantity) + quantity
                : row.nonSellableQuantity,
            goodsQuantity:
              returnTypeUId === 1
                ? Number(row.goodsQuantity) + quantity
                : row.goodsQuantity,
            damagedQuantity:
              returnTypeUId === 2
                ? Number(row.damagedQuantity) + quantity
                : row.damagedQuantity,
            returnTypeUId: returnTypeUId === 1 ? 1 : 2,
          };
        }
        return row;
      });

      setRows(updatedRows);
    } else {
      // Add new product
      const product = {
        id: rows.length + 1,
        productId: selectedProduct.productCode,
        productUId: selectedProduct.productUId,
        productName: selectedProduct.productName,
        mrp: selectedProduct.mrp,
        unitVolume: selectedProduct.unitVolume,
        loadingQuantity: 0,
        saleQuantity: 0,
        discountQuantity: 0,
        sellableQuantity: returnTypeUId === 1 ? quantity : 0,
        nonSellableQuantity: returnTypeUId === 2 ? quantity : 0,
        goodsQuantity: returnTypeUId === 1 ? quantity : 0,
        damagedQuantity: returnTypeUId === 2 ? quantity : 0,
        goodsVolume: returnTypeUId === 1 ? volume : 0,
        damagedVolume: returnTypeUId === 2 ? volume : 0,
        returnTypeUId: returnTypeUId === 1 ? 1 : 2,
        repGoodsQuantity: 0,
        repDamagedQuantity: 0,
        disGoodsQuantity: returnTypeUId === 1 ? volume : 0,
        disDamagedQuantity: returnTypeUId === 2 ? volume : 0,
        varianceGoodsQuantity: 0,
        varianceDamagedQuantity: 0,
      };
      setRows([...rows, product]);
    }
    setIsPriceListSelected(false);

    reset({
      ...getValues(),
      priceList: null,
      productUId: null,
      quantity: "",
      returnType: null,
    });
  };

  const priceListTypesOptions = useMemo(() => {
    if (!Array.isArray(priceListTypes)) return [];

    return mapListToOptions(
      priceListTypes.filter((item: any) => item.priceListTypeName !== null),
      "priceListTypeName",
      "priceListTypeUId"
    );
  }, [priceListTypes, mapListToOptions]);

  const productListOptions = useMemo(() => {
    return returnProductsList.map((product, index) => ({
      label: `${product.productCode}-${product.productName
        }##${product.mrp.toFixed(2)}`,
      value: `${product.productUId}-${product.mrp}`,
    }));
  }, [returnProductsList]);

  const returnTypeOptions = [
    { label: "Saleable", value: 1 },
    { label: "Non Saleable", value: 2 },
  ];

  // Function to get productUId  from
  const getProductUId = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[0]);
  };

  // Function to get mrp from productUId
  const getProductMRP = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[1]);
  };

  const productIDstring = getValues("productUId");

  useEffect(() => {
    if (Array.isArray(returnProductsList)) {
      const selectedProduct = returnProductsList.find(
        (product) =>
          product.productUId === getProductUId(productIDstring) &&
          product.mrp === getProductMRP(productIDstring)
      );

      setSelectedProduct(selectedProduct);
    } else {
      setSelectedProduct(null);
    }
  }, [getValues("productUId"), returnProductsList]);

  const handleCellClick = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }

      // Ignore portal
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      setCellModesModel((prevModel) => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    []
  );

  const handleCellModesModelChange = React.useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    []
  );

  const handleKeyDown: GridEventListener<"cellKeyDown"> = (params, event) => {
    if (
      event.key === "-" ||
      event.key === "+" ||
      event.key === "e" ||
      event.key === "E"
    ) {
      event.preventDefault();
    }
  };

  const columns: GridColDef[] = [
    {
      field: "productId",
      headerName: "PID",
      minWidth: 120,
      maxWidth: 120,
      sortable: false,
      flex: 1,
    },
    {
      field: "productName",
      headerName: "Product Name",
      minWidth: 200,
      sortable: false,
      flex: 1,
    },
    {
      field: "mrp",
      headerName: "MRP",
      minWidth: 73,
      maxWidth: 73,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "loadingQuantity",
      headerName: "Loading",
      minWidth: 75,
      maxWidth: 75,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "saleQuantity",
      headerName: "Sale",
      minWidth: 73,
      maxWidth: 73,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      editable: true,
      cellClassName: "editable-cell",
      // preProcessEditCellProps: (params) => {
      //   const hasError = params.props.value < 0;
      //   if (hasError)
      //     enqueueSnackbar("Sale Quantity can't be negative", {
      //       variant: "error",
      //     });
      //   return { ...params.props, error: hasError };
      // },
    },
    {
      field: "discountQuantity",
      headerName: "Discount",
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      editable: true,
      cellClassName: "editable-cell",
      preProcessEditCellProps: (params) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        if (hasError)
          enqueueSnackbar("Discount Quantity can't be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "sellableQuantity",
      headerName: "Saleable Return",
      minWidth: 130,
      maxWidth: 130,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      editable: true,
      cellClassName: "editable-cell",
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0;
        if (hasError)
          enqueueSnackbar("Saleable Return Quantity can't be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "nonSellableQuantity",
      headerName: "Non Saleable Return",
      minWidth: 160,
      maxWidth: 160,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      editable: true,
      cellClassName: "editable-cell",
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0;
        if (hasError)
          enqueueSnackbar("Non Saleable Return Quantity can't be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "goodsQuantity",
      headerName: "Good",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 100,
      maxWidth: 100,
      // editable: true,
      // cellClassName: "editable-cell",
      // preProcessEditCellProps: (params) => {
      //   const hasError = params.props.value < 0;
      //   if (hasError)
      //     enqueueSnackbar("Good Quantity can't be negative", {
      //       variant: "error",
      //     });
      //   return { ...params.props, error: hasError };
      // },
    },
    {
      field: "damagedQuantity",
      headerName: "Damaged",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 100,
      maxWidth: 100,
      // editable: true,
      // cellClassName: "editable-cell",
      // preProcessEditCellProps: (params) => {
      //   const hasError = params.props.value < 0;
      //   if (hasError)
      //     enqueueSnackbar("Damaged Quantity can't be negative", {
      //       variant: "error",
      //     });
      //   return { ...params.props, error: hasError };
      // },
    },
    {
      field: "repGoodsQuantity",
      headerName: "Good",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 100,
      maxWidth: 100,
    },
    {
      field: "repDamagedQuantity",
      headerName: "Damaged",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 100,
      maxWidth: 100,
    },
    {
      field: "disGoodsQuantity",
      headerName: "Good",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 100,
      maxWidth: 100,
      editable: true,
      cellClassName: "editable-cell",
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0;
        if (hasError)
          enqueueSnackbar("Distributor Good Quantity can't be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "disDamagedQuantity",
      headerName: "Damaged",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 100,
      maxWidth: 100,
      editable: true,
      cellClassName: "editable-cell",
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0;
        if (hasError)
          enqueueSnackbar("Distributor Damaged Quantity can't be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "varianceGoodsQuantity",
      headerName: "Good",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 100,
      maxWidth: 100,
    },
    {
      field: "varianceDamagedQuantity",
      headerName: "Damaged",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 100,
      maxWidth: 100,
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "systemUnloading",
      headerName: "System Unloading",
      headerAlign: "center",
      children: [{ field: "goodsQuantity" }, { field: "damagedQuantity" }],
    },
    {
      groupId: "repUnloading",
      headerName: "Rep Unloading",
      headerAlign: "center",
      children: [
        { field: "repGoodsQuantity" },
        { field: "repDamagedQuantity" },
      ],
    },
    {
      groupId: "disUnloading",
      headerName: "Distributor Unloading",
      headerAlign: "center",
      children: [
        { field: "disGoodsQuantity" },
        { field: "disDamagedQuantity" },
      ],
    },
    {
      groupId: "variance",
      headerName: "Unloading Variance",
      headerAlign: "center",
      children: [
        { field: "varianceGoodsQuantity" },
        { field: "varianceDamagedQuantity" },
      ],
    },
  ];

  return (
    <>
      <FormProvider methods={methods}>
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
              Tour Unloading Warehouse Details
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
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <RHFAutocompleteField
                    name="distributorPrimaryWarehouseUId"
                    placeholder="Primary Warehouse"
                    // @ts-ignore
                    options={primaryWarehousesOptions}
                    control={control}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteField
                    name="distributorDamageWarehouseUId"
                    placeholder="Damage Warehouse"
                    // @ts-ignore
                    options={damageWarehousesOptions}
                    control={control}
                  />
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
        {unloadingHeader.statusId === 2 ? null : (
          <Accordion
            expanded={expand2}
            onChange={() => setExpand2(!expand2)}
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
                borderBottomLeftRadius: expand2 ? "0px" : "9px",
                borderBottomRightRadius: expand2 ? "0px" : "9px",
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
                Return Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: "white",
                borderTopLeftRadius: expand2 ? "0px" : "9px",
                borderTopRightRadius: expand2 ? "0px" : "9px",
                borderBottomLeftRadius: "9px",
                borderBottomRightRadius: "9px",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="priceList"
                      placeholder="Price List*"
                      options={priceListTypesOptions}
                      control={control}
                      disabled={isPriceListSelected}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="productUId"
                      placeholder="Select Product*"
                      options={productListOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled={!getValues("priceList")}
                      onChange={handleProductChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="returnType"
                      placeholder="Return Type*"
                      options={returnTypeOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <RHFTextField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      disabled={
                        !getValues("productUId") || !getValues("priceList")
                      }
                      inputProps={{ min: 0 }}
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+" || e.key === "e") {
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
                      disabled={!getValues("quantity")}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
        <DataGrid
          sx={{
            height: 400,
            ...focusDataGridStyle,
          }}
          rows={searchedRows}
          columns={getColumnsWithTooltip(columns)}
          experimentalFeatures={{ columnGrouping: true }}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <QuickSearchToolbar
                columns={columnNames}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                menuItem={{
                  field: "searchColumn",
                  headerName: "Search By",
                }}
              />
            ),
          }}
          columnGroupingModel={columnGroupingModel}
          processRowUpdate={(newRow) => {
            // Prevent negative values
            const updatedRow = { ...newRow };
            if (updatedRow.saleQuantity < 0) updatedRow.saleQuantity = 0;
            if (updatedRow.discountQuantity < 0)
              updatedRow.discountQuantity = 0;
            if (updatedRow.sellableQuantity < 0)
              updatedRow.sellableQuantity = 0;
            if (updatedRow.nonSellableQuantity < 0)
              updatedRow.nonSellableQuantity = 0;
            return handleRowUpdate(updatedRow);
          }}
          cellModesModel={cellModesModel}
          onCellModesModelChange={handleCellModesModelChange}
          onCellClick={handleCellClick}
          onCellKeyDown={handleKeyDown}
          isCellEditable={(params) => unloadingHeader.statusId !== 2}
          density="compact"
          hideFooter
          disableRowSelectionOnClick
          disableColumnMenu
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <>
            {unloadingHeader.statusId === 2 || schedule.statusUId === 15 ? null : (
              <LoadingButton
                variant="contained"
                onClick={handleSubmitForm}
                loading={isSubmitting}
                disabled={
                  disPrimaryWarehouseUId === null ||
                  disPrimaryWarehouseUId === 0 ||
                  disSecondaryWarehouseUId === null ||
                  disSecondaryWarehouseUId === 0
                }
              >
                Submit
              </LoadingButton>
            )}
            {schedule.statusUId === 17 ? (
              <LoadingButton
                variant="contained"
                onClick={handleSubmitForm}
                loading={isSubmitting}
                disabled={
                  disPrimaryWarehouseUId === null ||
                  disPrimaryWarehouseUId === 0 ||
                  disSecondaryWarehouseUId === null ||
                  disSecondaryWarehouseUId === 0
                }
              >
                Submit
              </LoadingButton>
            ) : null}
          </>
        </Box>
      </FormProvider>
    </>
  );
};

export default UnloadingRepTour;
