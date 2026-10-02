import { Theme } from '@mui/material/styles';
export default function Timeline(theme: Theme): {
    MuiTimelineDot: {
        styleOverrides: {
            root: {
                boxShadow: string;
            };
        };
    };
    MuiTimelineConnector: {
        styleOverrides: {
            root: {
                backgroundColor: string;
            };
        };
    };
};
