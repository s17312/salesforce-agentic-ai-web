import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setSalesRepresentative } from "@/redux/slices/sales-representative-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateSalesRepresentativeStatus } from "@/service/salesRepresentative.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const SalesRepresentativeTableHeadings = [
  {
    field: "representativeID",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.name || "",
  },
  {
    field: "contactNo",
    headerName: "Phone Number",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.contactNo || "",
  },
  {
    field: "email",
    headerName: "Email Address",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.email || "",
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
          updateServiceReq={updateSalesRepresentativeStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Sales Representative"
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
          dispatchSlice={setSalesRepresentative}
          editPath={PATH_DASHBOARD.salesRepresentative.list}
          viewPath={PATH_DASHBOARD.salesRepresentative.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
