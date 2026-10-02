import { formatCurrency } from "@/utils/formatCurrency";

export const ItemWiseSaleSummaryReportTableHeadings = [
  {
    field: "productID",
    headerName: "Product ID",
    disableColumnMenu: true,
    minWidth: 50,
    sortable: false,
  },
  {
    field: "productName",
    headerName: "Product Name",
    disableColumnMenu: true,
    maxWidth: 150,
    minWidth: 230,
    sortable: false,
  },
  {
    field: "mrp",
    headerName: "MRP",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 200,
    headerAlign: "right",
    align: "right",
    sortable: false,
    valueGetter: (params: any) => {
      const mrp = params.value;
      return mrp ? formatCurrency(Number(mrp)) : "-";
    },
  },
  {
    field: "rate",
    headerName: "Rate",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 200,
    headerAlign: "right",
    align: "right",
    sortable: false,
    valueGetter: (params: any) => {
      const rate = params.value;
      return rate ? formatCurrency(Number(rate)) : "-";
    },
  },
  {
    field: "totalSaleQuantity",
    headerName: "Sale Qty",
    disableColumnMenu: true,
    headerAlign: "right",
    align: "right",
    flex: 1,
    maxWidth: 100,
    sortable: false,
  },
  {
    field: "totalDiscountQty",
    headerName: "Discount Qty",
    disableColumnMenu: true,
    headerAlign: "right",
    align: "right",
    flex: 1,
    maxWidth: 200,
    sortable: false,
  },
  {
    field: "totalReturnValue",
    headerName: "Return Qty",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    sortable: false,
  },
  {
    field: "netQty",
    headerName: "Net Qty",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    sortable: false,
  },
  {
    field: "totalValue",
    headerName: "Total Value",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    sortable: false,
    valueGetter: (params: any) => {
      const totalValue = params.value;
      return totalValue ? formatCurrency(Number(totalValue)) : "-";
    },
  },
  {
    field: "totalVolume",
    headerName: "Total Volume",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    sortable: false,
    valueGetter: (params: any) => {
      const totalVolume = params.value;
      return totalVolume ? formatCurrency(Number(totalVolume)) : "-";
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
