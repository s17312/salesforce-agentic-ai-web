import { Theme } from '@mui/material/styles';
export default function Autocomplete(theme: Theme): {
    MuiAutocomplete: {
        styleOverrides: {
            root: {
                '& span.MuiAutocomplete-tag': {
                    width: number;
                    height: number;
                    lineHeight: string;
                    textAlign: string;
                    borderRadius: any;
                    backgroundColor: any;
                    '@font-face'?: any;
                };
            };
            paper: {
                boxShadow: string;
            };
            listbox: {
                padding: any;
            };
            option: {
                padding: any;
                margin: any;
                borderRadius: any;
                '@font-face'?: any;
            };
        };
    };
};
