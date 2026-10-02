import { Theme } from '@mui/material/styles';
import { PaginationProps } from '@mui/material';
declare module '@mui/material/Pagination' {
    interface PaginationPropsVariantOverrides {
        soft: true;
    }
    interface PaginationPropsColorOverrides {
        info: true;
        success: true;
        warning: true;
        error: true;
    }
}
export default function Pagination(theme: Theme): {
    MuiPagination: {
        defaultProps: {
            color: string;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: PaginationProps;
            }) => ({
                '& .MuiPaginationItem-root'?: {
                    '&.Mui-selected': {
                        color: string;
                        backgroundColor: any;
                        '&:hover': {
                            backgroundColor: any;
                        };
                    };
                } | undefined;
            } | {
                '& .MuiPaginationItem-root': {
                    '&.Mui-selected': {
                        fontWeight: any;
                    };
                    borderColor?: any;
                };
            })[];
        };
    };
};
