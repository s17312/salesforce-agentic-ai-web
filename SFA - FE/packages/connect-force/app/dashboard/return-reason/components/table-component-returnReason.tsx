import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setReturnReason } from "@/redux/slices/return-reason-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateReturnReasonStatus } from "@/service/returnReason.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const ReturnReasonTableHeadings = [
  {
    field: "reasonId",
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
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "eligible",
    headerName: "Eligible",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    sortComparator: statusSortComparator("active"),
    renderCell: (params: any) => {
      return (
        <span style={{ color: params.row.eligible ? "green" : "red" }}>
          {params.row.eligible ? "Yes" : "No"}
        </span>
      );
    },
  },
  {
    field: "active",
    headerName: "Status",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    sortComparator: statusSortComparator("active"),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          row={params.row}
          updateServiceReq={updateReturnReasonStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Return Reason"
        />
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      return (
        <ActionCell
          row={params.row}
          dispatchSlice={setReturnReason}
          editPath={PATH_DASHBOARD.returnReason.list}
          viewPath={PATH_DASHBOARD.returnReason.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
