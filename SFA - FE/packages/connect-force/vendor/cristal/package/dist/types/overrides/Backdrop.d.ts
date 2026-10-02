import { Theme } from '@mui/material/styles';
export default function Backdrop(theme: Theme): {
    MuiBackdrop: {
        styleOverrides: {
            root: {
                backgroundColor: any;
            };
            invisible: {
                background: string;
            };
        };
    };
};
