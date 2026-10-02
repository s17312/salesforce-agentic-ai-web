"use client";

import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setWarehouse } from "@/redux/slices/warehouse-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateWarehouseStatus } from "@/service/warehouse";
import { statusSortComparator } from "@/utils/sortUtils";
import { maxWidth } from "@mui/system";
import { enqueueSnackbar } from "notistack";

export const WarehouseTableHeadings = [
  {
    field: "warehouseID",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.name || "",
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 255,
    valueGetter: (params: any) => params.row.description || "",
  },
  {
    field: "warehouseCategory.category",
    headerName: "Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    maxWidth: 100,
    valueGetter: (params: any) => params.row.warehouseCategory?.category || "",
  },
  {
    field: "warehouseType.warehouseTypeName",
    headerName: "Type",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    maxWidth: 100,
    valueGetter: (params: any) =>
      params.row.warehouseType?.warehouseTypeName || "",
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    maxWidth: 100,
    headerAlign: "center",
    align: "center",
    sortComparator: statusSortComparator("active"),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          row={params.row}
          updateServiceReq={updateWarehouseStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Warehouse"
        />
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    headerAlign: "center",
    align: "center",
    sortable: false,
    flex: 1,
    disableColumnMenu: true,
    minWidth: 130,
    renderCell: (params: any) => {
      return (
        <ActionCell
          row={params.row}
          dispatchSlice={setWarehouse}
          editPath={PATH_DASHBOARD.warehouse.list}
          viewPath={PATH_DASHBOARD.warehouse.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
