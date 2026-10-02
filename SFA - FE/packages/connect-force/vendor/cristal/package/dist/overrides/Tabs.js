// ----------------------------------------------------------------------
export default function Tabs(theme) {
    return {
        MuiTabs: {
            defaultProps: {
                // textColor: 'inherit',
                allowScrollButtonsMobile: true,
                variant: "scrollable",
            },
            styleOverrides: {
                scrollButtons: {
                    width: 48,
                    borderRadius: "50%",
                },
            },
        },
        MuiTab: {
            defaultProps: {
                disableRipple: true,
                iconPosition: "start",
            },
            styleOverrides: {
                root: ({ ownerState }) => (Object.assign(Object.assign({ padding: 0, opacity: 1, minWidth: 48, fontWeight: theme.typography.fontWeightMedium, "&:not(:last-of-type)": {
                        // marginRight: theme.spacing(3),
                        [theme.breakpoints.up("sm")]: {
                        // marginRight: theme.spacing(5),
                        },
                    }, "&:not(.Mui-selected)": {
                        color: theme.palette.primary.main,
                        paddingLeft: theme.spacing(5),
                        paddingRight: theme.spacing(5),
                    } }, ((ownerState.iconPosition === "start" ||
                    ownerState.iconPosition === "end") && {
                    minHeight: 48,
                })), { "&.Mui-selected": {
                        color: theme.palette.common.white,
                        background: theme.palette.primary.main,
                        paddingLeft: theme.spacing(5),
                        paddingRight: theme.spacing(5),
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                    } })),
            },
        },
        MuiTabPanel: {
            styleOverrides: {
                root: {
                    // backgroundColor: theme.palette.primary.main,
                    // padding: theme.spacing(3),
                    // border: `1px solid ${theme.palette.primary.main}`,
                    // borderBottomLeftRadius: "12px",
                    // borderBottomRightRadius: "12px",
                    boxShadow: theme.shadows[1],
                },
            },
        },
    };
}
