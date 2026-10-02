'use client';

import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useSelector } from "@/redux/store";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import PaidIcon from "@mui/icons-material/Paid";
import { Box, Button, Collapse, IconButton, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import {
    Delete as DeleteIcon,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { deleteTempPayment, getTempPayments } from "@/service/value-sale/valueInvoicePayment.service";
import { enqueueSnackbar } from "notistack";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import PaymentDetailsTable from "../../sales-invoice/payment/components/tempSubTable";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { StyledTableCell, StyledTableHeaderRow, StyledTableRow } from "@/styles/tableStyles/paymentTableStyles";

const PaymentDeletion = ({ params }: { params: { id: number } }) => {
    const outletID = Number(params.id);
    const router = useRouter();
    const theme = useTheme();
    const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const tempPayments = useSelector((state) => state.tourValueSalesSlice.TempPayments);

    const searchParams = useSearchParams();
    const scheduleId = searchParams.get('scheduleId');

    useEffect(() => {
        fetchGetTempPayments();
    }, []);

    const fetchGetTempPayments = async () => {
        try {
            await getTempPayments(scheduleId, outletID);
        } catch (error) {
            enqueueSnackbar("Error while fetching temp payments", {
                variant: "error",
            });
        }
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

    const toggleExpand = (id: number) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle the expanded state for the specific row ID
        }));
    };

    const handleBackClick = () => {
        router.push(`${PATH_DASHBOARD.salesTour.salesTour}/${scheduleId}`);
    };

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
        {
            field: 'action',
            headerName: 'Action',
            width: 80,
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params: any) => (
                <IconButton
                    size="small"
                    onClick={() => handleDelete(params.row?.paymentHeader.paymentHeaderId)}
                >
                    <DeleteIcon
                        fontSize="small"
                        sx={{ color: tableIconColors.deleteIcon }}
                    />
                </IconButton>
            ),
        }
    ];

    return (
        <>
            <BreadcrumbNavigation
                pageTitle="Invoice Payment Deletion"
                pageNavigation={[
                    {
                        pageName: "Sales Journey - Sales",
                        path: `${PATH_DASHBOARD.salesTour.salesTour}/${scheduleId}`,
                    },
                    { pageName: "Payment Deletion" },
                ]}
                onLinkClick={(path: any) => {
                    handleBreadcrumbNavigation(path);
                }}
                icon={<PaidIcon sx={{ color: theme.palette.primary.main }} />}
            />
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6"></Typography>
                    <Button variant="contained" onClick={handleBackClick} startIcon={<ArrowBackIcon />}>
                        Back
                    </Button>
                </Box>
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
                <ConfirmDeleteDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    onConfirm={confirmDelete}
                />
            </Container>
        </>
    );
};

export default PaymentDeletion;