"use client";

import React from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { OutletIcon } from "@/assets/icons/distributor-mapper/outlet";
import { Box, IconButton, Tooltip } from "@mui/material";
import { SalesRepIcon } from "@/assets/icons/distributor-mapper/sales-rep";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import Link from "next/link";
import { LinkGreenIcon } from "@/assets/icons/distributor-mapper/link-green";
import MappingCellActive from "@/components/mapping-cell/mappingCellActive";
import MappingCellInactive from "@/components/mapping-cell/mappingCellInactive";

export const RouteMapperTableHeadings = [
  {
    field: "routeId",
    headerName: "Route ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "routeName",
    headerName: "Route Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
  },
  {
    field: "hasOutlets",
    headerName: (
      <React.Fragment>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <OutletIcon />
          Outlet
        </Box>
      </React.Fragment>
    ),
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    minWidth: 50,
    maxWidth: 130,
    sortable: false,
    valueGetter: (params: any) => params.row.hasOutlets || "-",
    renderCell: (params: any) => {
      if (params.row.hasOutlets) {
        return (
          <MappingCellActive
            row={params.row}
            columnName="Outlets"
            routePath={`${PATH_DASHBOARD.routeMapper.outlet}/${params.row.uId}`}
          />
        );
      }
      return (
        <MappingCellInactive
          row={params.row}
          columnName="Outlets"
          routePath={`${PATH_DASHBOARD.routeMapper.outlet}/${params.row.uId}`}
        />
      );
    },
  },
  {
    field: "hasReps",
    headerName: (
      <React.Fragment>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SalesRepIcon />
          Sales Rep
        </Box>
      </React.Fragment>
    ),
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    minWidth: 50,
    maxWidth: 130,
    sortable: false,
    valueGetter: (params: any) => params.row.hasReps || "-",
    renderCell: (params: any) => {
      if (params.row.hasReps) {
        return (
          <MappingCellActive
            row={params.row}
            columnName="Sales representatives"
            routePath={`${PATH_DASHBOARD.routeMapper.salesrep}/${params.row.uId}`}
          />
        );
      }
      return (
        <MappingCellInactive
          row={params.row}
          columnName="Sales representatives"
          routePath={`${PATH_DASHBOARD.routeMapper.salesrep}/${params.row.uId}`}
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
    minWidth: 60,
    renderCell: (params: any) => {
      return (
        <Link href={`${PATH_DASHBOARD.routeMapper.view}/${params.row.uId}`}>
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
