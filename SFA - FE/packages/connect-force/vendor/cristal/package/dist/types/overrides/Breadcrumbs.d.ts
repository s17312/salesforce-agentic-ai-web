import { Theme } from '@mui/material/styles';
export default function Breadcrumbs(theme: Theme): {
    MuiBreadcrumbs: {
        styleOverrides: {
            separator: {
                marginLeft: any;
                marginRight: any;
            };
            li: {
                display: string;
                margin: any;
                '& > *': {
                    [x: string]: unknown;
                    '@font-face'?: any;
                };
            };
        };
    };
};
