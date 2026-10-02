
import { PATH_DASHBOARD } from "@/routes/paths";
import ActionCell from "@/components/actions-cell/actionsCell";
import { updatePaymentTermStatus } from "@/service/paymentTerm.service";
import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setPaymentTerm } from "@/redux/slices/payment-term-slice";
import { statusSortComparator } from "@/utils/sortUtils";


export const PaymentTermTableHeadings = [
  {
    field: "code",
    headerName: "Code",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "name",
    headerName: "Name",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "description",
    headerName: "Description",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
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
          updateServiceReq={updatePaymentTermStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Payment Term"
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
          dispatchSlice = {setPaymentTerm}
          editPath={PATH_DASHBOARD.paymentTerm.list}
          viewPath={PATH_DASHBOARD.paymentTerm.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
  
};
