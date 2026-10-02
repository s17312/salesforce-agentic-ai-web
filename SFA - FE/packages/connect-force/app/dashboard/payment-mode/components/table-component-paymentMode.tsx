import { PATH_DASHBOARD } from "@/routes/paths";
import SwitchCell from "@/components/switch-cell/switchCell";
import { updatePaymentModeStatus } from "@/service/paymentMode.service";
import { enqueueSnackbar } from "notistack";
import ActionCell from "@/components/actions-cell/actionsCell";
import { EllipsisText } from "@/styles/tableStyles/ellipsisText";
import { setPaymentMode } from "@/redux/slices/payment-mode-slice";
import { statusSortComparator } from "@/utils/sortUtils";

export const PaymentModeTableHeadings = [
  {
    field: "paymentModeId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "paymentModeType",
    headerName: "Type",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 255,
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
          updateServiceReq={updatePaymentModeStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Payment Mode"
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
          dispatchSlice = {setPaymentMode}
          editPath={PATH_DASHBOARD.paymentMode.list}
          viewPath={PATH_DASHBOARD.paymentMode.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
  
};
