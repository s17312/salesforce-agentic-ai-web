import { setPopupView } from "@/redux/slices/layout-slice";
import { setRequestedDetail } from "@/redux/slices/user-management/reset-requested-password-slice";
import { dispatch } from "@/redux/store";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import LockResetIcon from "@mui/icons-material/LockReset";
import { IconButton, Tooltip } from "@mui/material";

export const ResetRequestedPasswordTableHeadings = [
  {
    field: "userName",
    headerName: "Username",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "requestedOn",
    headerName: "Requested Date",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.requestedOn.split("T")[0] || "",
  },
  {
    field: "reason",
    headerName: "Reason for Reset",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
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
        <Tooltip title={"Reset Password"}>
          <IconButton onClick={onClickResetPassword}>
            <LockResetIcon
              fontSize="small"
              sx={{ color: tableIconColors.resetPasswordIcon }}
            />
          </IconButton>
        </Tooltip>
      );
    },
  },
];
