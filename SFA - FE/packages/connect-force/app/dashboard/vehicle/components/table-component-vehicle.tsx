import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setVehicle } from "@/redux/slices/vehicle-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateVehicleStatus } from "@/service/vehicle.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";

const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

export const VehicleTableHeadings = [
  {
    field: "vehicleID",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "plateNumber",
    headerName: "Plate Number",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.plateNumber || "",
  },
  {
    field: "vehicleCategory.category",
    headerName: "Vehicle Category",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    valueGetter: (params: any) => params.row.vehicleCategory.category || "",
  },
  {
    field: "yearOfManufacture",
    headerName: "Year of Manufacture",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 180,
    valueGetter: (params: any) => params.row.yearOfManufacture || "",
  },
  // {
  //   field: "insuranceRegisterDate",
  //   headerName: "Insurance Register Date",
  //   disableColumnMenu: true,
  //   flex: 1,
  //   minWidth: 210,
  //   valueGetter: (params: any) => params.row.insuranceRegisterDate || "",
  // },
  {
    field: "insuranceExpiryDate",
    headerName: "Insurance Expiry Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 200,
    valueGetter: (params: any) => params.row.insuranceExpiryDate || "",
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
          updateServiceReq={updateVehicleStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Vehicle"
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
          dispatchSlice={setVehicle}
          editPath={PATH_DASHBOARD.vehicle.list}
          viewPath={PATH_DASHBOARD.vehicle.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
