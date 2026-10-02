import { formatCurrency } from "@/utils/formatCurrency";

export const AssetStockViewTableHeadings = [
  {
    field: "assetId",
    headerName: "Asset ID",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: true,
  },
  {
    field: "assetName",
    headerName: "Asset Name",
    disableColumnMenu: true,
    flex: 1,
    sortable: true,
  },
  {
    field: "serialNumber",
    headerName: "Serial Number",
    disableColumnMenu: true,
    flex: 1,
    sortable: true,
  },
  {
    field: "guaranteeInformation",
    headerName: "Guarantee Information",
    disableColumnMenu: true,
    flex: 1,
    sortable: true,
  },
  {
    field: "manufacturer",
    headerName: "Manufacturer",
    disableColumnMenu: true,
    flex: 1,
    sortable: true,
  },
  {
    field: "purchaseDate",
    headerName: "Purchase Date",
    type: "string",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: true,
    // valueGetter: (params: any) => params.row.purchaseDate
    valueGetter: (params: any) => {
      return params.row.purchaseDate
        ? new Date(params.row.purchaseDate).toLocaleDateString()
        : null;
    },
  },
  {
    field: "cost",
    headerName: "Cost",
    type: "number",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: true,
    valueGetter: (params: any) => {
      return params.row.cost ? `${formatCurrency(Number(params.row.cost))}` : "-";
    },
  },
  {
    field: "assignStatus",
    headerName: "Assign Status",
    disableColumnMenu: true,
    flex: 1,
    sortable: true,
  },
  {
    field: "assetTypeName",
    headerName: "Asset Type",
    disableColumnMenu: true,
    flex: 1,
    sortable: true,
  },
  {
    field: "assetBrandName",
    headerName: "Asset Brand",
    disableColumnMenu: true,
    flex: 1,
    sortable: true,
  },
  {
    field: "assetModelName",
    headerName: "Asset Model",
    disableColumnMenu: true,
    flex: 1,
    sortable: true,
  },
  // {
  //   field: "additionalNotes",
  //   headerName: "Additional Notes",
  //   disableColumnMenu: true,
  //   flex: 1.5,
  //   sortable: false,
  // },
  // {
  //   field: "maintenanceSchedule",
  //   headerName: "Maintenance Schedule",
  //   type: "string",
  //   disableColumnMenu: true,
  //   flex: 1,
  //   maxWidth: 150,
  //   minWidth: 150,
  //   sortable: true,
  //   // valueGetter: (params: any) => params.row.maintenanceSchedule
  //   valueGetter: (params: any) => {
  //     return params.row.maintenanceSchedule
  //       ? new Date(params.row.maintenanceSchedule).toLocaleDateString()
  //       : null;
  //   },
  // },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
