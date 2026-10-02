import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { Tooltip } from "@mui/material";
import { formatCurrency } from "@/utils/formatCurrency";

export const GRNReportTableHeadings = [
  {
    field: "productID",
    headerName: "Product ID",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "productName",
    headerName: "Product Name",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 200,
    minWidth: 150,
    sortable: false,
  },
  {
    field: "mrp",
    headerName: "MRP",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const mrp = params.row.mrp;
      return mrp ? formatCurrency(Number(mrp)) : "-";
    },
  },
  {
    field: "rate",
    headerName: "Rate",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const rate = params.row.rate;
      return rate ? formatCurrency(Number(rate)) : "-";
    },
  },
  {
    field: "requestQuantity",
    headerName: "Req. Qty",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "approvedQuantity",
    headerName: "App. Qty",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "acceptedQuantity",
    headerName: "Acc. Qty",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "volume",
    headerName: "Volume",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const volume = params.row.volume;
      return volume !== null && volume !== undefined
        ? Number(volume).toFixed(3)
        : "-";
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
      const formattedValue = formatCurrency(params.value); // Format value to 2 decimal places
      return (
        <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
          <span>{formattedValue}</span>
        </Tooltip>
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
