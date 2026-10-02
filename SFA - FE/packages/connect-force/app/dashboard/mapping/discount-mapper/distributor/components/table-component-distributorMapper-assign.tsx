"use client";

import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef } from "@mui/x-data-grid";

export const DiscountMapperTableHeadingsDistributor: GridColDef[] = [
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
    valueGetter: (params: any) => params.row.businessCategory.category || "-",
  },
  {
    field: "paymentTerm.name",
    headerName: "Payment Term",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.paymentTerm.name || "-",
  },
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 100,
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
