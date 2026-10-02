import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { dataGridViewStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { generateCSVWithHeader } from "@/utils/reports/reportUtils";
import PrintIcon from "@mui/icons-material/Print";
import TableViewIcon from "@mui/icons-material/TableView";
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
import { DataGrid } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import React from "react";
import {
  CompanyStockViewTableHeadings,
  tableOptions,
} from "./table-header-compnay-stock";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

interface CompanyStockTableProps {
  rowsWithTotal: any[];
  isLoading: boolean;
  isSearchClicked: boolean;
  fileName: string;
  setOpen?: any;
  companyInfo?: any;
  selectedSummaryValue: string;
}

const CompanyStockTable: React.FC<CompanyStockTableProps> = ({
  rowsWithTotal,
  isLoading,
  isSearchClicked,
  fileName,
  setOpen,
  companyInfo,
  selectedSummaryValue,
}) => {
  const theme = useTheme();

  const handlePrint = () => {
    if (setOpen) {
      setOpen(true);
    }
  };

  const filteredColumns =
    selectedSummaryValue === "Summary"
      ? CompanyStockViewTableHeadings.filter((column) => column.field !== "mrp")
      : CompanyStockViewTableHeadings;

  const handleDownloadCSV = () => {
    if (companyInfo && rowsWithTotal && fileName) {
      generateCSVWithHeader(
        companyInfo,
        rowsWithTotal,
        fileName,
        selectedSummaryValue
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
  } = useColumnFilter(rowsWithTotal, CompanyStockViewTableHeadings);

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
              {`Company Stock View - ${selectedSummaryValue}`}
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
            sx={{ ...dataGridViewStyleMappers }}
            getRowId={(row) => row.stockDetailId}
            rows={isFiltered ? searchedRows : rowsWithTotal}
            columns={getColumnsWithTooltip(filteredColumns)}
            loading={isLoading}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            density="compact"
            getRowClassName={(params) =>
              params.row.productUId === "Total" ? "total-row" : ""
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

export default CompanyStockTable;
