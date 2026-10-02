import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Card } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { useSelector } from '@/redux/store';
import { styled } from '@mui/material/styles';
import { enqueueSnackbar } from 'notistack';
import { formatCurrency } from '@/utils/formatCurrency';
import { LoadingButton } from '@mui/lab';
import { getSalesInvoiceByID } from '@/service/direct-sale/sale.service';

// Custom styled components with enhanced modern look
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '20px',
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        maxWidth: '480px',
        overflow: 'hidden',
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    background: '#070E4D',
    color: '#ffffff',
    padding: '20px 24px',
    borderRadius: '16px 16px 0 0',
    fontWeight: 700,
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.5px',
}));

// Updated HighlightText with dynamic color based on amount
const HighlightText = styled('span')<{ isZero: boolean }>(({ theme, isZero }) => ({
    color: isZero ? '#f44336' : '#00c853', // Red if 0, green otherwise
    fontWeight: 'bold',
    background: isZero ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0, 200, 83, 0.1)', // Matching background tint
    padding: '2px 6px',
    borderRadius: '4px',
}));

interface SaleSubmitPopupProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    invoiceIDOrLostCallID?: string;
    isSubmitting?: boolean;
}

const DirectSaleSubmitPopup: React.FC<SaleSubmitPopupProps> = ({ open, onClose, onConfirm, invoiceIDOrLostCallID, isSubmitting = false }) => {
    const existingSalesInvoice = useSelector((state) => state.tourDirectSalesInvoiceSlice.SalesInvoiceByID);
    const saleInvoiceHeader = existingSalesInvoice?.saleInvoiceHeader;

    useEffect(() => {
        fetchExistingSalesInvoice();
    }, [open]);

    const fetchExistingSalesInvoice = async () => {
        try {
            await getSalesInvoiceByID(invoiceIDOrLostCallID ? invoiceIDOrLostCallID : localStorage.getItem('invoiceID'));
        } catch (error) {
            enqueueSnackbar("Error fetching existing sales invoice", {
                variant: "error",
            });
        }
    };

    const isSalesCompleted = saleInvoiceHeader?.invoiceAmount !== 0;
    const isDiscountCompleted = saleInvoiceHeader?.discountAmount !== 0;
    const isReturnCompleted = saleInvoiceHeader?.returnAmount !== 0;

    {/* Net Sale  = Sale Amount – Discount – Return Amount */ }
    const netSale = saleInvoiceHeader?.invoiceAmount - saleInvoiceHeader?.discountAmount - saleInvoiceHeader?.returnAmount;

    let message = '';
    if (isSalesCompleted && !isDiscountCompleted && !isReturnCompleted) {
        message = "The sales are completed, but the discount and return are not. Are you sure you want to submit?";
    } else if (isSalesCompleted && isReturnCompleted && !isDiscountCompleted) {
        message = "The sales and returns are completed, but the discount is not. Are you sure you want to submit?";
    } else if (isSalesCompleted && isDiscountCompleted && isReturnCompleted) {
        message = "All Sales, Discounts, and Returns are completed. Do you want to submit?";
    } else {
        message = "Please review the details before submitting.";
    }

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
        >
            <StyledDialogTitle>
                {(!isSalesCompleted || !isDiscountCompleted || !isReturnCompleted) ? (
                    <WarningIcon sx={{ mr: 1.5, color: '#ffca28', fontSize: '28px' }} />
                ) : (
                    <InfoIcon sx={{ mr: 1.5, color: '#ffffff', fontSize: '28px' }} />
                )}
                Confirm Sale Submission
            </StyledDialogTitle>
            <DialogContent sx={{ px: '28px', py: '20px' }}>
                <DialogContentText sx={{ color: '#333333', lineHeight: 1.7, fontSize: '1rem' }}>
                    {message}
                    <ul style={{ paddingLeft: '24px', margin: '16px 0', listStyleType: 'none' }}>
                        <li>
                            📌 Sales: <HighlightText isZero={saleInvoiceHeader?.invoiceAmount === 0}>
                                LKR {formatCurrency(saleInvoiceHeader?.invoiceAmount)}
                            </HighlightText>
                        </li>
                        <li>
                            📌 Discounts: <HighlightText isZero={saleInvoiceHeader?.discountAmount === 0}>
                                LKR {formatCurrency(saleInvoiceHeader?.discountAmount)}
                            </HighlightText>
                        </li>
                        <li>
                            📌 Returns: <HighlightText isZero={saleInvoiceHeader?.returnAmount === 0}>
                                LKR {formatCurrency(saleInvoiceHeader?.returnAmount)}
                            </HighlightText>
                        </li>
                        <li>
                            📌 Payments: <HighlightText isZero={saleInvoiceHeader?.paidAmount === 0}>
                                LKR {formatCurrency(saleInvoiceHeader?.paidAmount)}
                            </HighlightText>
                            <span style={{ color: '#666666', fontSize: '0.95rem' }}>
                                {' '} (Balance: <HighlightText isZero={saleInvoiceHeader?.balanceAmount === 0}>
                                    LKR {formatCurrency(saleInvoiceHeader?.balanceAmount)}
                                </HighlightText>)
                            </span>
                        </li>
                    </ul>

                    <Card sx={{ backgroundColor: '#f7f7f7', padding: 2, borderRadius: 2, mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Total Invoice Value:
                            <Typography component="span" variant="body1" sx={{ ml: 1, fontWeight: 700, color: '#00c853' }}>
                                LKR {formatCurrency(saleInvoiceHeader?.invoiceAmount)}
                            </Typography>
                        </Typography>

                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Net Sale:
                            <Typography component="span" variant="body1" sx={{ ml: 1, fontWeight: 700, color: '#00c853' }}>
                                LKR {formatCurrency(netSale)}
                            </Typography>
                        </Typography>
                    </Card>
                    <Typography style={{ color: '#d32f2f', fontWeight: 700 }}>Double-check before proceeding!</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', padding: '20px 28px', gap: '20px' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        color: '#e91e63',
                        borderColor: '#e91e63',
                        borderRadius: '10px',
                        padding: '6px 28px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ffe6f0',
                            borderColor: '#c2185b',
                        },
                    }}
                >
                    No, Cancel
                </Button>
                <LoadingButton
                    onClick={onConfirm}
                    variant="contained"
                    startIcon={<CheckIcon sx={{ fontSize: '20px' }} />}
                    loading={isSubmitting}
                    sx={{
                        backgroundColor: '#00c853',
                        borderRadius: '10px',
                        padding: '6px 28px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#00a843',
                            boxShadow: '0 4px 12px rgba(0, 200, 83, 0.3)',
                        },
                    }}
                >
                    Yes, Submit
                </LoadingButton>
            </DialogActions>
        </StyledDialog>
    );
};

export default DirectSaleSubmitPopup;