import React from 'react';
import { Theme } from '@mui/material/styles';
export default function Rating(theme: Theme): {
    MuiRating: {
        defaultProps: {
            emptyIcon: React.JSX.Element;
            icon: React.JSX.Element;
        };
        styleOverrides: {
            root: {
                '&.Mui-disabled': {
                    opacity: number;
                };
            };
            iconEmpty: {
                color: any;
            };
            sizeSmall: {
                '& svg': {
                    width: number;
                    height: number;
                };
            };
            sizeLarge: {
                '& svg': {
                    width: number;
                    height: number;
                };
            };
        };
    };
};
