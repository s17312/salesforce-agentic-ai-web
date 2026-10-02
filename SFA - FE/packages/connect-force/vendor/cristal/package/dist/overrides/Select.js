import { alpha } from '@mui/material/styles';
//
import { InputSelectIcon } from './CustomIcons';
// ----------------------------------------------------------------------
export default function Select(theme) {
    return {
        MuiSelect: {
            defaultProps: {
                IconComponent: InputSelectIcon,
            },
            styleOverrides: {
                root: {
                    backgroundColor: alpha(theme.palette.grey[400], 0.4),
                    color: theme.palette.common.black,
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.grey[400], 0.16),
                    },
                    '&.Mui-focused': {
                        backgroundColor: alpha(theme.palette.grey[400], 0.16),
                    },
                    '&.Mui-disabled': {
                        backgroundColor: theme.palette.action.disabledBackground,
                    },
                    '&.MuiSelect-nativeInput': {
                        backgroundColor: theme.palette.common.white,
                        color: theme.palette.common.black
                    },
                },
                underline: {
                    '&:before, :after': {
                        display: 'none',
                    },
                },
            },
        },
    };
}
