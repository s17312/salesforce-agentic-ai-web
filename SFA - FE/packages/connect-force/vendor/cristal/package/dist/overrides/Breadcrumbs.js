// ----------------------------------------------------------------------
export default function Breadcrumbs(theme) {
    return {
        MuiBreadcrumbs: {
            styleOverrides: {
                separator: {
                    marginLeft: theme.spacing(2),
                    marginRight: theme.spacing(2),
                },
                li: {
                    display: 'inline-flex',
                    margin: theme.spacing(0.25, 0),
                    '& > *': Object.assign({}, theme.typography.body2),
                },
            },
        },
    };
}
