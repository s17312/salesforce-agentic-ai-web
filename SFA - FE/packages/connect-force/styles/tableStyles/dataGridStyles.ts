import { Theme } from '@mui/material/styles';

export const editabledataGridStyles = (theme: Theme) => ({
  height: 700,
  width: '100%',
  '& .MuiDataGrid-cell--editable': {
    bgcolor: 'rgba(255, 255, 0, 0.356)',
    border: '1px solid white',
    ...theme.applyStyles('dark', {
      bgcolor: 'rgba(255, 255, 0, 0.404)',
    }),
  },
});