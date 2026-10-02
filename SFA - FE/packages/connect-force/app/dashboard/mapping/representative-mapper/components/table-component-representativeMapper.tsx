"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";

export const RepresentativeMapperTableHeadings = [
  {
    field: "representativeID",
    headerName: "Representative ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "name",
    headerName: "Representative Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.name || "-",
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.email || "-",
  },
  {
    field: "distributor.distributorName",
    headerName: "Distributor Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) =>
      params.row.distributor?.distributorName || "-",
  },
  {
    field: "actions",
    headerName: "Actions",
    headerAlign: "center",
    align: "center",
    sortable: false,
    flex: 1,
    disableColumnMenu: true,
    minWidth: 60,
    renderCell: (params: any) => {
      return (
        <Link
          href={`${PATH_DASHBOARD.representativeMapper.view}/${params.row.uId}`}
        >
          <Tooltip title={"View"}>
            <IconButton>
              <VisibilityIcon
                fontSize="small"
                sx={{ color: tableIconColors.visibilityIcon }}
              />
            </IconButton>
          </Tooltip>
        </Link>
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],
};
