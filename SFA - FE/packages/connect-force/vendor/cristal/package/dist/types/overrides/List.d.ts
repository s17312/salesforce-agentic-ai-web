import { Theme } from '@mui/material/styles';
export default function List(theme: Theme): {
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                color: string;
                minWidth: string;
                marginRight: any;
            };
        };
    };
    MuiListItemAvatar: {
        styleOverrides: {
            root: {
                minWidth: string;
                marginRight: any;
            };
        };
    };
    MuiListItemText: {
        styleOverrides: {
            root: {
                marginTop: number;
                marginBottom: number;
            };
            multiline: {
                marginTop: number;
                marginBottom: number;
            };
        };
    };
};
