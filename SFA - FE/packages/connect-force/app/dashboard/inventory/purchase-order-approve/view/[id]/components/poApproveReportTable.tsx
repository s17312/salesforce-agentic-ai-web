import { generateCSVWithHeader } from "@/utils/reports/reportUtils";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import PrintIcon from "@mui/icons-material/Print";
import TableViewIcon from "@mui/icons-material/TableView";
import { DataGrid } from "@mui/x-data-grid";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { POApproveReportTableHeadings, tableOptions } from "./table-header-po-approve";

interface POReportTableProps {
  rowsWithTotal: any[];
  isLoading: boolean;
  fileName: string;
  setOpen?: any;
  poApproveReportInfo?: any;
  expand: boolean;
}

const POApproveReportTable: React.FC<POReportTableProps> = ({
  rowsWithTotal,
  isLoading,
  fileName,
  setOpen,
  poApproveReportInfo,
  expand,
}) => {
  const theme = useTheme();

  const handlePrint = () => {
    if (setOpen) {
      setOpen(true);
    }
  };

  const handleDownloadCSV = () => {
    if (poApproveReportInfo && rowsWithTotal && fileName) {
      generateCSVWithHeader(poApproveReportInfo, rowsWithTotal, fileName);
    } else {
      enqueueSnackbar("CSV download failed due to missing data", {
        variant: "error",
      });
    }
  };

  return (
    <Card sx={{ backgroundColor: "#fff" }}>
      <CardContent>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
              }}
            >
              PO Approve Report
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handlePrint}>
                <PrintIcon sx={{ color: theme.palette.primary.main }} />
              </IconButton>
              <IconButton
                onClick={handleDownloadCSV}
                sx={{ color: theme.palette.primary.main }}
              >
                <TableViewIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 1 }} />
        </Box>
        <DataGrid
          sx={{
            height: expand ? "40vh" : "60vh",
            padding: "0px",
            boxShadow: "none",
            background: "unset",
            overflowY: "auto",
            "& .grand-total-row": {
              backgroundColor: "#DBD4F0 !important",
              fontWeight: "bold !important",
            },
            "& .subtotal-row": {
              backgroundColor: "rgb(225, 212, 250, 0.4) !important",
            },
          }}
          getRowId={(row) => row.id}
          rows={rowsWithTotal}
          columns={getColumnsWithTooltip(POApproveReportTableHeadings)}
          loading={isLoading}
          pageSizeOptions={tableOptions.rowsPerPageOptions}
          density="compact"
          getRowClassName={
            (params) => (params.row.isTotal ? "total-row" : "")
          }
          disableRowSelectionOnClick
          rowCount={rowsWithTotal.length - 1}
          pagination
          paginationMode="server"
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: QuickSearchToolbar,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default POApproveReportTable;
