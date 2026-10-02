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
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import {
  tableOptions,
  ItemWiseSaleSummaryReportTableHeadings,
} from "./table-header-item-wise-sale-summary";
import { useState } from "react";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

interface ItemWiseSaleSummaryReportTableProps {
  rowsWithTotal: any[];
  isLoading: boolean;
  isSearchClicked: boolean;
  fileName: string;
  setOpen?: any;
  invoiceDetailReportInfo?: any;
  expand: boolean;
}

const ItemWiseSaleSummaryReportTable: React.FC<
  ItemWiseSaleSummaryReportTableProps
> = ({
  rowsWithTotal,
  isLoading,
  isSearchClicked,
  fileName,
  setOpen,
  invoiceDetailReportInfo,
  expand,
}) => {
  const theme = useTheme();
  const [showDistributorColumns, setShowDistributorColumns] = useState(true);

  const handlePrint = () => {
    if (setOpen) {
      setOpen(true);
    }
  };

  const handleDownloadCSV = () => {
    if (invoiceDetailReportInfo && rowsWithTotal && fileName) {
      generateCSVWithHeader(invoiceDetailReportInfo, rowsWithTotal, fileName);
    } else {
      enqueueSnackbar("CSV download failed due to missing data", {
        variant: "error",
      });
    }
  };

  // Define the columns that should be collapsible
  const collapsibleColumnKeys = ["tourID", "outletID"];

  // Filter columns based on toggle state
  const visibleColumns = ItemWiseSaleSummaryReportTableHeadings.filter(
    (col) =>
      showDistributorColumns || !collapsibleColumnKeys.includes(col.field)
  );

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rowsWithTotal, visibleColumns);

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
              Item Wise Sales Summary Report
            </Typography>
            {isSearchClicked && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowDistributorColumns((prev) => !prev)}
                >
                  {showDistributorColumns ? "Hide Columns" : "Show Columns"}
                </Button>
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
            columns={getColumnsWithTooltip(visibleColumns)}
            loading={isLoading}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            density="compact"
            getRowClassName={(params) => {
              if (params.row.productID === "Total") return "grand-total-row";
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
                  columns={visibleColumns}
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

export default ItemWiseSaleSummaryReportTable;
