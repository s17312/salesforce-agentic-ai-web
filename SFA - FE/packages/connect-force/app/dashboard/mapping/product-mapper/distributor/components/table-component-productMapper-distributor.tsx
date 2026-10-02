"use client";

import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef } from "@mui/x-data-grid";

export const ProductMapperTableHeadingsDistributor: GridColDef[] = [
  {
    field: "distributorID",
    headerName: "Distributor ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "distributorName",
    headerName: "Distributor Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.distributorName || "-",
  },
  {
    field: "businessCategory.category",
    headerName: "Business Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.businessCategory?.category || "-",
  },
  {
    field: "ownerName",
    headerName: "Owner",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) =>
      params.row.title?.description + params.row.ownerName || "-",
  },
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 100,
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
