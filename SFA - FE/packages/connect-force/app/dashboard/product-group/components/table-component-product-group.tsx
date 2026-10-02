import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setProductGroup } from "@/redux/slices/product-group-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateProductGroupStatus } from "@/service/productGroup.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const productGroupTableHeadings = [
  {
    field: "productGroupId",
    headerName: "Code",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "productGroupName",
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
    sortable: true,
    sortComparator: statusSortComparator("active"),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          featureName="Product Group"
          row={params.row}
          updateServiceReq={updateProductGroupStatus}
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
          dispatchSlice={setProductGroup}
          editPath={PATH_DASHBOARD.productGroup.list}
          viewPath={PATH_DASHBOARD.productGroup.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
