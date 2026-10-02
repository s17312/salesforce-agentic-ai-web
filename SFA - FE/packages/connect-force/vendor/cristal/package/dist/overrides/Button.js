import { alpha } from '@mui/material/styles';
// ----------------------------------------------------------------------
const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];
export default function Button(theme) {
    const rootStyle = (ownerState) => {
        const inheritColor = ownerState.color === 'inherit';
        const containedVariant = ownerState.variant === 'contained';
        const outlinedVariant = ownerState.variant === 'outlined';
        const textVariant = ownerState.variant === 'text';
        const softVariant = ownerState.variant === 'soft';
        const smallSize = ownerState.size === 'small';
        const largeSize = ownerState.size === 'large';
        const defaultStyle = Object.assign(Object.assign({}, (containedVariant && {
            color: `${theme.palette.common.white} !important`,
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: 'transparent',
            background: theme.palette.primary.main,
            '&:hover': {
                boxShadow: theme.customShadows.z8,
                backgroundColor: theme.palette.action.btnHover,
            },
        })), (inheritColor && Object.assign(Object.assign(Object.assign(Object.assign({}, (containedVariant && {
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: 'transparent',
            background: theme.palette.primary.main,
            '&:hover': {
                boxShadow: theme.customShadows.z8,
                backgroundColor: theme.palette.action.hover,
            },
        })), (outlinedVariant && {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.6),
            },
        })), (textVariant && {
            color: theme.palette.primary.main,
            '&:hover': {
                backgroundColor: theme.palette.action.hover,
            },
        })), (softVariant && {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.lighter,
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.lighter, 0.6),
            },
        }))));
        const colorStyle = COLORS.map((color) => (Object.assign({}, (ownerState.color === color && Object.assign(Object.assign({}, (containedVariant && {
            backgroundColor: color,
            '&:hover': {
                boxShadow: theme.customShadows[color],
                backgroundColor: alpha(theme.palette[color].main, 0.8),
            },
        })), (softVariant && {
            color: theme.palette[color],
            backgroundColor: alpha(theme.palette[color].main, 0.4),
            '&:hover': {
                backgroundColor: alpha(theme.palette[color].main, 0.6),
            },
        }))))));
        const disabledState = {
            '&.Mui-disabled': Object.assign({}, (softVariant && {
                backgroundColor: theme.palette.action.disabledBackground,
            })),
        };
        const size = Object.assign(Object.assign({}, (smallSize && Object.assign({ height: 30, fontSize: 13 }, (softVariant && {
            padding: '4px 10px',
        })))), (largeSize && Object.assign({ height: 48, fontSize: 15 }, (softVariant && {
            padding: '8px 22px',
        }))));
        return [...colorStyle, defaultStyle, disabledState, size];
    };
    return {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: ({ ownerState }) => rootStyle(ownerState),
            },
        },
    };
}
