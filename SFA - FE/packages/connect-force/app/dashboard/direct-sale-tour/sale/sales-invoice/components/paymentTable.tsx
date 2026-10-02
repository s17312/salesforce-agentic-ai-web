import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getInvoicesByOutlet } from "@/service/tour-service/invoicePayment.service";
import { dataGridStockStyleMappers, tableIconColors } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { InvoicePayment_StatusChip } from "../../components/invoicePaymentStatusChip";
import dayjs from "dayjs";
import { Box, Collapse, IconButton, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { StyledTableCell, StyledTableHeaderRow, StyledTableRow } from "@/styles/tableStyles/paymentTableStyles";
import PaymentDetailsTable from "@/app/dashboard/sales-tour/sale/sales-invoice/payment/components/tempSubTable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getTempPayments } from "@/service/value-sale/valueInvoicePayment.service";
import { enqueueSnackbar } from "notistack";

const PaymentTable = () => {
    const route = useRouter();

    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
    const [saleInvoiceTypeUIds, setSaleInvoiceTypeUIds] = useState<number[]>([]);
    const [tabValue, setTabValue] = useState("1");
    const [pageTitle, setPageTitle] = useState("Invoice List");
    const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
    const outletInvoicesList = useSelector((state) => state.tourSalesPaymentSlice.outletInvoices);
    const tempPayments = useSelector((state) => state.tourValueSalesSlice.TempPayments);

    const searchParams = useSearchParams();
    const outletID = Number(searchParams.get('outletID'));
    const saleStatus = Number(searchParams.get('saleStatus'));
    const scheduleId = searchParams.get('scheduleId');

    useEffect(() => {
        fetchGetInvoicesByOutlet();
    }, []);

    const titles = {
        "1": "Invoice List",
        "2": "Approved Payments",
    };

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


    useEffect(() => {
        if (outletInvoicesList) {
            const saleInvoiceTypeUIds = outletInvoicesList?.filter((invoice: any) => selectionModel.includes(invoice.invoiceHeaderId)).map((invoice: any) => invoice.saleInvoiceTypeUId);
            setSaleInvoiceTypeUIds(saleInvoiceTypeUIds);
        }
    }, [selectionModel]);

    const fetchGetInvoicesByOutlet = async () => {
        try {
            await getInvoicesByOutlet(outletID);
        } catch (error) {
        }
    };

    const handleTableBtnClick = () => {
        const queryParams = new URLSearchParams();
        queryParams.append('outletID', outletID.toString());
        queryParams.append('scheduleId', scheduleId?.toString() || '');
        queryParams.append('selectedRows', JSON.stringify(selectionModel));
        queryParams.append('saleInvoiceTypeUIds', JSON.stringify(saleInvoiceTypeUIds));
        queryParams.append('returnUrl', window.location.href);
        route.push(`${PATH_DASHBOARD.directSaleTour.invoice.payment}?${queryParams.toString()}`);
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

    const columns: GridColDef[] = [
        {
            field: "invoiceDate",
            headerName: "Date",
            minWidth: 100,
            flex: 1,
            disableColumnMenu: true,
            valueGetter: (params: any) => {
                const date = params.value;
                return date ? dayjs(date).format('MM/DD/YYYY') : "-";
            },
        },
        { field: "invoiceId", headerName: "Invoice ID", minWidth: 150, flex: 1, disableColumnMenu: true },
        { field: "saleAmount", headerName: "Sales Amount", minWidth: 150, flex: 1, disableColumnMenu: true, align: "right", headerAlign: "right" },
        { field: "discountAmount", headerName: "Discount Amount", minWidth: 150, flex: 1, disableColumnMenu: true, align: "right", headerAlign: "right" },
        { field: "returnAmount", headerName: "Return Amount", minWidth: 150, flex: 1, disableColumnMenu: true, align: "right", headerAlign: "right" },
        { field: "invAmount", headerName: "Invoice Amount", minWidth: 150, flex: 1, disableColumnMenu: true, align: "right", headerAlign: "right" },
        { field: "paidAmount", headerName: "Paid Amount", minWidth: 150, flex: 1, disableColumnMenu: true, align: "right", headerAlign: "right" },
        { field: "balanceAmount", headerName: "Balance Amount", minWidth: 150, flex: 1, disableColumnMenu: true, align: "right", headerAlign: "right" },
        {
            field: "isPaidCompleted",
            headerName: "Status",
            minWidth: 100,
            flex: 1,
            disableColumnMenu: true,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => {
                const status = params.value === true ? 1 : 2;
                return <InvoicePayment_StatusChip status={status} />;
            }
        },
        { ...GRID_CHECKBOX_SELECTION_COL_DEF, width: 100 },
    ];

    const tempPaymentColumns = [
        {
            field: "expand",
            headerName: "",
            width: 100,
            renderCell: ({ row, toggleExpand }: any) => (
                <IconButton onClick={() => row?.paymentHeader && toggleExpand(row.paymentHeader.paymentHeaderId)}>
                    {row?.paymentHeader && expandedRows[row.paymentHeader.paymentHeaderId] ? (
                        <ExpandLessIcon />
                    ) : (
                        <ExpandMoreIcon />
                    )}
                </IconButton>
            ),
        },
        {
            field: 'paymentId',
            headerName: 'Payment ID',
            minWidth: 200,
            flex: 1,
            disableColumnMenu: true,
            valueGetter: (params: any) => params.row?.paymentHeader.paymentId,
        },
        {
            field: 'paymentDate',
            headerName: 'Payment Date',
            minWidth: 200,
            flex: 1,
            disableColumnMenu: true,
            valueGetter: (params: any) => dayjs(params.row?.paymentHeader.paymentDate).format('MM/DD/YYYY'),
        },
        {
            field: 'invoicePayment',
            headerName: 'Invoice Payment',
            minWidth: 200,
            flex: 1,
            disableColumnMenu: true,
            align: 'right',
            headerAlign: 'right',
            sortable: false,
            valueGetter: (params: any) => params.row?.paymentHeader.invoicePayment,
        },
        {
            field: 'cashPayment',
            headerName: 'Cash Payment',
            minWidth: 200,
            flex: 1,
            disableColumnMenu: true,
            align: 'right',
            headerAlign: 'right',
            sortable: false,
            valueGetter: (params: any) => params.row?.paymentHeader.cashPayment,
        },
        {
            field: 'chequePayment',
            headerName: 'Cheque Payment',
            minWidth: 200,
            flex: 1,
            disableColumnMenu: true,
            align: 'right',
            headerAlign: 'right',
            sortable: false,
            valueGetter: (params: any) => params.row?.paymentHeader.chequePayment,
        },
    ];

    return (
        <>
            <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                            onChange={handleChange}
                            aria-label="Product Mapper Tabs"
                        >
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
                            sx={{ ...dataGridStockStyleMappers }}
                            getRowId={(row) => row.invoiceHeaderId}
                            rows={outletInvoicesList}
                            columns={getColumnsWithTooltip(columns)}
                            onRowSelectionModelChange={(newSelectionModel) => {
                                setSelectionModel(newSelectionModel);
                            }}
                            checkboxSelection={saleStatus == 2 ? true : false}
                            rowSelectionModel={selectionModel}
                            slots={{
                                noRowsOverlay: CustomNoRowsOverlay,
                                toolbar: () => (<QuickSearchToolbar handleTableBtnClick={handleTableBtnClick} tableBtnText="Payment" isTableBtnDisabled={selectionModel.length == 0} />),
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
                                    {tempPayments.map((row) => (
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
                                                                // @ts-ignore
                                                                : row[column.field]}
                                                    </StyledTableCell>
                                                ))}
                                            </StyledTableRow>
                                            <TableRow component={Paper}>
                                                <TableCell
                                                    style={{ paddingBottom: 0, paddingTop: 0 }}
                                                    colSpan={tempPaymentColumns.length}
                                                >
                                                    <Collapse in={expandedRows[row.paymentHeader.paymentHeaderId] || false}>
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="subtitle1">Payment Details</Typography>
                                                            <PaymentDetailsTable paymentDetails={row.paymentDetail} />
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
            </Box>
        </>
    );
};

export default PaymentTable;