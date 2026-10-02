import { updateDistributorStatus } from "@/service/distributor.service";
import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import ActionCell from "@/components/actions-cell/actionsCell";
import { PATH_DASHBOARD } from "@/routes/paths";
import { setDistributor } from "@/redux/slices/distributor-slice";
import { statusSortComparator } from "@/utils/sortUtils";

export const DistributorTableHeadings = [
  {
    field: "distributorID",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "distributorName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "district.name_en",
    headerName: "District",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 150,
    valueGetter: (params: any) => params.row.district.name_en || "-",
  },
  {
    field: "city.name_en",
    headerName: "City",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.city.name_en || "-",
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "businessCategory.category",
    headerName: "Business Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 150,
    valueGetter: (params: any) => params.row.businessCategory?.category || "-",
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
          updateServiceReq={updateDistributorStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Distributor"
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
          dispatchSlice={setDistributor}
          editPath={PATH_DASHBOARD.distributor.list}
          viewPath={PATH_DASHBOARD.distributor.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
