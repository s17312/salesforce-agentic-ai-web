import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setVehicleCategory } from "@/redux/slices/vehicle-category-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { UpdateDiscountStatus } from "@/service/Discount/discount.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { enqueueSnackbar } from "notistack";

export const discountTableHeadings = [
  {
    field: "discountID",
    headerName: "DiscountId",
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
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
  },
  {
    field: "discountType.discountTypeName",
    headerName: "Discount Type",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.discountType?.discountTypeName || "",
  },
  {
    field:"company.companyName",
    headerName: "Company",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.company?.companyName || "",
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
          updateServiceReq={UpdateDiscountStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Discount"
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
          dispatchSlice={setVehicleCategory}
          editPath={PATH_DASHBOARD.discount.list}
          viewPath={PATH_DASHBOARD.discount.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
