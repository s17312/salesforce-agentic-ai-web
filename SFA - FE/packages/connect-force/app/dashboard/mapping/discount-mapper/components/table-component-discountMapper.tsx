"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import Link from "next/link";

export const DiscountMapperTableHeadings = [
  {
    field: "discountID",
    headerName: "Discount ID",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: "discountName",
    headerName: "Discount Name",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.discountName || "-",
  },
  {
    field: "discountTypeName",
    headerName: "Discount Type",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.discountTypeName || "-",
  },
  {
    field: "valueDiscountTypeName",
    headerName: "Value Discount Type",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 200,
    valueGetter: (params: any) => params.row.valueDiscountTypeName || "-",
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
        <Link href={`${PATH_DASHBOARD.discountMapper.view}/${params.row.uId}`}>
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
