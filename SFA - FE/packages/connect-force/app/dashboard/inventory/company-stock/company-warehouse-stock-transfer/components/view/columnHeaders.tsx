import { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import { format } from "date-fns";
import { SimpleStatusChip } from "@/app/dashboard/inventory/distributor-stock/distributor-warehouse-stock-transfer/components/view/statusChip";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

export const AdjustViewColumns = (): GridColDef[] => [
  {
    field: "stockTransferId",
    headerName: "Transfer Id",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "companyName",
    headerName: "Company Name",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "stockTransferDate",
    headerName: "Transfer Date",
    flex: 1,
    valueGetter: (params) => {
      const formattedDate = params.value;
      return formattedDate ? format(new Date(formattedDate), dateFormat) : "-";
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
    width: 120,
    headerAlign: "center",
    align: "left",
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const { status } = params.row;
      return (
        <>
          <Link
            href={`${PATH_DASHBOARD.companyStock.companyWarehouseStockTransfer.view}/${params.row.uId}`}
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
                href={`${PATH_DASHBOARD.companyStock.companyWarehouseStockTransfer.edit}/${params.row.uId}`}
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
