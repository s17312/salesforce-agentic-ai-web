import React from 'react';
import { Theme } from '@mui/material/styles';
import { CheckboxProps } from '@mui/material';
export default function Checkbox(theme: Theme): {
    MuiCheckbox: {
        defaultProps: {
            icon: React.JSX.Element;
            checkedIcon: React.JSX.Element;
            indeterminateIcon: React.JSX.Element;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: CheckboxProps;
            }) => {
                '& svg'?: {
                    width: number;
                    height: number;
                } | undefined;
                padding: any;
            };
        };
    };
};
