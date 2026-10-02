// @ts-nocheck
import React from 'react';
//
import { CheckboxIcon, CheckboxCheckedIcon, CheckboxIndeterminateIcon } from './CustomIcons';
// ----------------------------------------------------------------------
export default function Checkbox(theme) {
    return {
        MuiCheckbox: {
            defaultProps: {
                icon: React.createElement(CheckboxIcon, null),
                checkedIcon: React.createElement(CheckboxCheckedIcon, null),
                indeterminateIcon: React.createElement(CheckboxIndeterminateIcon, null),
            },
            styleOverrides: {
                root: ({ ownerState }) => (Object.assign(Object.assign({ padding: theme.spacing(1) }, (ownerState.size === 'small' && {
                    '& svg': { width: 20, height: 20 },
                })), (ownerState.size === 'medium' && {
                    '& svg': { width: 24, height: 24 },
                }))),
            },
        },
    };
}
