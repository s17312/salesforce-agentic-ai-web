import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface ConfirmTableClearDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmTableClearDialog: React.FC<ConfirmTableClearDialogProps> = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableRestoreFocus
            PaperProps={{
                sx: { backgroundColor: 'white' }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WarningIcon color='warning' sx={{ marginRight: 1}} />
                Warning
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ textAlign: 'center' }}>
                    If the selected company changes, the <strong> Adjustment table will be cleared</strong>. Are you sure you want to continue?
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 0 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        color: '#4caf50',
                        borderColor: '#4caf50',
                        '&:hover': {
                            backgroundColor: '#e8f5e9',
                            borderColor: '#4caf50'
                        }
                    }}
                >
                    No, Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    startIcon={<WarningIcon />}
                    sx={{
                        backgroundColor: '#f44336',
                        borderWidth: 0,
                        '&:hover': {
                            backgroundColor: '#d32f2f'
                        }
                    }}
                >
                    Yes, Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmTableClearDialog;