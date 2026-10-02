// @ts-nocheck
import React from 'react';
//
import { RadioIcon, RadioCheckedIcon } from './CustomIcons';
// ----------------------------------------------------------------------
export default function Radio(theme) {
    return {
        MuiRadio: {
            defaultProps: {
                icon: React.createElement(RadioIcon, null),
                checkedIcon: React.createElement(RadioCheckedIcon, null),
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
