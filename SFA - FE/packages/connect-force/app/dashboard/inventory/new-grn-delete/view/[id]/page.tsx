"use client";

import FormProvider, {
  RHFTextField,
} from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import RHFTextArea from "@/components/hook-form/RHFTextArea";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container, cursorTextDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { focusDataGridStyle } from "@/styles/tableStyles/tableStyle";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { extractProductName } from "@/utils/wordFilters";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  DeleteOutline as DeleteOutlineIcon,
  PostAdd as PostAddIcon,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { DataGrid, GridColDef, GridColumnGroupingModel } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import { NewGRNValidationSchema } from "@/utils/schemas/NewGrnSchema";
import { formatToOnlyDate } from "@/utils/dateUtils";
import "../../../../../../styles/tableStyles/editableTableStyles.css";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { getDistrubutorGRNById } from "@/service/inventory/new-distributor-grn.service";
import { format, isValid } from "date-fns";

const NewDistributorGRNView = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [rows, setRows] = useState([] as any[]);
  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const distributorGRNData = useSelector((state) => state.newDistributorGrnSlice.newDistributorGRN);
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

  const defaultValues = useMemo(
    () => ({
      grnTypeName: distributorGRNData?.grnDirectHeader?.grnTypeName || "",
      paymentTermName: distributorGRNData?.grnDirectHeader?.paymentTermName || "",
      deliveryMethodName: distributorGRNData?.grnDirectHeader?.deliveryMethodName || "",
      poDate: distributorGRNData?.grnDirectHeader?.poDate || "",
      deliveryDate: distributorGRNData?.grnDirectHeader?.deliveryDate || "",
      warehouseName: distributorGRNData?.grnDirectHeader?.warehouseName || "",
      priceListName: distributorGRNData?.grnDirectHeader?.priceListName || "",
      chequeDate: distributorGRNData?.grnDirectHeader?.chequeDate || "",
      chequeNumber: distributorGRNData?.grnDirectHeader?.chequeNumber || "",
      poNo: distributorGRNData?.grnDirectHeader?.poNo || "",
      createdBy: distributorGRNData?.grnDirectHeader?.createdBy || "ADMIN",
      creationDate: distributorGRNData?.grnDirectHeader?.creationDate || "",
      modifiedBy: distributorGRNData?.grnDirectHeader?.modifiedBy || "ADMIN",
      modifiedDate: distributorGRNData?.grnDirectHeader?.modifiedDate || "",
    }),
    [distributorGRNData]
  );

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(NewGRNValidationSchema),
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
      "priceListName",
      "productUID",
      "quantity",
      "deliveryDate",
      "warehouseName",
    ],
  });

  const fetchData = async () => {
    try {
      await getDistrubutorGRNById(params.id);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (distributorGRNData) {
      const grnHeader = distributorGRNData.grnDirectHeader;
      const grnDetails = distributorGRNData.grnDirectDetails;

      reset({
        grnNo: grnHeader?.grnNo,
        invoiceNo: grnHeader?.invoiceNo,
        companyUId: grnHeader?.companyName,
        grnTypeName: grnHeader?.grnTypeName,
        distributorUId: grnHeader?.distributorName,
        date: dayjs(grnHeader?.date).format("YYYY-MM-DD"),
        deliveryDate: grnHeader?.deliveryDate ? dayjs(grnHeader?.deliveryDate).format("YYYY-MM-DD") : null,
        priceListName: grnHeader?.priceListName,
        paymentTermName: grnHeader?.paymentTermName,
        deliveryMethodName: grnHeader?.deliveryMethodName,
        poNo: grnHeader?.poNo || "",
        poDate: grnHeader?.poDate ? dayjs(grnHeader?.poDate).format("YYYY-MM-DD") : null,
        warehouseName: grnHeader?.warehouseName,
        chequeDate: grnHeader?.chequeDate ? dayjs(grnHeader?.chequeDate).format("YYYY-MM-DD") : null,
        chequeNumber: grnHeader?.chequeNumber || "",
        remark: grnHeader?.remark || "",
      });

      const formattedRows = grnDetails
      ?.filter((item: any) => !(item.foc === 0 && item.quantity === 0))
      .map((item: any) => ({
        id: `${item.productUID}-${item.mrp}-${Date.now()}`,
        uId: item.productUID,
        productID: item.productID,
        productName: extractProductName(item.productName),
        mrp: item.mrp,
        rate: item.rate,
        requestedQty: item.quantity,
        volume: item.volume,
        baseUnitName: item.baseUnitName || null,
        value: item.value || 0.00,
        uomQty: item.uomQty || "0",
        amount: item.discountAmount || 0.00,
        batchNo: item.batchNo || "",
        expDate: formatToOnlyDate(item.expiryDate),
        foc: item.foc || 0.00,
        isVat: item.isVat || false,
        vat: item.vatAmount || 0.00,
      }));

      setRows(formattedRows);
    }
  }, [distributorGRNData]);

  useEffect(() => {
    if (!getValues("productUID")) {
      setValue("quantity", "");
      clearErrors("quantity");
    }
  }, [watch("productUID")]);

  // Calculate totals
  const totalStockUpdate = distributorGRNData.grnDirectHeader?.totalValue;
  const totalVolume = distributorGRNData.grnDirectHeader?.totalVolume;
  const totalValue = distributorGRNData.grnDirectHeader?.totalValue;
  const totalFoc = distributorGRNData.grnDirectHeader?.totalFOC;
  const totalAmount = distributorGRNData.grnDirectHeader?.totalDiscountAmount;
  const totalVat = rows?.reduce((acc, row) => acc + row.vat, 0);

  const handleDelete = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
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
      preProcessEditCellProps: (params) => {
        const requestedQty = params.props.value;
        if (
          requestedQty === null ||
          requestedQty === undefined ||
          requestedQty === ""
        ) {
          enqueueSnackbar("Quantity cannot be empty", { variant: "error" });
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
      field: "foc",
      headerName: "FOC",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "disocuntRate",
      headerName: "Rate(%)",
      width: 110,
      sortable: false,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 110,
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
      }
    },
    {
      field: "isVat",
      headerName: "is VAT",
      width: 80,
      sortable: false,
      headerAlign: "right",
      align: "right",
      type: 'boolean',
      renderCell: (params: any) => {
        const isVat = params.value;
        return (
          isVat ? <DoneRoundedIcon /> : <ClearRoundedIcon />
        )
      }
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
    }
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "discount",
      headerName: "Discount",
      headerAlign: "center",
      children: [{ field: "foc" }, { field: "disocuntRate" }, { field: "amount" },],
    },
  ];

  const handleBack = () => {
    router.push(PATH_DASHBOARD.newDistributorGrn.list);
  };

  console.log('distributorGRNData', distributorGRNData);
  console.log('defaultValues', defaultValues);


  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor GRN View"
        pageNavigation={[
          {
            pageName: "Distributor GRN",
            path: PATH_DASHBOARD.newDistributorGrnDelete.list,
          },
          { pageName: "View" },
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
                    <RHFTextField
                      name="grnNo"
                      label="GRN No"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="invoiceNo"
                      label="Invoice No"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="date"
                      label="Date"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="companyUId"
                      label="Company"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="distributorUId"
                      label="Distributor"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="priceListName"
                      label="Price List Type"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.priceListName ? { shrink: true } : { shrink: false }
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="grnTypeName"
                      label="Grn Type"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.grnTypeName ? { shrink: true } : { shrink: false }
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="paymentTermName"
                      label="Payment Term"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.paymentTermName ? { shrink: true } : { shrink: false }
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="deliveryMethodName"
                      label="Delivery Method"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.deliveryMethodName ? { shrink: true } : { shrink: false }
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="poNo"
                      label="PO No"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.poNo ? { shrink: true } : { shrink: false }
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="poDate"
                      label="PO Date"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.poDate ? { shrink: true } : { shrink: false }
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="deliveryDate"
                      label="Delivery Date"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.deliveryDate ? { shrink: true } : { shrink: false }
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="warehouseName"
                      label="Warehouse"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.warehouseName ? { shrink: true } : { shrink: false }
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="chequeDate"
                      label="Cheque Date"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.chequeDate ? { shrink: true } : { shrink: false }
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <RHFTextField
                      name="chequeNumber"
                      label="Cheque No"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                      InputLabelProps={
                        defaultValues.chequeNumber ? { shrink: true } : { shrink: false }
                      }
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
                  getRowId={(row) => row.id}
                  sx={{
                    ...focusDataGridStyle,
                  }}
                  rows={Array.isArray(rows) ? rows : []}
                  columns={Array.isArray(columns) ? getColumnsWithTooltip(columns) : []}
                  experimentalFeatures={{ columnGrouping: true }}
                  columnGroupingModel={columnGroupingModel}
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
                  <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 600 }}>
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
                      disabled
                    />
                  </Grid>
                  {/* total details  card*/}
                  <Grid item xs={3} sx={{ mt: 2 }}>
                    <Card sx={{ backgroundColor: "#ffffff", padding: 2 }}>
                      <Grid container direction="column" spacing={1}>
                        <Grid item xs={12}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="textSecondary" fontWeight={600}>
                              Gross Invoice Value:
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(totalValue)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="textSecondary" fontWeight={600}>
                              Discount Value:
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(totalAmount)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="textSecondary" fontWeight={600}>
                              VAT 18%:
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(totalVat)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="textSecondary" fontWeight={600}>
                              Net Invoice Value:
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(totalValue - totalAmount + totalVat)}
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
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleBack}
                        sx={{ mr: 2, height: 40 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
          <Grid item xs={12} sx={{ mb: 3, mt: 3 }}>
            <Box
              sx={{ mx: 12, mb: 3 }}
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(4, 1fr)",
              }}
            >
              <RHFTextField
                name="createdBy"
                label="Created By"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
              />
              <RHFTextField
                name="creationDate"
                label="Created Date"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                value={
                  defaultValues.creationDate &&
                    isValid(new Date(defaultValues.creationDate))
                    ? format(new Date(defaultValues.creationDate), dateFormat)
                    : ""
                }
              />
              <RHFTextField
                name="modifiedBy"
                label="Modified By"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
              />
              <RHFTextField
                name="modifiedDate"
                label="Modified Date"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                value={
                  defaultValues.modifiedDate &&
                    isValid(new Date(defaultValues.modifiedDate))
                    ? format(new Date(defaultValues.modifiedDate), dateFormat)
                    : ""
                }
                InputLabelProps={
                  defaultValues.modifiedDate ? { shrink: true } : { shrink: false }
                }
              />
            </Box>
          </Grid>
        </FormProvider>
      </Container>
      {
        popupResponse && serverDownError && (
          <PopupResponse
            type={"error"}
            message={"Internal server error"}
            redirectBack={redirectBack}
          />
        )
      }
    </FsBox >
  );
};

export default NewDistributorGRNView;
