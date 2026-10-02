import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { dataGridStockStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { generateCSVWithHeader } from "@/utils/reports/reportUtils";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import TableViewIcon from "@mui/icons-material/TableView";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { enqueueSnackbar } from "notistack";
import AssetStockViewReport from "../report/assetStockReport";
import {
  AssetStockViewTableHeadings,
  tableOptions,
} from "./table-header-asset-stock";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

interface AssetStockTableProps {
  rowsWithTotal: any[];
  isLoading: boolean;
  isSearchClicked: boolean;
  fileName: string;
  setOpen?: any;
  assetInfo?: any;
  expand: boolean;
}

const AssetStockTable: React.FC<AssetStockTableProps> = ({
  rowsWithTotal,
  isLoading,
  isSearchClicked,
  fileName,
  setOpen,
  assetInfo,
  expand,
}) => {
  const theme = useTheme();

  const handlePrint = () => {
    if (setOpen) {
      setOpen(true);
    }
  };

  const handleDownloadCSV = () => {
    if (assetInfo && rowsWithTotal && fileName) {
      generateCSVWithHeader(assetInfo, rowsWithTotal, fileName);
    } else {
      enqueueSnackbar("CSV download failed due to missing data", {
        variant: "error",
      });
    }
  };

  const transformedRows = rowsWithTotal.map((row) => ({
    ...row,
    purchaseDate: row.purchaseDate ? new Date(row.purchaseDate) : null,
    maintenanceSchedule: row.maintenanceSchedule
      ? new Date(row.maintenanceSchedule)
      : null,
  }));

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rowsWithTotal, AssetStockViewTableHeadings);

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
              Asset Stock View
            </Typography>
            {isSearchClicked && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handlePrint}>
                  <PrintIcon sx={{ color: theme.palette.primary.main }} />
                </IconButton>
                <PDFDownloadLink
                  document={
                    <AssetStockViewReport
                      data={rowsWithTotal}
                      assetInfo={assetInfo}
                    />
                  }
                  fileName={fileName}
                >
                  {/* @ts-ignore  */}
                  {({ loading, error }) => {
                    if (loading) {
                      return <CircularProgress />;
                    }
                    if (error) {
                      enqueueSnackbar("Error generating PDF", {
                        variant: "error",
                      });
                    }
                    return (
                      <DownloadIcon
                        sx={{
                          color: theme.palette.primary.main,
                          verticalAlign: "middle",
                        }}
                      />
                    );
                  }}
                </PDFDownloadLink>
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
              ...dataGridStockStyleMappers,
            }}
            getRowId={(row) => row.assetId}
            rows={isFiltered ? searchedRows : rowsWithTotal}
            columns={getColumnsWithTooltip(AssetStockViewTableHeadings)}
            loading={isLoading}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            density="compact"
            getRowClassName={(params) =>
              params.row.assetId === "Total" ? "total-row" : ""
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
                  columns={AssetStockViewTableHeadings}
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

export default AssetStockTable;
