import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import ActionCell from "@/components/actions-cell/actionsCell";
import { statusSortComparator } from "@/utils/sortUtils";
import { setCompany } from "@/redux/slices/company-slice";
import { PATH_DASHBOARD } from "@/routes/paths";
import { updateCompanyStatus } from "@/service/company.service";

export const CompanyTableHeadings = [
  {
    field: "companyId",
    headerName: "Code",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "companyName",
    headerName: "Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "legalEntryType.legalEntryTypeName",
    headerName: "Legal Entity Type",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 150,
    valueGetter: (params: any) =>
      params.row.legalEntryType?.legalEntryTypeName || "",
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
          updateServiceReq={updateCompanyStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Company"
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
          dispatchSlice={setCompany}
          editPath={PATH_DASHBOARD.company.list}
          viewPath={PATH_DASHBOARD.company.view}
        />
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
