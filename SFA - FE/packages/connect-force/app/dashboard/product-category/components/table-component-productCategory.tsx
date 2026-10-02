"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import ActionCell from "@/components/actions-cell/actionsCell";
import { setProductCategory } from "@/redux/slices/product-category-slice";
import { enqueueSnackbar } from "notistack";
import { updateProductCategoryStatus } from "@/service/productCategory.service";
import SwitchCell from "@/components/switch-cell/switchCell";
import { statusSortComparator } from "@/utils/sortUtils";

export const ProductCategoryTableHeadings = [
  {
    field: "categoryId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "categoryName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.categoryName || "",
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 255,
    valueGetter: (params: any) => params.row.description || "",
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
          updateServiceReq={updateProductCategoryStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Product Category"
        />
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    headerAlign: "center",
    align: "center",
    sortable: false,
    flex: 1,
    disableColumnMenu: true,
    minWidth: 130,
    renderCell: (params: any) => {
      return (
        <ActionCell
          row={params.row}
          dispatchSlice={setProductCategory}
          editPath={PATH_DASHBOARD.productCategory.list}
          viewPath={PATH_DASHBOARD.productCategory.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
