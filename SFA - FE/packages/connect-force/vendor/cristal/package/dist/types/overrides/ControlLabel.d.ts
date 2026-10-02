import { Theme } from '@mui/material/styles';
export default function ControlLabel(theme: Theme): {
    MuiFormControlLabel: {
        styleOverrides: {
            label: {
                [x: string]: unknown;
                '@font-face'?: any;
            };
        };
    };
    MuiFormHelperText: {
        styleOverrides: {
            root: {
                marginTop: any;
            };
        };
    };
    MuiFormLabel: {
        styleOverrides: {
            root: {
                color: string;
            };
        };
    };
};
