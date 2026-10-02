"use client";

import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef } from "@mui/x-data-grid";

export const CompanyMapperTableHeadingsAssign: GridColDef[] = [
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
  },
  {
    field: "registeredAddress",
    headerName: "Registered Address",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
  },
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 100,
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
