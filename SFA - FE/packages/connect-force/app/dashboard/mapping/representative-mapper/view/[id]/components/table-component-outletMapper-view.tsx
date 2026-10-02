"use client";

import { GridColDef } from "@mui/x-data-grid";

export const OutletMappedViewTableHeadingsAssign: GridColDef[] = [
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
    field: "contactNo1",
    headerName: "Contact No",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.contactNo1 || "-",
  },
  {
    field: "outletCategory",
    headerName: "Outlet Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.outletCategory || "-",
  },
  {
    field: "outletClassification",
    headerName: "Outlet Classification",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.outletClassification || "-",
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
