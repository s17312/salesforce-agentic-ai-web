import { Theme } from '@mui/material/styles';
export default function DatePicker(theme: Theme): {
    MuiDatePicker: {
        defaultProps: {
            inputFormat: string;
        };
    };
};
