import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setAssetType } from "@/redux/slices/asset-type-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateAssetTypeStatus } from "@/service/assetType.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const AssetTypeTableHeadings = [
  {
    field: "assetTypeId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "assetTypeName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.assetTypeName || "",
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
          updateServiceReq={updateAssetTypeStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Asset Type"
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
          dispatchSlice={setAssetType}
          editPath={PATH_DASHBOARD.assetType.list}
          viewPath={PATH_DASHBOARD.assetType.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
