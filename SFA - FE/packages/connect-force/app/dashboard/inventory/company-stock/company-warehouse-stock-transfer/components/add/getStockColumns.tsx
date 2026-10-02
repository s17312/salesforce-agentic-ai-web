import { GridColDef } from "@mui/x-data-grid";
import { Tooltip, IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

export const getStockColumns = (
  handleDelete: (id: number) => void
): GridColDef[] => [
  {
    field: "productID",
    headerName: "Product ID",
    width: 80,
    sortable: false,
    flex: 1,
  },
  {
    field: "productName",
    headerName: "Product Name",
    width: 120,
    flex: 1,
    sortable: false,
  },
  {
    field: "availableStock",
    headerName: "Available Stock",
    width: 150,
    sortable: false,
    headerAlign: "right",
    align: "right",
  },
  {
    field: "mrp",
    headerName: "MRP",
    width: 110,
    headerAlign: "right",
    align: "right",
    sortable: false,
    renderCell: (params: any) => {
      const formattedValue = params.value.toFixed(2);
      return (
        <Tooltip title={formattedValue} arrow slotProps={tooltipSlotProps}>
          <span>{formattedValue}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "stockUpdate",
    headerName: "Stock Update",
    width: 150,
    headerAlign: "right",
    align: "right",
    sortable: false,
    renderCell: (params: any) => (
      <Tooltip
        title={
          params.row.action === "increment"
            ? `${params.value}`
            : `${params.value}`
        }
        arrow
        slotProps={tooltipSlotProps}
      >
        <span
          style={{
            color: params.row.action === "increment" ? "green" : "green",
          }}
        >
          {params.row.action === "increment"
            ? `+${params.value}`
            : `${params.value}`}
        </span>
      </Tooltip>
    ),
  },
  {
    field: "volume",
    headerName: "Volume",
    width: 150,
    headerAlign: "right",
    align: "right",
    sortable: false,
    renderCell: (params: any) => {
      const formattedValue = formatVolume3Decimals(params.value);
      return (
        <Tooltip
          title={
            params.row.action === "increment"
              ? `${formattedValue}`
              : `${formattedValue}`
          }
          arrow
          slotProps={tooltipSlotProps}
        >
          <span
            style={{
              color: params.row.action === "increment" ? "green" : "green",
            }}
          >
            {params.row.action === "increment"
              ? `+${formattedValue}`
              : `${formattedValue}`}
          </span>
        </Tooltip>
      );
    },
  },
  {
    field: "value",
    headerName: "Value",
    width: 120,
    headerAlign: "right",
    align: "right",
    sortable: false,
    renderCell: (params: any) => {
      const formattedValue = formatCurrency(params.value);
      return (
        <Tooltip
          title={
            params.row.action === "increment"
              ? `${formattedValue}`
              : `${formattedValue}`
          }
          arrow
          slotProps={tooltipSlotProps}
        >
          <span
            style={{
              color: params.row.action === "increment" ? "green" : "green",
            }}
          >
            {params.row.action === "increment"
              ? `+${formattedValue}`
              : `${formattedValue}`}
          </span>
        </Tooltip>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    headerAlign: "center",
    align: "center",
    sortable: false,
    renderCell: (params: any) => (
      <IconButton
        size="small"
        sx={{ color: "red" }}
        onClick={() => handleDelete(params.row.id)}
      >
        <DeleteOutlineIcon />
      </IconButton>
    ),
  },
];
