// @ts-nocheck
import { Theme } from "@mui/material/styles";

export default function DataGrid(theme: Theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          backgroundColor: "transparent",
          "& .MuiTablePagination-root": {
            borderTop: 0,
            color: "#4a5173",
            fontWeight: 600,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "var(--primary-lighter, #e0f2fe) !important",
            borderRadius: "10px 10px 0 0",
            borderBottom: "none",
            minHeight: "48px !important",
            maxHeight: "48px !important",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "var(--primary-lighter, #e0f2fe) !important",
            color: "var(--text-primary, #0f172a) !important",
            fontWeight: 800,
            fontSize: "0.9rem",
            "&:focus, &:focus-within": { outline: "none" },
            "&:not(:last-child)": {
              borderRight: "1.5px solid rgba(0, 0, 0, 0.08)",
            },
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 800,
            color: "var(--text-primary, #0f172a) !important",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            color: "var(--text-primary, #0f172a)",
            fontSize: "0.875rem",
            "&:focus, &:focus-within": { outline: "none" },
          },
          "& .MuiDataGrid-row": {
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.03)",
            },
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            justifyContent: "flex-end",
            paddingTop: "8px",
          },
        },
        columnSeparator: {
          display: "none", // Using crisp borderRight vertical divider lines instead
        },
        toolbarContainer: {
          padding: theme.spacing(1.5, 0),
          backgroundColor: "transparent",
          "& .MuiButton-root": {
            marginRight: theme.spacing(1.5),
            color: "#0a0d2c",
            fontWeight: 600,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "rgba(10,13,44,0.06)",
            },
          },
        },
        paper: {
          boxShadow: theme.customShadows ? theme.customShadows.dropdown : "0 4px 16px rgba(0,0,0,0.1)",
        },
        menu: {
          "& .MuiPaper-root": {
            borderRadius: "8px",
            boxShadow: theme.customShadows ? theme.customShadows.dropdown : "0 4px 16px rgba(0,0,0,0.1)",
          },
          "& .MuiMenuItem-root": {
            ...theme.typography.body2,
            "& .MuiListItemIcon-root": {
              minWidth: "auto",
            },
          },
        },
        panelFooter: {
          padding: theme.spacing(2),
          justifyContent: "flex-end",
          borderTop: `1px solid ${theme.palette.divider}`,
          "& .MuiButton-root": {
            "&:first-of-type": {
              marginRight: theme.spacing(1.5),
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            },
            "&:last-of-type": {
              color: theme.palette.common.white,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          },
        },
      },
    },
  };
}
