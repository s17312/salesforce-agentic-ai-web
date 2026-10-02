import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import InfoIcon from '@mui/icons-material/Info';

interface ConfirmDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmSubmitDialog: React.FC<ConfirmDeleteDialogProps> = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    maxWidth: '400px',
                    width: '100%',
                    padding: '24px'
                }
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: '600',
                    color: '#333333',
                    padding: '0 0 16px 0'
                }}
            >
                <InfoIcon sx={{ marginRight: 1, color: '#555555' }} />
                Confirm Submit Sales Invoice List
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    sx={{
                        textAlign: 'center',
                        color: '#666666',
                        fontSize: '0.875rem'
                    }}
                >
                    The selected record will be submitted. Are you sure you want to continue?
                </DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: 'center',
                    gap: '16px',
                    padding: '16px 0 0 0'
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        color: '#666666',
                        borderColor: '#dddddd',
                        borderRadius: '8px',
                        padding: '8px 24px',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                            borderColor: '#cccccc'
                        }
                    }}
                >
                    No, Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    startIcon={<DoneIcon />}
                    sx={{
                        backgroundColor: '#4caf50',
                        borderRadius: '8px',
                        padding: '8px 24px',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                            backgroundColor: '#388e3c'
                        }
                    }}
                >
                    Yes, Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmSubmitDialog;