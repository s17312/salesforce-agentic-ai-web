import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setAssetModel } from "@/redux/slices/asset-model-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateAssetModelStatus } from "@/service/assetModel.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const AssetModelTableHeadings = [
  {
    field: "assetModelId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "assetModelName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.assetModelName || "",
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
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    sortComparator: statusSortComparator("active"),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          row={params.row}
          updateServiceReq={updateAssetModelStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Asset Model"
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
          dispatchSlice={setAssetModel}
          editPath={PATH_DASHBOARD.assetModel.list}
          viewPath={PATH_DASHBOARD.assetModel.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
