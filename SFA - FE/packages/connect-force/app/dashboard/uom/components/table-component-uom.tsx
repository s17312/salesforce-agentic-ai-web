import { setUOM } from "@/redux/slices/uom-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import ActionCell from "@/components/actions-cell/actionsCell";
import { updateUOMStatus } from "@/service/uom.service";
import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import { statusSortComparator } from "@/utils/sortUtils";
import { Chip } from "@mui/material";

export const UOMTableHeadings = [
  {
    field: "uomId",
    headerName: "Code",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.uomId || "",
  },
  {
    field: "shortName",
    headerName: "Name",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.shortName || "",
  },
  {
    field: "description",
    headerName: "Description",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.description || "-",
  },
  {
    field: "isNotBaseUnit",
    headerName: "Base Unit",
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    renderCell: (params: any) => {
      const isNotBaseUnit = params.row.isNotBaseUnit;
      return (
        <Chip
          label={isNotBaseUnit ? "Not base unit" : "Base unit"}
          variant="soft"
          size="small"
          sx={{
            color: isNotBaseUnit ? "green" : "red",
            border: `1px solid ${isNotBaseUnit ? "green" : "red"}`,
            borderRadius: "35px",
          }}
        />
      );
    },
  },
  {
    field: "count",
    headerName: "Ratio",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.count || "-",
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
          featureName="Unit of Measurement"
          row={params.row}
          updateServiceReq={updateUOMStatus}
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
          dispatchSlice={setUOM}
          editPath={PATH_DASHBOARD.uom.list}
          viewPath={PATH_DASHBOARD.uom.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
