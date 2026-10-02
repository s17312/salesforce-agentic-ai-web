import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface ConfirmWHStockTableClearDialog {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmWHStockTableClearDialog: React.FC<ConfirmWHStockTableClearDialog> = ({ open, onClose, onConfirm, message }) => {
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
                    {message}
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

export default ConfirmWHStockTableClearDialog;