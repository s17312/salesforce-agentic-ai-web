"use client";

import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyle,
  tableIconColors,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useRouter } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useSelector } from "@/redux/store";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import PaidIcon from "@mui/icons-material/Paid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardContent,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  deleteTempPayment,
  getAllInvoicePayments,
  getTempOutletPaymentsAll,
} from "@/service/value-sale/valueInvoicePayment.service";
import { enqueueSnackbar } from "notistack";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  StyledTableCell,
  StyledTableHeaderRow,
  StyledTableRow,
} from "@/styles/tableStyles/paymentTableStyles";
import { formatCurrency } from "@/utils/formatCurrency";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import { InvoicePayment_StatusChip } from "@/app/dashboard/rep-tour/sale/components/invoicePaymentStatusChip";
import FormProvider, { RHFAutocompleteField } from "@/components/hook-form";
import { useForm, useWatch } from "react-hook-form";
import { mapListToOptions } from "@/utils/sortUtils";
import {
  getRouteOutlets,
  getTourDistributors,
  getTourRoutes,
  getTourSalesRep,
} from "@/service/tour-service/tourSchedule.service";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchIcon from "@mui/icons-material/Search";
import { tourValueSalesSlice } from "@/redux/slices/tour/tour-value-sales-slice";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import PaymentDetailsTable from "./payment/components/tempSubTable";

const AllPaymentInvoicesView = () => {
  const router = useRouter();
  const theme = useTheme();
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [saleInvoiceTypeUIds, setSaleInvoiceTypeUIds] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [tabValue, setTabValue] = useState("1");
  const [pageTitle, setPageTitle] = useState("Invoice List");
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(true);
  const today = new Date();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const outletInvoicesList = useSelector(
    (state) => state.tourSalesPaymentSlice.outletInvoicesDirectPayment
  );
  const distributors_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedule_Distributors
  );
  const rep_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedule_Rep
  );
  const route_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedule_Routes
  );
  const outlet_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedule_Outlets
  );
  const tempPayments = useSelector(
    (state) => state.tourValueSalesSlice.TempPayments
  );

  const titles = {
    "1": "Invoice List",
    "2": "Approved Payments",
  };

  const methods = useForm<any>({
    // @ts-ignore
    resolver: yupResolver(tourValueSalesSlice),
    mode: "all",
  });

  const { control, setValue, getValues, watch } = methods;

  useWatch({
    control,
    name: ["distributorUId"],
  });

  const distributorUId = watch("distributorUId");
  const representativeUId = watch("representativeUId");
  const routeUId = watch("routeUId");
  const outletUId = watch("outletUId");
  const watchedFromDate = useWatch({ control, name: "fromDate" });
  const watchedToDate = useWatch({ control, name: "toDate" });

  useEffect(() => {
    const saleInvoiceTypeUIds = selectionModel
      .map((id) => {
        const invoice = outletInvoicesList.find(
          (invoice: any) => invoice.invoiceHeaderId === id
        );
        return invoice ? invoice.saleInvoiceTypeUId : null;
      })
      .filter((id) => id !== null);
    setSaleInvoiceTypeUIds(saleInvoiceTypeUIds);
  }, [selectionModel]);

  const fetchGetOutletInvoicesList = async () => {
    try {
      await getAllInvoicePayments({
        distributorUId: distributorUId,
        representativeUId: representativeUId,
        routeUId: routeUId,
        outletUId: outletUId,
        fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
        toDate: toDate ? toDate.toISOString().split("T")[0] : "",
        page: null,
        pageSize: null,
        sortColumn: null,
        sortOrder: null,
        searchKeyword: null,
      });
    } catch (error) {
      enqueueSnackbar("Error while fetching temp payments", {
        variant: "error",
      });
    }
  };

  const fetchTempOutletPaymentsAll = async () => {
    try {
      await getTempOutletPaymentsAll({
        distributorUId: distributorUId,
        representativeUId: representativeUId,
        routeUId: routeUId,
        outletUId: outletUId,
        fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
        toDate: toDate ? toDate.toISOString().split("T")[0] : "",
        page: null,
        pageSize: null,
        sortColumn: null,
        sortOrder: null,
        searchKeyword: null,
      });
    } catch (error) {
      enqueueSnackbar("Error while fetching temp payments", {
        variant: "error",
      });
    }
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);

    if (newValue === "2") {
      // fetch Approved Payments
      try {
        fetchTempOutletPaymentsAll();
      } catch (error) {
        enqueueSnackbar("Error while fetching approved payments", {
          variant: "error",
        });
      }
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state for the specific row ID
    }));
  };

  const handleTableBtnClick = () => {
    const selectedInvoices = outletInvoicesList.filter((invoice: any) =>
      selectionModel.includes(invoice.invoiceHeaderId)
    );

    const uniqueOutlets = new Set(
      selectedInvoices.map((inv: any) => inv.outletUId)
    );

    if (uniqueOutlets.size > 1) {
      enqueueSnackbar("Please select invoices from the same outlet", {
        variant: "warning",
      });
      return;
    }

    const selectedScheduleId = selectedInvoices[0]?.tourScheduleUId;
    const selectedOutletUId = Array.from(uniqueOutlets)[0];

    const queryParams = new URLSearchParams();
    queryParams.append("outletID", selectedOutletUId.toString());
    queryParams.append("scheduleId", selectedScheduleId?.toString() || "");
    queryParams.append("selectedRows", JSON.stringify(selectionModel));
    queryParams.append(
      "saleInvoiceTypeUIds",
      JSON.stringify(saleInvoiceTypeUIds)
    );
    queryParams.append("returnUrl", window.location.href);
    router.push(
      `${
        PATH_DASHBOARD.directPayment.invoice.payment
      }?${queryParams.toString()}`
    );
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        const resMsg = await deleteTempPayment(deleteId);
        enqueueSnackbar(resMsg.message, {
          variant: "success",
        });
        fetchGetOutletInvoicesList(); // Recall fetch function after successful deletion
      } catch (error) {
        console.error("Error while deleting company stock adjustment", error);
      } finally {
        setOpen(false);
        setDeleteId(null);
      }
    }
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  useEffect(() => {
    if (outletInvoicesList.length > 0) {
      setExpanded(false);
    }
  }, [outletInvoicesList]);

  useEffect(() => {
    fetchGetDistributors();
  }, []);

  useEffect(() => {
    if (distributorUId) {
      setValue("representativeUId", null);
      setValue("routeUId", null);
      setValue("outletUId", null);
      fetchGetSalesRep(distributorUId);
    } else {
      setValue("representativeUId", null);
      setValue("routeUId", null);
      setValue("outletUId", null);
    }
  }, [distributorUId]);

  useEffect(() => {
    if (representativeUId) {
      setValue("routeUId", null);
      setValue("outletUId", null);
      fetchGetRoutes(representativeUId);
    } else {
      setValue("routeUId", null);
      setValue("outletUId", null);
    }
  }, [representativeUId]);

  useEffect(() => {
    if (routeUId) {
      setValue("outletUId", null);
      fetchGetOutlets(routeUId);
    } else {
      setValue("outletUId", null);
    }
  }, [routeUId]);

  useEffect(() => {
    // Avoid infinite loop by checking if the value is different
    if (watchedFromDate && watchedFromDate !== fromDate) {
      setFromDate(watchedFromDate);
    }
    if (watchedToDate && watchedToDate !== toDate) {
      setToDate(watchedToDate);
    }
  }, [watchedFromDate, watchedToDate]);

  useEffect(() => {
    if (tabValue === "2") {
      fetchTempOutletPaymentsAll();
    }
  }, [tabValue]);

  const fetchGetDistributors = async () => {
    try {
      await getTourDistributors();
    } catch (error) {
      enqueueSnackbar("Error fetching distributors", { variant: "error" });
    }
  };

  const fetchGetSalesRep = async (distributorID: any) => {
    try {
      await getTourSalesRep(distributorID);
    } catch (error) {
      enqueueSnackbar("Error fetching sales rep", { variant: "error" });
    }
  };

  const fetchGetRoutes = async (repID: any) => {
    try {
      await getTourRoutes(repID);
    } catch (error) {
      enqueueSnackbar("Error fetching routes", { variant: "error" });
    }
  };

  const fetchGetOutlets = async (routeUId: any) => {
    try {
      await getRouteOutlets(routeUId);
    } catch (error) {
      enqueueSnackbar("Error fetching Outlets", { variant: "error" });
    }
  };

  const handleSearch = async () => {
    if (!distributorUId) {
      enqueueSnackbar("Please select a Distributor", { variant: "warning" });
      return;
    }

    try {
      await fetchGetOutletInvoicesList();
      setTabValue("1");
      setPageTitle(titles["1"]);
    } catch (error) {
      enqueueSnackbar("Error while searching payments", { variant: "error" });
    }
  };

  const distributorOptions = useMemo(
    () => mapListToOptions(distributors_list, "distributorName", "uId"),
    [distributors_list, mapListToOptions]
  );
  const repOptions = useMemo(
    () => mapListToOptions(rep_list, "name", "uId"),
    [rep_list, mapListToOptions]
  );
  const routeOptions = useMemo(
    () => mapListToOptions(route_list, "routeName", "routeUId"),
    [route_list, mapListToOptions]
  );
  const outletOptions = useMemo(
    () => mapListToOptions(outlet_list, "name", "outletUId"),
    [outlet_list, mapListToOptions]
  );

  const columns: any[] = [
    {
      field: "invoiceDate",
      headerName: "Date",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => {
        const date = params.value;
        return date ? dayjs(date).format("MM/DD/YYYY") : "-";
      },
    },
    {
      field: "outletId",
      headerName: "Outlet Id",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "outletName",
      headerName: "Outlet Name",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "invoiceId",
      headerName: "Invoice ID",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "saleAmount",
      headerName: "Sales Amount",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      valueGetter: (params: any) => {
        const saleAmount = params.value;
        return saleAmount ? formatCurrency(saleAmount) : 0;
      },
    },
    {
      field: "discountAmount",
      headerName: "Discount Amount",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      valueGetter: (params: any) => {
        const discountAmount = params.value;
        return discountAmount ? formatCurrency(discountAmount) : 0;
      },
    },
    {
      field: "returnAmount",
      headerName: "Return Amount",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      valueGetter: (params: any) => {
        const returnAmount = params.value;
        return returnAmount ? formatCurrency(returnAmount) : 0;
      },
    },
    {
      field: "invAmount",
      headerName: "Invoice Amount",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      valueGetter: (params: any) => {
        const invAmount = params.value;
        return invAmount ? formatCurrency(invAmount) : 0;
      },
    },
    {
      field: "paidAmount",
      headerName: "Paid Amount",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      valueGetter: (params: any) => {
        const paidAmount = params.value;
        return paidAmount ? formatCurrency(paidAmount) : 0;
      },
    },
    {
      field: "balanceAmount",
      headerName: "Balance Amount",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      valueGetter: (params: any) => {
        const saleAmount = params.value;
        return saleAmount ? formatCurrency(saleAmount) : 0;
      },
    },
    {
      field: "isPaidCompleted",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const status = params.value === true ? 1 : 2;
        return <InvoicePayment_StatusChip status={status} />;
      },
    },
    { ...GRID_CHECKBOX_SELECTION_COL_DEF, width: 100 },
  ];

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(outletInvoicesList, columns);

  const tempPaymentColumns = [
    {
      field: "expand",
      headerName: "",
      width: 100,
      renderCell: ({ row, toggleExpand }: any) => (
        <IconButton
          onClick={() =>
            row?.paymentHeader &&
            toggleExpand(row.paymentHeader.paymentHeaderId)
          }
        >
          {row?.paymentHeader &&
          expandedRows[row.paymentHeader.paymentHeaderId] ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </IconButton>
      ),
    },
    {
      field: "paymentId",
      headerName: "Payment ID",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row?.paymentHeader.paymentId,
    },
    {
      field: "paymentDate",
      headerName: "Payment Date",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) =>
        dayjs(params.row?.paymentHeader.paymentDate).format("MM/DD/YYYY"),
    },
    {
      field: "invoicePayment",
      headerName: "Invoice Payment",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (params: any) => params.row?.paymentHeader.invoicePayment,
    },
    {
      field: "cashPayment",
      headerName: "Cash Payment",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (params: any) => params.row?.paymentHeader.cashPayment,
    },
    {
      field: "chequePayment",
      headerName: "Cheque Payment",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (params: any) => params.row?.paymentHeader.chequePayment,
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: any) => (
        <IconButton
          size="small"
          onClick={() =>
            handleDelete(params.row?.paymentHeader.paymentHeaderId)
          }
        >
          <DeleteIcon
            fontSize="small"
            sx={{ color: tableIconColors.deleteIcon }}
          />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <BreadcrumbNavigation
        pageTitle="Invoice Payment"
        pageNavigation={[
          {
            pageName: "Sales Payments",
          },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        icon={<PaidIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
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
              borderBottomLeftRadius: expanded ? "0px" : "9px",
              borderBottomRightRadius: expanded ? "0px" : "9px",
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
              Sales Payment Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: "white",
              borderTopLeftRadius: expanded ? "0px" : "9px",
              borderTopRightRadius: expanded ? "0px" : "9px",
              borderBottomLeftRadius: "9px",
              borderBottomRightRadius: "9px",
            }}
          >
            <FormProvider methods={methods}>
              <CardContent
                sx={{ pt: "0px", pb: "12px", pl: "24px", pr: "24px" }}
              >
                <Box sx={{ width: "100%" }}>
                  <Divider sx={{ borderColor: "#e8eaef", mb: 2 }} />
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={3}>
                      <RHFAutocompleteField
                        name="distributorUId"
                        placeholder="Distributor*"
                        options={distributorOptions}
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
                        name="representativeUId"
                        placeholder="Sales Rep*"
                        options={repOptions}
                        control={control}
                        inputProps={{
                          form: {
                            autocomplete: "off",
                          },
                        }}
                        disabled={!distributorUId}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFAutocompleteField
                        name="routeUId"
                        placeholder="Route*"
                        options={routeOptions}
                        control={control}
                        disabled={!representativeUId || !distributorUId}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFAutocompleteField
                        name="outletUId"
                        placeholder="Outlet*"
                        options={outletOptions}
                        control={control}
                        disabled={
                          !representativeUId || !distributorUId || !routeUId
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFDatePicker
                        name="fromDate"
                        label="From Date*"
                        disableFuture={true}
                        onChange={(date: any) => {
                          setValue("fromDate", date);
                        }}
                        format={
                          process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                        }
                        value={fromDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFDatePicker
                        name="toDate"
                        label="To Date*"
                        disableFuture={true}
                        onChange={(date: any) => {
                          setValue("toDate", date);
                        }}
                        format={
                          process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                        }
                        value={toDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                  </Grid>
                  <Grid>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        mt: 2,
                      }}
                    >
                      <Divider sx={{ borderColor: "#e8eaef", mt: 1, mb: 1 }} />
                      <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{ ml: 1 }}
                        startIcon={<SearchIcon />}
                        disabled={!distributorUId} // disable until Distributor is selected
                      >
                        Search
                      </Button>
                    </Box>
                  </Grid>
                </Box>
              </CardContent>
            </FormProvider>
          </AccordionDetails>
        </Accordion>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="Product Mapper Tabs">
              <Tab label="Invoice List" value="1" />
              <Tab label="Approved Payments" value="2" />
            </TabList>
          </Box>
          <TabPanel
            value="1"
            sx={{
              padding: 2,
              marginTop: 0,
              paddingBottom: 0,
            }}
          >
            <DataGrid
              sx={{ ...dataGridStyle }}
              getRowId={(row) => row.invoiceHeaderId}
              rows={searchedRows}
              columns={getColumnsWithTooltip(columns)}
              checkboxSelection
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              rowSelectionModel={selectionModel}
              isRowSelectable={(params) => params.row.balanceAmount >= 0}
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    handleTableBtnClick={handleTableBtnClick}
                    tableBtnText="Payment"
                    isTableBtnDisabled={selectionModel.length == 0}
                    columns={columns.filter(
                      (col) => col.field !== "isPaidCompleted"
                    )}
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
              density="compact"
              hideFooter
              disableRowSelectionOnClick
              disableColumnMenu
            />
          </TabPanel>
          <TabPanel
            value="2"
            sx={{
              padding: 2,
              marginTop: 0,
              paddingBottom: 0,
            }}
          >
            <TableContainer sx={{ height: "65vh", width: "100%" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <StyledTableHeaderRow>
                    {tempPaymentColumns.map((column) => (
                      <StyledTableCell
                        key={column.field}
                        // @ts-ignore
                        align={column.align || "left"}
                        sx={{
                          minWidth: column.minWidth,
                          width: column.width,
                          flex: column.flex,
                        }}
                      >
                        {column.headerName}
                      </StyledTableCell>
                    ))}
                  </StyledTableHeaderRow>
                </TableHead>
                <TableBody>
                  {(tempPayments || []).map((row: any) => (
                    <React.Fragment key={row.paymentHeader.paymentHeaderId}>
                      <StyledTableRow>
                        {tempPaymentColumns.map((column) => (
                          <StyledTableCell
                            key={column.field}
                            // @ts-ignore
                            align={column.align || "left"}
                          >
                            {column.renderCell
                              ? column.renderCell({ row, toggleExpand })
                              : column.valueGetter
                              ? column.valueGetter({ row })
                              : // @ts-ignore
                                row[column.field]}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                      <TableRow component={Paper}>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={tempPaymentColumns.length}
                        >
                          <Collapse
                            in={
                              expandedRows[row.paymentHeader.paymentHeaderId] ||
                              false
                            }
                          >
                            <Box sx={{ margin: 1 }}>
                              <Typography variant="subtitle1">
                                Payment Details
                              </Typography>
                              <PaymentDetailsTable
                                paymentDetails={row.paymentDetail}
                              />
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabContext>
        <ConfirmDeleteDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={confirmDelete}
        />
      </Container>
    </>
  );
};

export default AllPaymentInvoicesView;
