import React from 'react';
//
import { TreeViewCollapseIcon, TreeViewExpandIcon, TreeViewEndIcon } from './CustomIcons';
// ----------------------------------------------------------------------
export default function TreeView(theme) {
    return {
        MuiTreeView: {
            defaultProps: {
                defaultCollapseIcon: React.createElement(TreeViewCollapseIcon, { sx: { width: 20, height: 20 } }),
                defaultExpandIcon: React.createElement(TreeViewExpandIcon, { sx: { width: 20, height: 20 } }),
                defaultEndIcon: React.createElement(TreeViewEndIcon, { sx: { color: 'text.secondary', width: 20, height: 20 } }),
            },
        },
        MuiTreeItem: {
            styleOverrides: {
                label: Object.assign({}, theme.typography.body2),
                iconContainer: {
                    width: 'auto',
                },
            },
        },
    };
}
