// @ts-nocheck
import React from 'react';
//
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './CustomIcons';
// ----------------------------------------------------------------------
const COLORS = ['info', 'success', 'warning', 'error'];
export default function Alert(theme) {
    const isLight = theme.palette.mode === 'light';
    const rootStyle = (ownerState) => {
        const standardVariant = ownerState.variant === 'standard';
        const filledVariant = ownerState.variant === 'filled';
        const outlinedVariant = ownerState.variant === 'outlined';
        const colorStyle = COLORS.map((color) => (Object.assign({}, (ownerState.severity === color && Object.assign(Object.assign(Object.assign({}, (standardVariant && {
            color: theme.palette[color][isLight ? 'darker' : 'lighter'],
            backgroundColor: theme.palette[color][isLight ? 'lighter' : 'darker'],
            '& .MuiAlert-icon': {
                color: theme.palette[color][isLight ? 'main' : 'light'],
            },
        })), (filledVariant && {
            color: theme.palette[color].contrastText,
            backgroundColor: theme.palette[color].main,
        })), (outlinedVariant && {
            color: theme.palette[color][isLight ? 'dark' : 'light'],
            border: `solid 1px ${theme.palette[color].main}`,
            '& .MuiAlert-icon': {
                color: theme.palette[color].main,
            },
        }))))));
        return [...colorStyle];
    };
    return {
        MuiAlert: {
            defaultProps: {
                iconMapping: {
                    info: React.createElement(InfoIcon, null),
                    success: React.createElement(SuccessIcon, null),
                    warning: React.createElement(WarningIcon, null),
                    error: React.createElement(ErrorIcon, null),
                },
            },
            styleOverrides: {
                root: ({ ownerState }) => rootStyle(ownerState),
                icon: {
                    opacity: 1,
                },
            },
        },
        MuiAlertTitle: {
            styleOverrides: {
                root: {
                    marginBottom: theme.spacing(0.5),
                },
            },
        },
    };
}
