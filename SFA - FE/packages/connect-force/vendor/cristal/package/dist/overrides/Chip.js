import React from 'react';
import { alpha } from '@mui/material/styles';
//
import { CloseIcon } from './CustomIcons';
// ----------------------------------------------------------------------
const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];
export default function Chip(theme) {
    const isLight = theme.palette.mode === 'light';
    const rootStyle = (ownerState) => {
        const defaultColor = ownerState.color === 'default';
        const filledVariant = ownerState.variant === 'filled';
        const outlinedVariant = ownerState.variant === 'outlined';
        const softVariant = ownerState.variant === 'soft';
        const defaultStyle = Object.assign({}, (defaultColor && Object.assign(Object.assign({ '& .MuiChip-avatar': {
                color: theme.palette.text[isLight ? 'secondary' : 'primary'],
                backgroundColor: alpha(theme.palette.grey[500], 0.48),
            } }, (outlinedVariant && {
            border: `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        })), (softVariant && {
            color: theme.palette.text.primary,
            backgroundColor: alpha(theme.palette.grey[500], 0.16),
            '&:hover': {
                backgroundColor: alpha(theme.palette.grey[500], 0.32),
            },
        }))));
        const colorStyle = COLORS.map((color) => (Object.assign({}, (ownerState.color === color && Object.assign(Object.assign({ '& .MuiChip-avatar': {
                color: theme.palette[color].lighter,
                backgroundColor: theme.palette[color].dark,
            } }, (filledVariant && {
            '& .MuiChip-deleteIcon': {
                color: alpha(theme.palette[color].contrastText, 0.56),
                '&:hover': {
                    color: theme.palette[color].contrastText,
                },
            },
        })), (softVariant && {
            color: theme.palette[color][isLight ? 'dark' : 'light'],
            backgroundColor: alpha(theme.palette[color].main, 0.16),
            '&:hover': {
                backgroundColor: alpha(theme.palette[color].main, 0.32),
            },
            '& .MuiChip-deleteIcon': {
                color: alpha(theme.palette[color][isLight ? 'dark' : 'light'], 0.48),
                '&:hover': {
                    color: theme.palette[color].dark,
                },
            },
        }))))));
        return [...colorStyle, defaultStyle];
    };
    return {
        MuiChip: {
            defaultProps: {
                deleteIcon: React.createElement(CloseIcon, null),
            },
            styleOverrides: {
                root: ({ ownerState }) => rootStyle(ownerState),
            },
        },
    };
}
