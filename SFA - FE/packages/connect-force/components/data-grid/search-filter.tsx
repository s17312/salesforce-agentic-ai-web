import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Switch,
} from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";

interface SearchBarFilterProps {
  handleNextClick?: () => void;
  handleBackClick?: () => void;
  handleSaveClick?: () => void;
  handleUploadClick?: () => void;
  handleNewClick?: () => void;
  handleTableBtnClick?: () => void;
  handleTableLoadingBtnClick?: () => void;
  handleRegisterBtnClick?: () => void;
  nextBtnText?: string;
  nextBtnIcon?: React.ReactNode;
  isDisabled?: boolean;
  isTableBtnDisabled?: boolean;
  isTableLoadingBtnDisabled?: boolean;
  isTableLoadingBtnLoading?: boolean;
  isNewButtonDisabled?: boolean;
  isRegisterButtonDisabled?: boolean;
  newBtnText?: string;
  tableBtnText?: string;
  tableLoadingBtnText?: string;
  newBtnIcon?: React.ReactNode;
  registerButtonText?: string;
  saveBtnIcon?: React.ReactNode;
  saveBtnText?: string;
  saveBtnDisabled?: boolean;
  showSwitch?: boolean;
  showSearch?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  columns?: any[];
  menuItem?: {
    field: string;
    headerName: string;
  };
  filteredData?: any[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedStatus?: Record<string, string>;
  setSelectedStatus?: (status: Record<string, string>) => void;
}

export default function QuickSearchToolbar({
  handleNextClick,
  handleBackClick,
  handleSaveClick,
  handleUploadClick,
  handleNewClick,
  handleTableBtnClick,
  handleTableLoadingBtnClick,
  handleRegisterBtnClick,
  isDisabled,
  isTableBtnDisabled,
  isTableLoadingBtnDisabled = false,
  isTableLoadingBtnLoading = false,
  isNewButtonDisabled,
  isRegisterButtonDisabled,
  nextBtnText = "Next",
  newBtnText = "New",
  tableBtnText = "Register",
  tableLoadingBtnText = "save",
  registerButtonText = "Create",
  nextBtnIcon = <ArrowForwardIosRoundedIcon />,
  newBtnIcon = <AddIcon />,
  saveBtnIcon = <SaveRoundedIcon />,
  saveBtnText = "Save",
  saveBtnDisabled = false,
  showSwitch = false,
  showSearch = true,
  checked = false,
  onCheckedChange,
  columns = [],
  menuItem,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}: SearchBarFilterProps) {
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
  };
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
      {showSearch && (
        <Box
          sx={{ display: "flex", gap: 2, alignItems: "center", flexGrow: 1 }}
        >
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
              sx={{
                minWidth: 120,
                bgcolor: "#e6e4f5",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#0a0d2c",
                height: "40px",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
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
            inputRef={inputRef}
            id="search-filter"
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
              width: "320px",
              "@media (max-width: 768px)": {
                width: "100%",
              },
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f0effb",
                borderRadius: "10px",
                height: "40px",
                fontSize: "0.875rem",
                color: "#0a0d2c",
                "& fieldset": { border: "none" },
                "&:hover fieldset": { border: "none" },
                "&.Mui-focused fieldset": { border: "1px solid #0a0d2c" },
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
      )}
      <Box flexGrow={1} />

      {showSwitch && (
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={handleSwitchChange}
              inputProps={{ "aria-label": "Show products switch" }}
            />
          }
          label="Show selected items"
          labelPlacement="start"
          disabled={isDisabled}
        />
      )}

      {handleNewClick && (
        <Button
          variant="contained"
          startIcon={newBtnIcon}
          onClick={handleNewClick}
          disabled={isNewButtonDisabled}
        >
          {newBtnText}
        </Button>
      )}
      {handleNextClick && (
        <Button
          variant="contained"
          endIcon={nextBtnIcon}
          onClick={handleNextClick}
          disabled={isDisabled}
        >
          {nextBtnText}
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
          disabled={saveBtnDisabled}
          startIcon={saveBtnIcon}
          onClick={handleSaveClick}
        >
          {saveBtnText}
        </Button>
      )}
      {handleUploadClick && (
        <Button
          variant="contained"
          disabled={isDisabled}
          startIcon={<CloudUploadIcon />}
          onClick={handleUploadClick}
        >
          Upload
        </Button>
      )}
      {handleTableBtnClick && (
        <Button
          variant="contained"
          onClick={handleTableBtnClick}
          disabled={isTableBtnDisabled}
        >
          {tableBtnText}
        </Button>
      )}

      {handleTableLoadingBtnClick && (
        <LoadingButton
          variant="contained"
          onClick={handleTableLoadingBtnClick}
          disabled={isTableLoadingBtnDisabled}
          loading={isTableLoadingBtnLoading}
        >
          {tableLoadingBtnText}
        </LoadingButton>
      )}
      {handleRegisterBtnClick && (
        <Button
          variant="contained"
          onClick={handleRegisterBtnClick}
          sx={{
            bgcolor: "rgba(220, 53, 69, 0.85)",
            "&:hover": { bgcolor: "rgba(220, 53, 69, 0.85)" },
          }}
          disabled={isRegisterButtonDisabled}
        >
          {registerButtonText}
        </Button>
      )}
    </Stack>
  );
}
