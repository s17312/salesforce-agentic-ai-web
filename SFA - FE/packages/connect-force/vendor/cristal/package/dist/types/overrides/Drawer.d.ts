import { Theme } from '@mui/material/styles';
import { DrawerProps } from '@mui/material';
export default function Drawer(theme: Theme): {
    MuiDrawer: {
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: DrawerProps;
            }) => {
                '& .MuiDrawer-paper'?: {
                    boxShadow: string;
                } | undefined;
            };
        };
    };
};
