import { Theme } from '@mui/material/styles';
import { LinearProgressProps } from '@mui/material';
export default function Progress(theme: Theme): {
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: LinearProgressProps;
            }) => {
                backgroundColor?: any;
            }[];
        };
    };
};
