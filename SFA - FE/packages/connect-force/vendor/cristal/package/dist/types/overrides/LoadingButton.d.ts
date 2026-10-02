import { Theme } from '@mui/material/styles';
export default function LoadingButton(theme: Theme): {
    MuiLoadingButton: {
        variants: ({
            props: {
                loading: boolean;
                loadingPosition: string;
                size: string;
            };
            style: {
                '& .MuiLoadingButton-loadingIndicatorStart': {
                    left: number;
                };
                '& .MuiLoadingButton-loadingIndicatorEnd'?: undefined;
            };
        } | {
            props: {
                loading: boolean;
                loadingPosition: string;
                size: string;
            };
            style: {
                '& .MuiLoadingButton-loadingIndicatorEnd': {
                    right: number;
                };
                '& .MuiLoadingButton-loadingIndicatorStart'?: undefined;
            };
        })[];
        styleOverrides: {
            loadingIndicatorStart: {
                left: number;
            };
            loadingIndicatorEnd: {
                right: number;
            };
        };
    };
};
