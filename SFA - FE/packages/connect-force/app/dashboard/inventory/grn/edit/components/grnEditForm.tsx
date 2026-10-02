import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import RHFTextArea from "@/components/hook-form/RHFTextArea";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getWarehousesByDistributorUId } from "@/service/inventory/company-stock-adjustment.service";
import { updateGRN } from "@/service/inventory/grn.service";
import {
  getAllActiveCompanies_PO,
  getDeliveryMethods_PO,
  getDistributorDetails_PO,
  getPaymentTerms_PO,
  getPriceLists_PO,
} from "@/service/inventory/purchaseOrder.service";
import { dataGridStockViewStyleMappers } from "@/styles/tableStyles/tableStyle";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { GRNValidationSchema } from "@/utils/schemas/grnValidationSchema";
import { mapListToOptions } from "@/utils/sortUtils";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import "../components/purchaseOrderApproveStyles.css";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

interface GRNHeader {
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

interface GRNDetail {
  productUId: number;
  mrp: number;
  productID: string;
  productName: string;
  stockAvailable: number;
  rate: number;
  requestQuantity: number;
  volume: number;
  value: number;
  poHeaderUId: number;
  approvedQuantity: number | null;
  acceptedQuantity: number | null;
  baseUnitName: string | null;
}

interface CurrentGRN {
  grnFullHeader: GRNHeader;
  grnFullDetails: GRNDetail[];
  id: number;
}

type Props = {
  id: number;
  currentGRN?: CurrentGRN;
};

export default function GrnEditForm({ id, currentGRN }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const [expand1, setExpand1] = useState(true);
  const [serverDownError, setServerDownError] = useState(false);
  const [rows, setRows] = useState([] as any[]);
  const [isCompanySelected, setIsCompanySelected] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const po_Companies = useSelector(
    (state) => state.purchaseOrderSlice.PO_Companies
  );

  const po_Distributors = useSelector(
    (state) => state.purchaseOrderSlice.PO_Distributors
  );

  const po_PaymentTerms = useSelector(
    (state) => state.purchaseOrderSlice.PO_PaymentTerms
  );

  const po_DeliveryMethods = useSelector(
    (state) => state.purchaseOrderSlice.PO_DeliveryMethods
  );

  const cs_Warehouses = useSelector(
    (state) => state.companyStockAdjustmentSlice.CS_Warehouses
  );

  const defaultValues = useMemo(
    () => ({
      companyUId: currentGRN?.grnFullHeader?.companyUId || 0,
      distributorUId: currentGRN?.grnFullHeader?.distributorUId || 0,
      poDate: currentGRN?.grnFullHeader?.poDate || "",
      deliveryDate: currentGRN?.grnFullHeader?.deliveryDate || "",
      priceListUId: currentGRN?.grnFullHeader?.priceListTypeUId || 0,
      paymentTermUId: currentGRN?.grnFullHeader?.paymentTermUId || 0,
      deliveryMethodUId: currentGRN?.grnFullHeader?.deliveryMethodUId || 0,
      warehouseId: currentGRN?.grnFullHeader?.warehouseUId || 0,
      remark: currentGRN?.grnFullHeader?.remark || null,
      approveRemark: currentGRN?.grnFullHeader?.approveRemark || null,
      productUId: null,
      quantity: "",
    }),
    [currentGRN]
  );

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(GRNValidationSchema),
    defaultValues,
  });

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useWatch({
    control,
    name: [
      "companyUId",
      "distributorUId",
      "warehouseId",
      "priceListUId",
      "productUId",
      "quantity",
    ],
  });

  const grnFullHeader = currentGRN?.grnFullHeader;

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
  const fetchGetPriceList = async (distributorID: number) => {
    try {
      await getPriceLists_PO(distributorID);
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

  // GET getWarehousesByDistributorUId
  const fetchGetWarehousesByDistributorUId = async (distributorId: number) => {
    try {
      await getWarehousesByDistributorUId(distributorId, 1);
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
      fetchGetWarehousesByDistributorUId(distributorId);
    }
    if (distributorId) {
      fetchGetPriceList(distributorId);
    }
  }, [companyId, distributorId]);

  useEffect(() => {
    if (currentGRN) {
      reset(defaultValues);
    }

    if (Array.isArray(currentGRN?.grnFullDetails)) {
      const mappedProducts = currentGRN.grnFullDetails.map((detail, index) => ({
        id: index + 1,
        uId: detail.productUId,
        productID: detail.productID,
        productName: detail.productName,
        availableStock: detail.stockAvailable,
        mrp: detail.mrp,
        rate: detail.rate,
        requestedQty: detail.requestQuantity,
        approvedQty: detail.approvedQuantity,
        acceptedQty: detail.acceptedQuantity,
        approvedQuantity: detail.approvedQuantity,
        volume: detail.volume,
        baseUnitName: detail.baseUnitName,
        value: detail.value,
      }));

      setRows(mappedProducts);
    }
  }, [currentGRN, reset, defaultValues]);

  const companyOptions = useMemo(
    () => mapListToOptions(po_Companies, "companyName", "uId"),
    [po_Companies, mapListToOptions]
  );
  const distributorOptions = useMemo(
    () =>
      mapListToOptions(po_Distributors, "distributorName", "distributorUId"),
    [po_Distributors, mapListToOptions]
  );
  const paymentTermOptions = useMemo(
    () => mapListToOptions(po_PaymentTerms, "name", "uId"),
    [po_PaymentTerms, mapListToOptions]
  );
  const deliveryMethodOptions = useMemo(
    () => mapListToOptions(po_DeliveryMethods, "deliveryMethodName", "uId"),
    [po_DeliveryMethods, mapListToOptions]
  );

  const warehouseOptions = useMemo(
    () => mapListToOptions(cs_Warehouses, "name", "uId"),
    [cs_Warehouses, mapListToOptions]
  );

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

  const handleReject = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const hasInvalidApprovedQuantity = rows.some(
      (row) => row.acceptedQty === null || isNaN(row.acceptedQty)
    );
    if (hasInvalidApprovedQuantity) {
      enqueueSnackbar("Approved quantity cannot be empty", {
        variant: "error",
      });
      return;
    }
    const payload = {
      grn: {
        grnHeader: {
          warehouseId: formData.warehouseId,
          distributorUId: formData.distributorUId,
          companyUId: formData.companyUId,
          grnRemark: formData.grnRemark,
          statusId: 9,
          approvedBy: 0,
          approvedDate: new Date().toISOString(),
          rejectedBy: 0,
          rejectedDate: new Date().toISOString(),
        },
        grnDetails: rows.map((row) => ({
          productUId: row.uId,
          mrp: row.mrp,
          rate: row.rate,
          acceptedQuantity: row.acceptedQty,
          approvedQuantity: row.approvedQuantity,
        })),
      },
    };

    try {
      // Call API to update updatePurchaseOrder
      const responseMsg = await updateGRN(id, payload);
      enqueueSnackbar(`${responseMsg.message}`, { variant: "success" });
      router.push(PATH_DASHBOARD.purchaseOrder.grn.view);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    const formData = getValues();
    const hasInvalidApprovedQuantity = rows.some(
      (row) => row.acceptedQty === null || isNaN(row.acceptedQty)
    );
    if (hasInvalidApprovedQuantity) {
      enqueueSnackbar("Approved quantity cannot be empty", {
        variant: "error",
      });
      return;
    }
    const payload = {
      grn: {
        grnHeader: {
          warehouseId: formData.warehouseId,
          distributorUId: formData.distributorUId,
          companyUId: formData.companyUId,
          grnRemark: formData.grnRemark,
          statusId: 8,
          approvedBy: 0,
          approvedDate: new Date().toISOString(),
          rejectedBy: 0,
          rejectedDate: new Date().toISOString(),
        },
        grnDetails: rows.map((row) => ({
          productUId: row.uId,
          mrp: row.mrp,
          rate: row.rate,
          acceptedQuantity: row.acceptedQty,
          approvedQuantity: row.approvedQuantity,
        })),
      },
    };

    try {
      // Call API to save draftcreatePurchaseOrder
      const responseMsg = await updateGRN(id, payload);
      enqueueSnackbar(`${responseMsg.message}`, { variant: "success" });
      handleReset();
      router.push(PATH_DASHBOARD.purchaseOrder.grn.view);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowUpdate = (newRow: GridRowModel) => {
    const acceptedQty = parseInt(newRow.acceptedQty, 10);
    const safeAcceptedQty = isNaN(acceptedQty) ? 0 : acceptedQty;
    const volume = parseFloat(newRow.uomQty ?? 1) * safeAcceptedQty;
    const value = parseFloat(newRow.mrp ?? 1) * safeAcceptedQty;

    const updatedRow = {
      ...newRow,
      acceptedQty: safeAcceptedQty,
      volume: isNaN(volume) ? 0 : volume,
      value: isNaN(value) ? 0 : value,
    };

    setRows((prevRows) =>
      // @ts-ignore
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );

    return updatedRow;
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
    { field: "productName", headerName: "Product Name", width: 200, flex: 1 },
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
      field: "approvedQty",
      headerName: "Approved Qty",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "acceptedQty",
      headerName: "Accepted Qty",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
      editable: true,
      type: "number",
      cellClassName: "editable-cell", // Add a custom class name
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0;
        return { ...params.props, error: hasError };
      },
      renderEditCell: (params) => {
        return (
          <input
            type="number"
            value={params.value ?? ""}
            onChange={(e) => {
              const newValue =
                e.target.value.trim() === "" ? 0 : Number(e.target.value);
              if (!isNaN(newValue) && newValue >= 0) {
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: newValue,
                });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "-" || e.key === "+") {
                e.preventDefault();
              }
            }}
            style={{
              textAlign: "right",
              width: "100%",
              border: "none",
              outline: "none",
            }}
          />
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
        const formattedValue = formatVolume3Decimals(params.value); // Format value to 2 decimal places
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
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
      width: 90,
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
            Purchase Order Approval Information
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
                  name="poNo"
                  label="PO No"
                  disabled
                  defaultValue={grnFullHeader?.poNo}
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
                <RHFAutocompleteField
                  name="warehouseId"
                  placeholder="Warehouse*"
                  options={warehouseOptions}
                  control={control}
                  inputProps={{
                    form: {
                      autocomplete: "off",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={3}>
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
                />
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Card sx={{ backgroundColor: "#fff" }}>
        <CardContent>
          <Box sx={{ width: "100%" }}>
            <DataGrid
              sx={{
                ...dataGridStockViewStyleMappers,
                height: !expand1 ? "43vh" : "22vh",
              }}
              rows={rows}
              columns={getColumnsWithTooltip(columns)}
              processRowUpdate={handleRowUpdate}
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
            <Grid item xs={5} sx={{ mr: 2 }}>
              <RHFTextArea
                name="remark"
                label="PO Creation Remark"
                control={control}
                numberOfRows={1}
                disabled
              />
            </Grid>
            <Grid item xs={5} sx={{ mr: 2, mt: 2 }}>
              <RHFTextArea
                name="approveRemark"
                label="PO Approval Remark"
                control={control}
                numberOfRows={1}
                disabled
              />
            </Grid>
            <Grid
              container
              alignContent={"center"}
              justifyContent={"space-between"}
              mt={2}
            >
              <Grid item xs={5} sx={{ mr: 2 }}>
                <RHFTextArea
                  name="grnRemark"
                  label="GRN Remark"
                  control={control}
                  numberOfRows={1}
                />
              </Grid>
              <Grid item>
                <LoadingButton
                  variant="contained"
                  color="error"
                  loading={isSubmitting}
                  onClick={handleSubmit(handleReject)}
                  sx={{
                    backgroundColor: "#ee3737",
                    mr: 2,
                    "&:hover": {
                      backgroundColor: "#cc2e2e",
                    },
                  }}
                  disabled={rows.length === 0 || !getValues("warehouseId")}
                >
                  Reject
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit(handleApprove)}
                  sx={{
                    backgroundColor: "#198754",
                    "&:hover": {
                      backgroundColor: "#166f47",
                    },
                  }}
                  disabled={rows.length === 0 || !getValues("warehouseId")}
                >
                  Approve
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
