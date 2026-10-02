import React from 'react';
import { Theme } from '@mui/material/styles';
import { RadioProps } from '@mui/material';
export default function Radio(theme: Theme): {
    MuiRadio: {
        defaultProps: {
            icon: React.JSX.Element;
            checkedIcon: React.JSX.Element;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: RadioProps;
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
