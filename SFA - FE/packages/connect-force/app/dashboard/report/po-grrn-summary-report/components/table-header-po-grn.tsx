import { formatVolume3Decimals } from "@/utils/formatCurrency";

export const POGRNSummaryTableHeadings = [
  {
    field: "poNo",
    headerName: "PO No",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 200,
    minWidth: 150,
    sortable: false,
  },
  {
    field: "productID",
    headerName: "Product ID",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
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
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const mrp = params.row.mrp;
      return mrp ? Number(mrp).toFixed(2) : "-";
    },
  },
  {
    field: "rate",
    headerName: "Rate",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const rate = params.row.rate;
      return rate ? Number(rate).toFixed(2) : "-";
    },
  },
  {
    field: "requestedQunatity",
    headerName: "Req. Qty",
    type: "number",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
  },
  {
    field: "approvedQuantity",
    headerName: "App. Qty",
    type: "number",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
  },
  {
    field: "acceptedQuantity",
    headerName: "Acc. Qty",
    type: "number",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
  },
  {
    field: "totalValue",
    headerName: "Total Value",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const totalValue = params.row.totalValue;
      return totalValue ? Number(totalValue).toFixed(2) : "-";
    },
  },
  {
    field: "totalVolume",
    headerName: "Total Volume",
    type: "number",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const totalVolume = params.row.totalVolume;
      return totalVolume ? formatVolume3Decimals(totalVolume) : "-";
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
