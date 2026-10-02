import { Theme } from "@mui/material";
export default function Accordion(theme: Theme): {
    MuiAccordion: {
        styleOverrides: {
            root: {
                backgroundColor: string;
                "&.Mui-expanded": {
                    boxShadow: string;
                    borderRadius: any;
                    backgroundColor: string;
                };
                "&.Mui-disabled": {
                    backgroundColor: string;
                };
            };
        };
    };
    MuiAccordionSummary: {
        styleOverrides: {
            root: {
                fontWeight: number;
                color: string;
                paddingLeft: any;
                paddingRight: any;
                "&.Mui-expanded": {
                    color: string;
                    "&.MuiAccordionSummary-expandIconWrapper": {
                        color: string;
                    };
                };
                "&.Mui-disabled": {
                    opacity: number;
                    color: string;
                    "& .MuiTypography-root": {
                        color: string;
                    };
                };
            };
            expandIconWrapper: {
                color: string;
            };
        };
    };
};
