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
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { InvoicePayment_StatusChip } from "../../components/invoicePaymentStatusChip";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useRouter, useSearchParams } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useSelector } from "@/redux/store";
import { getInvoicesByOutlet } from "@/service/tour-service/invoicePayment.service";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import PaidIcon from "@mui/icons-material/Paid";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  deleteTempPayment,
  getTempPayments,
} from "@/service/value-sale/valueInvoicePayment.service";
import { enqueueSnackbar } from "notistack";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  StyledTableCell,
  StyledTableHeaderRow,
  StyledTableRow,
} from "@/styles/tableStyles/paymentTableStyles";
import PaymentDetailsTable from "@/app/dashboard/sales-tour/sale/sales-invoice/payment/components/tempSubTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const PaymentInvoicesView = ({ params }: { params: { id: number } }) => {
  const outletID = Number(params.id);
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

  const outletInvoicesList = useSelector(
    (state) => state.tourSalesPaymentSlice.outletInvoices
  );
  const tempPayments = useSelector(
    (state) => state.tourValueSalesSlice.TempPayments
  );

  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");

  const titles = {
    "1": "Invoice List",
    "2": "Approved Payments",
  };

  useEffect(() => {
    fetchGetInvoicesByOutlet();
  }, []);

  const fetchGetInvoicesByOutlet = async () => {
    try {
      await getInvoicesByOutlet(outletID);
    } catch (error) {}
  };

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

  useEffect(() => {
    if (tabValue === "1") {
      fetchGetInvoicesByOutlet();
    } else {
      fetchGetTempPayments();
    }
  }, [tabValue]);

  const fetchGetTempPayments = async () => {
    try {
      await getTempPayments(scheduleId, outletID);
    } catch (error) {
      enqueueSnackbar("Error while fetching temp payments", {
        variant: "error",
      });
    }
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
  };

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state for the specific row ID
    }));
  };

  const handleTableBtnClick = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("outletID", outletID.toString());
    queryParams.append("scheduleId", scheduleId?.toString() || "");
    queryParams.append("selectedRows", JSON.stringify(selectionModel));
    queryParams.append(
      "saleInvoiceTypeUIds",
      JSON.stringify(saleInvoiceTypeUIds)
    );
    queryParams.append("returnUrl", window.location.href);
    router.push(
      `${PATH_DASHBOARD.directSaleTour.invoice.payment}?${queryParams.toString()}`
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
        fetchGetTempPayments(); // Recall fetch function after successful deletion
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
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row?.paymentHeader.paymentId,
    },
    {
      field: "paymentDate",
      headerName: "Payment Date",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) =>
        dayjs(params.row?.paymentHeader.paymentDate).format("MM/DD/YYYY"),
    },
    {
      field: "invoicePayment",
      headerName: "Invoice Payment",
      minWidth: 200,
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
      minWidth: 200,
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
      minWidth: 200,
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
            pageName: "Direct Sale - Sales",
            path: `${PATH_DASHBOARD.directSaleTour.directSaleTour}/${scheduleId}`,
          },
          { pageName: "Payment" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        icon={<PaidIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
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
                  {tempPayments.map((row: any) => (
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

export default PaymentInvoicesView;
