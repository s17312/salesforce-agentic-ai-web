import { lighten, styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

export const StyledTourDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-row.super-app-theme--Filled": {
    backgroundColor: lighten(theme.palette.success.main, 0.8),
    "&:hover": {
      backgroundColor: lighten(theme.palette.success.main, 0.7),
    },
    "&.Mui-selected": {
      backgroundColor: lighten(theme.palette.success.main, 0.5),
      "&:hover": {
        backgroundColor: lighten(theme.palette.success.main, 0.4),
      },
    },
  },
}));
