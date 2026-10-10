"use client";

import React from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { OutletIcon } from "@/assets/icons/distributor-mapper/outlet";
import { Box, IconButton, Tooltip } from "@mui/material";
import { ProductIcon } from "@/assets/icons/distributor-mapper/products";
import { RouteIcon } from "@/assets/icons/distributor-mapper/route";
import { SalesRepIcon } from "@/assets/icons/distributor-mapper/sales-rep";
import MappingCellActive from "@/components/mapping-cell/mappingCellActive";
import MappingCellInactive from "@/components/mapping-cell/mappingCellInactive";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import Link from "next/link";
import { CompanyIcon } from "@/assets/icons/distributor-mapper/company";

export const DistributorMapperTableHeadings = [
  {
    field: "distributorCode",
    headerName: "Distributor ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "distributorName",
    headerName: "Distributor Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.distributorName || "-",
  },
  {
    field: "hasProducts",
    headerName: (
      <React.Fragment>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ProductIcon />
          Product
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
    valueGetter: (params: any) => params.row.hasProducts || "-",
    renderCell: (params: any) => {
      if (params.row.hasProducts) {
        return (
          <MappingCellActive
            row={params.row}
            columnName="Products"
            routePath={`${PATH_DASHBOARD.distributorMapper.product}/${params.row.uId}`}
          />
        );
      }
      return (
        <MappingCellInactive
          row={params.row}
          columnName="Products"
          routePath={`${PATH_DASHBOARD.distributorMapper.product}/${params.row.uId}`}
        />
      );
    },
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
            routePath={`${PATH_DASHBOARD.distributorMapper.outlet}/${params.row.uId}`}
          />
        );
      }
      return (
        <MappingCellInactive
          row={params.row}
          columnName="Outlets"
          routePath={`${PATH_DASHBOARD.distributorMapper.outlet}/${params.row.uId}`}
        />
      );
    },
  },
  {
    field: "hasRoutes",
    headerName: (
      <React.Fragment>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <RouteIcon />
          Route
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
    valueGetter: (params: any) => params.row.hasRoutes || "-",
    renderCell: (params: any) => {
      if (params.row.hasRoutes) {
        return (
          <MappingCellActive
            row={params.row}
            columnName="Routes"
            routePath={`${PATH_DASHBOARD.distributorMapper.route}/${params.row.uId}`}
          />
        );
      }
      return (
        <MappingCellInactive
          row={params.row}
          columnName="Routes"
          routePath={`${PATH_DASHBOARD.distributorMapper.route}/${params.row.uId}`}
        />
      );
    },
  },
  {
    field: "hasRepresentatives",
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
    valueGetter: (params: any) => params.row.hasRepresentatives || "-",
    renderCell: (params: any) => {
      if (params.row.hasRepresentatives) {
        return (
          <MappingCellActive
            row={params.row}
            columnName="Representatives"
            routePath={`${PATH_DASHBOARD.distributorMapper.representative}/${params.row.uId}`}
          />
        );
      }
      return (
        <MappingCellInactive
          row={params.row}
          columnName="Representatives"
          routePath={`${PATH_DASHBOARD.distributorMapper.representative}/${params.row.uId}`}
        />
      );
    },
  },
  {
    field: "hasCompanies",
    headerName: (
      <React.Fragment>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CompanyIcon />
          Company
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
    valueGetter: (params: any) => params.row.hasCompanies || "-",
    renderCell: (params: any) => {
      if (params.row.hasCompanies) {
        return (
          <MappingCellActive
            row={params.row}
            columnName="Companies"
            routePath={`${PATH_DASHBOARD.distributorMapper.company}/${params.row.uId}`}
          />
        );
      }
      return (
        <MappingCellInactive
          row={params.row}
          columnName="Companies"
          routePath={`${PATH_DASHBOARD.distributorMapper.company}/${params.row.uId}`}
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
        <Link
          href={`${PATH_DASHBOARD.distributorMapper.view}/${params.row.uId}`}
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
