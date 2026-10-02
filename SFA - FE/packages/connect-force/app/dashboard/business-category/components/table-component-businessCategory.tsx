"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import SwitchCell from "@/components/switch-cell/switchCell";
import { updateBusinessCatergoryStatus } from "@/service/businessCategory.service";
import { enqueueSnackbar } from "notistack";
import ActionCell from "@/components/actions-cell/actionsCell";
import { setBusinessCategory } from "@/redux/slices/business-category-slice";
import { statusSortComparator } from "@/utils/sortUtils";

export const BusinessCategoryTableHeadings = [
  {
    field: "categoryId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "category",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.category || "",
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
    sortComparator: statusSortComparator('active'),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          row={params.row}
          updateServiceReq={updateBusinessCatergoryStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Business Category"
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
          dispatchSlice={setBusinessCategory}
          editPath={PATH_DASHBOARD.businesscategory.list}
          viewPath={PATH_DASHBOARD.businesscategory.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
