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
import {
  DistributorMappingTableHeadings,
  tableOptions,
} from "./table-header-distributor-mapping";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

interface DistributorMappingTableProps {
  rowsWithTotal: any[];
  isLoading: boolean;
  isSearchClicked: boolean;
  fileName: string;
  setOpen?: any;
  distributorMappingInfo?: any;
  selectedRadioValue: string;
}

const DistributorMappingTable: React.FC<DistributorMappingTableProps> = ({
  rowsWithTotal,
  isLoading,
  isSearchClicked,
  fileName,
  setOpen,
  distributorMappingInfo,
  selectedRadioValue,
}) => {
  const theme = useTheme();

  const handlePrint = () => {
    if (setOpen) {
      setOpen(true);
    }
  };

  const handleDownloadCSV = () => {
    if (distributorMappingInfo && rowsWithTotal && fileName) {
      const filteredRows = rowsWithTotal.map((row) => ({
        Distributor_Id: row.distributorId,
        Distributor_Name: row.distributorName,
        Id: row.id,
        Name: row.name,
      }));

      generateCSVWithHeader(
        distributorMappingInfo,
        filteredRows,
        fileName,
        selectedRadioValue
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
  } = useColumnFilter(rowsWithTotal, DistributorMappingTableHeadings);

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
              {`Distributor Mapping Info - ${selectedRadioValue}`}
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
          <Alert severity="info">Please click on search to view the data</Alert>
        ) : (
          <DataGrid
            sx={{ ...dataGridViewStyleMappers }}
            getRowId={(row) => row.key}
            rows={isFiltered ? searchedRows : rowsWithTotal}
            columns={getColumnsWithTooltip(DistributorMappingTableHeadings)}
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
                  columns={DistributorMappingTableHeadings}
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

export default DistributorMappingTable;
