import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import { OutletIcon } from "@/assets/icons/distributor-mapper/outlet";
import { SalesRepIcon } from "@/assets/icons/distributor-mapper/sales-rep";
import { DistributorIcon } from "@/assets/icons/distributor-mapper/distributor";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
interface SearchBarFilterProps {
  handleDistributorClick?: () => void;
  handleOutletClick?: () => void;
  handleSalesRepClick?: () => void;
  isDisabled?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus?: Record<string, string>;
  setSelectedStatus?: (status: Record<string, string>) => void;
  columns?: any[];
  menuItem: {
    field: string;
    headerName: string;
  };
}

export default function QuickSearchToolbarIcons({
  handleDistributorClick,
  handleOutletClick,
  handleSalesRepClick,
  isDisabled = false,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  columns = [],
  menuItem,
}: SearchBarFilterProps) {
  const [menuItems] = useState(columns || []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && searchQuery && searchQuery.length > 0) {
      inputRef.current.focus();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (
      menuItems.length > 0 &&
      selectedStatus &&
      Object.keys(selectedStatus).length === 0
    ) {
      const defaultValues = menuItems.reduce((acc: any, item: any) => {
        acc[item.field] = "All";
        return acc;
      }, {});
      if (setSelectedStatus) {
        setSelectedStatus(defaultValues);
      }
    }
  }, [menuItems]);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      paddingBottom="10px"
    >
      <Select
        size="small"
        value={selectedStatus?.[menuItem.field] || "All"}
        onChange={(event) => {
          if (setSelectedStatus) {
            setSelectedStatus({
              ...selectedStatus,
              [menuItem.field]: event.target.value,
            });
          }
        }}
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="All">All</MenuItem>
        {columns.map((col) => (
          <MenuItem key={col.field} value={col.field}>
            {col.headerName || col.field}
          </MenuItem>
        ))}
      </Select>
      <GridToolbarQuickFilter
        size="small"
        id="search-filter"
        placeholder="Search..."
        inputRef={inputRef}
        variant="outlined"
        fullWidth
        clearable
        value={searchQuery}
        onChange={(event: any) => {
          setSearchQuery(event.target.value);
        }}
        sx={{
          width: "20%",
          "@media (max-width: 768px)": {
            width: "100%",
          },
        }}
        InputProps={{
          endAdornment: searchQuery ? (
            <IconButton
              size="small"
              onClick={() => {
                setSearchQuery("");
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : null,
        }}
      />
      <Box flexGrow={1} />
      <Button
        disabled={isDisabled}
        size="small"
        variant="outlined"
        endIcon={<DistributorIcon />}
        onClick={handleDistributorClick}
        sx={{ paddingY: 2 }}
      >
        Distributor
      </Button>
      <Button
        disabled={isDisabled}
        size="small"
        variant="outlined"
        endIcon={<SalesRepIcon />}
        onClick={handleSalesRepClick}
        sx={{ paddingY: 2 }}
      >
        Sales Rep
      </Button>
      <Button
        disabled={isDisabled}
        size="small"
        variant="outlined"
        endIcon={<OutletIcon />}
        onClick={handleOutletClick}
        sx={{ paddingY: 2 }}
      >
        Outlet
      </Button>
    </Stack>
  );
}
