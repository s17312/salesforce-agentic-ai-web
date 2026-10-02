import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import RHFTextArea from "@/components/hook-form/RHFTextArea";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  getAllActiveCompanies_PO,
  getDeliveryMethods_PO,
  getDistributorDetails_PO,
  getPaymentTerms_PO,
  getPriceLists_PO,
  getProductByPriceList_PO,
  updatePurchaseOrder,
} from "@/service/inventory/purchaseOrder.service";
import { dataGridStockViewStyleMappers } from "@/styles/tableStyles/tableStyle";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import { PoCreationValidationSchema } from "@/utils/schemas/PoCreationSchema";
import { mapListToOptions } from "@/utils/sortUtils";
import { extractProductName } from "@/utils/wordFilters";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
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
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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
  uomQty: string; // Added this field
  baseUnitName: string | null;
  uId: number;
  isArchive: boolean;
  active: boolean;
  creationDate: string;
  modifiedDate: string | null; // Modified this field to allow null
  totalRecordCount: number;
  createdBy: number;
  modifiedBy: number;
}

interface poHeader {
  companyUId: number;
  distributorUId: number;
  poNo: string;
  poDate: string;
  priceListTypeUId: number;
  deliveryDate: string;
  paymentTermUId: number;
  deliveryMethodUId: number;
  statusId: number;
  remark: string;
  savedBy: number;
  savedDate: string;
  submittedBy: number | null;
  submittedDate: string | null;
  approvedBy: number | null;
  approvedDate: string | null;
  rejectedBy: number | null;
  rejectedDate: string | null;
  totalQuantity: number;
  approveRemark: string | null;
  totalVolume: number;
  totalValue: number;
  warehouseUId: number;
}

interface PurchaseOrderDetail {
  productUId: number;
  productID: string;
  productName: string;
  mrp: number;
  stockAvailable: number;
  rate: number;
  requestQuantity: number;
  volume: number;
  value: number;
  poHeaderUId: number;
  approvedQuantity: number | null;
  baseUnitName: string | null;
}

interface CurrentPO {
  poHeader: poHeader;
  poDetail: PurchaseOrderDetail[];
  id: number;
}

type Props = {
  id: number;
  currentPO?: CurrentPO;
};

export default function PurchaseOrderEditComponent({ id, currentPO }: Props) {
  const router = useRouter();
  const theme = useTheme();

  const [serverDownError, setServerDownError] = useState(false);
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(true);
  const [rows, setRows] = useState([] as any[]);
  const [initialRows, setInitialRows] = useState([] as any[]);
  const [expand1, setExpand1] = useState(true);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<ProductDetails | null>(null);
  const [isCompanySelected, setIsCompanySelected] = useState(true);
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

  const defaultValues = useMemo(
    () => ({
      companyUId: currentPO?.poHeader?.companyUId || 0,
      distributorUId: currentPO?.poHeader?.distributorUId || 0,
      poDate: currentPO?.poHeader?.poDate || "",
      deliveryDate: currentPO?.poHeader?.deliveryDate || "",
      priceListUId: currentPO?.poHeader?.priceListTypeUId || 0,
      paymentTermUId: currentPO?.poHeader?.paymentTermUId || 0,
      deliveryMethodUId: currentPO?.poHeader?.deliveryMethodUId || 0,
      remark: currentPO?.poHeader?.remark || null,
      productUId: null,
      quantity: "",
    }),
    [currentPO]
  );

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(PoCreationValidationSchema),
    defaultValues,
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
  const fetchGetPriceList = async (companyId: number) => {
    try {
      await getPriceLists_PO(companyId);
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
    priceListTypeId: number
  ) => {
    try {
      await getProductByPriceList_PO(companyId, priceListTypeId);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchGetAllActiveCompanies();
    fetchGetPaymentTerms();
    fetchGetDeliveryMethods();
  }, []);

  const companyId = getValues("companyUId");
  const distributorId = getValues("distributorUId");
  const priceListTypeId = getValues("priceListUId");

  useEffect(() => {
    if (companyId) {
      fetchGetDistributorDetails(companyId);
    }
    if (companyId && distributorId) {
      fetchGetPriceList(distributorId);
    }
    if (distributorId && priceListTypeId) {
      fetchGetProductByPriceList(distributorId, priceListTypeId);
    }
    setRows([]);
  }, [companyId, distributorId, priceListTypeId]);

  useEffect(() => {
    if (currentPO) {
      reset(defaultValues);
    }

    if (Array.isArray(currentPO?.poDetail)) {
      const mappedProducts = currentPO?.poDetail.map((detail, index) => ({
        id: index + 1,
        uId: detail.productUId,
        productID: detail.productID,
        productName: detail.productName,
        availableStock: detail.stockAvailable,
        mrp: detail.mrp,
        rate: detail.rate,
        requestedQty: detail.requestQuantity,
        volume: detail.volume,
        baseUnitName: detail.baseUnitName,
        value: detail.value,
      }));

      setRows(mappedProducts);
      setInitialRows(mappedProducts);
    }
  }, [currentPO, reset, defaultValues]);

  const companyOptions = useMemo(
    () => mapListToOptions(po_Companies, "companyName", "uId"),
    [po_Companies, mapListToOptions]
  );
  const distributorOptions = useMemo(
    () =>
      mapListToOptions(po_Distributors, "distributorName", "distributorUId"),
    [po_Distributors, mapListToOptions]
  );
  const priceListOptions = useMemo(
    () =>
      mapListToOptions(po_PriceLists, "priceListTypeName", "priceListTypeUId"),
    [po_PriceLists, mapListToOptions]
  );
  const paymentTermOptions = useMemo(
    () => mapListToOptions(po_PaymentTerms, "name", "uId"),
    [po_PaymentTerms, mapListToOptions]
  );
  const deliveryMethodOptions = useMemo(
    () => mapListToOptions(po_DeliveryMethods, "deliveryMethodName", "uId"),
    [po_DeliveryMethods, mapListToOptions]
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
    const rowsChanged = JSON.stringify(rows) !== JSON.stringify(initialRows);
    setIsButtonsDisabled(!rowsChanged);
  }, [rows, initialRows]);

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

  const formattedVolume = Number(totalVolume.toFixed(3));

  const totalValue = rows.reduce((acc, row) => acc + row.value, 0);

  const handleAddProduct = () => {
    const currentQuantity = getValues("quantity");
    const requestedQty = parseFloat(currentQuantity);
    const volume =
      parseFloat(selectedProductDetails?.uomQty ?? "0") * requestedQty;
    const value = (selectedProductDetails?.mrp ?? 0) * requestedQty;

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
            requestedQty: row.requestedQty + requestedQty,
            volume: row.volume + volume,
            value: row.value + value,
          };
        }
        return row;
      });
      setRows(updatedRows);
    } else {
      // Add new product
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
        mrp: selectedProductDetails?.mrp,
        rate: selectedProductDetails?.rate,
        requestedQty: requestedQty,
        volume: volume,
        baseUnitName: selectedProductDetails?.baseUnitName,
        value: value,
      };
      setRows([...rows, newProduct]);
    }

    reset({
      ...getValues(),
      productUId: null,
      quantity: "",
    });
  };

  const handleUpdateDraft = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const payload = {
      purchaseOrder: {
        purchaseOrderHeader: {
          companyUId: formData.companyUId,
          distributorUId: formData.distributorUId,
          poNo: null,
          poDate: formData.poDate,
          priceListTypeUId: formData.priceListUId,
          deliveryDate: formData.deliveryDate,
          paymentTermUId: formData.paymentTermUId,
          deliveryMethodUId: formData.deliveryMethodUId,
          statusId: 1,
          remark: formData.remark,
          savedBy: 0,
          savedDate: new Date().toISOString(),
          submittedBy: null,
          submittedDate: null,
          approvedBy: null,
          approvedDate: null,
          rejectedBy: null,
          rejectedDate: null,
          totalQuantity: totalStockUpdate,
          approveRemark: null,
          totalVolume: totalVolume,
          totalValue: totalValue,
          warehouseUId: 0,
        },
        purchaseOrderDetails: rows.map((row) => ({
          productUId: row.uId,
          mrp: row.mrp,
          stockAvailable: row.availableStock,
          rate: row.rate,
          requestQuantity: row.requestedQty,
          volume: row.volume,
          value: row.value,
          poHeaderUId: 0,
          approvedQuantity: 0,
        })),
      },
    };

    try {
      // Call API to update updatePurchaseOrder
      const responseMsg = await updatePurchaseOrder(id, payload);

      enqueueSnackbar(`${responseMsg.message} | ${responseMsg.result.poNo}`, {
        variant: "success",
      });
      router.push(PATH_DASHBOARD.purchaseOrder.creation.view);
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
      purchaseOrder: {
        purchaseOrderHeader: {
          companyUId: formData.companyUId,
          distributorUId: formData.distributorUId,
          poNo: null,
          poDate: formData.poDate,
          priceListTypeUId: formData.priceListUId,
          deliveryDate: formData.deliveryDate,
          paymentTermUId: formData.paymentTermUId,
          deliveryMethodUId: formData.deliveryMethodUId,
          statusId: 2,
          remark: formData.remark,
          savedBy: 0,
          savedDate: new Date().toISOString(),
          submittedBy: null,
          submittedDate: null,
          approvedBy: null,
          approvedDate: null,
          rejectedBy: null,
          rejectedDate: null,
          totalQuantity: totalStockUpdate,
          approveRemark: null,
          totalVolume: totalVolume,
          totalValue: totalValue,
          warehouseUId: 0,
        },
        purchaseOrderDetails: rows.map((row) => ({
          productUId: row.uId,
          mrp: row.mrp,
          stockAvailable: row.availableStock,
          rate: row.rate,
          requestQuantity: row.requestedQty,
          volume: row.volume,
          value: row.value,
          poHeaderUId: 0,
          approvedQuantity: 0,
        })),
      },
    };

    try {
      // Call API to save draftcreatePurchaseOrder
      const responseMsg = await updatePurchaseOrder(id, payload);
      enqueueSnackbar(`${responseMsg.message} | ${responseMsg.result.poNo}`, {
        variant: "success",
      });
      handleReset();
      router.push(PATH_DASHBOARD.purchaseOrder.creation.view);
    } catch (error) {
      console.error(error);
    }finally{
    setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    setRows([]);
  };

  const handleDelete = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleCompanyChange = () => {
    const currentValues = getValues();
    setIsCompanySelected(false);
    reset({
      ...currentValues,
      distributorUId: null,
      priceListUId: null,
      productUId: null,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "productID",
      headerName: "Product ID",
      width: 100,
      sortable: false,
      flex: 1,
    },
    { field: "productName", headerName: "Product Name", width: 250, flex: 1 },
    {
      field: "mrp",
      headerName: "MRP",
      width: 90,
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
      field: "availableStock",
      headerName: "Stock Available",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "rate",
      headerName: "Rate",
      width: 90,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (params: any) => {
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
      headerName: "Requested Qty",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "volume",
      headerName: "Volume",
      width: 150,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        const formattedVolume = formatVolume3Decimals(params.value);
        return (
          <Tooltip arrow title={formattedVolume} slotProps={tooltipSlotProps}>
            <span>{formattedVolume}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "baseUnitName",
      headerName: "UoM",
      width: 120,
      sortable: false,
      headerAlign: "right",
      align: "right",
      maxWidth: 60,
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

  return (
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
            Purchase Order Information
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
                  // onChange={handleCompanyChange}
                  inputProps={{
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  disabled={isCompanySelected}
                />
              </Grid>
              <Grid item xs={3}>
                {/* <RHFTextField name="poDate" label="PO Date" disabled /> */}
                <RHFDatePicker
                  name="poDate"
                  label="PO Date*"
                  disableFuture={false}
                  onChange={(date: any) => {
                    setValue("deliveryDate", date);
                  }}
                  format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
                  value={null}
                  renderInput={(params) => (
                    <TextField {...params} disabled={isCompanySelected} />
                  )}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFDatePicker
                  name="deliveryDate"
                  label="Delivery Date*"
                  disableFuture={false}
                  onChange={(date: any) => {
                    setValue("deliveryDate", date);
                  }}
                  format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
                  value={null}
                  renderInput={(params) => (
                    <TextField {...params} disabled={isCompanySelected} />
                  )}
                  disabled={isCompanySelected}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFAutocompleteField
                  name="priceListUId"
                  placeholder="Price List"
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
                    !getValues("companyUId") || !getValues("priceListUId")
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
              sx={{
                ...dataGridStockViewStyleMappers,
                height: !expand1 ? "42vh" : "22vh",
              }}
              rows={rows}
              columns={getColumnsWithTooltip(columns)}
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
              <Typography variant="body1" color="textSecondary">
                Total Requested Qty:{" "}
                <Chip
                  label={totalStockUpdate}
                  sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Total Volume:{" "}
                <Chip
                  label={formatVolume3Decimals(formattedVolume)}
                  sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Total Value:{" "}
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
            >
              <Grid item xs={5} sx={{ mr: 2 }}>
                <RHFTextArea
                  name="remark"
                  label="PO Creation Remark"
                  control={control}
                  numberOfRows={2}
                />
              </Grid>
              <Grid item>
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  loading={isSubmitting}
                  onClick={handleUpdateDraft}
                  sx={{ mr: 2, height: 40 }}
                  disabled={rows.length === 0 || isButtonsDisabled}
                >
                  Update draft
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
  );
}
