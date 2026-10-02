import React from 'react';
import { Theme } from '@mui/material/styles';
import { AlertProps } from '@mui/material';
export default function Alert(theme: Theme): {
    MuiAlert: {
        defaultProps: {
            iconMapping: {
                info: React.JSX.Element;
                success: React.JSX.Element;
                warning: React.JSX.Element;
                error: React.JSX.Element;
            };
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: AlertProps;
            }) => {
                color?: string | undefined;
                border?: string | undefined;
                '& .MuiAlert-icon'?: {
                    color: string;
                } | undefined;
                backgroundColor?: string | undefined;
            }[];
            icon: {
                opacity: number;
            };
        };
    };
    MuiAlertTitle: {
        styleOverrides: {
            root: {
                marginBottom: any;
            };
        };
    };
};
