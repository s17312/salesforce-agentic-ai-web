import { Theme } from '@mui/material/styles';
import { SwitchProps } from '@mui/material';
export default function Switch(theme: Theme): {
    MuiSwitch: {
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: SwitchProps;
            }) => {
                '& .MuiSwitch-thumb': {
                    width: number;
                    height: number;
                    boxShadow: string;
                    color: string;
                };
                '& .MuiSwitch-track': {
                    opacity: number;
                    borderRadius: number;
                    backgroundColor: any;
                };
                '& .MuiSwitch-switchBase': {
                    '&.Mui-checked': {
                        transform: string;
                        '&+.MuiSwitch-track': {
                            opacity: number;
                        };
                    };
                    '&.Mui-disabled': {
                        '& .MuiSwitch-thumb': {
                            opacity: number;
                        };
                        '&+.MuiSwitch-track': {
                            opacity: number;
                        };
                    };
                    padding: number;
                    left: number;
                };
                padding: string;
                width: number;
                height: number;
            };
        };
    };
};
