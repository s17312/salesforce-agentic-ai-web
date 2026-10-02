// @mui
import { createTheme } from '@mui/material/styles';
//
import customShadows from './customShadows';
import componentsOverride from './overrides';
import palette from './palette';
import shadows from './shadows';
import typography from './typography';
// ----------------------------------------------------------------------
export const crystalTheme = createTheme({
    palette: palette(),
    typography,
    shape: { borderRadius: 8 },
    shadows: shadows('light'),
    customShadows: customShadows('light')
});
crystalTheme.components = componentsOverride(crystalTheme);
