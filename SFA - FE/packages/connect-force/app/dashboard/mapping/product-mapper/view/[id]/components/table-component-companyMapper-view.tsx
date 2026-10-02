"use client";

import { GridColDef } from "@mui/x-data-grid";

export const CompanyMappedViewTableHeadingsAssign: GridColDef[] = [
  {
    field: "companyID",
    headerName: "Company ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "companyName",
    headerName: "Company Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.companyName || "-",
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
    field: "registeredAddress",
    headerName: "Registered Address",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.registeredAddress || "-",
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
