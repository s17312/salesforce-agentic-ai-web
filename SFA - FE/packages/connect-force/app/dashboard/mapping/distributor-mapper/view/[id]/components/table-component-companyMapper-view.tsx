"use client";

import { GridColDef } from "@mui/x-data-grid";

export const CompanyMapperTableHeadingsAssignView: GridColDef[] = [
  {
    field: "company.companyId",
    headerName: "Company ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.company.companyId || "-",
  },
  {
    field: "company.companyName",
    headerName: "Company Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.company.companyName || "-",
  },
  {
    field: "company.registeredAddress",
    headerName: "Registered Address",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.company.registeredAddress || "-",
  },
  {
    field: "company.email",
    headerName: "Email",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.company.email || "-",
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
