"use client";

import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef } from "@mui/x-data-grid";

export const ProductMapperTableHeadingsAssign: GridColDef[] = [
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
    field: "categoryName",
    headerName: "Product Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.categoryName || "-",
  },
  {
    field: "productGroupName",
    headerName: "Product Group",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.productGroupName || "-",
  },
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 100,
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
