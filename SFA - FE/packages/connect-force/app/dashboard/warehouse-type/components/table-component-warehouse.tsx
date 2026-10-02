"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import SwitchCell from "@/components/switch-cell/switchCell";
import { enqueueSnackbar } from "notistack";
import ActionCell from "@/components/actions-cell/actionsCell";
import { statusSortComparator } from "@/utils/sortUtils";
import { updateWarehouseTypeStatus } from "@/service/warehouseType.service";
import { setWarehouseType } from "@/redux/slices/warehouse-type-slice";

export const WarehouseTableHeadings = [
  {
    field: "warehouseTypeId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "warehouseTypeName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.warehouseTypeName || "",
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.description || "-",
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    sortComparator: statusSortComparator('active'),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          row={params.row}
          updateServiceReq={updateWarehouseTypeStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Warehouse Type"
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
          dispatchSlice={setWarehouseType}
          editPath={PATH_DASHBOARD.warehouseType.list}
          viewPath={PATH_DASHBOARD.warehouseType.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
