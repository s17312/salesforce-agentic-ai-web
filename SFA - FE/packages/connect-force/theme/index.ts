// @mui
import { createTheme } from '@mui/material/styles';
import customShadows from './customShadows';
import componentsOverride from './overrides';
import palette from './palette';
import shadows from './shadows';
import typography from './typography';

// ----------------------------------------------------------------------

export const lightTheme = createTheme({
  palette: palette('light'),
  typography,
  shape: { borderRadius: 8 },
  shadows: shadows('light'),
  customShadows: customShadows('light'),
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--primary-main': '#0a0d2c',
          '--primary-light': '#6b46c1',
          '--primary-lighter': '#e0dcf7',
          '--secondary-main': '#3366ff',
          '--secondary-light': '#84a9ff',
          '--bg-default': '#080a25',
          '--bg-paper': '#f5f4fd',
          '--text-primary': '#0a0d2c',
          '--text-secondary': '#5d638a',
          '--border-color': '#e2e0f5',
        },
      },
    },
  },
});

lightTheme.components = {
  ...lightTheme.components,
  ...componentsOverride(lightTheme),
};

export const darkTheme = createTheme({
  palette: palette('dark'),
  typography,
  shape: { borderRadius: 8 },
  shadows: shadows('dark'),
  customShadows: customShadows('dark'),
});

darkTheme.components = componentsOverride(darkTheme);

export default lightTheme;
