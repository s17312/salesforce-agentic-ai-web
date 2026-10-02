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

// Custom No Rows Overlay matching the uploaded screenshot
function CustomNoRowsOverlay() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        py: 6,
      }}
    >
      <svg width="100" height="90" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Box outline */}
        <rect x="25" y="45" width="50" height="32" rx="4" fill="#DDE1F0" stroke="#B8C0DF" strokeWidth="2" />
        <path d="M25 55L40 55C43 55 45 57 45 60C45 63 47 65 50 65C53 65 55 63 55 60C55 57 57 55 60 55L75 55" stroke="#B8C0DF" strokeWidth="2" />
        {/* Document pages inside */}
        <rect x="35" y="22" width="30" height="32" rx="2" fill="#FFFFFF" stroke="#CCD2EA" strokeWidth="2" />
        <line x1="41" y1="28" x2="59" y2="28" stroke="#DDE1F0" strokeWidth="2" strokeLinecap="round" />
        <line x1="41" y1="34" x2="59" y2="34" stroke="#DDE1F0" strokeWidth="2" strokeLinecap="round" />
        <line x1="41" y1="40" x2="51" y2="40" stroke="#DDE1F0" strokeWidth="2" strokeLinecap="round" />
        {/* Speech bubble with dots */}
        <circle cx="68" cy="22" r="11" fill="#E4E8F5" />
        <path d="M63 29L61 34L67 31" fill="#E4E8F5" />
        <circle cx="63" cy="22" r="1.5" fill="#A4AECE" />
        <circle cx="68" cy="22" r="1.5" fill="#A4AECE" />
        <circle cx="73" cy="22" r="1.5" fill="#A4AECE" />
      </svg>
      <Typography sx={{ mt: 1.5, color: '#4a5173', fontWeight: 600, fontSize: '0.9rem' }}>
        No Rows
      </Typography>
    </Box>
  );
}

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
            <Typography variant="caption" sx={{ color: '#686d94', fontWeight: 600, mb: 0.3, ml: 0.5, fontSize: '0.75rem' }}>
              Column
            </Typography>
            <FormControl size="small">
              <Select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  bgcolor: '#e6e4f5',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#0a0d2c',
                  minWidth: 100,
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
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
                    <SearchIcon fontSize="small" sx={{ color: '#686d94' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                maxWidth: 340,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f0effb',
                  borderRadius: '10px',
                  height: '40px',
                  fontSize: '0.875rem',
                  color: '#0a0d2c',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: '1px solid #0a0d2c' },
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
                bgcolor: '#0a0d2c',
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
                boxShadow: '0 4px 12px rgba(10,13,44,0.2)',
                '&:hover': {
                  bgcolor: '#181d4f',
                  boxShadow: '0 6px 16px rgba(10,13,44,0.3)',
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
      <Box sx={{ width: '100%', minHeight: 380, flexGrow: 1 }}>
        <DataGrid
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
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{
            border: 'none',
            bgcolor: 'transparent',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#dedbf5 !important',
              borderRadius: '12px 12px 0 0',
              borderBottom: 'none',
              minHeight: '48px !important',
              maxHeight: '48px !important',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#dedbf5 !important',
              color: '#0a0d2c',
              fontWeight: 800,
              fontSize: '0.9rem',
              '&:focus, &:focus-within': { outline: 'none' },
              '&:not(:last-child)': {
                borderRight: '1.5px solid rgba(10,13,44,0.15)',
              },
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 800,
              color: '#0a0d2c',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e6e4f7',
              color: '#0a0d2c',
              fontSize: '0.875rem',
              '&:focus, &:focus-within': { outline: 'none' },
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: 'rgba(222, 219, 245, 0.25)',
              },
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
          }}
          {...gridProps}
        />
      </Box>
    </Box>
  );
}

export default DataTable;
