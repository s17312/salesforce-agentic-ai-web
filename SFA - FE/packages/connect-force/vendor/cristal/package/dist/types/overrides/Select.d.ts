import { Theme } from '@mui/material/styles';
import { InputSelectIcon } from './CustomIcons';
export default function Select(theme: Theme): {
    MuiSelect: {
        defaultProps: {
            IconComponent: typeof InputSelectIcon;
        };
        styleOverrides: {
            root: {
                backgroundColor: any;
                color: string;
                '&:hover': {
                    backgroundColor: any;
                };
                '&.Mui-focused': {
                    backgroundColor: any;
                };
                '&.Mui-disabled': {
                    backgroundColor: string;
                };
                '&.MuiSelect-nativeInput': {
                    backgroundColor: string;
                    color: string;
                };
            };
            underline: {
                '&:before, :after': {
                    display: string;
                };
            };
        };
    };
};
