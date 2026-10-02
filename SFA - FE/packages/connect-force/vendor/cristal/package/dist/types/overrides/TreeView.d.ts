import React from 'react';
import { Theme } from '@mui/material/styles';
export default function TreeView(theme: Theme): {
    MuiTreeView: {
        defaultProps: {
            defaultCollapseIcon: React.JSX.Element;
            defaultExpandIcon: React.JSX.Element;
            defaultEndIcon: React.JSX.Element;
        };
    };
    MuiTreeItem: {
        styleOverrides: {
            label: {
                [x: string]: unknown;
                '@font-face'?: any;
            };
            iconContainer: {
                width: string;
            };
        };
    };
};
