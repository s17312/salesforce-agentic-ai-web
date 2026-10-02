import { Theme } from '@mui/material/styles';
export default function Table(theme: Theme): {
    MuiTableContainer: {
        styleOverrides: {
            root: {
                position: string;
            };
        };
    };
    MuiTableRow: {
        styleOverrides: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: string;
                    '&:hover': {
                        backgroundColor: string;
                    };
                };
            };
        };
    };
    MuiTableCell: {
        styleOverrides: {
            root: {
                borderBottom: string;
            };
            head: {
                color: string;
                backgroundColor: string;
            };
            stickyHeader: {
                backgroundColor: string;
                backgroundImage: string;
            };
            paddingCheckbox: {
                paddingLeft: any;
            };
        };
    };
    MuiTablePagination: {
        defaultProps: {
            backIconButtonProps: {
                size: string;
            };
            nextIconButtonProps: {
                size: string;
            };
            SelectProps: {
                MenuProps: {
                    MenuListProps: {
                        sx: {
                            '& .MuiMenuItem-root': {
                                [x: string]: unknown;
                                '@font-face'?: any;
                            };
                        };
                    };
                };
            };
        };
        styleOverrides: {
            root: {
                borderTop: string;
            };
            toolbar: {
                height: number;
            };
            actions: {
                marginRight: any;
            };
            select: {
                '&:focus': {
                    borderRadius: any;
                };
            };
        };
    };
};
