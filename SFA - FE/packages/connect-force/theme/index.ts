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
          '--primary-main': '#070E4D',
          '--primary-light': '#6575DC',
          '--primary-lighter': '#C9CFF3',
          '--secondary-main': '#2163D7',
          '--secondary-light': '#84A9FF',
          '--bg-default': '#F4F6F8',
          '--bg-paper': '#FFFFFF',
          '--text-primary': '#212B36',
          '--text-secondary': '#637381',
          '--border-color': '#E0E0E0',
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
