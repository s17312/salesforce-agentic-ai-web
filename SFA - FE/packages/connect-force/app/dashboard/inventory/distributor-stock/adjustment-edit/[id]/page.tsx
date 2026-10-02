"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { dispatch, useSelector } from "@/redux/store";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useForm, useWatch } from "react-hook-form";
import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import dayjs from "dayjs";
import {
  Business as BusinessIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import {
  dataGridStockViewStyleMappers,
  dataStyleMappers,
} from "@/styles/tableStyles/tableStyle";
import RHFTextArea from "@/components/hook-form/RHFTextArea";
import { LoadingButton } from "@mui/lab";
import { mapListToOptions } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";
import ConfirmTableClearDialog from "@/components/popup/ConfirmTableClearDialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { distributorAdjustmentValidationSchema } from "@/utils/schemas/distributorAdjustmentSchema";
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
import {
  updateDistributorStockAdjustment,
  submitDistributorStockAdjustment,
  getAllActiveCompanies,
  getPriceListsById,
  getProductByPriceList,
  getWarehousesByDistributorUId,
  getDistributorsByCompanyUId,
  getStockAdjustmentById,
} from "@/service/inventory/distributor-stock-adjustment.service";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TotalTableRows from "./components/total-table";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
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
  uomId: number;
  baseUnitId: number;
  baseUnitName: string;
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

const DSAdjustmentEdit = ({ params }: { params: { id: number } }) => {
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
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([] as any[]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    (state) => state.distributorStockAdjustmentSlice.DS_Products
  );
  const ds_adjustment = useSelector(
    (state) => state.distributorStockAdjustmentSlice.DS_Adjustment || []
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const stockAdjustmentHeader = ds_adjustment.stockAdjustmentHeader;
  const stockAdjustmentDetail = ds_adjustment.stockAdjustmentDetail;

  const defaultValues = useMemo(
    () => ({
      stockAdjustmentDate: stockAdjustmentHeader?.stockAdjustmentDate
        ? dayjs(stockAdjustmentHeader.stockAdjustmentDate).format("YYYY-MM-DD")
        : "",
      companyUId: stockAdjustmentHeader?.companyUId || "",
      priceListUId: stockAdjustmentHeader?.priceListTypeUId || "",
      distributorUId: stockAdjustmentHeader?.distributorUId || "",
      wareHouseUId: stockAdjustmentHeader?.wareHouseUId || "",
      batchID: stockAdjustmentHeader?.batchID || "",
      refID: stockAdjustmentHeader?.refID || "",
      productUId: null,
      quantity: "",
      createdRemark: stockAdjustmentHeader?.createdRemark || "",
    }),
    [stockAdjustmentHeader]
  );
  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(distributorAdjustmentValidationSchema),
    defaultValues,
  });
  const { control, getValues, reset } = methods;

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

  // GET /getPriceList/{distributorId}
  const fetchGetPriceList = async (distributorId: number) => {
    try {
      await getPriceListsById(distributorId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
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

  // GET getWarehousesByDistributorUId
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

  // GET /getStockAdjustmentById/{id}
  const fetchGetStockAdjustmentById = async () => {
    try {
      await getStockAdjustmentById(params.id);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchGetStockAdjustmentById();
    fetchGetAllActiveCompanies();
  }, []);

  const companyId = getValues("companyUId");
  const distributorId = getValues("distributorUId");
  const warehouseId = getValues("wareHouseUId");
  const priceListTypeId = getValues("priceListUId");

  useEffect(() => {
    if (stockAdjustmentHeader) {
      reset(defaultValues);
    }

    if (Array.isArray(stockAdjustmentDetail)) {
      const mappedProducts = stockAdjustmentDetail.map((detail, index) => ({
        id: index + 1,
        uId: detail.productUID,
        productID: detail.productID,
        stockAdjustmentDetailId: detail.stockAdjustmentDetailId,
        productName: detail.productName,
        availableStock: detail.stockAvailable,
        mrp: detail.mrp,
        rate: detail.rate,
        stockUpdate: detail.updateQuantity,
        volume: detail.volume,
        value: detail.value,
        baseUnitId: detail.baseUnitId,
        baseUnitName: detail.baseUnitName,
        action: "",
      }));

      setRows(mappedProducts);
      const highestId = Math.max(
        ...mappedProducts.map((product) => product.stockAdjustmentDetailId)
      );
      setIdCounter(highestId + 1);
    }
  }, [
    stockAdjustmentHeader,
    ds_adjustment,
    stockAdjustmentDetail,
    reset,
    defaultValues,
  ]);

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
    } else {
      setRows([]);
    }
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
      .toFixed(3)
  );

  const totalVolumeMinus = parseFloat(
    rows
      .reduce((acc, row) => {
        const value = parseFloat(row.volume);
        return value < 0 ? acc + value : acc;
      }, 0.0)
      .toFixed(3)
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

  const handleReset = () => {
    reset({
      stockAdjustmentDate: dayjs().format("YYYY-MM-DD"),
      companyUId: null,
      distributorId: null,
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

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const payload = {
      distributorStockAdjustment: {
        distributorStockAdjustmentHeader: {
          stockAdjustmentNo: stockAdjustmentHeader.stockAdjustmentNo,
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
          stockAdjustmentDetailId: row.stockAdjustmentDetailId,
          productUId: row.uId,
          stockAvailable: row.availableStock,
          mrp: row.mrp,
          rate: row.rate,
          updateQuantity: parseFloat(row.stockUpdate),
          volume: parseFloat(row.volume),
          value: row.value,
        })),
      },
    };

    try {
      const responceMsg = await updateDistributorStockAdjustment(
        params.id,
        payload
      );
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
        submitType: 2, // 1:Save as draft , 2:Submit
        stockAdjustmentNo: stockAdjustmentHeader.stockAdjustmentNo,
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
        stockAdjustmentDetailId: row.stockAdjustmentDetailId,
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

  const handleCompanyChange = () => {
    const currentValues = getValues();
    setIsCompanySelected(false);
    reset({
      ...currentValues,
      priceListUId: null,
      distributorUId: null,
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
          stockAdjustmentDetailId: idCounter,
          productID: selectedProductDetails?.productID,
          productName: selectedProductDetails?.productName,
          availableStock: selectedProductDetails?.availableStock,
          uom: selectedProductDetails?.uom,
          uomQty: selectedProductDetails?.uomQty,
          rate: selectedProductDetails?.rate,
          mrp: selectedProductDetails?.mrp,
          stockUpdate: stockUpdate,
          volume: volume,
          value: value,
          action: activeButton || "",
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

  const handleDelete = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleCompanyFocus = () => {
    if (rows.length === 0) {
      setOpen(false);
    } else {
      setOpen(true);
    }
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
    { field: "productID", headerName: "Product ID", width: 150 },
    { field: "productName", headerName: "Product Name", width: 150, flex: 1 },
    {
      field: "availableStock",
      headerName: "Available Stock",
      width: 150,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "mrp",
      headerName: "MRP",
      width: 110,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        const formattedValue = params.value.toFixed(2); // Format value to 2 decimal places
        return (
          <Tooltip title={formattedValue} arrow slotProps={tooltipSlotProps}>
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
      editable: true,
      type: "number",
      renderCell: (params: any) => {
        const { stockUpdate } = params.row;
        let displayStockUpdate = stockUpdate;
        let color = "";

        if (parseFloat(stockUpdate) < 0) {
          color = "red";
        } else {
          color = "green";
        }

        displayStockUpdate = `${stockUpdate}`;
        return (
          <Tooltip
            title={displayStockUpdate}
            arrow
            slotProps={tooltipSlotProps}
          >
            <span style={{ color }}>{displayStockUpdate}</span>
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
        const formattedValue = formatVolume3Decimals(params.value);
        let displayVolume = formattedValue;
        let color = "";

        if (parseFloat(formattedValue) < 0) {
          color = "red";
        } else {
          color = "green";
        }

        displayVolume = `${formattedValue}`;

        return (
          <Tooltip title={displayVolume} arrow slotProps={tooltipSlotProps}>
            <span style={{ color }}>{displayVolume}</span>
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
      renderCell: (params: any) => {
        const formattedValue = formatCurrency(params.value);
        let displayValue = formattedValue;
        let color = "";

        if (parseFloat(formattedValue) < 0) {
          color = "red";
        } else {
          color = "green";
        }

        displayValue = `${formattedValue}`;

        return (
          <Tooltip title={displayValue} arrow slotProps={tooltipSlotProps}>
            <span style={{ color }}>{displayValue}</span>
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
      const baseUnit = row.baseUnitName;
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
        pageTitle="Distributor Stock Adjustment Edit"
        pageNavigation={[
          {
            pageName: "Distributor Stock Adjustment",
            path: PATH_DASHBOARD.distributorStock.adjustmentView,
          },
          { pageName: "Edit" },
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
                      onFocus={handleCompanyFocus}
                      disableClearable={true}
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
                      onFocus={handleDistributorFocus}
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
                      disabled={!getValues("quantity")}
                    >
                      Add
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
                    processRowUpdate={handleRowUpdate}
                  />
                </Box>

                {/* Additional Components Below DataGrid */}
                <Grid container justifyContent={"space-between"} sx={{ mt: 3 }}>
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

export default DSAdjustmentEdit;
