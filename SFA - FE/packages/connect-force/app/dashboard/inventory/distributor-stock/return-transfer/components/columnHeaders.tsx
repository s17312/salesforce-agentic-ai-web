import { PATH_DASHBOARD } from "@/routes/paths";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import Link from "next/link";
import { SimpleStatusChip } from "../../adjustment-view/components/statusChip";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

export const StockReturnTransferColumns = (props: {
  handleDelete: (id: number) => void;
}): GridColDef[] => [
  {
    field: "stockReturnNo",
    headerName: "STID",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params: any) => params.row.stockReturnNo || "",
  },
  {
    field: "stockReturnDate",
    headerName: "Date",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const date = params.row.stockReturnDate;
      return date ? format(new Date(date), dateFormat) : "-";
    },
  },
  {
    field: "distributorName",
    headerName: "Distributor",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "wareHouseName",
    headerName: "Warehouse",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "totalQuantity",
    headerName: "Total Transferred Stock",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
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
    field: "statusName",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => <SimpleStatusChip status={params.value} />,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "Action",
    width: 130,
    headerAlign: "center",
    align: "left",
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const { statusName } = params.row;
      return (
        <>
          <Link
            href={`${PATH_DASHBOARD.distributorStock.stockReturnTransfer.view}/${params.row.stockReturnHeaderId}`}
          >
            <IconButton size="small">
              <VisibilityIcon
                fontSize="small"
                sx={{ color: tableIconColors.visibilityIcon }}
              />
            </IconButton>
          </Link>
          {statusName !== "Submitted" && statusName !== "Deleted" && (
            <>
              <Link
                href={`${PATH_DASHBOARD.distributorStock.stockReturnTransfer.edit}/${params.row.stockReturnHeaderId}`}
              >
                <IconButton size="small">
                  <EditIcon
                    fontSize="small"
                    sx={{ color: tableIconColors.editIconColor }}
                  />
                </IconButton>
              </Link>

              <IconButton
                size="small"
                onClick={() =>
                  props.handleDelete(params.row.stockReturnHeaderId)
                }
              >
                <DeleteIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.deleteIcon }}
                />
              </IconButton>
            </>
          )}
        </>
      );
    },
  },
];
