import { Theme } from '@mui/material/styles';
import { ButtonProps } from '@mui/material';
declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        soft: true;
    }
}
export default function Button(theme: Theme): {
    MuiButton: {
        defaultProps: {
            disableElevation: boolean;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: ButtonProps;
            }) => ({
                color?: import("@mui/material").PaletteColor | undefined;
                backgroundColor?: any;
                '&:hover'?: {
                    boxShadow: string;
                    backgroundColor: any;
                } | {
                    backgroundColor: any;
                    boxShadow?: undefined;
                } | undefined;
            } | {
                color?: string | undefined;
                backgroundColor?: string | undefined;
                '&:hover'?: {
                    boxShadow: string;
                    backgroundColor: string;
                    borderColor?: undefined;
                } | {
                    borderColor: string;
                    backgroundColor: any;
                    boxShadow?: undefined;
                } | {
                    backgroundColor: any;
                    boxShadow?: undefined;
                    borderColor?: undefined;
                } | undefined;
                borderColor?: string | undefined;
                borderStyle?: string | undefined;
                borderWidth?: string | undefined;
                background?: string | undefined;
            } | {
                '&.Mui-disabled': {
                    backgroundColor?: string | undefined;
                };
            } | {
                padding?: string | undefined;
                height?: number | undefined;
                fontSize?: number | undefined;
            })[];
        };
    };
};
