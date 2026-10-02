import { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import { SimpleStatusChip } from "./statusChip";
import dayjs from "dayjs";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

export const AdjustViewColumns = (): GridColDef[] => [
  {
    field: "stockTransferId",
    headerName: "Transfer Id",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "distributorName",
    headerName: "Distributor",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "stockTransferDate",
    headerName: "Transfer Date",
    flex: 1,
    renderCell: (params) => {
      const formattedDate = dayjs(params.value).format("YYYY-MM-DD");
      return <span>{formattedDate}</span>;
    },
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "fromWarehouseName",
    headerName: "From Warehouse",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "recivingWarehouseName",
    headerName: "Receiving Warehouse",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "totalVolume",
    headerName: "Total Volume",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      return params.row.totalVolume
        ? `${formatVolume3Decimals(Number(params.row.totalVolume))}`
        : "-";
    },
  },
  {
    field: "totalValue",
    headerName: "Total Value",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      return params.row.totalValue
        ? `${formatCurrency(Number(params.row.totalValue))}`
        : "-";
    },
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => <SimpleStatusChip status={params.value} />,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "Action",
    width: 100,
    headerAlign: "center",
    align: "left",
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const { status } = params.row;
      return (
        <>
          <Link
            href={`${PATH_DASHBOARD.distributorStock.distributorWarehouseStockTransfer.view}/${params.row.uId}`}
          >
            <IconButton size="small">
              <VisibilityIcon
                fontSize="small"
                sx={{ color: tableIconColors.visibilityIcon }}
              />
            </IconButton>
          </Link>
          {status !== 1 && (
            <>
              <Link
                href={`${PATH_DASHBOARD.distributorStock.distributorWarehouseStockTransfer.edit}/${params.row.uId}`}
              >
                <IconButton size="small">
                  <EditIcon
                    fontSize="small"
                    sx={{ color: tableIconColors.editIconColor }}
                  />
                </IconButton>
              </Link>
            </>
          )}
        </>
      );
    },
  },
];
