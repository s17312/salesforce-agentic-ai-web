import { createTheme, alpha } from '@mui/material/styles';

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = {
  lighter: '#c9cff3',
  light: '#D3D8FD',
  main: '#070E4D',
  dark: '#6575DC',
  darker: '#4F2DB2',
  contrastText: '#fff',
};

const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#38465514',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
};

const INFO = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#fff',
};

const SUCCESS = {
  lighter: '#D8FBDE',
  light: '#86E8AB',
  main: '#36B37E',
  dark: '#1B806A',
  darker: '#0A5554',
  contrastText: '#fff',
};

const WARNING = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#fff',
};

const COMMON = {
  common: {
    black: '#000',
    white: '#fff',
    background: 'linear-gradient(181.79deg, #DADEE4 -1.04%, #2163D7 52.25%)',
  },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: '#fff',
  action: {
    btnHover: '#2D3675',
    hover: 'rgb(225, 212, 250, 0.4)',
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(PRIMARY.main, 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

function palette() {
  return {
    ...COMMON,
    mode: 'light' as const,
    text: {
      primary: '#666B71',
      secondary: '#000',
      disabled: '#666B71',
    },
    background: {
      paper: alpha('#FFF', 0.9),
      default: alpha('#F1F1F1', 0.8),
      neutral: alpha('#F1F1F1', 0.8),
    },
    filter: { paper: 'blur(9px)', default: 'blur(5px)', neutral: 'blur(5px)' },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };
}

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }: { sm: number; md: number; lg: number }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

const FONT_PRIMARY = 'Poppins, sans-serif';

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightLight: 200,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: { fontWeight: 800, lineHeight: 80 / 64, fontSize: pxToRem(40), ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }) },
  h2: { fontWeight: 800, lineHeight: 64 / 48, fontSize: pxToRem(32), ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }) },
  h3: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(24), ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }) },
  h4: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(20), ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }) },
  h5: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(18), ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }) },
  h6: { fontWeight: 700, lineHeight: 28 / 18, fontSize: pxToRem(17), ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }) },
  subtitle1: { fontWeight: 600, lineHeight: 1.5, fontSize: pxToRem(16) },
  subtitle2: { fontWeight: 600, lineHeight: 22 / 14, fontSize: pxToRem(14) },
  body1: { lineHeight: 1.5, fontSize: pxToRem(16) },
  body2: { lineHeight: 22 / 14, fontSize: pxToRem(14) },
  caption: { lineHeight: 1.5, fontSize: pxToRem(12) },
  overline: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(12), textTransform: 'uppercase' as const },
  button: { fontWeight: 200, lineHeight: 24 / 14, fontSize: pxToRem(14), textTransform: 'capitalize' as const },
};

function createShadow(color: string) {
  const transparent1 = alpha(color, 0.2);
  const transparent2 = alpha(color, 0.14);
  const transparent3 = alpha(color, 0.12);
  return [
    'none',
    `0px 2px 1px -1px ${transparent1},0px 1px 1px 0px ${transparent2},0px 1px 3px 0px ${transparent3}`,
    `0px 3px 1px -2px ${transparent1},0px 2px 2px 0px ${transparent2},0px 1px 5px 0px ${transparent3}`,
    `0px 3px 3px -2px ${transparent1},0px 3px 4px 0px ${transparent2},0px 1px 8px 0px ${transparent3}`,
    `0px 2px 4px -1px ${transparent1},0px 4px 5px 0px ${transparent2},0px 1px 10px 0px ${transparent3}`,
    `0px 3px 5px -1px ${transparent1},0px 5px 8px 0px ${transparent2},0px 1px 14px 0px ${transparent3}`,
    `0px 3px 5px -1px ${transparent1},0px 6px 10px 0px ${transparent2},0px 1px 18px 0px ${transparent3}`,
    `0px 4px 5px -2px ${transparent1},0px 7px 10px 1px ${transparent2},0px 2px 16px 1px ${transparent3}`,
    `0px 5px 5px -3px ${transparent1},0px 8px 10px 1px ${transparent2},0px 3px 14px 2px ${transparent3}`,
    `0px 5px 6px -3px ${transparent1},0px 9px 12px 1px ${transparent2},0px 3px 16px 2px ${transparent3}`,
    `0px 6px 6px -3px ${transparent1},0px 10px 14px 1px ${transparent2},0px 4px 18px 3px ${transparent3}`,
    `0px 6px 7px -4px ${transparent1},0px 11px 15px 1px ${transparent2},0px 4px 20px 3px ${transparent3}`,
    `0px 7px 8px -4px ${transparent1},0px 12px 17px 2px ${transparent2},0px 5px 22px 4px ${transparent3}`,
    `0px 7px 8px -4px ${transparent1},0px 13px 19px 2px ${transparent2},0px 5px 24px 4px ${transparent3}`,
    `0px 7px 9px -4px ${transparent1},0px 14px 21px 2px ${transparent2},0px 5px 26px 4px ${transparent3}`,
    `0px 8px 9px -5px ${transparent1},0px 15px 22px 2px ${transparent2},0px 6px 28px 5px ${transparent3}`,
    `0px 8px 10px -5px ${transparent1},0px 16px 24px 2px ${transparent2},0px 6px 30px 5px ${transparent3}`,
    `0px 8px 11px -5px ${transparent1},0px 17px 26px 2px ${transparent2},0px 6px 32px 5px ${transparent3}`,
    `0px 9px 11px -5px ${transparent1},0px 18px 28px 2px ${transparent2},0px 7px 34px 6px ${transparent3}`,
    `0px 9px 12px -6px ${transparent1},0px 19px 29px 2px ${transparent2},0px 7px 36px 6px ${transparent3}`,
    `0px 10px 13px -6px ${transparent1},0px 20px 31px 3px ${transparent2},0px 8px 38px 7px ${transparent3}`,
    `0px 10px 13px -6px ${transparent1},0px 21px 33px 3px ${transparent2},0px 8px 40px 7px ${transparent3}`,
    `0px 10px 14px -6px ${transparent1},0px 22px 35px 3px ${transparent2},0px 8px 42px 7px ${transparent3}`,
    `0px 11px 14px -7px ${transparent1},0px 23px 36px 3px ${transparent2},0px 9px 44px 8px ${transparent3}`,
    `0px 11px 15px -7px ${transparent1},0px 24px 38px 3px ${transparent2},0px 9px 46px 8px ${transparent3}`,
  ];
}

const themeColor = palette();

export const crystalTheme = createTheme({
  palette: palette(),
  typography: typography as any,
  shape: { borderRadius: 8 },
  shadows: createShadow(themeColor.grey[500]) as any,
});
