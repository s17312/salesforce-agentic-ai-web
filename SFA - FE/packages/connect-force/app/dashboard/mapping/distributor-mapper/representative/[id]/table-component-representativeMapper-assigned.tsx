"use client";

import React from "react";
import { Checkbox } from "@mui/material";

export const RepresentativeMapperTableHeadingsAssigned = [
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
    field: "##",
    headerName: "Select",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    minWidth: 50,
    maxWidth: 130,
    sortable: false,
    valueGetter: (params: any) => params.row.description || "-",
    renderCell: (params: any) => {
      return <Checkbox />;
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
