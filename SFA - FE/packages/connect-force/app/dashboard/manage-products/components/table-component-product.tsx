import { updateProductStatus } from "@/service/product.service";
import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import ActionCell from "@/components/actions-cell/actionsCell";
import { PATH_DASHBOARD } from "@/routes/paths";
import { setProduct } from "@/redux/slices/product-slice";
import { statusSortComparator } from "@/utils/sortUtils";

export const ProductTableHeadings = [
  {
    field: "productID",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "productName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "productGroupName",
    headerName: "Product Group",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 150,
    valueGetter: (params: any) =>
      params.row.productGroupName ||
      params.row.productGroup?.productGroupName ||
      "",
  },
  {
    field: "productCategoryName",
    headerName: "Product Category",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) =>
      params.row.productCategoryName ||
      params.row.productCategory.categoryName ||
      "",
  },
  {
    field: "uomShortName",
    headerName: "Measurement",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    valueGetter: (params: any) =>
      `${params.row.qty || 0} ${params.row.uomShortName || ""}`,
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
          updateServiceReq={updateProductStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Product"
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
          dispatchSlice={setProduct}
          editPath={PATH_DASHBOARD.product.list}
          viewPath={PATH_DASHBOARD.product.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
