import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import { DataGrid, GridColDef, DataGridProps } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export interface IDataTableProps {
  title?: string;
  columns: GridColDef[];
  data: any[];
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
  getRowId,
  rowsPerPageOptions = [5, 10, 25, 50],
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
}: IDataTableProps & DataGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

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
                      <IconButton size="small" color="info" onClick={() => handleView(id)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {handleEdit && (
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(id)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {handleDelete && (
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(id)}>
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
    ? data.filter((row) =>
        Object.values(row).some(
          (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  return (
    <Card sx={{ width: '100%', boxShadow: (theme) => theme.shadows[2], borderRadius: 2, ...sx }}>
      {(title || isSearch || handleAdd || handleTableBtnClick || tableTopComponent) && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          {title && <CardHeader title={title} sx={{ p: 0 }} titleTypographyProps={{ variant: 'h6', fontWeight: 700 }} />}

          {tableTopComponent}

          <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 'auto' }}>
            {isSearch && (
              <TextField
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: '100%', sm: 240 } }}
              />
            )}

            {handleAdd && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                size="small"
                sx={{ textTransform: 'none', borderRadius: 1.5 }}
              >
                Add
              </Button>
            )}

            {handleTableBtnClick && tableBtnText && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={tableBtnIcon}
                onClick={handleTableBtnClick}
                disabled={isTableBtnDisabled}
                size="small"
                sx={{ textTransform: 'none', borderRadius: 1.5 }}
              >
                {tableBtnText}
              </Button>
            )}
          </Stack>
        </Box>
      )}

      <Box sx={{ width: '100%', minHeight: 400 }}>
        <DataGrid
          rows={filteredData}
          columns={finalColumns}
          getRowId={getRowId || ((row) => row.id || row.code || row._id || Math.random().toString())}
          pageSizeOptions={rowsPerPageOptions}
          checkboxSelection={isSelectableRows}
          density={density}
          rowCount={rowCount || filteredData.length}
          initialState={{
            pagination: { paginationModel: { pageSize: rowsPerPageOptions[0] || 10, page: 0 } },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f9fafb', fontWeight: 700 },
          }}
          {...gridProps}
        />
      </Box>
    </Card>
  );
}

export default DataTable;
