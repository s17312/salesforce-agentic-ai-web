"use client";

import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef } from "@mui/x-data-grid";

export const DiscountToRepresentativeMapperViewTableHeadingsAssign: GridColDef[] =
  [
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
      headerName: "Conact No",
      flex: 1,
      disableColumnMenu: true,
      minWidth: 200,
      valueGetter: (params: any) => params.row.contactNo || "-",
    },
  ];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
