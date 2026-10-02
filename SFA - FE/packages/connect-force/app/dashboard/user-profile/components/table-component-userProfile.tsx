import SwitchCell from "@/components/switch-cell/switchCell";
import { setUserProfile } from "@/redux/slices/user-management/user-profile-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { updateUserProfileStatus } from "@/service/user-management/userProfile.service";
import ActionCell from "@/components/actions-cell/actionsCell";
import { dispatch } from "@/redux/store";
import { setRequestedDetail } from "@/redux/slices/user-management/reset-requested-password-slice";
import { setPopupView } from "@/redux/slices/layout-slice";
import { IconButton, Tooltip } from "@mui/material";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import LockResetIcon from "@mui/icons-material/LockReset";

export const UserProfileTableHeadings = [
  {
    field: "profile.firstName",
    headerName: "First Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.profile?.firstName,
  },
  {
    field: "profile.lastName",
    headerName: "Last Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.profile?.lastName,
  },
  {
    field: "userName",
    headerName: "User Name",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "profile.email",
    headerName: "E-mail",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.profile?.email,
  },
  {
    field: "profile.mobileNumber",
    headerName: "Mobile Number",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.profile?.mobileNumber,
  },
  {
    field: "profile.dob",
    headerName: "DOB",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => {
      const dob = params.row.profile?.dob;
      if (!dob) return "";
      try {
        return format(new Date(dob), "yyyy-MM-dd");
      } catch (error) {
        return dob;
      }
    },
  },
  {
    field: "profile.nic",
    headerName: "NIC",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.profile?.nic,
  },
  {
    field: "profile.address",
    headerName: "Address",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.profile?.address,
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
          updateServiceReq={updateUserProfileStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="User Profile"
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
      const onClickResetPassword = () => {
        dispatch(setRequestedDetail(params.row));
        dispatch(setPopupView(true));
      };
      return (
        <>
          <ActionCell
            row={params.row}
            dispatchSlice={setUserProfile}
            editPath={PATH_DASHBOARD.userProfile.list}
            viewPath={PATH_DASHBOARD.userProfile.view}
          />
          <Tooltip title={"Reset Password"}>
            <IconButton
              onClick={onClickResetPassword}
              disabled={!params.row.active}
            >
              <LockResetIcon
                fontSize="small"
                sx={{
                  color: params.row.active
                    ? tableIconColors.resetPasswordIcon
                    : tableIconColors.disabledIcon,
                }}
              />
            </IconButton>
          </Tooltip>
        </>
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
