"use client";

import { GridColDef } from "@mui/x-data-grid";

export const RepresentativeMappedViewTableHeadingsAssign: GridColDef[] = [
  {
    field: "representativeID",
    headerName: "Representative ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "name",
    headerName: "Representative Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.name || "-",
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.email || "-",
  },
  {
    field: "contactNo",
    headerName: "Contact No",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.contactNo || "-",
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
