import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setMainOutlet } from "@/redux/slices/main-outlet-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateMainOutletStatus } from "@/service/main-outlet.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const MainOutletTableHeadings = [
  {
    field: "outletID",
    headerName: "Outlet ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "name",
    headerName: "Outlet Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "address",
    headerName: "Address",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 150,
    valueGetter: (params: any) => params.row.address,
  },
  {
    field: "contactNo",
    headerName: "Contact No",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.contactNo,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    sortable: true,
    sortComparator: statusSortComparator("active"),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          row={params.row}
          updateServiceReq={updateMainOutletStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Main Outlet"
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
          dispatchSlice={setMainOutlet}
          editPath={PATH_DASHBOARD.mainOutlet.list}
          viewPath={PATH_DASHBOARD.mainOutlet.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
