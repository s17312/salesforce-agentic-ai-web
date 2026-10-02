import { generateCSVWithHeader } from "@/utils/reports/reportUtils";
import {
  Alert,
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
import { POGRNSummaryTableHeadings, tableOptions } from "./table-header-po-grn";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useMemo } from "react";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

interface POGRNReportTableProps {
  rowsWithTotal: any[];
  isLoading: boolean;
  isSearchClicked: boolean;
  fileName: string;
  setOpen?: any;
  poGRNReportInfo?: any;
  expand: boolean;
  selectedSummaryValue: string;
}

const POGRNReportTable: React.FC<POGRNReportTableProps> = ({
  rowsWithTotal,
  isLoading,
  isSearchClicked,
  fileName,
  setOpen,
  poGRNReportInfo,
  expand,
  selectedSummaryValue,
}) => {
  const theme = useTheme();

  const handlePrint = () => {
    if (setOpen) {
      setOpen(true);
    }
  };

  const handleDownloadCSV = () => {
    if (poGRNReportInfo && rowsWithTotal && fileName) {
      generateCSVWithHeader(poGRNReportInfo, rowsWithTotal, fileName);
    } else {
      enqueueSnackbar("CSV download failed due to missing data", {
        variant: "error",
      });
    }
  };

  const tableHeadings = useMemo(() => {
    if (selectedSummaryValue === "Summary") {
      // remove poNo column
      return POGRNSummaryTableHeadings.filter((col) => col.field !== "poNo");
    }
    return POGRNSummaryTableHeadings;
  }, [selectedSummaryValue]);

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rowsWithTotal, tableHeadings);

  const isFiltered =
    searchQuery.trim() !== "" ||
    Object.values(selectedStatus).some((val) => val !== "All");

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
              PO GRN Summary Report
            </Typography>
            {isSearchClicked && (
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
            )}
          </Box>
          <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 1 }} />
        </Box>
        {!isSearchClicked ? (
          <Alert severity="info">
            Please click the search button to display the table
          </Alert>
        ) : (
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
            rows={isFiltered ? searchedRows : rowsWithTotal}
            columns={getColumnsWithTooltip(tableHeadings)}
            loading={isLoading}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            density="compact"
            getRowClassName={(params) =>
              // params.row.isTotal ? "total-row" : ""
              {
                if (params.row.id === "grand-total") return "grand-total-row";
                if (params.row.id.startsWith("subtotal-"))
                  return "subtotal-row";
                return "";
              }
            }
            disableRowSelectionOnClick
            rowCount={
              isFiltered && searchedRows.length > 0
                ? searchedRows.length
                : rowsWithTotal.length - 1
            }
            pagination
            paginationMode={
              isFiltered && searchedRows.length > 0 ? "client" : "server"
            }
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  columns={tableHeadings}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  menuItem={{
                    field: "searchColumn",
                    headerName: "Search By",
                  }}
                />
              ),
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default POGRNReportTable;
