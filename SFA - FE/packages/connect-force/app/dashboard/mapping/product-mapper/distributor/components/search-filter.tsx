import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
interface SearchBarFilterProps {
  handleNextClick?: () => void;
  handleBackClick?: () => void;
  handleSaveClick?: () => void;
  isDisabled?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedStatus?: Record<string, string>;
  setSelectedStatus?: (status: Record<string, string>) => void;
  columns?: any[];
  menuItem?: {
    field: string;
    headerName: string;
  };
}

export default function QuickSearchToolbar({
  handleNextClick,
  handleBackClick,
  handleSaveClick,
  isDisabled,
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
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexGrow: 1 }}>
        {menuItem && (
          <Select
            size="small"
            value={
              menuItem?.field &&
              selectedStatus &&
              selectedStatus[menuItem.field]
                ? selectedStatus[menuItem.field]
                : "All"
            }
            onChange={(event) => {
              if (setSelectedStatus && menuItem?.field) {
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
        )}
        <GridToolbarQuickFilter
          size="small"
          id="search-filter"
          inputRef={inputRef}
          placeholder="Search..."
          variant="outlined"
          fullWidth
          clearable
          value={searchQuery}
          onChange={(event: any) => {
            if (setSearchQuery) {
              setSearchQuery(event.target.value);
            }
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
                  if (setSearchQuery) {
                    setSearchQuery("");
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : null,
          }}
        />
      </Box>
      <Box flexGrow={1} />
      {handleNextClick && (
        <Button
          variant="contained"
          endIcon={<ArrowForwardIosRoundedIcon />}
          onClick={handleNextClick}
        >
          Next
        </Button>
      )}
      {handleBackClick && (
        <Button
          variant="contained"
          startIcon={<ArrowBackIosNewRoundedIcon />}
          onClick={handleBackClick}
        >
          Back
        </Button>
      )}
      {handleSaveClick && (
        <Button
          variant="contained"
          disabled={isDisabled}
          startIcon={<SaveRoundedIcon />}
          onClick={handleSaveClick}
        >
          Save
        </Button>
      )}
    </Stack>
  );
}
