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
import {
  DiscountEligibilityReportTableHeadings,
  tableOptions,
} from "./table-header-discount-eligibility";
import PrintIcon from "@mui/icons-material/Print";
import TableViewIcon from "@mui/icons-material/TableView";
import { DataGrid } from "@mui/x-data-grid";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

interface DiscountEligibilityReportTableProps {
  rowsWithTotal: any[];
  isLoading: boolean;
  isSearchClicked: boolean;
  fileName: string;
  setOpen?: any;
  discountEligibilityReportInfo?: any;
  expand: boolean;
  selectedSummaryValue: string;
}

const DiscountEligibilityReportTable = ({
  rowsWithTotal,
  isLoading,
  isSearchClicked,
  fileName,
  setOpen,
  discountEligibilityReportInfo,
  expand,
  selectedSummaryValue,
}: DiscountEligibilityReportTableProps) => {
  const theme = useTheme();

  const handlePrint = () => {
    if (setOpen) {
      setOpen(true);
    }
  };
  const handleDownloadCSV = () => {
    if (discountEligibilityReportInfo && rowsWithTotal && fileName) {
      generateCSVWithHeader(
        discountEligibilityReportInfo,
        rowsWithTotal,
        fileName
      );
    } else {
      enqueueSnackbar("CSV download failed due to missing data", {
        variant: "error",
      });
    }
  };

  const filteredColumns =
    selectedSummaryValue === "Summary"
      ? DiscountEligibilityReportTableHeadings.filter(
          (column) =>
            column.field !== "invoiceNumber" && column.field !== "invoiceDate"
        )
      : DiscountEligibilityReportTableHeadings;

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rowsWithTotal, filteredColumns);

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
              {`Discount Eligibility Report - ${selectedSummaryValue}`}
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
            columns={getColumnsWithTooltip(filteredColumns)}
            loading={isLoading}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            density="compact"
            getRowClassName={(params) => {
              if (params.row.id === "grand-total") return "grand-total-row";
              if (params.row.id.startsWith("subtotal-")) return "subtotal-row";
              return "";
            }}
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
                  columns={filteredColumns}
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

export default DiscountEligibilityReportTable;
