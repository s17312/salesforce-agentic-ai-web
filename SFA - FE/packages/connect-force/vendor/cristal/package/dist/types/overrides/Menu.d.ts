import { Theme } from "@mui/material/styles";
export default function Menu(theme: Theme): {
    MuiMenuItem: {
        styleOverrides: {
            root: {
                "&.Mui-selected": {
                    backgroundColor: string;
                    "&:hover": {
                        backgroundColor: string;
                    };
                };
                color: string;
            };
        };
    };
};
