import React from 'react';
import { Theme } from '@mui/material/styles';
import { ChipProps } from '@mui/material';
declare module '@mui/material/Chip' {
    interface ChipPropsVariantOverrides {
        soft: true;
    }
}
export default function Chip(theme: Theme): {
    MuiChip: {
        defaultProps: {
            deleteIcon: React.JSX.Element;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: ChipProps;
            }) => ({
                color?: string | undefined;
                backgroundColor?: any;
                '&:hover'?: {
                    backgroundColor: any;
                } | undefined;
                '& .MuiChip-deleteIcon'?: {
                    color: any;
                    '&:hover': {
                        color: string;
                    };
                } | undefined;
                '& .MuiChip-avatar'?: {
                    color: string;
                    backgroundColor: string;
                } | undefined;
            } | {
                color?: string | undefined;
                backgroundColor?: any;
                '&:hover'?: {
                    backgroundColor: any;
                } | undefined;
                border?: string | undefined;
                '& .MuiChip-avatar'?: {
                    color: string;
                    backgroundColor: any;
                } | undefined;
            })[];
        };
    };
};
