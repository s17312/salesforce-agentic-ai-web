import { Theme } from '@mui/material/styles';
export default function Stepper(theme: Theme): {
    MuiStepConnector: {
        styleOverrides: {
            line: {
                borderColor: string;
            };
        };
    };
};
