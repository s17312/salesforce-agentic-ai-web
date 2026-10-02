import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export interface ConfirmDialogProps {
  title: string;
  description: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  confirmationText?: string;
  cancellationText?: string;
  allowClose?: boolean;
  buttonOrder?: string[];
  hideCancelButton?: boolean;
  children?: ReactNode;
  content?: ReactNode;
  buttonText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  open?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  variant = 'warning',
  confirmationText = 'Confirm',
  cancellationText = 'Cancel',
  hideCancelButton = false,
  buttonText,
  onCancel,
  onConfirm,
  open = true,
}: ConfirmDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case 'error':
        return <ErrorOutlineIcon color="error" sx={{ fontSize: 40 }} />;
      case 'info':
        return <InfoOutlinedIcon color="info" sx={{ fontSize: 40 }} />;
      case 'success':
        return <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />;
      case 'warning':
      default:
        return <WarningAmberIcon color="warning" sx={{ fontSize: 40 }} />;
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <Box sx={{ pt: 3, px: 3, textAlign: 'center' }}>
        {getIcon()}
        <DialogTitle sx={{ p: 0, pt: 1, fontWeight: 700 }}>{title}</DialogTitle>
      </Box>
      <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
        {!hideCancelButton && onCancel && (
          <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ textTransform: 'none' }}>
            {cancellationText}
          </Button>
        )}
        {onConfirm && (
          <Button
            variant="contained"
            color={variant === 'error' ? 'error' : 'primary'}
            onClick={onConfirm}
            sx={{ textTransform: 'none' }}
          >
            {buttonText || confirmationText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export const BaseConfirmDialog = ConfirmDialog;

export function useConfirm() {
  return (options: any) => {
    return new Promise((resolve) => {
      resolve(true);
    });
  };
}

export default ConfirmDialog;
