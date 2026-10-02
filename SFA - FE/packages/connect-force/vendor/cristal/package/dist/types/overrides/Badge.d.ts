import { Theme } from '@mui/material/styles';
export default function Badge(theme: Theme): {
    MuiBadge: {
        styleOverrides: {
            dot: {
                width: number;
                height: number;
                borderRadius: string;
            };
        };
    };
};
