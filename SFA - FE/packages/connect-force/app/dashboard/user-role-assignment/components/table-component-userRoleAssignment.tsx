import SwitchCell from "@/components/switch-cell/switchCell";
import ActionCell from "@/components/actions-cell/actionsCell";
import { setUserRoleAssignment } from "@/redux/slices/user-management/user-role-assignment-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { enqueueSnackbar } from "notistack";
import { statusSortComparator } from "@/utils/sortUtils";
import { updateUserRoleAssignmentActiveStatus } from "@/service/user-management/userRoleAssignment.service";

export const UserRoleAssignmentTableHeadings = [
  {
    field: "userName",
    headerName: "User Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 120,
  },
  {
    field: "roleName",
    headerName: "Role",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 120,
  },
  {
    field: "companyName",
    headerName: "Company",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 150,
    valueGetter: (params: any) => params.row.companyName || "-",
  },
  {
    field: "distributors",
    headerName: "Distributors",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 150,
    valueGetter: (params: any) =>
      params.row.distributors?.map((d: any) => d.value).join(", ") || "-",
  },
  {
    field: "representatives",
    headerName: "Representatives",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 150,
    valueGetter: (params: any) =>
      params.row.representatives?.map((r: any) => r.value).join(", ") || "-",
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
    renderCell: (params: any) => (
      <SwitchCell
        row={params.row}
        updateServiceReq={updateUserRoleAssignmentActiveStatus}
        enqueueSnackbar={enqueueSnackbar}
        featureName="User Role Assignment"
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => (
      <ActionCell
        row={params.row}
        dispatchSlice={setUserRoleAssignment}
        editPath={PATH_DASHBOARD.userRoleAssignment.list}
        viewPath={PATH_DASHBOARD.userRoleAssignment.view}
      />
    ),
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
