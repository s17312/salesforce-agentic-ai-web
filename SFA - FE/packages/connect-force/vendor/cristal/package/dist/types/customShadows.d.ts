interface CustomShadowOptions {
    z1: string;
    z4: string;
    z8: string;
    z12: string;
    z16: string;
    z20: string;
    z24: string;
    primary: string;
    secondary: string;
    info: string;
    success: string;
    warning: string;
    error: string;
    card: string;
    dialog: string;
    dropdown: string;
}
declare module '@mui/material/styles' {
    interface Theme {
        customShadows: CustomShadowOptions;
    }
    interface ThemeOptions {
        customShadows?: CustomShadowOptions;
    }
}
export default function customShadows(themeMode: 'light' | 'dark'): {
    z1: string;
    z4: string;
    z8: string;
    z12: string;
    z16: string;
    z20: string;
    z24: string;
    primary: string;
    info: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    card: string;
    dialog: string;
    dropdown: string;
};
export {};
