import { Theme } from "@mui/material/styles";
export default function Paper(theme: Theme): {
    MuiPaper: {
        defaultProps: {
            elevation: number;
        };
        styleOverrides: {
            root: {
                backgroundImage: string;
                backgroundColor: string;
                backdropFilter: string;
            };
        };
    };
};
