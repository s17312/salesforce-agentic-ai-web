import { Theme } from '@mui/material/styles';
export default function SvgIcon(theme: Theme): {
    MuiSvgIcon: {
        styleOverrides: {
            fontSizeLarge: {
                width: number;
                height: number;
                fontSize: string;
            };
        };
    };
};
