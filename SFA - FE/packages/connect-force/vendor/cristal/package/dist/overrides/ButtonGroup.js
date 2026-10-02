import { alpha } from '@mui/material/styles';
// ----------------------------------------------------------------------
const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];
export default function ButtonGroup(theme) {
    const rootStyle = (ownerState) => {
        const inheritColor = ownerState.color === 'inherit';
        const containedVariant = ownerState.variant === 'contained';
        const outlinedVariant = ownerState.variant === 'outlined';
        const textVariant = ownerState.variant === 'text';
        const softVariant = ownerState.variant === 'soft';
        const horizontalOrientation = ownerState.orientation === 'horizontal';
        const verticalOrientation = ownerState.orientation === 'vertical';
        const defaultStyle = {
            '& .MuiButtonGroup-grouped': {
                '&:not(:last-of-type)': Object.assign({}, (!outlinedVariant && Object.assign(Object.assign(Object.assign({ borderStyle: 'solid' }, (inheritColor && {
                    borderColor: alpha(theme.palette.grey[500], 0.32),
                })), (horizontalOrientation && {
                    borderWidth: '0px 1px 0px 0px',
                })), (verticalOrientation && {
                    borderWidth: '0px 0px 1px 0px',
                })))),
            },
        };
        const colorStyle = COLORS.map((color) => ({
            '& .MuiButtonGroup-grouped': {
                '&:not(:last-of-type)': Object.assign({}, (!outlinedVariant && Object.assign({}, (ownerState.color === color && Object.assign(Object.assign(Object.assign({}, (containedVariant && {
                    borderColor: alpha(theme.palette[color].dark, 0.48),
                })), (textVariant && {
                    borderColor: alpha(theme.palette[color].main, 0.48),
                })), (softVariant && {
                    borderColor: alpha(theme.palette[color].dark, 0.24),
                })))))),
            },
        }));
        const disabledState = {
            '& .MuiButtonGroup-grouped.Mui-disabled': {
                '&:not(:last-of-type)': {
                    borderColor: theme.palette.action.disabledBackground,
                },
            },
        };
        return [...colorStyle, defaultStyle, disabledState];
    };
    return {
        MuiButtonGroup: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: ({ ownerState }) => rootStyle(ownerState),
            },
        },
    };
}
