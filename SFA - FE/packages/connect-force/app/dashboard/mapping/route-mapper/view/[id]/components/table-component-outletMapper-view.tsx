"use client";

import {  GridColDef } from "@mui/x-data-grid";

export const OutletMapperViewTableHeadingsAssign: GridColDef[] = [
  {
    field: "outletId",
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
    field: "parentOutletCode",
    headerName: "Parent Outlet Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.parentOutletCode || "-",
  },
  {
    field: "address",
    headerName: "Address",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.address || "-",
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
