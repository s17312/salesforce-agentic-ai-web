import { Theme } from "@mui/material/styles";
export default function Card(theme: Theme): {
    MuiCard: {
        styleOverrides: {
            root: {
                position: string;
                boxShadow: string;
                "backdrop-filter": string;
                borderRadius: number;
                zIndex: number;
                backgroundColor: string;
                backdropFilter: string;
            };
        };
    };
    MuiCardHeader: {
        defaultProps: {
            titleTypographyProps: {
                variant: string;
            };
            subheaderTypographyProps: {
                variant: string;
                marginTop: any;
            };
        };
        styleOverrides: {
            root: {
                padding: any;
            };
        };
    };
    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: any;
            };
        };
    };
};
