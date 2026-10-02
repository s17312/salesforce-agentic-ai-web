
import { setRoute } from "@/redux/slices/route-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import ActionCell from "@/components/actions-cell/actionsCell";
import { updateRouteStatus } from "@/service/route.service";
import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import { statusSortComparator } from "@/utils/sortUtils";

export const RouteTableHeadings = [
  {
    field: "routeId",
    headerName: "Code",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "routeName",
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
    field: "startPoint",
    headerName: "Start Point",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  }
  ,
  {
    field: "endPoint",
    headerName: "End Point",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "distance",
    headerName: "Distance (KM)",
    headerAlign: "right",
    disableColumnMenu: true,
    flex: 1,
    align: "right",
    minWidth: 100,
  },
  {
    field: "estimateTime",
    headerName: "Estimate Time (min)",
    headerAlign: "right",
    disableColumnMenu: true,
    flex: 1,
    align: "right",
    minWidth: 100,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    minWidth: 70,
    sortComparator: statusSortComparator('active'),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          featureName="Route"
          row={params.row}
          updateServiceReq={updateRouteStatus}
          enqueueSnackbar={enqueueSnackbar}
        />
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    sortable: false,
    flex: 1,
    minWidth: 130,
    renderCell: (params: any) => {
      return (
        <ActionCell
          row={params.row}
          dispatchSlice={setRoute}
          editPath={PATH_DASHBOARD.route.list}
          viewPath={PATH_DASHBOARD.route.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100]
};
