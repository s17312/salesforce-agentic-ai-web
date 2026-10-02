import {
  Box,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { SimpleStatusChip } from "./statusChip";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import Link from "next/link";
import { PATH_DASHBOARD } from "@/routes/paths";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

export const AdjustViewColumns = (props: {
  handleDelete: (id: number) => void;
  theme: any;
}): GridColDef[] => [
  {
    field: "stockAdjustmentNo",
    headerName: "Adjustment Id",
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
    field: "wareHouseName",
    headerName: "Warehouse",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "batchID",
    headerName: "Batch ID",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "refID",
    headerName: "Ref ID",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
  },

  {
    field: "totalQuantity",
    headerName: "Total Quantity",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => {
      const { totalPlusQuantity, totalMinusQuantity } = params.row;
      return (
        <Box>
          <Grid container spacing={0.5} direction="column">
            <Grid item>
              <Typography
                sx={{
                  color: props.theme.palette.success.dark,
                  display: "flex",
                  justifyContent: "right",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >{`+${totalPlusQuantity}`}</Typography>
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  color: props.theme.palette.error.main,
                  display: "flex",
                  justifyContent: "right",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >{`${totalMinusQuantity}`}</Typography>
            </Grid>
          </Grid>
        </Box>
      );
    },
  },

  {
    field: "totalVolume",
    headerName: "Total Volume",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => {
      const { totalPlusVolume, totalMinusVolume } = params.row;
      return (
        <Box>
          <Grid container spacing={0.5} direction="column">
            <Grid item>
              <Typography
                sx={{
                  color: props.theme.palette.success.dark,
                  display: "flex",
                  justifyContent: "right",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >{`+${formatVolume3Decimals(totalPlusVolume)}`}</Typography>
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  color: props.theme.palette.error.main,
                  display: "flex",
                  justifyContent: "right",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >{`${formatVolume3Decimals(totalMinusVolume)}`}</Typography>
            </Grid>
          </Grid>
        </Box>
      );
    },
  },

  {
    field: "totalValue",
    headerName: "Total Value",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => {
      const { totalPlusValue, totalMinusValue } = params.row;
      return (
        <Box>
          <Grid container spacing={0.5} direction="column">
            <Grid item>
              <Typography
                sx={{
                  color: props.theme.palette.success.dark,
                  display: "flex",
                  justifyContent: "right",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >{`+${formatCurrency(totalPlusValue)}`}</Typography>
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  color: props.theme.palette.error.main,
                  display: "flex",
                  justifyContent: "right",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >{`${formatCurrency(totalMinusValue)}`}</Typography>
            </Grid>
          </Grid>
        </Box>
      );
    },
  },
  {
    field: "createdRemark",
    headerName: "Remark",
    flex: 1,
    sortable: false,
    align: "right",
    headerAlign: "right",
    disableColumnMenu: true,
    renderCell(params) {
      if (!params.value) {
        return null;
      }
      return (
        <Tooltip
          title={params.value}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
        >
          <Chip label={params.value} size="small" variant="outlined" />
        </Tooltip>
      );
    },
  },
  {
    field: "statusName",
    headerName: "Status",
    headerAlign: "center",
    align: "center",
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
      const { statusName } = params.row;
      return (
        <>
          <Link
            href={`${PATH_DASHBOARD.distributorStock.adjustmentView}/${params.row.stockAdjustmentHeaderId}`}
          >
            <IconButton
              size="small"
              // onClick={() => props.handleView(params.row.id)}
            >
              <VisibilityIcon
                fontSize="small"
                sx={{ color: tableIconColors.visibilityIcon }}
              />
            </IconButton>
          </Link>
          {statusName !== "Submitted" && statusName !== "Deleted" && (
            <>
              <Link
                href={`${PATH_DASHBOARD.distributorStock.edit}/${params.row.stockAdjustmentHeaderId}`}
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
                  props.handleDelete(params.row.stockAdjustmentHeaderId)
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
