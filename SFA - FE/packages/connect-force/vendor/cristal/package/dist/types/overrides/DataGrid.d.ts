import { Theme } from "@mui/material/styles";
export default function DataGrid(theme: Theme): {
    MuiDataGrid: {
        styleOverrides: {
            root: {
                border: string;
                outline: string;
                borderWidth: number;
                padding: string;
                align: string;
                "& .MuiTablePagination-root": {
                    borderTop: number;
                    color: string;
                };
                "&.MuiDataGrid-root": {
                    padding: string;
                };
                "&.MuiDataGrid-root .MuiDataGrid-row": {
                    backgroundColor: string;
                    borderRadius: string;
                    borderBottom: string;
                    "&:hover": {
                        backgroundColor: string;
                        borderRadius: string;
                    };
                };
                "&.MuiDataGrid-root .MuiDataGrid-columnHeader": {
                    outline: string;
                    "&:focus-within": {
                        outline: string;
                    };
                    "&:focus": {
                        outline: string;
                    };
                };
                "&.MuiDataGrid-root .MuiDataGrid-columnHeaders": {
                    border: string;
                    borderRadius: string;
                    backgroundColor: string;
                };
                "&.MuiDataGrid-root .MuiDataGrid-columnHeaderTitle": {
                    color: string;
                };
                color: string;
                backgroundColor: string;
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                    outline: string;
                };
                "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus": {
                    outline: string;
                };
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                    outline: string;
                };
            };
            cell: {
                borderBottom: string;
            };
            columnSeparator: {
                color: string;
                visibility: string;
            };
            columnHeader: {
                "&:last-of-type": {
                    "& .MuiDataGrid-columnSeparator": {
                        display: string;
                    };
                    "& .MuiDataGrid-menuIcon": {
                        display: string;
                    };
                };
            };
            toolbarContainer: {
                padding: any;
                backgroundColor: string;
                "& .MuiButton-root": {
                    marginRight: any;
                    color: string;
                    "&:hover": {
                        backgroundColor: string;
                    };
                };
            };
            paper: {
                boxShadow: string;
            };
            menu: {
                "& .MuiPaper-root": {
                    boxShadow: string;
                };
                "& .MuiMenuItem-root": {
                    "& .MuiListItemIcon-root": {
                        minWidth: string;
                    };
                    '@font-face'?: any;
                };
            };
            panelFooter: {
                padding: any;
                justifyContent: string;
                borderTop: string;
                "& .MuiButton-root": {
                    display: string;
                    "&:first-of-type": {
                        marginRight: any;
                        color: string;
                        "&:hover": {
                            backgroundColor: string;
                        };
                    };
                    "&:last-of-type": {
                        color: string;
                        backgroundColor: string;
                        "&:hover": {
                            backgroundColor: string;
                        };
                    };
                };
            };
            filterForm: {
                padding: any;
                "& .MuiFormControl-root": {
                    margin: any;
                };
                "& .MuiInput-root": {
                    marginTop: any;
                    "&::before, &::after": {
                        display: string;
                    };
                    "& .MuiNativeSelect-select, .MuiInput-input": {
                        padding: any;
                        borderRadius: any;
                        backgroundColor: string;
                        color: string;
                        '@font-face'?: any;
                    };
                    "& .MuiSvgIcon-root": {
                        right: number;
                    };
                };
            };
        };
    };
};
