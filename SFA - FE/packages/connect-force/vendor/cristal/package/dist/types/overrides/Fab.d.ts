import { Theme } from '@mui/material/styles';
import { FabProps } from '@mui/material';
declare module '@mui/material/Fab' {
    interface FabPropsVariantOverrides {
        outlined: true;
        outlinedExtended: true;
        soft: true;
        softExtended: true;
    }
}
export default function Fab(theme: Theme): {
    MuiFab: {
        defaultProps: {
            color: string;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: FabProps;
            }) => ({
                color?: string | undefined;
                backgroundColor?: any;
                '&:hover'?: {
                    backgroundColor: any;
                    border: string;
                } | {
                    backgroundColor: any;
                    border?: undefined;
                } | undefined;
                border?: string | undefined;
                boxShadow?: string | undefined;
            } | {
                backgroundColor?: any;
                '&:hover'?: {
                    backgroundColor: any;
                } | undefined;
                color?: string | undefined;
                boxShadow?: string | undefined;
                border?: string | undefined;
                '&:hover, &:active': {
                    boxShadow: string;
                };
            } | {
                '&.Mui-disabled': {
                    backgroundColor?: string | undefined;
                    border?: string | undefined;
                };
            } | {
                height?: number | undefined;
                minHeight?: number | undefined;
                borderRadius?: number | undefined;
                padding?: any;
                width?: string | undefined;
                '& svg'?: {
                    marginRight: any;
                } | undefined;
            })[];
        };
    };
};
