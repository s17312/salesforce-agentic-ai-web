"use client";

import { GridColDef } from "@mui/x-data-grid";

export const DistributorToCompanyMapperViewTableHeadingsAssign: GridColDef[] = [
  {
    field: "distributorID",
    headerName: "Distributor ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.distributorID || "-",
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
    field: "businessCategory",
    headerName: "Business Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.businessCategory || "-",
  },
  {
    field: "paymentTerm",
    headerName: "Payment Term",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.paymentTerm || "-",
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
