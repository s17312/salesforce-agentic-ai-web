import React from 'react';
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DistributorStockViewReport from '../report/distributorStockReport';
import { enqueueSnackbar } from 'notistack';

interface DistributorStockReportDialogProps {
    open: boolean;
    handleClose: () => void;
    rowsWithTotal: any;
    distributorInfo: any;
    fileName: string;
    reportName: string;
    selectedSummaryValue: string;
}

const DistributorStockReportDialog: React.FC<DistributorStockReportDialogProps> = ({ open, handleClose, rowsWithTotal, distributorInfo, fileName, reportName, selectedSummaryValue }) => {
    const theme = useTheme();

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth sx={{ color: 'white' }}>
            <DialogTitle sx={{ color: theme.palette.primary.main }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mr={4}>
                    {reportName}
                    <PDFDownloadLink document={<DistributorStockViewReport data={rowsWithTotal} distributorInfo={distributorInfo} selectedSummaryValue={selectedSummaryValue} />} fileName={fileName}>
                        {/* @ts-ignore  */}
                        {({ loading, error }) => {
                            if (loading) {
                                return <CircularProgress />;
                            }
                            if (error) {
                                enqueueSnackbar('Error generating PDF', { variant: 'error' });
                            }
                            return <Button variant="outlined" startIcon={<DownloadIcon />}>Download</Button>
                        }}
                    </PDFDownloadLink>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <PDFViewer height="600px" width="100%">
                    <DistributorStockViewReport data={rowsWithTotal} distributorInfo={distributorInfo} selectedSummaryValue={selectedSummaryValue} />
                </PDFViewer>
            </DialogContent>
        </Dialog>
    );
};

export default DistributorStockReportDialog;