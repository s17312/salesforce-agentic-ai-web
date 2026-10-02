import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

export const CompanyStockViewTableHeadings = [
  {
    field: 'productId',
    headerName: 'Product ID',
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false
  },
  {
    field: 'productName',
    headerName: 'Product Name',
    disableColumnMenu: true,
    flex: 1,
    sortable: false
  },
  {
    field: 'productCategoryName',
    headerName: 'Product Category',
    disableColumnMenu: true,
    flex: 1,
    sortable: false
  },
  {
    field: 'productGroupName',
    headerName: 'Product Group',
    disableColumnMenu: true,
    flex: 1,
    sortable: false
  },
  {
    field: 'mrp',
    headerName: 'MRP',
    headerAlign: 'right',
    align: 'right',
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const mrp = params.row.mrp;
      return mrp ? Number(mrp).toFixed(2) : '-';
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
    field: 'quantity',
    headerName: 'Qty',
    type: 'number',
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false
  },
  {
    field: 'volume',
    headerName: 'Volume',
    type: 'number',
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const volume = params.row.volume;
      return volume ? formatVolume3Decimals(volume) : '-';
    },
  },
  {
    field: 'totalValue',
    headerName: 'Value',
    type: 'number',
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const value = params.row.totalValue;
      return value ? formatCurrency(value) : '-';
    },
  }
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
