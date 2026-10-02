"use client";

import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";

export const OutletMapperTableHeadingsAssigned = [
  {
    field: "outletID",
    headerName: "Outlet ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "name",
    headerName: "Outlet Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.name || "-",
  },
  {
    field: "statusName",
    headerName: "Outlet Status",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 180,
    valueGetter: (params: any) => params.row.statusName || "-",
  },
  {
    field: "classification",
    headerName: "Outlet Clasification",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 180,
    valueGetter: (params: any) => params.row.classification || "-",
  },
  {
    field: "outletCategoryName",
    headerName: "Outlet Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 180,
    valueGetter: (params: any) => params.row.outletCategoryName || "-",
  },
  {
    field: "paymentModeType",
    headerName: "Payment Mode",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 180,
    valueGetter: (params: any) => params.row.paymentModeType || "-",
  },
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 100,
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
