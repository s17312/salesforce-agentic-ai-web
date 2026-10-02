"use client";

import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef } from "@mui/x-data-grid";

export const DiscountToOutletMapperViewTableHeadingsAssign: GridColDef[] = [
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
    minWidth: 180,
    valueGetter: (params: any) => params.row.name || "-",
  },
  {
    field: "contactNo1",
    headerName: "Contact No",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 180,
    valueGetter: (params: any) => params.row.contactNo1 || "-",
  },
  {
    field: "outletClassification",
    headerName: "Outlet Clasification",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 180,
    valueGetter: (params: any) => params.row.outletClassification || "-",
  },
  {
    field: "outletCategory",
    headerName: "Outlet Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 180,
    valueGetter: (params: any) => params.row.outletCategory || "-",
  },
  {
    field: "paymentModeType",
    headerName: "Payment Mode",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 180,
    valueGetter: (params: any) => params.row.paymentModeType || "-",
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
