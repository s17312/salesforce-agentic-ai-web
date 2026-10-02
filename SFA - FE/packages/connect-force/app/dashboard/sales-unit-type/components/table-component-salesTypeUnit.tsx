import ActionCell from "@/components/actions-cell/actionsCell";
import SwitchCell from "@/components/switch-cell/switchCell";
import { setSalesUnitType } from "@/redux/slices/sales-unit-type-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateSalesUnitTypeStatus } from "@/service/salesUnitType.service";
import { statusSortComparator } from "@/utils/sortUtils";
import { Chip, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";

export const SalesUnitTypeTableHeadings = [
  {
    field: "unitId",
    headerName: "Code",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.unitId || "",
  },
  {
    field: "unitName",
    headerName: "Name",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.unitName || "",
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
    field: "isBaseUnit",
    headerName: "Base Unit",
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    renderCell: (params: any) => {
      const { isBaseUnit, baseUnitName } = params.row;
      return isBaseUnit ? (
        <Chip
          label="Base unit"
          variant="soft"
          size="small"
          sx={{
            color: "red",
            border: "1px solid red",
            borderRadius: "35px",
          }}
        />
      ) : (
        baseUnitName || "No Base Unit"
      );
    },
  },
  {
    field: "ratio",
    headerName: "Quantity",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.ratio || "-",
  },
  {
    field: "totQty",
    headerName: "Total Quantity",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    valueGetter: (params: any) => params.row.totQty || "-",
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
          featureName="Sales Unit Type"
          row={params.row}
          updateServiceReq={updateSalesUnitTypeStatus}
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
          dispatchSlice={setSalesUnitType}
          editPath={PATH_DASHBOARD.salesUnitType.list}
          viewPath={PATH_DASHBOARD.salesUnitType.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
