import { PATH_DASHBOARD } from "@/routes/paths";
import SwitchCell from "@/components/switch-cell/switchCell";
import { enqueueSnackbar } from "notistack";
import ActionCell from "@/components/actions-cell/actionsCell";
import { updateOutletStatusStatus } from "@/service/outletStatus.service";
import { setOutletStatus } from "@/redux/slices/outlet-status-slice";
import { statusSortComparator } from "@/utils/sortUtils";

export const OutletStatusTableHeadings = [
  {
    field: "outletStatusID",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "statusName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.statusName || "",
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
    field: "status",
    headerName: "Status",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    minWidth: 70,
    sortComparator: statusSortComparator("active"),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          featureName="outlet status"
          row={params.row}
          updateServiceReq={updateOutletStatusStatus}
          enqueueSnackbar={enqueueSnackbar}
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
          dispatchSlice={setOutletStatus}
          editPath={PATH_DASHBOARD.outletstatus.list}
          viewPath={PATH_DASHBOARD.outletstatus.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
