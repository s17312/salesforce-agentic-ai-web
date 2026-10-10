"use client";

import React from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Box, IconButton, Tooltip } from "@mui/material";
import { ProductIcon } from "@/assets/icons/distributor-mapper/products";
import MappingCellActive from "@/components/mapping-cell/mappingCellActive";
import MappingCellInactive from "@/components/mapping-cell/mappingCellInactive";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import Link from "next/link";
import { DistributorIcon } from "@/assets/icons/distributor-mapper/distributor";

export const CompanyMapperTableHeadings = [
  {
    field: "companyCode",
    headerName: "Company ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "companyName",
    headerName: "Company Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.companyName || "-",
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
    minWidth: 100,
    sortable: false,
    valueGetter: (params: any) => params.row.hasProducts || "-",
    renderCell: (params: any) => {
      if (params.row.hasProducts) {
        return (
          <MappingCellActive
            row={params.row}
            columnName="Products"
            routePath={`${PATH_DASHBOARD.companyMapper.product}/${params.row.uId}`}
          />
        )
      }
      return (
        <MappingCellInactive
          row={params.row}
          columnName="Products"
          routePath={`${PATH_DASHBOARD.companyMapper.product}/${params.row.uId}`}
        />
      );
    },
  },
  {
    field: "hasDistributor",
    headerName: (
      <React.Fragment>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DistributorIcon />
          Distributor
        </Box>
      </React.Fragment>
    ),
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    minWidth: 100,
    sortable: false,
    valueGetter: (params: any) => params.row.hasDistributor || "-",
    renderCell: (params: any) => {
      if (params.row.hasDistributor) {
        return (
          <MappingCellActive
            row={params.row}
            columnName="Distributor"
            routePath={`${PATH_DASHBOARD.companyMapper.distributor}/${params.row.uId}`}
          />
        )
      }
      return (
        <MappingCellInactive
          row={params.row}
          columnName="Distributor"
          routePath={`${PATH_DASHBOARD.companyMapper.distributor}/${params.row.uId}`}
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
        <Link href={`${PATH_DASHBOARD.companyMapper.view}/${params.row.uId}`}>
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
