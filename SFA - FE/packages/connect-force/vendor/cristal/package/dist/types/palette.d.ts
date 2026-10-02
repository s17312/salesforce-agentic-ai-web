export type ColorSchema = "primary" | "secondary" | "info" | "success" | "warning" | "error";
declare module "@mui/material/styles/createPalette" {
    interface TypeBackground {
        neutral: string;
    }
    interface SimplePaletteColorOptions {
        lighter: string;
        darker: string;
    }
    interface PaletteColor {
        lighter: string;
        darker: string;
    }
}
export default function palette(): {
    readonly mode: "light";
    readonly text: {
        readonly primary: "#666B71";
        readonly secondary: "#000";
        readonly disabled: "#666B71";
    };
    readonly background: {
        readonly paper: any;
        readonly default: any;
        readonly neutral: any;
    };
    readonly filter: {
        readonly paper: "blur(9px)";
        readonly default: "blur(5px)";
        readonly neutral: "blur(5px)";
    };
    readonly action: {
        readonly active: string;
        readonly btnHover: string;
        readonly hover: string;
        readonly selected: any;
        readonly disabled: any;
        readonly disabledBackground: any;
        readonly focus: any;
        readonly hoverOpacity: number;
        readonly disabledOpacity: number;
    };
    readonly common: {
        black: string;
        white: string;
        background: string;
    };
    readonly primary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly secondary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly info: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly success: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly warning: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly error: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly grey: {
        0: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
    readonly divider: string;
};
