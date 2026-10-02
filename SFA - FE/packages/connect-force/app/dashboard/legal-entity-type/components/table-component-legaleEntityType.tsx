import ActionCell from "@/components/actions-cell/actionsCell";
import { enqueueSnackbar } from "@/components/snackbar";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setLegleEntityType } from "@/redux/slices/legle-entity-type-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateLegleEntityTypeStatus } from "@/service/legleEntityType.service";
import { statusSortComparator } from "@/utils/sortUtils";

export const LegleEntityTypeTableHeadings = [
  {
    field: "legalEntryTypeId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "legalEntryTypeName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.legalEntryTypeName || "",
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 255,
    valueGetter: (params: any) => params.row.description || "-",
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
          updateServiceReq={updateLegleEntityTypeStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Legal Entity Type"
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
          dispatchSlice={setLegleEntityType}
          editPath={PATH_DASHBOARD.legleEntityType.list}
          viewPath={PATH_DASHBOARD.legleEntityType.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
