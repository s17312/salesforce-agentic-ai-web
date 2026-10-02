// ----------------------------------------------------------------------
export default function DataGrid(theme) {
    return {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: "0 !important",
                    outline: "none",
                    borderWidth: 0,
                    padding: "10px",
                    align: "center",
                    "& .MuiTablePagination-root": {
                        borderTop: 0,
                        color: theme.palette.common.black,
                    },
                    "&.MuiDataGrid-root": {
                        padding: "0px",
                    },
                    "&.MuiDataGrid-root .MuiDataGrid-row": {
                        backgroundColor: "rgb(255,255,248, 0.3)",
                        borderRadius: "12px",
                        // borderTop: `1px solid ${theme.palette.primary.lighter}`,
                        borderBottom: `1px solid ${theme.palette.primary.lighter}`,
                        // marginTop: "5px",
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: "12px",
                        },
                    },
                    "&.MuiDataGrid-root .MuiDataGrid-columnHeader": {
                        outline: "none",
                        "&:focus-within": {
                            outline: "none",
                        },
                        "&:focus": {
                            outline: "none",
                        },
                    },
                    "&.MuiDataGrid-root .MuiDataGrid-columnHeaders": {
                        border: `1px solid ${theme.palette.primary.lighter}`,
                        borderRadius: "12px",
                        backgroundColor: "#DBD4F0",
                    },
                    // "& .MuiDataGrid-virtualScroller": {
                    //   "&::-webkit-scrollbar": {
                    //     width: "5px",
                    //     height: "5px",
                    //   },
                    //   "&::-webkit-scrollbar-thumb": {
                    //     background: "#888",
                    //     borderRadius: "10px",
                    //   },
                    //   "&::-webkit-scrollbar-thumb:hover": {
                    //     background: "#555",
                    //   },
                    // },
                    "&.MuiDataGrid-root .MuiDataGrid-columnHeaderTitle": {
                        color: "#212B36",
                    },
                    color: theme.palette.common.black,
                    backgroundColor: "unset",
                    "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                        outline: "none",
                    },
                    "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus": {
                        outline: "none",
                    },
                    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                        outline: "none",
                    },
                },
                cell: {
                    borderBottom: `0`,
                },
                columnSeparator: {
                    color: `${theme.palette.divider} !important`,
                    visibility: "visible",
                },
                columnHeader: {
                    "&:last-of-type": {
                        "& .MuiDataGrid-columnSeparator": {
                            display: "none",
                        },
                        "& .MuiDataGrid-menuIcon": {
                            display: "none",
                        },
                    },
                    // "& .MuiDataGrid-columnHeaderTitleContainer": {
                    //   justifyContent: "center",
                    // },
                },
                toolbarContainer: {
                    padding: theme.spacing(2),
                    backgroundColor: theme.palette.background.neutral,
                    "& .MuiButton-root": {
                        marginRight: theme.spacing(1.5),
                        color: theme.palette.text.primary,
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                        },
                    },
                },
                paper: {
                    boxShadow: theme.customShadows.dropdown,
                },
                menu: {
                    "& .MuiPaper-root": {
                        boxShadow: theme.customShadows.dropdown,
                    },
                    "& .MuiMenuItem-root": Object.assign(Object.assign({}, theme.typography.body2), { "& .MuiListItemIcon-root": {
                            minWidth: "auto",
                        } }),
                },
                panelFooter: {
                    padding: theme.spacing(2),
                    justifyContent: "flex-end",
                    borderTop: `1px solid ${theme.palette.divider}`,
                    "& .MuiButton-root": {
                        display: "none",
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
                filterForm: {
                    padding: theme.spacing(1.5, 0),
                    "& .MuiFormControl-root": {
                        margin: theme.spacing(0, 0.5),
                    },
                    "& .MuiInput-root": {
                        marginTop: theme.spacing(3),
                        "&::before, &::after": {
                            display: "none",
                        },
                        "& .MuiNativeSelect-select, .MuiInput-input": Object.assign(Object.assign({}, theme.typography.body2), { padding: theme.spacing(0.75, 1), borderRadius: theme.shape.borderRadius, backgroundColor: theme.palette.background.neutral, color: theme.palette.common.black }),
                        "& .MuiSvgIcon-root": {
                            right: 4,
                        },
                    },
                },
            },
        },
    };
}
