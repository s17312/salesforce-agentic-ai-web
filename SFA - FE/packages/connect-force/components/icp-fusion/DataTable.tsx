import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Select,
  MenuItem,
  Typography,
  FormControl,
} from '@mui/material';
import { DataGrid, GridColDef, DataGridProps } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { alpha } from '@mui/material/styles';
import { useThemeContext } from '@/context/ThemeContext';
import { CustomNoRowsOverlay } from '@/components/data-grid/noRowOverlay';

export interface IDataTableProps {
  title?: string;
  columns: GridColDef[];
  data?: any[];
  rows?: any[];
  getRowId?: (row: any) => string;
  rowsPerPageOptions?: number[];
  menuItems?: any;
  isSearch?: boolean;
  isFilter?: boolean;
  isSelectableRows?: boolean;
  handleView?: (id: any) => void;
  handleEdit?: (id: any) => void;
  handleDelete?: (id: any) => void;
  rowComponent?: React.ElementType;
  tableTopComponent?: React.ReactNode;
  showToolbar?: boolean;
  onPaginationChange?: (pagination: { page: number; pageSize: number }) => void;
  contentHeight?: number;
  density?: 'compact' | 'standard' | 'comfortable';
  sx?: any;
  filterByColumn?: boolean;
  handleAdd?: () => void;
  rowCount?: number;
  handleTableBtnClick?: () => void;
  isTableBtnDisabled?: boolean;
  tableBtnText?: string;
  tableBtnIcon?: React.ReactNode;
}

export function DataTable({
  title,
  columns = [],
  data = [],
  rows: rowsFromProps,
  getRowId,
  rowsPerPageOptions = [100, 25, 50, 10],
  isSearch = true,
  isSelectableRows = false,
  handleView,
  handleEdit,
  handleDelete,
  tableTopComponent,
  density = 'standard',
  sx,
  handleAdd,
  rowCount,
  handleTableBtnClick,
  isTableBtnDisabled,
  tableBtnText,
  tableBtnIcon,
  ...gridProps
}: IDataTableProps & Partial<DataGridProps>) {
  const { currentTheme } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('All');

  const rawData = rowsFromProps || data || [];

  // Auto add Action Column if actions are defined
  const actionColumn: GridColDef[] =
    handleView || handleEdit || handleDelete
      ? [
          {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
              const id = params.id || params.row?.id;
              return (
                <Stack direction="row" spacing={0.5}>
                  {handleView && (
                    <Tooltip title="View">
                      <IconButton size="small" sx={{ color: '#00B8D9' }} onClick={() => handleView(id)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {handleEdit && (
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: '#7D56EC' }} onClick={() => handleEdit(id)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {handleDelete && (
                    <Tooltip title="Delete">
                      <IconButton size="small" sx={{ color: '#FF5630' }} onClick={() => handleDelete(id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              );
            },
          },
        ]
      : [];

  const finalColumns = [...columns, ...actionColumn];

  // Client-side search filtering
  const filteredData = searchQuery
    ? rawData.filter((row: any) =>
        Object.values(row).some(
          (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : rawData;

  const btnLabelText = tableBtnText ? tableBtnText.replace(/^\+\s*/, '') : 'Register';

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, ...sx }}>
      {/* Search & Action Controls Bar matching screenshot callout 4 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Left Side: Column Dropdown & Search Input */}
        <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ flexGrow: 1, maxWidth: 600 }}>
          {/* Column Selector */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ color: currentTheme?.textSecondary || '#686d94', fontWeight: 600, mb: 0.3, ml: 0.5, fontSize: '0.75rem' }}>
              Column
            </Typography>
            <FormControl size="small">
              <Select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  bgcolor: currentTheme?.headerTint || '#ede9fe',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: currentTheme?.textPrimary || '#0f172a',
                  minWidth: 100,
                  height: '40px',
                  border: `1.5px solid ${alpha(currentTheme?.primaryMain || '#6366f1', 0.2)}`,
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-icon': { color: currentTheme?.primaryMain || '#6366f1' },
                }}
              >
                <MenuItem value="All">All</MenuItem>
                {columns.map((col) => (
                  <MenuItem key={col.field} value={col.field}>
                    {col.headerName || col.field}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Search Input Box */}
          {isSearch && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="small" sx={{ color: currentTheme?.primaryMain || '#6366f1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                maxWidth: 340,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#ffffff',
                  borderRadius: '10px',
                  height: '40px',
                  fontSize: '0.875rem',
                  color: currentTheme?.textPrimary || '#0f172a',
                  border: `1.5px solid ${alpha(currentTheme?.primaryMain || '#6366f1', 0.2)}`,
                  transition: 'all 0.2s ease',
                  '& fieldset': { border: 'none' },
                  '&:hover': {
                    border: `1.5px solid ${currentTheme?.primaryMain || '#6366f1'}`,
                  },
                  '&.Mui-focused': {
                    border: `1.5px solid ${currentTheme?.primaryMain || '#6366f1'}`,
                    boxShadow: `0 0 0 3px ${alpha(currentTheme?.primaryMain || '#6366f1', 0.15)}`,
                  },
                },
              }}
            />
          )}
        </Stack>

        {/* Right Side: + Register Button matching Callout 4 */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {tableTopComponent}

          {(handleAdd || handleTableBtnClick) && (
            <Button
              variant="contained"
              onClick={handleAdd || handleTableBtnClick}
              disabled={isTableBtnDisabled}
              sx={{
                bgcolor: currentTheme?.primaryMain || '#6366f1',
                color: '#ffffff',
                borderRadius: '8px',
                px: 2.5,
                py: 0.8,
                height: '40px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                boxShadow: `0 4px 12px ${alpha(currentTheme?.primaryMain || '#6366f1', 0.25)}`,
                '&:hover': {
                  bgcolor: currentTheme?.primaryDark || '#4f46e5',
                  boxShadow: `0 6px 16px ${alpha(currentTheme?.primaryMain || '#6366f1', 0.35)}`,
                },
              }}
            >
              {tableBtnIcon || <AddIcon fontSize="small" sx={{ color: '#ffffff' }} />}
              {btnLabelText}
            </Button>
          )}
        </Stack>
      </Box>

      {/* DataGrid Container with Purple Header & Grid */}
      <Box sx={{ width: '100%', minHeight: 400, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          autoHeight={filteredData.length === 0}
          rows={filteredData}
          columns={finalColumns}
          getRowId={getRowId || ((row) => row.uId || row.id || row.code || Math.random().toString())}
          pageSizeOptions={rowsPerPageOptions}
          checkboxSelection={isSelectableRows}
          density={density}
          rowCount={rowCount || filteredData.length}
          initialState={{
            pagination: { paginationModel: { pageSize: rowsPerPageOptions[0] || 100, page: 0 } },
          }}
          slots={{
            noRowsOverlay: () => (
              <CustomNoRowsOverlay
                onAdd={handleAdd || handleTableBtnClick}
                buttonText={tableBtnText || 'Add Entry'}
              />
            ),
            noResultsOverlay: () => (
              <CustomNoRowsOverlay
                onAdd={handleAdd || handleTableBtnClick}
                buttonText={tableBtnText || 'Add Entry'}
              />
            ),
          }}
          sx={{
            border: 'none',
            bgcolor: 'transparent',
            width: '100%',
            flexGrow: 1,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: `${currentTheme?.headerTint || '#ede9fe'} !important`,
              borderRadius: '12px 12px 0 0',
              borderBottom: 'none',
              minHeight: '48px !important',
              maxHeight: '48px !important',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: `${currentTheme?.headerTint || '#ede9fe'} !important`,
              color: currentTheme?.textPrimary || '#0f172a',
              fontWeight: 800,
              fontSize: '0.9rem',
              '&:focus, &:focus-within': { outline: 'none' },
              '&:not(:last-child)': {
                borderRight: `1.5px solid ${alpha(currentTheme?.primaryMain || '#6366f1', 0.12)}`,
              },
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 800,
              color: currentTheme?.textPrimary || '#0f172a',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${alpha(currentTheme?.primaryMain || '#6366f1', 0.08)}`,
              color: currentTheme?.textPrimary || '#0f172a',
              fontSize: '0.875rem',
              '&:focus, &:focus-within': { outline: 'none' },
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: `${alpha(currentTheme?.headerTint || '#ede9fe', 0.45)}`,
              },
            },
            '& .MuiDataGrid-virtualScroller': {
              minHeight: filteredData.length === 0 ? '340px !important' : 'auto',
              overflowX: filteredData.length === 0 ? 'hidden !important' : 'auto',
            },
            '& .MuiDataGrid-virtualScrollerContent': {
              minHeight: filteredData.length === 0 ? '340px !important' : 'auto',
            },
            '& .MuiDataGrid-overlay': {
              minHeight: '340px !important',
              display: 'flex !important',
              alignItems: 'center !important',
              justifyContent: 'center !important',
              backgroundColor: 'transparent !important',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 'none',
              justifyContent: 'flex-end',
              pt: 1,
            },
            '& .MuiTablePagination-root': {
              color: '#4a5173',
              fontSize: '0.85rem',
            },
            '& .MuiTablePagination-select': {
              fontWeight: 600,
            },
            ...(Array.isArray(sx) ? Object.assign({}, ...sx) : sx),
          }}
          {...gridProps}
        />
      </Box>
    </Box>
  );
}

export default DataTable;
