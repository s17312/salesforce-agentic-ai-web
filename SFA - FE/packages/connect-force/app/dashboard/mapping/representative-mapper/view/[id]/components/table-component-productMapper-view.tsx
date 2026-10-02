"use client";

import { GridColDef } from "@mui/x-data-grid";

export const ProductMapperViewTableHeadingsAssign: GridColDef[] = [
  {
    field: "productID",
    headerName: "Product ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "productName",
    headerName: "Product Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.productName || "-",
  },
  {
    field: "productCategory",
    headerName: "Product Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.productCategory || "-",
  },
  {
    field: "productGroup",
    headerName: "Product Group",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.productGroup || "-",
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
