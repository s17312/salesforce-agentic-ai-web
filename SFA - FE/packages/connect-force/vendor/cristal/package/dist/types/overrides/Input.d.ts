import { Theme } from "@mui/material/styles";
export default function Input(theme: Theme): {
    MuiInputBase: {
        styleOverrides: {
            root: {
                "&.Mui-disabled": {
                    "& svg": {
                        color: string;
                    };
                };
            };
            input: {
                "&::placeholder": {
                    opacity: number;
                    color: string;
                };
                color: string;
            };
        };
    };
    MuiInput: {
        styleOverrides: {
            underline: {
                "&:before": {
                    borderBottomColor: any;
                };
                "&:after": {
                    borderBottomColor: string;
                };
            };
        };
    };
    MuiTextField: {
        styleOverrides: {
            root: {
                "& .MuiInputLabel-root.Mui-focused": {
                    color: string;
                };
            };
        };
    };
    MuiFilledInput: {
        styleOverrides: {
            root: {
                borderRadius: any;
                backgroundColor: any;
                "&:hover": {
                    backgroundColor: any;
                };
                "&.Mui-focused": {
                    backgroundColor: any;
                };
                "&.Mui-disabled": {
                    backgroundColor: string;
                };
            };
            underline: {
                "&:before, :after": {
                    display: string;
                };
            };
        };
    };
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: string;
                    backgroundColor: any;
                };
                "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderWidth: number;
                        borderColor: string;
                        backgroundColor: any;
                    };
                };
                "&.Mui-disabled": {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: string;
                        backgroundColor: any;
                    };
                };
            };
        };
    };
};
