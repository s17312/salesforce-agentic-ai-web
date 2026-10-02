import { Theme } from '@mui/material/styles';
import { ButtonGroupProps } from '@mui/material';
declare module '@mui/material/ButtonGroup' {
    interface ButtonGroupPropsVariantOverrides {
        soft: true;
    }
}
export default function ButtonGroup(theme: Theme): {
    MuiButtonGroup: {
        defaultProps: {
            disableElevation: boolean;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: ButtonGroupProps;
            }) => ({
                '& .MuiButtonGroup-grouped': {
                    '&:not(:last-of-type)': {
                        borderColor?: any;
                    };
                };
            } | {
                '& .MuiButtonGroup-grouped.Mui-disabled': {
                    '&:not(:last-of-type)': {
                        borderColor: string;
                    };
                };
            })[];
        };
    };
};
