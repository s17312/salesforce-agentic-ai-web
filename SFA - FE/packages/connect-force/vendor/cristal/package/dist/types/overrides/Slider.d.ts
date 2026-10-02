import { Theme } from '@mui/material/styles';
export default function Slider(theme: Theme): {
    MuiSlider: {
        defaultProps: {
            size: string;
        };
        styleOverrides: {
            root: {
                '&.Mui-disabled': {
                    color: string;
                };
            };
            rail: {
                opacity: number;
            };
            markLabel: {
                fontSize: number;
                color: string;
            };
            valueLabel: {
                borderRadius: number;
                backgroundColor: string;
            };
        };
    };
};
