import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setOutletCategory } from "@/redux/slices/outlet-category-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateOutletCategoryStatus } from "@/service/outletCategory.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const OutletCategoryTableHeadings = [
  {
    field: "outletCategoryId",
    headerName: "Code",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "outletCategoryName",
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
          featureName="Outlet Category"
          row={params.row}
          updateServiceReq={updateOutletCategoryStatus}
          enqueueSnackbar={enqueueSnackbar}
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
          dispatchSlice={setOutletCategory}
          editPath={PATH_DASHBOARD.outletCategory.list}
          viewPath={PATH_DASHBOARD.outletCategory.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
