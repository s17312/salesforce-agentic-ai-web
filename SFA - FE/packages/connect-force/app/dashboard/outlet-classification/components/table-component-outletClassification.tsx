import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { setOutletClassification } from "@/redux/slices/outlet-classification-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { dispatch } from "@/redux/store";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { updateOutletClassificationStatus } from "@/service/outletClassification.service";
import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import { statusSortComparator } from "@/utils/sortUtils";
import ActionCell from "@/components/actions-cell/actionsCell";

export const OutletClassificationTableHeadings = [
  {
    field: "classificationID",
    headerName: "Code",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "classification",
    headerName: "Name",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
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
    headerAlign: "center",
    align: "center",
    minWidth: 70,
    sortComparator: statusSortComparator("active"),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          featureName="Outlet Classification"
          row={params.row}
          updateServiceReq={updateOutletClassificationStatus}
          enqueueSnackbar={enqueueSnackbar}
        />
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    sortable: false,
    flex: 1,
    minWidth: 130,
    renderCell: (params: any) => {
      return (
        <ActionCell
          row={params.row}
          dispatchSlice={setOutletClassification}
          editPath={PATH_DASHBOARD.outletClassification.list}
          viewPath={PATH_DASHBOARD.outletClassification.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
