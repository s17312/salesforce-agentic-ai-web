import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
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
    field: "roleTypeModel.roleTypeName",
    headerName: "Role Type",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.roleTypeModel?.roleTypeName || "",
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
        <ActionCell
          row={params.row}
          dispatchSlice={setUserRole}
          editPath={PATH_DASHBOARD.userRole.list}
          viewPath={PATH_DASHBOARD.userRole.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
