import { Theme } from '@mui/material/styles';
export default function Avatar(theme: Theme): {
    MuiAvatar: {
        styleOverrides: {
            colorDefault: {
                color: string;
                backgroundColor: any;
            };
        };
    };
    MuiAvatarGroup: {
        defaultProps: {
            max: number;
        };
        styleOverrides: {
            root: {
                justifyContent: string;
            };
            avatar: {
                fontSize: number;
                fontWeight: any;
                '&:first-of-type': {
                    fontSize: number;
                    color: string;
                    backgroundColor: string;
                };
            };
        };
    };
};
