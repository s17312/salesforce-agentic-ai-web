// @mui
import { useTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

import { public_sanse } from "@/app/dashboard/font";



export default function StyledNotistack() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        '#__next': {
          '.SnackbarContent-root': { 
            fontfamily:`${public_sanse.className}`,
            width: '100%',
            padding: theme.spacing(1),
            margin: theme.spacing(0.25, 0),
            boxShadow: theme.customShadows?.z8 ?? '0 8px 16px 0 rgba(0, 0, 0, 0.16)',
            borderRadius: theme.shape.borderRadius,
            color: isLight
              ? theme.palette.common.black
              : theme.palette.grey[800],
            backgroundColor: isLight
              ? theme.palette.grey[900]
              : theme.palette.common.white,
            '&.SnackbarItem-variantSuccess, &.SnackbarItem-variantError, &.SnackbarItem-variantWarning, &.SnackbarItem-variantInfo': {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.paper,
            },
            [theme.breakpoints.up('md')]: {
              minWidth: 240,
            },
          },
          '.SnackbarItem-message': {
            padding: '0 !important',
            fontWeight: theme.typography.fontWeightMedium,
            fontSize: theme.typography.pxToRem(5),
          },
          '.SnackbarItem-action': {
            marginRight: 0,
            color: theme.palette.common.white,
            '& svg': {
              width: 20,
              height: 20,
            },
          },
        },
      }}
    />
  );

  return inputGlobalStyles;
}