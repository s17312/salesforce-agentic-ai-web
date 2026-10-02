import PermissionActionCell from "@/components/actions-cell/permissionActionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setUserRoleData } from "@/redux/slices/user-management/user-role-permission-slice";
import { setUserRole } from "@/redux/slices/user-role-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateUserRoleStatus } from "@/service/userRole.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const UserRoleTableHeadings = [
  {
    field: "roleId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "roleName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.roleName || "",
  },
  {
    field: "description",
    headerName: "Description",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "status",
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
          updateServiceReq={updateUserRoleStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="User Role"
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
        <PermissionActionCell
          row={params.row}
          dispatchSlice={setUserRoleData}
          editPath={PATH_DASHBOARD.userRolePermission.add}
          viewPath={PATH_DASHBOARD.userRole.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
