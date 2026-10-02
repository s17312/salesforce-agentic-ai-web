"use client";

import { GridColDef } from "@mui/x-data-grid";

export const RouteMappedViewTableHeadingsAssign: GridColDef[] = [
  {
    field: "routeId",
    headerName: "Route ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "routeName",
    headerName: "Route Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.routeName || "-",
  },
  {
    field: "startPoint",
    headerName: "Start Point",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.startPoint || "-",
  },
  {
    field: "endPoint",
    headerName: "End Point",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.endPoint || "-",
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
