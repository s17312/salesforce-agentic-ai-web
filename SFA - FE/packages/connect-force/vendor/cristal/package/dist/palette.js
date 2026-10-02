import { alpha } from "@mui/material/styles";
// SETUP COLORS
const GREY = {
    0: "#FFFFFF",
    100: "#F9FAFB",
    200: "#F4F6F8",
    300: "#DFE3E8",
    400: "#C4CDD5",
    500: "#919EAB",
    600: "#637381",
    700: "#454F5B",
    800: "#212B36",
    900: "#161C24",
};
const PRIMARY = {
    lighter: "#c9cff3",
    light: "#D3D8FD",
    main: "#070E4D",
    dark: "#6575DC",
    darker: "#4F2DB2",
    contrastText: "#fff",
};
const SECONDARY = {
    lighter: "#D6E4FF",
    light: "#84A9FF",
    main: "#38465514",
    dark: "#1939B7",
    darker: "#091A7A",
    contrastText: "#fff",
};
const INFO = {
    lighter: "#CAFDF5",
    light: "#61F3F3",
    main: "#00B8D9",
    dark: "#006C9C",
    darker: "#003768",
    contrastText: "#fff",
};
const SUCCESS = {
    lighter: "#D8FBDE",
    light: "#86E8AB",
    main: "#36B37E",
    dark: "#1B806A",
    darker: "#0A5554",
    contrastText: "#fff",
};
const WARNING = {
    lighter: "#FFF5CC",
    light: "#FFD666",
    main: "#FFAB00",
    dark: "#B76E00",
    darker: "#7A4100",
    contrastText: GREY[800],
};
const ERROR = {
    lighter: "#FFE9D5",
    light: "#FFAC82",
    main: "#FF5630",
    dark: "#B71D18",
    darker: "#7A0916",
    contrastText: "#fff",
};
const COMMON = {
    common: {
        black: "#000",
        white: "#fff",
        background: "linear-gradient(181.79deg, #DADEE4 -1.04%, #2163D7 52.25%)",
    },
    primary: PRIMARY,
    secondary: SECONDARY,
    info: INFO,
    success: SUCCESS,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    divider: "#fff",
    action: {
        btnHover: "#2D3675",
        hover: "rgb(225, 212, 250, 0.4)",
        selected: alpha(GREY[500], 0.16),
        disabled: alpha(GREY[500], 0.8),
        disabledBackground: alpha(PRIMARY.main, 0.24),
        focus: alpha(GREY[500], 0.24),
        hoverOpacity: 0.08,
        disabledOpacity: 0.48,
    },
};
export default function palette() {
    const crystal = Object.assign(Object.assign({}, COMMON), { mode: "light", text: {
            primary: "#666B71",
            secondary: "#000",
            disabled: "#666B71",
        }, background: {
            paper: alpha("#FFF", 0.9),
            default: alpha("#F1F1F1", 0.8),
            neutral: alpha("#F1F1F1", 0.8),
        }, filter: { paper: "blur(9px)", default: "blur(5px)", neutral: "blur(5px)" }, action: Object.assign(Object.assign({}, COMMON.action), { active: GREY[600] }) });
    return crystal;
}
