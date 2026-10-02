import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setPriceListType } from "@/redux/slices/price-list-type-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updatePriceListTypeStatus } from "@/service/mapping-service/priceListType.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const PriceListTypeTableHeadings = [
  {
    field: "priceListTypeId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "priceListTypeName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.priceListTypeName || "",
  },
  {
    field: "priceType.name",
    headerName: "Price Type",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.priceType?.name || "",
  },
  {
    field: "priceListTypeDescription",
    headerName: "Description",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.priceListTypeDescription || "",
  },
  {
    field: "active",
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
          updateServiceReq={updatePriceListTypeStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Price List Type"
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
          dispatchSlice={setPriceListType}
          editPath={PATH_DASHBOARD.priceListType.list}
          viewPath={PATH_DASHBOARD.priceListType.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
