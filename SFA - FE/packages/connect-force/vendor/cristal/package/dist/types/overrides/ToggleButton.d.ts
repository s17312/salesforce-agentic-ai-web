import { Theme } from '@mui/material/styles';
import { ToggleButtonProps } from '@mui/material';
export default function ToggleButton(theme: Theme): {
    MuiToggleButton: {
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: ToggleButtonProps;
            }) => ({
                '&.Mui-selected'?: {
                    borderColor: string;
                } | undefined;
            } | {
                '&.Mui-disabled': {
                    '&.Mui-selected': {
                        color: string;
                        backgroundColor: string;
                        borderColor: string;
                    };
                };
            })[];
        };
    };
    MuiToggleButtonGroup: {
        styleOverrides: {
            root: {
                borderRadius: any;
                backgroundColor: string;
                border: string;
            };
            grouped: {
                margin: number;
                borderColor: string;
                borderRadius: string;
            };
        };
    };
};
