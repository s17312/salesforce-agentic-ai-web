// ----------------------------------------------------------------------
export default function Accordion(theme) {
    return {
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: "#D1D4EF",
                    "&.Mui-expanded": {
                        boxShadow: theme.customShadows.z8,
                        borderRadius: theme.shape.borderRadius,
                        backgroundColor: "#E6E8FA",
                    },
                    "&.Mui-disabled": {
                        backgroundColor: "transparent",
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    fontWeight: 300,
                    color: "#49484D",
                    paddingLeft: theme.spacing(2),
                    paddingRight: theme.spacing(1),
                    "&.Mui-expanded": {
                        color: theme.palette.primary.main,
                        "&.MuiAccordionSummary-expandIconWrapper": {
                            color: theme.palette.primary.main,
                        }
                    },
                    "&.Mui-disabled": {
                        opacity: 1,
                        color: theme.palette.action.disabled,
                        "& .MuiTypography-root": {
                            color: "inherit",
                        },
                    },
                },
                expandIconWrapper: {
                    color: "inherit",
                },
            },
        },
    };
}
