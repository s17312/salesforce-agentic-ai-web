import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import { dataGridStockStyleMappers, focusDataGridStyle } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { formatCurrency, formatRate } from "@/utils/formatCurrency";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";


interface ViewSaleTableProps {
    saleInvoiceDetail: [];
}

const ViewSaleTable: React.FC<ViewSaleTableProps> = ({
    saleInvoiceDetail
}) => {
    const [rows, setRows] = useState([] as any[]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!saleInvoiceDetail) return;

        const updatedRows: any[] = saleInvoiceDetail.map((row: any) => {
            const matchedUnit = row.salesUnitType.find((unit: any) => unit.uId === row.saleUnit);
            return {
                ...row,
                id: `${row.productUId}-${row.mrp}-${row.rate}`,
                salesUnit: matchedUnit?.unitName ?? "N/A",
                units: (matchedUnit?.ratio ?? 0) * row.sale,
            };
        });
        setRows(updatedRows);

    }, [saleInvoiceDetail])

    const columns: any[] = [
        {
            field: "productId",
            headerName: "Product ID",
            minWidth: 130,
            flex: 1,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: "productName",
            headerName: "Product Name",
            minWidth: 300,
            flex: 1,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: "mrp",
            headerName: "MRP",
            minWidth: 80,
            flex: 1,
            disableColumnMenu: true,
            align: "right",
            headerAlign: "right",
            sortable: false,
            renderCell: (params: any) => <>{formatRate(params.row.mrp)}</>,
        },
        {
            field: "rate",
            headerName: "Rate",
            minWidth: 80,
            flex: 1,
            disableColumnMenu: true,
            align: "right",
            headerAlign: "right",
            sortable: false,
            renderCell: (params: any) => <>{formatRate(params.row.rate)}</>,
        },
        {
            field: "availableQuantity",
            headerName: "Available Qty",
            minWidth: 80,
            flex: 1,
            disableColumnMenu: true,
            align: "right",
            headerAlign: "right",
            sortable: false,
        },
        {
            field: "salesUnit",
            headerName: "Sales Unit",
            minWidth: 110,
            flex: 1,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: "saleQuantity",
            headerName: "Sale",
            minWidth: 80,
            flex: 1,
            disableColumnMenu: true,
            type: "number",
            align: "right",
            headerAlign: "right",
            sortable: false,
        },
        {
            field: "units",
            headerName: "Total Units",
            minWidth: 80,
            flex: 1,
            disableColumnMenu: true,
            align: "right",
            headerAlign: "right",
            sortable: false,
        },
        {
            field: "saleValue",
            headerName: "Sale Value",
            minWidth: 160,
            flex: 1,
            disableColumnMenu: true,
            align: "right",
            headerAlign: "right",
            sortable: false,
            renderCell: (params: any) => <>{formatCurrency(params.row.saleValue)}</>,
        },
    ];

    const {
        searchedRows,
        searchQuery,
        setSearchQuery,
        selectedStatus,
        setSelectedStatus,
    } = useColumnFilter(rows, columns);

    return (
        <>
            <DataGrid
                sx={{ ...dataGridStockStyleMappers, ...focusDataGridStyle }}
                rows={searchedRows}
                columns={getColumnsWithTooltip(columns)}
                loading={isLoading}
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay,
                    toolbar: () => (
                        <QuickSearchToolbar
                            columns={columns}
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
                disableRowSelectionOnClick
                disableColumnMenu
            />
        </>
    );
};

export default ViewSaleTable;
