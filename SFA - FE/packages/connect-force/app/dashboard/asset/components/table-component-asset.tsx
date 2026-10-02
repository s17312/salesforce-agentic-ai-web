import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setAsset } from "@/redux/slices/asset-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateAssetStatus } from "@/service/asset.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

export const AssetTableHeadings = [
  {
    field: "assetId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "assetName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.assetName || "",
  },
  {
    field: "assetType.assetTypeName",
    headerName: "Asset Type",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) =>  params.row.assetType?.assetTypeName || "",
  },
  {
    field: "assetBrand.assetBrandName",
    headerName: "Asset Brand",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.assetBrand?.assetBrandName || "",
  },
  {
    field: "assetModel.assetModelName",
    headerName: "Asset Model",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.assetModel?.assetModelName || "",
  },
  {
    field: "serialNumber",
    headerName: "Serial Number",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.serialNumber || "",
  },
  {
    field: "purchaseDate",
    headerName: "Purchase Date",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) => params.row.purchaseDate || "",
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
          updateServiceReq={updateAssetStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Asset"
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
          dispatchSlice={setAsset}
          editPath={PATH_DASHBOARD.asset.list}
          viewPath={PATH_DASHBOARD.asset.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
