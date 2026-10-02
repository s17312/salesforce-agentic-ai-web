import { Theme } from "@mui/material/styles";
import { TabProps } from "@mui/material";
export default function Tabs(theme: Theme): {
    MuiTabs: {
        defaultProps: {
            allowScrollButtonsMobile: boolean;
            variant: string;
        };
        styleOverrides: {
            scrollButtons: {
                width: number;
                borderRadius: string;
            };
        };
    };
    MuiTab: {
        defaultProps: {
            disableRipple: boolean;
            iconPosition: string;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: TabProps;
            }) => {
                "&.Mui-selected": {
                    color: string;
                    background: string;
                    paddingLeft: any;
                    paddingRight: any;
                    borderTopLeftRadius: string;
                    borderTopRightRadius: string;
                };
                minHeight?: number | undefined;
                padding: number;
                opacity: number;
                minWidth: number;
                fontWeight: any;
                "&:not(:last-of-type)": {
                    [x: number]: {};
                };
                "&:not(.Mui-selected)": {
                    color: string;
                    paddingLeft: any;
                    paddingRight: any;
                };
            };
        };
    };
    MuiTabPanel: {
        styleOverrides: {
            root: {
                boxShadow: string;
            };
        };
    };
};
