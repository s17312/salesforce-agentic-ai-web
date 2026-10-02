"use client";

import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import RHFTextArea from "@/components/hook-form/RHFTextArea";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  getAllActiveCompanies_PO,
  getBatchNumbers,
  getDeliveryMethods_PO,
  getDistributorDetails_PO,
  getPaymentTerms_PO,
  getPriceLists_PO,
  getProductByPriceListWithWarehouse_PO,
} from "@/service/inventory/purchaseOrder.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { focusDataGridStyle } from "@/styles/tableStyles/tableStyle";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import { extractProductName } from "@/utils/wordFilters";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  DeleteOutline as DeleteOutlineIcon,
  PostAdd as PostAddIcon,
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
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import { NewGRNValidationSchema } from "@/utils/schemas/NewGrnSchema";
import { getWarehousesByDistributorUId } from "@/service/inventory/distributor-stock.service";
import { getAllGrnTypes } from "@/service/inventory/grn-type.service";
import { formatToOnlyDate } from "@/utils/dateUtils";
import "../../../../../../styles/tableStyles/editableTableStyles.css";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { getDistrubutorGRNById, partialDeleteSubmittedNewGRN, updateDistrubutorGRN } from "@/service/inventory/new-distributor-grn.service";

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
  uomQty: string;
  uId: number;
  baseUnitName: string | null;
  isArchive: boolean;
  active: boolean;
  creationDate: string;
  modifiedDate: string | null;
  totalRecordCount: number;
  createdBy: number;
  modifiedBy: number;
}

const NewDistributorGRNView = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [rows, setRows] = useState([] as any[]);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<ProductDetails | null>(null);
  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCompanySelected, setIsCompanySelected] = useState(true);
  const [isDistributorSelected, setIsDistributorSelected] = useState(false);
  const [isWarehouseSelected, setIsWarehouseSelected] = useState(false);
  const [batchNumbers, setBatchNumbers] = useState<any>();
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const po_Companies = useSelector(
    (state) => state.purchaseOrderSlice.PO_Companies
  );
  const po_Distributors = useSelector(
    (state) => state.purchaseOrderSlice.PO_Distributors
  );
  const po_PriceLists = useSelector(
    (state) => state.purchaseOrderSlice.PO_PriceLists
  );
  const po_PaymentTerms = useSelector(
    (state) => state.purchaseOrderSlice.PO_PaymentTerms
  );
  const po_DeliveryMethods = useSelector(
    (state) => state.purchaseOrderSlice.PO_DeliveryMethods
  );
  const po_Products = useSelector(
    (state) => state.purchaseOrderSlice.PO_Products
  );
  const warehouseOptionsList = useSelector(
    (state) => state.distributorStockSlice.warehouseOptionsStockView
  );
  const grnOptionsList = useSelector(
    (state) => state.grnTypeSlice.grnTypeDetails
  );
  const distributorGRNData = useSelector(
    (state) => state.newDistributorGrnSlice.newDistributorGRN
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(NewGRNValidationSchema),
    defaultValues: {
      grnNo: "",
      invoiceNo: "",
      companyUId: null,
      distributorUId: null,
      date: dayjs().format("YYYY-MM-DD"),
      poDate: null,
      deliveryDate: null,
      priceListUId: null,
      paymentTermUId: null,
      deliveryMethodUId: null,
      productUId: null,
      quantity: "",
      chequeDate: null,
    },
  });
  const {
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
    clearErrors,
    watch,
  } = methods;

  useWatch({
    control,
    name: [
      "companyUId",
      "distributorUId",
      "priceListUId",
      "productUId",
      "quantity",
      "deliveryDate",
      "warehouseUId",
    ],
  });

  // GET /allActiveCompanies
  const fetchGetAllActiveCompanies = async () => {
    try {
      await getAllActiveCompanies_PO();
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // GET /getDistributorDetails_PO
  const fetchGetDistributorDetails = async (companyId: number) => {
    try {
      await getDistributorDetails_PO(companyId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // GET /getPriceList/{companyId}
  const fetchGetPriceList = async (distributorId: number) => {
    try {
      await getPriceLists_PO(distributorId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // GET /getPaymentTerms_PO
  const fetchGetPaymentTerms = async () => {
    try {
      await getPaymentTerms_PO();
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // GET /getDeliveryMethods_PO
  const fetchGetDeliveryMethods = async () => {
    try {
      await getDeliveryMethods_PO();
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // GET /getProductByPriceList_PO
  const fetchGetProductByPriceList = async (
    companyId: number,
    warehouseId: number,
    priceListTypeId: number
  ) => {
    try {
      await getProductByPriceListWithWarehouse_PO(
        companyId,
        warehouseId,
        priceListTypeId
      );
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  //GET warehouseOptions
  const fetchWarehouseData = async (distributorId: any) => {
    try {
      await getWarehousesByDistributorUId(distributorId);
    } catch (error) {
      console.error("error", error);
    }
  };

  // GET /grnType
  const fetchGrnTypeData = async () => {
    try {
      await getAllGrnTypes();
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  // GET getBatchNumbers
  const fetchBatchNumbers = async (
    productUId: number,
    mrp: number,
    priceListTypeUId: number,
    warehouseUId: number,
    stockRefUId: number,
    stockRoleTypeUId: number
  ) => {
    try {
      const batchData = await getBatchNumbers(
        productUId,
        mrp,
        priceListTypeUId,
        warehouseUId,
        stockRefUId,
        stockRoleTypeUId
      );
      setBatchNumbers(batchData);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await getDistrubutorGRNById(params.id);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchGetAllActiveCompanies();
    fetchGetPaymentTerms();
    fetchGetDeliveryMethods();
    fetchGrnTypeData();
  }, []);

  useEffect(() => {
    if (distributorGRNData) {
      const grnHeader = distributorGRNData.grnDirectHeader;
      const grnDetails = distributorGRNData.grnDirectDetails;

      reset({
        grnNo: grnHeader?.grnNo,
        invoiceNo: grnHeader?.invoiceNo,
        companyUId: grnHeader?.companyUId,
        distributorUId: grnHeader?.distributorUId,
        date: dayjs(grnHeader?.date).format("YYYY-MM-DD"),
        grnType: grnHeader?.grnType,
        deliveryDate: grnHeader?.deliveryDate
          ? dayjs(grnHeader?.deliveryDate).format("YYYY-MM-DD")
          : null,
        priceListUId: grnHeader?.priceListUId,
        paymentTermUId: grnHeader?.paymentTermUId,
        deliveryMethodUId: grnHeader?.deliveryMethodUId,
        poNo: grnHeader?.poNo || "",
        poDate: grnHeader?.poDate
          ? dayjs(grnHeader?.poDate).format("YYYY-MM-DD")
          : null,
        warehouseUId: grnHeader?.warehouseUId,
        chequeDate: grnHeader?.chequeDate
          ? dayjs(grnHeader?.chequeDate).format("YYYY-MM-DD")
          : null,
        chequeNumber: grnHeader?.chequeNumber || "",
        remark: grnHeader?.remark || "",
      });

      const formattedRows = grnDetails
        ?.filter((item: any) => !(item.foc === 0 && item.quantity === 0))
        .map((item: any) => ({
          id: `${item.productUID}-${item.mrp}-${item.batchNo}-${Date.now()}`,
          uId: item.productUID,
          productID: item.productID,
          productName: extractProductName(item.productName),
          mrp: item.mrp,
          rate: item.rate,
          requestedQty: item.quantity,
          volume: item.volume,
          baseUnitName: item.baseUnitName || null,
          value: item.value || 0.0,
          uomQty: item.uomQty || "0",
          amount: item.discountAmount || 0.0,
          batchNo: item.batchNo || "",
          expDate: formatToOnlyDate(item.expiryDate),
          foc: item.foc || 0.0,
          disocuntRate: item.discountRate,
          isVat: item.isVat || false,
          vat: item.vatAmount || 0.0,
          grnDetailId: item.grnDirectDetailId,
        }));

      setRows(formattedRows);
    }
  }, [distributorGRNData]);

  const { priceListUId, warehouseUId, distributorUId } = getValues();

  useEffect(() => {
    if (selectedProductDetails) {
      fetchBatchNumbers(
        selectedProductDetails.productUID,
        selectedProductDetails.mrp,
        priceListUId,
        warehouseUId,
        distributorUId,
        2
      );
    }
  }, [selectedProductDetails]);

  const companyId = getValues("companyUId");
  const distributorId = getValues("distributorUId");
  const priceListTypeId = getValues("priceListUId");
  const deliverDate = getValues("deliveryDate");
  const warehouseId = getValues("warehouseUId");
  const batchNo = getValues("batchNo");

  useEffect(() => {
    if (companyId) {
      fetchGetDistributorDetails(companyId);
    }
    if (companyId && distributorId) {
      fetchGetPriceList(distributorId);
    }
    if (distributorId && priceListTypeId && warehouseId) {
      fetchGetProductByPriceList(distributorId, warehouseId, priceListTypeId);
    }
    if (distributorId) {
      fetchWarehouseData(distributorId);
    }
    setRows([]);
  }, [companyId, distributorId, priceListTypeId, warehouseId]);

  const companyOptions = useMemo(
    () => mapListToOptions(po_Companies, "companyName", "uId"),
    [po_Companies, mapListToOptions]
  );
  const distributorOptions = useMemo(
    () =>
      mapListToOptions(po_Distributors, "distributorName", "distributorUId"),
    [po_Distributors, mapListToOptions]
  );

  const priceListOptions = useMemo(() => {
    if (!Array.isArray(po_PriceLists)) return [];

    return mapListToOptions(
      po_PriceLists.filter((item: any) => item.priceListTypeName !== null),
      "priceListTypeName",
      "priceListTypeUId"
    );
  }, [po_PriceLists, mapListToOptions]);

  const paymentTermOptions = useMemo(
    () => mapListToOptions(po_PaymentTerms, "name", "uId"),
    [po_PaymentTerms, mapListToOptions]
  );
  const deliveryMethodOptions = useMemo(
    () => mapListToOptions(po_DeliveryMethods, "deliveryMethodName", "uId"),
    [po_DeliveryMethods, mapListToOptions]
  );
  const warehousesOptions = useMemo(
    () => mapListToOptions(warehouseOptionsList, "name", "uId"),
    [warehouseOptionsList, mapListToOptions]
  );
  const grnTypeOptions = useMemo(
    () => mapListToOptions(grnOptionsList, "grnTypeName", "uId"),
    [grnOptionsList, mapListToOptions]
  );
  const batchTypeOptions = useMemo(
    () =>
      mapListToOptions(
        batchNumbers,
        "batchNumber",
        "batchNumber",
        (item) => `${item.batchNumber} | ${formatToOnlyDate(item.endDate)}`
      ),
    [batchNumbers, mapListToOptions]
  );

  const productOptions = useMemo(() => {
    if (!Array.isArray(po_Products)) return [];
    return po_Products.map((product, index) => ({
      label: product.productName,
      value: `${product.productUID}-${product.mrp}`,
    }));
  }, [po_Products]);

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
    if (Array.isArray(po_Products)) {
      const selectedProduct = po_Products.find(
        (product) =>
          product.productUID === getProductUId(productIDstring) &&
          product.mrp === getProductMRP(productIDstring)
      );
      setSelectedProductDetails(selectedProduct);
    } else {
      setSelectedProductDetails(null);
    }
  }, [getValues("productUId"), po_Products]);

  useEffect(() => {
    if (!getValues("productUId")) {
      setValue("quantity", "");
      clearErrors("quantity");
    }
  }, [watch("productUId")]);

  // Calculate totals
  const totalStockUpdate = rows.reduce(
    (acc, row) => acc + parseFloat(row.requestedQty),
    0
  );
  const totalVolume = rows.reduce(
    (acc, row) => acc + parseFloat(row.volume),
    0
  );
  const totalValue = rows.reduce((acc, row) => acc + row.value, 0);
  const totalFoc = rows.reduce((acc, row) => acc + Number(row.foc), 0);
  const totalAmount = rows.reduce((acc, row) => acc + row.amount, 0);
  const totalVat = rows.reduce((acc, row) => acc + row.vat, 0);

  const handleAddProduct = () => {
    const currentQuantity = getValues("quantity");
    const currentFoc = parseFloat(getValues("foc"));
    const requestedQty = parseFloat(currentQuantity);
    const volume =
      parseFloat(selectedProductDetails?.uomQty ?? "0") * requestedQty +
      parseFloat(selectedProductDetails?.uomQty ?? "0") * currentFoc;
    const value = (selectedProductDetails?.rate ?? 0) * requestedQty;

    const existingProductIndex = rows.findIndex(
      (row) =>
        row.uId === selectedProductDetails?.productUID &&
        row.mrp === selectedBatchDetails?.mrp &&
        row.batchNo === selectedBatchDetails?.batchNumber
    );

    if (existingProductIndex !== -1) {
      // Update existing product
      const updatedRows = rows.map((row, index) => {
        if (index === existingProductIndex) {
          return {
            ...row,
            requestedQty: row.requestedQty + requestedQty,
            volume: row.volume + volume + parseFloat(row.foc),
            value: row.value + value,
            foc: row.foc + currentFoc,
          };
        }
        return row;
      });
      setRows(updatedRows);
    } else {
      // Add new product
      const uniqueId = `${selectedProductDetails?.productUID}-${selectedProductDetails?.mrp
        }-${selectedBatchDetails?.batchNumber}-${Date.now()}`;

      const newProduct = {
        id: uniqueId,
        uId: selectedProductDetails?.productUID,
        productID: selectedProductDetails?.productID,
        productName: extractProductName(
          selectedProductDetails?.productName || ""
        ),
        mrp: selectedBatchDetails?.mrp,
        rate: selectedBatchDetails?.rate,
        requestedQty: requestedQty,
        volume: volume,
        baseUnitName: selectedProductDetails?.baseUnitName,
        value: value,
        uomQty: selectedProductDetails?.uomQty,
        amount: 0,
        batchNo: selectedBatchDetails?.batchNumber,
        expDate: formatToOnlyDate(selectedBatchDetails?.endDate),
        foc: currentFoc,
        isVat: false,
        vat: 0.0,
        disocuntRate: 0,
      };
      setRows([...rows, newProduct]);
    }

    reset({
      ...getValues(),
      productUId: null,
      quantity: "",
      foc: "",
      batchNo: null,
    });
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const payload = {
      grnDirectUpdate: {
        grnDirectUpdateHeader: {
          grnNo: formData.grnNo,
          invoiceNo: formData.invoiceNo,
          date: formData.date ? dayjs(formData.date).format("YYYY-MM-DD") : null,
          companyUId: formData.companyUId,
          distributorUId: formData.distributorUId,
          priceListUId: formData.priceListUId,
          grnType: formData.grnType,
          paymentTermUId: formData.paymentTermUId,
          deliveryMethodUId: formData.deliveryMethodUId,
          poNo: formData.poNo || null,
          poDate: formData.poDate ? dayjs(formData.poDate).format("YYYY-MM-DD") : null,
          deliveryDate: formData.deliveryDate
            ? dayjs(formData.deliveryDate).format("YYYY-MM-DD")
            : null,
          warehouseUId: formData.warehouseUId,
          chequeDate: formData.chequeDate
            ? dayjs(formData.chequeDate).format("YYYY-MM-DD")
            : null,
          chequeNumber: formData.chequeNumber || null,
          remark: formData.remark || null,
          totalQuantity: totalStockUpdate,
          totalFOC: totalFoc,
          totalDiscountAmount: totalAmount || null,
          totalVolume: totalVolume,
          totalValue: totalValue,
          statusId: 5,
        },
        grnDirectUpdateDetails: rows.map((row) => ({
          productUId: row.uId,
          productID: row.productID,
          productName: row.productName,
          batchNo: row.batchNo,
          expiryDate: row.expDate ? dayjs(row.expDate).format("YYYY-MM-DD") : null,
          mrp: row.mrp,
          rate: row.rate,
          quantity: row.requestedQty,
          foc: row.foc,
          discountRate: row.disocuntRate,
          discountAmount: row.amount || null,
          isVat: row.isVat,
          vatAmount: row.vat,
          volume: row.volume,
          value: row.value,
          grnDetailId: row.grnDetailId,
        })),
      },
    };

    try {
      const responseMsg = await partialDeleteSubmittedNewGRN(params.id, payload);
      enqueueSnackbar(`${responseMsg.message} | ${responseMsg.number}`, {
        variant: "success",
      });
      handleReset();
      router.push(PATH_DASHBOARD.newDistributorGrnDelete.list);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsDistributorSelected(false);
    setIsCompanySelected(false);
    setIsWarehouseSelected(false);
    reset({
      grnNo: "",
      invoiceNo: "",
      companyUId: null,
      distributorUId: null,
      date: dayjs().format("YYYY-MM-DD"),
      deliveryDate: null,
      priceListUId: null,
      paymentTermUId: null,
      deliveryMethodUId: null,
      productUId: null,
      quantity: "",
    });
    setRows([]);
  };

  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    const oldDisocuntRate = parseFloat(oldRow?.disocuntRate ?? 0);
    const newDisocuntRate = parseFloat(newRow?.disocuntRate ?? 0);
    const oldAmount = parseFloat(oldRow?.amount ?? 0);
    const newAmount = parseFloat(newRow?.amount ?? 0);

    if (oldDisocuntRate > 0 && newAmount !== oldAmount) {
      enqueueSnackbar(
        "Cannot change 'amount' because 'rate' already has a value.",
        { variant: "error" }
      );
      return oldRow;
    }

    if (
      oldAmount > 0 &&
      oldDisocuntRate === 0 &&
      newDisocuntRate !== oldDisocuntRate
    ) {
      enqueueSnackbar(
        "Cannot change 'rate' because 'amount' already has a value and 'rate' was initially empty.",
        { variant: "error" }
      );
      return oldRow;
    }
    const requestedQty = parseFloat(newRow.requestedQty);
    const safeRequestedQty = isNaN(requestedQty) ? 0 : requestedQty;

    const volume =
      parseFloat(newRow.uomQty ?? 1) * safeRequestedQty +
      parseFloat(newRow.uomQty ?? 1) * newRow.foc;
    const value = parseFloat(newRow.rate ?? 1) * safeRequestedQty;
    const newDiscountAmount = newAmount
      ? newAmount
      : value * (Number(newRow.disocuntRate) / 100);
    const vat = newRow.isVat ? (value - newDiscountAmount) * 0.18 : 0;

    const updatedRow = {
      ...newRow,
      requestedQty: safeRequestedQty,
      volume: isNaN(volume) ? 0 : volume,
      value: isNaN(value) ? 0 : value,
      disocuntRate: Number(newRow.disocuntRate) || 0,
      amount: isNaN(newRow.amount) ? 0 : newDiscountAmount,
      isVat: newRow.isVat,
      vat,
    };

    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );

    return updatedRow;
  };

  const handleDelete = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleCompanyChange = () => {
    const currentValues = getValues();
    setIsCompanySelected(false);
    setIsDistributorSelected(false);
    reset({
      ...currentValues,
      distributorUId: null,
      priceListUId: null,
      productUId: null,
      warehouseUId: null,
    });
  };

  const handleDistributorChange = () => {
    const currentValues = getValues();
    setIsDistributorSelected(true);
    setIsWarehouseSelected(false);
    reset({
      ...currentValues,
      warehouseUId: null,
    });
  };

  const handleWarehouseChange = () => {
    const currentValues = getValues();
    setIsWarehouseSelected(true);
    reset({
      ...currentValues,
      productUId: null,
    });
  };

  const handleBatchChange = () => {
    if (Array.isArray(batchNumbers)) {
      const selectedBatch = batchNumbers.find(
        (batch) => batch.batchNumber === getValues("batchNo")
      );
      setSelectedBatchDetails(selectedBatch);
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

  const columns: GridColDef[] = [
    {
      field: "productID",
      headerName: "Prod. ID",
      width: 80,
      sortable: false,
    },
    { field: "productName", headerName: "Product", width: 220 },
    {
      field: "batchNo",
      headerName: "Batch No",
      width: 120,
      sortable: false,
    },
    {
      field: "expDate",
      headerName: "Exp Date",
      width: 120,
      sortable: false,
    },
    {
      field: "mrp",
      headerName: "MRP",
      width: 90,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>; // Return an empty span if the value is an empty string
        }
        const formattedValue = params.value.toFixed(2); // Format value to 2 decimal places
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "rate",
      headerName: "Rate",
      width: 90,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>; // Return an empty span if the value is an empty string
        }
        const formattedValue = formatCurrency(params.value); // Format value to 2 decimal places
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "requestedQty",
      headerName: "Qty",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
      editable: true,
      cellClassName: "editable-cell",
      type: "number",
      preProcessEditCellProps: (params: any) => {
        const newValue = params.props.value;
        const availableQty = params.row.requestedQty;

        // Negative or scientific notation
        if (newValue < 0 || newValue.toString().includes("e")) {
          enqueueSnackbar("Quantity can't be negative", { variant: "error" });
          return { ...params.props, error: true };
        }

        // Empty check
        if (newValue === null || newValue === undefined || newValue === "") {
          enqueueSnackbar("Quantity cannot be empty", { variant: "error" });
          return { ...params.props, error: true };
        }
        // Greater than available
        if (newValue > availableQty) {
          enqueueSnackbar(
            `Quantity cannot exceed available quantity (${availableQty})`,
            {
              variant: "error",
            }
          );
          return { ...params.props, error: true };
        }
      },
    },
    {
      field: "foc",
      headerName: "FOC",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
      editable: true,
      cellClassName: "editable-cell",
      type: "number",
      preProcessEditCellProps: (params: any) => {
        const newValue = params.props.value;
        const availableQty = params.row.foc;
        // Negative or scientific notation
        if (newValue < 0 || newValue.toString().includes("e")) {
          enqueueSnackbar("FOC can't be negative", { variant: "error" });
          return { ...params.props, error: true };
        }
        // Exceeding available quantity
        if (newValue > availableQty) {
          enqueueSnackbar(
            `FOC cannot exceed available quantity (${availableQty})`,
            {
              variant: "error",
            }
          );
          return { ...params.props, error: true };
        }
        return { ...params.props, error: false };
      },
    },
    {
      field: "disocuntRate",
      headerName: "Rate(%)",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
      editable: false,
      type: "number",
      preProcessEditCellProps: (params: any) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        if (hasError)
          enqueueSnackbar("Rate(%) can't be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
      editable: false,
      type: "number",
      preProcessEditCellProps: (params: any) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        if (hasError)
          enqueueSnackbar("Discount Amount can't be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>; // Return an empty span if the value is an empty string
        }
        const formattedValue = formatCurrency(params.value); // Format value to 2 decimal places
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "isVat",
      headerName: "is VAT",
      width: 80,
      sortable: false,
      headerAlign: "center",
      align: "center",
      type: "boolean",
      editable: false,
      renderCell: (params: any) => {
        const isVat = params.value;
        return isVat ? <DoneRoundedIcon /> : <ClearRoundedIcon />;
      },
    },
    {
      field: "vat",
      headerName: "VAT",
      width: 120,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>; // Return an empty span if the value is an empty string
        }
        const formattedValue = formatCurrency(params.value); // Format value to 2 decimal places
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
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>; // Return an empty span if the value is an empty string
        }
        const formattedValue = formatVolume3Decimals(params.value); // Format value to 2 decimal places
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
      width: 150,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>; // Return an empty span if the value is an empty string
        }
        const formattedValue = formatCurrency(params.value); // Format value to 2 decimal places
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
      width: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params: any) => {
        if (!params.row.id) {
          return <span></span>; // Return an empty span if the row ID is not valid
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

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "discount",
      headerName: "Discount",
      headerAlign: "center",
      children: [
        { field: "foc" },
        { field: "disocuntRate" },
        { field: "amount" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor GRN Update"
        pageNavigation={[
          {
            pageName: "Distributor GRN",
            path: PATH_DASHBOARD.newDistributorGrnDelete.list,
          },
          { pageName: "Update" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        icon={<PostAddIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
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
                  flexGrow: 1,
                }}
              >
                GRN Information
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
                    <RHFTextField name="grnNo" label="GRN No*" disabled />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="invoiceNo"
                      label="Invoice No*"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFDatePicker
                      name="date"
                      label="Date*"
                      disableFuture={false}
                      disablePast={false}
                      onChange={(date: any) => {
                        setValue("date", date);
                      }}
                      format={
                        process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                      }
                      value={null}
                      renderInput={(params) => (
                        <TextField {...params} disabled={isCompanySelected} />
                      )}
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
                      name="priceListUId"
                      placeholder="Price List Type*"
                      options={priceListOptions}
                      control={control}
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
                      name="grnType"
                      placeholder="Grn Type*"
                      options={grnTypeOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="paymentTermUId"
                      placeholder="Payment Term"
                      options={paymentTermOptions}
                      control={control}
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
                      name="deliveryMethodUId"
                      placeholder="Delivery Method"
                      options={deliveryMethodOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled={isCompanySelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField name="poNo" label="PO No" disabled />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFDatePicker
                      name="poDate"
                      label="PO Date"
                      disableFuture={false}
                      disablePast={false}
                      onChange={(date: any) => {
                        setValue("poDate", date);
                      }}
                      format={
                        process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                      }
                      value={null}
                      renderInput={(params) => (
                        <TextField {...params} disabled={isCompanySelected} />
                      )}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFDatePicker
                      name="deliveryDate"
                      label="Delivery Date"
                      disableFuture={false}
                      disablePast={false}
                      onChange={(date: any) => {
                        setValue("deliveryDate", date);
                      }}
                      format={
                        process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                      }
                      value={null}
                      renderInput={(params) => (
                        <TextField {...params} disabled={isCompanySelected} />
                      )}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFAutocompleteField
                      name="warehouseUId"
                      placeholder="Warehouse*"
                      onChange={handleWarehouseChange}
                      // @ts-ignore
                      options={warehousesOptions}
                      control={control}
                      disabled={!isDistributorSelected}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="chequeNumber"
                      label="Cheque No"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFDatePicker
                      name="chequeDate"
                      label="Cheque Date"
                      disableFuture={false}
                      disablePast={false}
                      onChange={(date: any) => {
                        setValue("chequeDate", date);
                      }}
                      format={
                        process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                      }
                      value={null}
                      renderInput={(params) => <TextField {...params} />}
                      disabled
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

          <Card sx={{ backgroundColor: "#fff" }}>
            <CardContent>
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2, alignItems: "stretch" }}
                >
                  <Grid item xs={6}>
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
                      disabled
                    />
                  </Grid>
                  <Grid item xs={2.5}>
                    <RHFAutocompleteField
                      name="batchNo"
                      placeholder="Batch No"
                      options={batchTypeOptions}
                      onChange={handleBatchChange}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled={!getValues("productUId")}
                    />
                  </Grid>
                  <Grid item xs={1}>
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
                  <Grid item xs={1}>
                    <RHFTextField
                      name="foc"
                      label="FOC"
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
                      disabled
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleAddProduct}
                      disabled={
                        !!errors.quantity ||
                        !getValues("quantity") ||
                        !getValues("productUId")
                      }
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
                <DataGrid
                  getRowId={(row) => row.id}
                  sx={{
                    ...focusDataGridStyle,
                  }}
                  rows={rows}
                  columns={getColumnsWithTooltip(columns)}
                  experimentalFeatures={{ columnGrouping: true }}
                  columnGroupingModel={columnGroupingModel}
                  getRowClassName={(params) =>
                    params.row.productID === "Total" ? "total-row" : ""
                  }
                  processRowUpdate={handleProcessRowUpdate}
                  density="compact"
                  hideFooter
                  disableRowSelectionOnClick
                  disableColumnMenu
                />
                <Box
                  display="flex"
                  gap={2}
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{
                    backgroundColor: "#f1f1f1",
                    padding: 1,
                    mt: 2,
                    mb: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Total:
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    Qty:{" "}
                    <Chip
                      label={totalStockUpdate}
                      sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    FOC:{" "}
                    <Chip
                      label={totalFoc}
                      sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Dis. Amount:{" "}
                    <Chip
                      label={totalAmount ? formatCurrency(totalAmount) : "0.00"}
                      sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Volume:{" "}
                    <Chip
                      label={formatVolume3Decimals(totalVolume)}
                      sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Value:{" "}
                    <Chip
                      label={formatCurrency(totalValue)}
                      sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                    />
                  </Typography>
                </Box>
                <Grid
                  container
                  alignContent={"center"}
                  justifyContent={"space-between"}
                  sx={{ mt: 2 }}
                >
                  <Grid item xs={8} sx={{ mr: 2 }}>
                    <RHFTextArea
                      name="remark"
                      label="Remark"
                      control={control}
                      numberOfRows={1}
                    />
                  </Grid>
                  {/* total details  card*/}
                  <Grid item xs={3} sx={{ mt: 2 }}>
                    <Card sx={{ backgroundColor: "#ffffff", padding: 2 }}>
                      <Grid container direction="column" spacing={1}>
                        <Grid item xs={12}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              fontWeight={600}
                            >
                              Gross Invoice Value:
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(totalValue)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              fontWeight={600}
                            >
                              Discount Value:
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(totalAmount)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              fontWeight={600}
                            >
                              VAT 18%:
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(totalVat)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              fontWeight={600}
                            >
                              Net Invoice Value:
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(
                                totalValue - totalAmount + totalVat
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignContent={"center"}
                  justifyContent={"space-between"}
                  sx={{ mt: 2 }}
                >
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                      <LoadingButton
                        variant="outlined"
                        color="primary"
                        loading={isSubmitting}
                        onClick={methods.handleSubmit(handleUpdate)}
                        sx={{ mr: 2, height: 40 }}
                        disabled={rows.length === 0}
                      >
                        Update
                      </LoadingButton>
                    </Box>
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

export default NewDistributorGRNView;
