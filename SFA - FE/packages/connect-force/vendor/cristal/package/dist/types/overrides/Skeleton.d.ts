import { Theme } from '@mui/material/styles';
export default function Skeleton(theme: Theme): {
    MuiSkeleton: {
        defaultProps: {
            animation: string;
        };
        styleOverrides: {
            root: {
                backgroundColor: string;
            };
        };
    };
};
