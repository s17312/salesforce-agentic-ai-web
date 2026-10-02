import { updateOutletStatus } from "@/service/outlet.service";
import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import ActionCell from "@/components/actions-cell/actionsCell";
import { PATH_DASHBOARD } from "@/routes/paths";
import { setOutlet } from "@/redux/slices/outlet-slice";
import { statusSortComparator } from "@/utils/sortUtils";

export const OutletTableHeadings = [
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
    field: "districtNameEN",
    headerName: "District",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 150,
    valueGetter: (params: any) =>
      params.row.districtNameEN || params.row.district?.name_en || "-",
  },
  {
    field: "cityNameEN",
    headerName: "City",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) =>
      params.row.cityNameEN || params.row.city?.name_en || "-",
  },
  {
    field: "contactNo1",
    headerName: "Contact No",
    flex: 1,
    disableColumnMenu: true,
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
    sortable: true,
    sortComparator: statusSortComparator("active"),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          row={params.row}
          updateServiceReq={updateOutletStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Outlet"
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
          dispatchSlice={setOutlet}
          editPath={PATH_DASHBOARD.outlet.list}
          viewPath={PATH_DASHBOARD.outlet.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
