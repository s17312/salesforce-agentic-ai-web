// ----------------------------------------------------------------------
export default function ControlLabel(theme) {
    return {
        MuiFormControlLabel: {
            styleOverrides: {
                label: Object.assign({}, theme.typography.body2)
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginTop: theme.spacing(1)
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: theme.palette.text.disabled
                }
            }
        }
    };
}
