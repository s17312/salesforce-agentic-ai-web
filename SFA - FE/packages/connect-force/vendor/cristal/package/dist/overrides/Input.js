// @ts-nocheck
import { alpha } from "@mui/material/styles";
// ----------------------------------------------------------------------
export default function Input(theme) {
    return {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    "&.Mui-disabled": {
                        "& svg": {
                            color: theme.palette.text.disabled,
                        },
                    },
                },
                input: {
                    "&::placeholder": {
                        opacity: 1,
                        color: theme.palette.text.disabled,
                    },
                    color: theme.palette.common.black,
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                underline: {
                    "&:before": {
                        borderBottomColor: alpha(theme.palette.grey[500], 0.56),
                    },
                    "&:after": {
                        borderBottomColor: theme.palette.text.primary,
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: theme.palette.text.primary,
                    },
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: alpha(theme.palette.grey[500], 0.4),
                    "&:hover": {
                        backgroundColor: alpha(theme.palette.grey[500], 0.16),
                    },
                    "&.Mui-focused": {
                        backgroundColor: alpha(theme.palette.grey[500], 0.16),
                    },
                    "&.Mui-disabled": {
                        backgroundColor: theme.palette.action.disabledBackground,
                    },
                },
                underline: {
                    "&:before, :after": {
                        display: "none",
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D2D6FB",
                        backgroundColor: alpha(theme.palette.secondary.main, 0.02),
                    },
                    "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 1,
                            borderColor: theme.palette.text.primary,
                            backgroundColor: alpha(theme.palette.secondary.main, 0.02),
                        },
                    },
                    "&.Mui-disabled": {
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.action.disabledBackground,
                            backgroundColor: alpha(theme.palette.secondary.main, 0.07),
                        },
                    },
                },
            },
        },
    };
}
