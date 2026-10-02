import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getInvoicesByOutletInvoice } from "@/service/tour-service/invoicePayment.service";
import { dataGridStockStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { InvoicePayment_StatusChip } from "../../components/invoicePaymentStatusChip";
import dayjs from "dayjs";

const PaymentTable = () => {
    const route = useRouter();

    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
    const outletInvoicesList = useSelector((state) => state.tourSalesPaymentSlice.outletInvoices);

    const searchParams = useSearchParams();
    const outletID = Number(searchParams.get('outletID'));

    useEffect(() => {
        fetchGetInvoicesByOutlet();
    }, []);

    const fetchGetInvoicesByOutlet = async () => {
        try {
            await getInvoicesByOutletInvoice(outletID);
        } catch (error) {
        }
    };

    const handleTableBtnClick = () => {
        const queryParams = new URLSearchParams();
        queryParams.append('outletID', outletID.toString());
        queryParams.append('selectedRows', JSON.stringify(selectionModel));
        queryParams.append('returnUrl', window.location.href);
        route.push(`${PATH_DASHBOARD.salesTour.invoice.payment}?${queryParams.toString()}`);
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

    return (
        <>
            <DataGrid
                sx={{ ...dataGridStockStyleMappers }}
                getRowId={(row) => row.invoiceHeaderId}
                rows={outletInvoicesList}
                columns={getColumnsWithTooltip(columns)}
                checkboxSelection
                onRowSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                }}
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
        </>
    );
};

export default PaymentTable;