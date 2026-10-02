"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useRouter } from "next/navigation";
import { dispatch, useSelector } from "@/redux/store";
import { useForm, useWatch } from "react-hook-form";
import { distributorAdjustmentValidationSchema } from "@/utils/schemas/distributorAdjustmentSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import {
  createDistributorStockAdjustment,
  submitDistributorStockAdjustment,
  getAllActiveCompanies,
  getPriceListsById,
  getProductByPriceList,
  getWarehousesByDistributorUId,
  getDistributorsByCompanyUId,
} from "@/service/inventory/distributor-stock-adjustment.service";
import { mapListToOptions } from "@/utils/sortUtils";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Business as BusinessIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteOutlineIcon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataStyleMappers } from "@/styles/tableStyles/tableStyle";
import { LoadingButton } from "@mui/lab";
import { enqueueSnackbar } from "notistack";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import RHFTextArea from "@/components/hook-form/RHFTextArea";
import PopupResponse from "@/components/popup/popup-response";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TotalTableRows from "./components/total-table";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { extractProductName } from "@/utils/wordFilters";
import DistributorStockUploadPopUp from "./bulk-upload/distributor-stock-upload-pop-up";

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
  uomId: number;
  baseUnitId: number;
  baseUnitName: string;
  uomQty: number;
  uId: number;
  creationDate: string;
  modifiedDate: string;
  totalRecordCount: number;
  createdBy: number;
  modifiedBy: number;
}

const DistributorStockAdjustment = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [isCompanySelected, setIsCompanySelected] = useState(true);
  const [isDistributorSelected, setIsDistributorSelected] = useState(true);
  const [expand1, setExpand1] = useState(true);
  const [idCounter, setIdCounter] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeButton, setActiveButton] = useState<
    "increment" | "decrement" | null
  >("increment");
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<ProductDetails | null>(null);
  const [rows, setRows] = useState([] as any[]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPopUpOpen, setUploadPopUpOpen] = useState(false);
  // const [hasBulkUploadError, setHasBulkUploadError] = useState(false);
  // const [uploadAttempted, setUploadAttempted] = useState(false);

  const ds_Companies = useSelector(
    (state) => state.distributorStockAdjustmentSlice.DS_Companies
  );
  const ds_PriceLists = useSelector(
    (state) => state.distributorStockAdjustmentSlice.DS_PriceLists
  );
  const ds_Distributors = useSelector(
    (state) => state.distributorStockAdjustmentSlice.DS_Distributors
  );
  const ds_Warehouses = useSelector(
    (state) => state.distributorStockAdjustmentSlice.DS_Warehouses
  );
  const ds_Products = useSelector(
    (state) => state.distributorStockAdjustmentSlice.DS_Products || []
  );
  const ds_adjustmentBulk = useSelector(
    (state) => state.distributorStockAdjustmentSlice.DS_AdjustmentBulk
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(distributorAdjustmentValidationSchema),
    defaultValues: {
      stockAdjustmentDate: dayjs().format("YYYY-MM-DD"),
      companyUId: null,
      priceListUId: null,
      distributorUId: null,
      wareHouseUId: null,
      batchID: "",
      refID: "",
      productUId: null,
      quantity: "",
    },
  });
  const {
    control,
    getValues,
    reset,
    formState: { errors },
  } = methods;

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  // GET /allActiveCompanies
  const fetchGetAllActiveCompanies = async () => {
    try {
      await getAllActiveCompanies();
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchGetAllActiveCompanies();
  }, []);

  const companyId = getValues("companyUId");
  const distributorId = getValues("distributorUId");
  const warehouseId = getValues("wareHouseUId");
  const priceListTypeId = getValues("priceListUId");

  useEffect(() => {
    if (companyId) {
      fetchGetDistributorsByCompanyUId(companyId);
      if (distributorId) {
        fetchGetWarehousesByDistributorUId(distributorId);
        fetchGetPriceList(distributorId);
        if (distributorId && warehouseId && priceListTypeId) {
          fetchGetProductByPriceList(
            distributorId,
            warehouseId,
            priceListTypeId
          );
        }
      }
    }
    setRows([]);
  }, [companyId, warehouseId, priceListTypeId, distributorId]);

  // Options Creation
  const companyOptions = useMemo(
    () => mapListToOptions(ds_Companies, "companyName", "uId"),
    [ds_Companies, mapListToOptions]
  );
  const distributorOptions = useMemo(
    () =>
      mapListToOptions(ds_Distributors, "distributorName", "distributorUId"),
    [ds_Distributors, mapListToOptions]
  );

  const priceListOptions = useMemo(() => {
    if (!Array.isArray(ds_PriceLists)) return [];

    return mapListToOptions(
      ds_PriceLists.filter((item: any) => item.priceListTypeName !== null),
      "priceListTypeName",
      "priceListTypeUId"
    );
  }, [ds_PriceLists, mapListToOptions]);

  const warehouseOptions = useMemo(
    () => mapListToOptions(ds_Warehouses, "name", "uId"),
    [ds_Warehouses, mapListToOptions]
  );
  const productOptions = useMemo(() => {
    return ds_Products.map((product, index) => ({
      label: product.productName,
      value: `${product.productUID}-${product.mrp}`,
    }));
  }, [ds_Products]);

  // Function to get productUId from productUId
  const getProductUId = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[0]);
  };

  // Function to get mrp from productUId
  const getProductMRP = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[1]);
  };

  useWatch({
    control,
    name: [
      "companyUId",
      "distributorUId",
      "priceListUId",
      "wareHouseUId",
      "batchID",
      "refID",
      "quantity",
      "productUId",
      "createdRemark",
    ],
  });

  const productIDstring = getValues("productUId");

  useEffect(() => {
    if (Array.isArray(ds_Products)) {
      const selectedProduct = ds_Products.find(
        (product) =>
          product.productUID === getProductUId(productIDstring) &&
          product.mrp === getProductMRP(productIDstring)
      );
      setSelectedProductDetails(selectedProduct);
    } else {
      setSelectedProductDetails(null);
    }
  }, [productIDstring, ds_Products]);

  const handleReset = () => {
    reset({
      stockAdjustmentDate: dayjs().format("YYYY-MM-DD"),
      companyUId: null,
      priceListUId: null,
      wareHouseUId: null,
      batchID: "",
      refID: "",
      productUId: null,
      quantity: "",
      createdRemark: "",
    });
    setRows([]);
  };

  const handleCompanyChange = () => {
    const currentValues = getValues();
    setIsCompanySelected(false);
    reset({
      ...currentValues,
      distributorUId: null,
      priceListUId: null,
      wareHouseUId: null,
      productUId: null,
    });
  };

  const handleDistributorChange = () => {
    const currentValues = getValues();
    setIsDistributorSelected(false);
    reset({
      ...currentValues,
      priceListUId: null,
      wareHouseUId: null,
      productUId: null,
    });
  };

  const handleToggle = (button: "increment" | "decrement") => {
    setActiveButton(button);
  };

  const handleDelete = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  // GET companydistributor/distributorDetails/company?CompanyId=12
  const fetchGetDistributorsByCompanyUId = async (companyId: number) => {
    try {
      await getDistributorsByCompanyUId(companyId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // GET /getPriceList/{companyUId}
  const fetchGetPriceList = async (distributorId: number) => {
    try {
      await getPriceListsById(distributorId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // GET getWarehousesByCompanyUId
  const fetchGetWarehousesByDistributorUId = async (distributorId: number) => {
    try {
      await getWarehousesByDistributorUId(distributorId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // GET getProductByPriceList
  const fetchGetProductByPriceList = async (
    distributorId: number,
    warehouseId: number,
    priceListTypeId: number
  ) => {
    try {
      await getProductByPriceList(distributorId, warehouseId, priceListTypeId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  // Calculate totals
  const totalStockUpdatePlus = rows.reduce((acc, row) => {
    const value = parseFloat(row.stockUpdate);
    return value > 0 ? acc + value : acc;
  }, 0);

  const totalStockUpdateMinus = rows.reduce((acc, row) => {
    const value = parseFloat(row.stockUpdate);
    return value < 0 ? acc + value : acc;
  }, 0);

  const totalVolumePlus = parseFloat(
    rows
      .reduce((acc, row) => {
        const value = parseFloat(row.volume);
        return value > 0 ? acc + value : acc;
      }, 0.0)
      .toFixed(2)
  );

  const totalVolumeMinus = parseFloat(
    rows
      .reduce((acc, row) => {
        const value = parseFloat(row.volume);
        return value < 0 ? acc + value : acc;
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

  const totalValueMinus = parseFloat(
    rows
      .reduce((acc, row) => {
        return row.value < 0 ? acc + parseFloat(row.value) : acc;
      }, 0.0)
      .toFixed(2)
  );

  const handleAddProduct = () => {
    const currentQuantity = getValues("quantity");
    const requestedQty = parseFloat(currentQuantity);
    let totalReducedQuantity = 0;
    let totalAddedQuantity = 0;

    rows.forEach((row) => {
      if (row.uId === selectedProductDetails?.productUID) {
        if (row.action === "decrement") {
          totalReducedQuantity += parseFloat(row.stockUpdate);
        } else if (row.action === "increment") {
          totalAddedQuantity += parseFloat(row.stockUpdate);
        }
      }
    });

    if (activeButton === "decrement") {
      totalReducedQuantity += parseFloat(currentQuantity);
    } else {
      totalAddedQuantity += requestedQty;
    }

    const totalAvailableStock =
      (selectedProductDetails?.availableStock ?? 0) + totalAddedQuantity;

    if (
      activeButton === "decrement" &&
      totalAvailableStock < totalReducedQuantity
    ) {
      enqueueSnackbar(
        `Product: ${selectedProductDetails?.productID} does not have enough stock`,
        { variant: "error" }
      );
    } else {
      let stockUpdate = parseFloat(currentQuantity);
      let volume = (selectedProductDetails?.uomQty ?? 0) * stockUpdate;
      let value = (selectedProductDetails?.mrp ?? 0) * stockUpdate;

      if (activeButton === "decrement") {
        stockUpdate = -stockUpdate;
        volume = -volume;
        value = -value;
      }

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
              action:
                row.stockUpdate + stockUpdate > 0 ? "increment" : "decrement",
            };
          }
          return row;
        });
        setRows(updatedRows);
      } else {
        const newProduct = {
          id: idCounter,
          uId: selectedProductDetails?.productUID,
          productID: selectedProductDetails?.productID,
          productName: selectedProductDetails?.productName,
          availableStock: selectedProductDetails?.availableStock,
          uom: selectedProductDetails?.uom,
          uomQty: selectedProductDetails?.uomQty,
          mrp: selectedProductDetails?.mrp,
          rate: selectedProductDetails?.rate,
          stockUpdate: stockUpdate,
          volume: volume,
          value: value,
          action: activeButton,
          baseUnitId: selectedProductDetails?.baseUnitId,
          baseUnitName: selectedProductDetails?.baseUnitName,
        };
        setRows([...rows, newProduct]);
        setIdCounter((prevCounter) => prevCounter + 1);
      }
      reset({
        ...getValues(),
        productUId: null,
        quantity: "",
      });
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const payload = {
      distributorStockAdjustmentHeader: {
        stockAdjustmentDate: formData.stockAdjustmentDate,
        companyUId: formData.companyUId,
        distributorUId: formData.distributorUId,
        wareHouseUId: formData.wareHouseUId,
        priceListTypeUId: formData.priceListUId,
        batchID: formData.batchID,
        refID: formData.refID,
        totalPlusQuantity: totalStockUpdatePlus,
        totalPlusVolume: totalVolumePlus,
        totalPlusValue: totalValuePlus,
        totalMinusQuantity: totalStockUpdateMinus,
        totalMinusVolume: totalVolumeMinus,
        totalMinusValue: totalValueMinus,
        createdRemark: formData.createdRemark,
      },
      distributorStockAdjustmentDetail: rows.map((row) => ({
        productUId: row.uId,
        stockAvailable: row.availableStock,
        mrp: row.mrp,
        rate: row.rate,
        updateQuantity: parseFloat(row.stockUpdate),
        volume: parseFloat(row.volume),
        value: row.value,
      })),
    };

    try {
      // Call API to save draft createDistributorStockAdjustment
      const responceMsg = await createDistributorStockAdjustment(payload);
      enqueueSnackbar(`${responceMsg.message} | ${responceMsg.number}`, {
        variant: "success",
      });
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
      distributorStockAdjustmentHeader: {
        submitType: 1,
        stockAdjustmentNo: null,
        stockAdjustmentDate: formData.stockAdjustmentDate,
        companyUId: formData.companyUId,
        distributorUId: formData.distributorUId,
        wareHouseUId: formData.wareHouseUId,
        priceListTypeUId: formData.priceListUId,
        batchID: formData.batchID,
        refID: formData.refID,
        totalPlusQuantity: totalStockUpdatePlus,
        totalPlusVolume: totalVolumePlus,
        totalPlusValue: totalValuePlus,
        totalMinusQuantity: totalStockUpdateMinus,
        totalMinusVolume: totalVolumeMinus,
        totalMinusValue: totalValueMinus,
        createdRemark: formData.createdRemark,
      },
      distributorStockAdjustmentDetail: rows.map((row) => ({
        productUId: row.uId,
        stockAvailable: row.availableStock,
        mrp: row.mrp,
        rate: row.rate,
        updateQuantity: parseFloat(row.stockUpdate),
        volume: parseFloat(row.volume),
        value: row.value,
      })),
    };

    try {
      // Call API to save draft submitDistributorStockAdjustment
      const responceMsg = await submitDistributorStockAdjustment(payload);
      enqueueSnackbar(`${responceMsg.message} | ${responceMsg.number}`, {
        variant: "success",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      handleReset();
    }
  };

  useEffect(() => {
    if (Array.isArray(ds_adjustmentBulk) && ds_adjustmentBulk.length > 0) {
      handleBulkUpload();
    }
  }, [ds_adjustmentBulk]);

  const handleBulkUpload = () => {
    if (!Array.isArray(ds_adjustmentBulk)) return;

    const updatedRows = [...rows];
    let newIdCounter = idCounter;

    for (let i = 0; i < ds_adjustmentBulk.length; i++) {
      const bulkItem = ds_adjustmentBulk[i];
      const matchedProduct = ds_Products.find(
        (p: any) =>
          p.productID === bulkItem.ProductID &&
          Number(p.mrp) === Number(bulkItem.MRP)
      );

      if (!matchedProduct) {
        enqueueSnackbar(
          `Product with ID: ${bulkItem.ProductID} and MRP: ${bulkItem.MRP} does not exist.`,
          { variant: "error" }
        );
        return; // Stop processing further
      }

      const quantity = Number(bulkItem.Quentity) || 0;
      if (!quantity) continue; // Skip if no quantity

      // Check if already in table (by productUID and mrp)
      const existingIndex = updatedRows.findIndex(
        (row) =>
          row.uId === matchedProduct.productUID &&
          Number(row.mrp) === Number(matchedProduct.mrp)
      );

      let stockUpdate = quantity;
      let volume = (Number(matchedProduct.uomQty) || 0) * stockUpdate;
      let value = (Number(matchedProduct.mrp) || 0) * stockUpdate;

      if (existingIndex !== -1) {
        // Update existing row
        updatedRows[existingIndex] = {
          ...updatedRows[existingIndex],
          stockUpdate: updatedRows[existingIndex].stockUpdate + stockUpdate,
          volume: updatedRows[existingIndex].volume + volume,
          value: updatedRows[existingIndex].value + value,
          action:
            updatedRows[existingIndex].stockUpdate + stockUpdate > 0
              ? "increment"
              : "decrement",
        };
      } else {
        // Add new row
        updatedRows.push({
          id: newIdCounter++,
          uId: matchedProduct.productUID,
          productID: matchedProduct.productID,
          productName: extractProductName(matchedProduct.productName || ""),
          availableStock: matchedProduct.availableStock,
          uom: matchedProduct.uom,
          uomQty: matchedProduct.uomQty,
          mrp: matchedProduct.mrp,
          rate: matchedProduct.rate,
          stockUpdate,
          volume,
          value,
          action: stockUpdate > 0 ? "increment" : "decrement",
          baseUnitId: matchedProduct.baseUnitId,
          baseUnitName: matchedProduct.baseUnitName,
        });
      }
    }

    enqueueSnackbar("Distributor stock adjustment uploaded successfully", {
      variant: "success",
    });

    setRows(updatedRows);
    setIdCounter(newIdCounter);
  };

  const handleUploadBtnClick = () => {
    setUploadPopUpOpen(true);
  };

  const handleUploadPopUpClose = () => {
    setUploadPopUpOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: "productID",
      headerName: "Product ID",
      width: 150,
      sortable: false,
      flex: 1,
    },
    {
      field: "productName",
      headerName: "Product Name",
      width: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "availableStock",
      headerName: "Available Stock",
      width: 150,
      sortable: false,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "mrp",
      headerName: "MRP",
      width: 110,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (params: any) => {
        const formattedValue = params.value.toFixed(2); // Format value to 2 decimal places
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "stockUpdate",
      headerName: "Stock Update",
      width: 150,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (params: any) => (
        <Tooltip
          title={
            params.row.action === "increment"
              ? `+${params.value}`
              : `-${params.value}`
          }
          arrow
        >
          <span
            style={{
              color: params.row.action === "increment" ? "green" : "red",
            }}
          >
            {params.row.action === "increment"
              ? `+${params.value}`
              : `${params.value}`}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "volume",
      headerName: "Volume",
      width: 150,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (params: any) => {
        const formattedValue = formatVolume3Decimals(params.value); // Format value to 2 decimal places
        return (
          <Tooltip
            title={
              params.row.action === "increment"
                ? `+${formattedValue}`
                : `-${formattedValue}`
            }
            arrow
          >
            <span
              style={{
                color: params.row.action === "increment" ? "green" : "red",
              }}
            >
              {params.row.action === "increment"
                ? `+${formattedValue}`
                : `${formattedValue}`}
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "baseUnitName",
      headerName: "UOM",
      maxWidth: 80,
      flex: 1,
      sortable: false,
    },
    {
      field: "value",
      headerName: "Value",
      width: 150,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (params: any) => {
        const formattedValue = formatCurrency(params.value); // Format value to 2 decimal places
        return (
          <Tooltip
            title={
              params.row.action === "increment"
                ? `+${formattedValue}`
                : `-${formattedValue}`
            }
            arrow
          >
            <span
              style={{
                color: params.row.action === "increment" ? "green" : "red",
              }}
            >
              {params.row.action === "increment"
                ? `+${formattedValue}`
                : `${formattedValue}`}
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params: any) => (
        <IconButton
          size="small"
          sx={{ color: "red" }}
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      ),
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

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Stock Adjustment Add"
        pageNavigation={[
          {
            pageName: "Distributor Stock Adjustment",
            path: PATH_DASHBOARD.distributorStock.adjustmentView,
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
              <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                  ml: 1,
                }}
              >
                Distributor Stock Adjustment Information
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
                      name="stockAdjustmentDate"
                      label="Date"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="companyUId"
                      placeholder="Company*"
                      options={companyOptions}
                      control={control}
                      onChange={handleCompanyChange}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="distributorUId"
                      placeholder="Distributor*"
                      options={distributorOptions}
                      control={control}
                      onChange={handleDistributorChange}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled={isCompanySelected}
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
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="priceListUId"
                      placeholder="Price List*"
                      options={priceListOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled={isDistributorSelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField name="batchID" label="Batch ID" />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField name="refID" label="Ref ID" />
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
              display: "flex",
              flexDirection: "column",
              minHeight: !expand1 ? "80vh" : "65vh",
            }}
          >
            <CardContent
              sx={{ display: "flex", flexDirection: "column", flex: 1 }}
            >
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2, alignItems: "stretch" }}
                >
                  <Grid item xs={6.75}>
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
                        !getValues("priceListUId") ||
                        !getValues("wareHouseUId")
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor:
                            activeButton === "decrement"
                              ? theme.palette.error.main
                              : "transparent",
                          color:
                            activeButton === "decrement" ? "#fff" : "inherit",
                          "&:hover": {
                            backgroundColor:
                              activeButton === "decrement"
                                ? theme.palette.error.dark
                                : "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                        onClick={() => handleToggle("decrement")}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor:
                            activeButton === "increment"
                              ? theme.palette.success.main
                              : "transparent",
                          color:
                            activeButton === "increment" ? "#fff" : "inherit",
                          "&:hover": {
                            backgroundColor:
                              activeButton === "increment"
                                ? theme.palette.success.dark
                                : "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                        onClick={() => handleToggle("increment")}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={1.5}>
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
                  <Grid item xs={1.25}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleUploadBtnClick}
                      disabled={
                        !getValues("distributorUId") ||
                        !getValues("priceListUId") ||
                        !getValues("wareHouseUId")
                      }
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload
                    </Button>
                  </Grid>
                </Grid>

                {/* DataGrid with Flex Height */}
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <DataGrid
                    sx={{
                      ...dataStyleMappers,
                    }}
                    rows={rows}
                    columns={getColumnsWithTooltip(columns)}
                    density="compact"
                    hideFooter
                    disableRowSelectionOnClick
                    disableColumnMenu
                  />
                </Box>

                {/* Additional Components Below DataGrid */}
                <Grid container justifyContent={"space-between"} sx={{ mt: 5 }}>
                  <Grid item xs={5} alignItems={"left"}>
                    <RHFTextArea
                      name="createdRemark"
                      label="Remark"
                      control={control}
                      numberOfRows={3}
                    />
                  </Grid>
                  <Grid item xs={5} alignItems={"right"}>
                    <Box sx={{ width: "100%", borderRadius: 1 }}>
                      <TotalTableRows groupedRows={groupRowsByBaseUnit(rows)} />
                    </Box>
                  </Grid>
                </Grid>
                {/* Buttons at the Bottom */}
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
                      disabled={rows.length === 0}
                    >
                      Save as draft
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
      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
      <DistributorStockUploadPopUp
        open={uploadPopUpOpen}
        handleClose={handleUploadPopUpClose}
        // hasError={hasBulkUploadError}
        // setUploadAttempted={setUploadAttempted}
      />
    </FsBox>
  );
};

export default DistributorStockAdjustment;
