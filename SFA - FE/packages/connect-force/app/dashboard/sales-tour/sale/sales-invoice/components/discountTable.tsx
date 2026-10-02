import React, { useEffect, useState } from "react";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useSelector } from "@/redux/store";
import { getSalesDiscountByInvoiceId, saveSalesDiscount } from "@/service/tour-service/discount.service";
import { dataGridStockStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import { useSearchParams } from "next/navigation";

interface SaleRepTourProps {
    existingSalesInvoice: any;
}

const DiscountTable: React.FC<SaleRepTourProps> = ({ existingSalesInvoice }) => {
    const [rows, setRows] = useState([] as any[]);
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
    const tourSalesDiscountList = useSelector((state) => state.tourSalesDiscountSlice.InvoiceDiscountList);

    const searchParams = useSearchParams();
    const saleStatus = Number(searchParams.get('saleStatus'));

    const saleInvoiceHeader = existingSalesInvoice?.saleInvoiceHeader;

    useEffect(() => {
        fetchGetSalesDiscountByInvoiceId();
    }, []);

    useEffect(() => {
        const updatedRows = tourSalesDiscountList.map((discount) => {
            const appliedDiscount = () => {
                if (discount.pdOfferQty) {
                    return discount.pdOfferQty;
                } else if (discount.vdOfferAmt) {
                    return discount.vdOfferAmt;
                } else {
                    return 0;
                }
            };
            return {
                ...discount,
                id: discount.discountUId,
                appliedDiscount: appliedDiscount(),
                rate: discount.rate,
            };
        });
        setRows(updatedRows);
    }, [tourSalesDiscountList]);

    const fetchGetSalesDiscountByInvoiceId = async () => {
        try {
            if (!existingSalesInvoice) {
                enqueueSnackbar("Please sumbit the sales before discount", { variant: "error" });
            } else {
                await getSalesDiscountByInvoiceId(existingSalesInvoice.saleInvoiceHeader.uId);
            }
        } catch (error) {
        }
    };

    const handleRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = {
            ...newRow,
            appliedDiscount: newRow.appliedDiscount,
        };

        setRows((prevRows) =>
            // @ts-ignore
            prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
        );
        return updatedRow;
    };

    const handleSaveBtnClick = async () => {
        const selectedRows = rows.filter((row) => selectionModel.includes(row.id));

        // mapped to discount details
        const discountDetails = selectedRows.map((row) => {
            return {
                discountUId: row.discountUId,
                pdOfferQty: row.pdOfferQty || 0,
                rate: row.rate,
                mrp: row.mrp,
                vdOfferAmt: row.vdOfferAmt || 0,
                isApply: true,
            };
        });

        const payload = {
            salesDiscountHeader: {
                tourScheduleUId: existingSalesInvoice.saleInvoiceHeader.tourScheduleUId,
                saleInvoiceHeaderUId: existingSalesInvoice.saleInvoiceHeader.uId,
                salesDiscountStatus: 1,
            },
            salesDiscountDetails: discountDetails
        };
        try {
            const responceMsg = await saveSalesDiscount(payload);
            enqueueSnackbar(responceMsg, { variant: "success" });
            fetchGetSalesDiscountByInvoiceId();
            setSelectionModel([]);
        } catch (error) {
            enqueueSnackbar("Failed to save discount", { variant: "error" });
        }
    };

    const columns: GridColDef[] = [
        { field: "discountID", headerName: "Discount ID", minWidth: 150, flex: 1, disableColumnMenu: true, sortable: false },
        { field: "discountType", headerName: "Discount Type", minWidth: 150, flex: 1, disableColumnMenu: true, sortable: false },
        { field: "discountName", headerName: "Discount Name", minWidth: 150, flex: 1, disableColumnMenu: true, sortable: false },
        {
            field: "pdOfferQty",
            headerName: "Suggested Product Discount",
            minWidth: 150,
            flex: 1,
            disableColumnMenu: true,
            align: "right",
            headerAlign: "right",
            sortable: false,
            valueGetter: (params: any) => params.row.pdOfferQty || '-',
        },
        {
            field: "vdOfferAmt",
            headerName: "Suggested Value Discount",
            minWidth: 150,
            flex: 1,
            disableColumnMenu: true,
            align: "right",
            headerAlign: "right",
            sortable: false,
            valueGetter: (params: any) => params.row.vdOfferAmt || '-',
        },
        {
            field: "appliedDiscount",
            headerName: "Applied Discount",
            minWidth: 150,
            flex: 1,
            disableColumnMenu: true,
            align: "right",
            headerAlign: "right",
            editable: saleStatus == 2 ? false : true,
            type: 'number',
            cellClassName: 'editable-cell',
            sortable: false
        },
        { ...GRID_CHECKBOX_SELECTION_COL_DEF, width: 100 },
    ];

    return (
        <>
            <DataGrid
                sx={{ ...dataGridStockStyleMappers }}
                getRowId={(row) => row.discountUId}
                rows={rows}
                columns={getColumnsWithTooltip(columns)}
                checkboxSelection
                onRowSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                }}
                rowSelectionModel={selectionModel}
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay,
                    toolbar: () => (
                        <QuickSearchToolbar
                            handleTableBtnClick={handleSaveBtnClick}
                            isTableBtnDisabled={saleStatus == 2}
                            tableBtnText="Save"
                        />
                    ),
                }}
                processRowUpdate={handleRowUpdate}
                density="compact"
                hideFooter
                disableRowSelectionOnClick
                disableColumnMenu
            />
        </>
    );
};

export default DiscountTable;
