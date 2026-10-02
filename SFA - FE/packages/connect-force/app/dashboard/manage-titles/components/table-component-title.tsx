import { updateTitleStatus } from "@/service/titles.service";
import ActionCell from "@/components/actions-cell/actionsCell";
import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import { PATH_DASHBOARD } from "@/routes/paths";
import { setTitle } from "@/redux/slices/title-slice";
import { statusSortComparator } from "@/utils/sortUtils";

export const TitleTableHeadings = [
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    minWidth: 300,
  },
  {
    field: "creationDate",
    headerName: "Created Date",
    flex: 1,
    minWidth: 200,
    valueGetter: (params: any) => {
      const date = params.row.creationDate.split("T")[0];
      return date;
    },
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
          updateServiceReq={updateTitleStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Title"
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
          dispatchSlice={setTitle}
          editPath={PATH_DASHBOARD.title.list}
          viewPath={PATH_DASHBOARD.title.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
