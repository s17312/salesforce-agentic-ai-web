import { generateCSVWithHeader } from "@/utils/reports/reportUtils";
import {
  Alert,
  Box,
  Button,
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
import {
  AnnualSaleSummaryReportTableHeadings,
  tableOptions,
} from "./table-header-annual-summary-report";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import QuickSearchToolbar from "@/components/data-grid/search-filter";

interface AnnualSaleSummaryReportTableProps {
  rowsWithTotal: any[];
  isLoading: boolean;
  isSearchClicked: boolean;
  fileName: string;
  setOpen?: any;
  annualSaleSummaryReportInfo?: any;
  expand: boolean;
}
const AnnualSaleSummaryReportTable: React.FC<
  AnnualSaleSummaryReportTableProps
> = ({
  rowsWithTotal,
  isLoading,
  isSearchClicked,
  fileName,
  setOpen,
  annualSaleSummaryReportInfo,
  expand,
}) => {
  const theme = useTheme();

  const handlePrint = () => {
    if (setOpen) {
      setOpen(true);
    }
  };

  const handleDownloadCSV = () => {
    if (annualSaleSummaryReportInfo && rowsWithTotal && fileName) {
      generateCSVWithHeader(
        annualSaleSummaryReportInfo,
        rowsWithTotal,
        fileName
      );
    } else {
      enqueueSnackbar("CSV download failed due to missing data", {
        variant: "error",
      });
    }
  };

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rowsWithTotal, AnnualSaleSummaryReportTableHeadings);

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
              Annual Sale Summary Report
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
            }}
            getRowId={(row) => row.id}
            rows={rowsWithTotal}
            columns={getColumnsWithTooltip(
              AnnualSaleSummaryReportTableHeadings
            )}
            loading={isLoading}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            density="compact"
            disableRowSelectionOnClick
            rowCount={rowsWithTotal.length - 1}
            pagination
            paginationMode={
              isFiltered && searchedRows.length > 0 ? "client" : "server"
            }
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  columns={AnnualSaleSummaryReportTableHeadings}
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

export default AnnualSaleSummaryReportTable;
