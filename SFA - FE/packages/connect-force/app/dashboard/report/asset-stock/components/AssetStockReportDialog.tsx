import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
} from "@mui/material";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React from "react";
import AssetStockViewReport from "../report/assetStockReport";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { enqueueSnackbar } from "notistack";

interface AssetStockReportDialogProps {
  open: boolean;
  handleClose: () => void;
  rowsWithTotal: any;
  assetInfo: any;
  fileName: string;
  reportName: string;
}

const AssetStockReportDialog: React.FC<AssetStockReportDialogProps> = ({
  open,
  handleClose,
  rowsWithTotal,
  assetInfo,
  fileName,
  reportName,
}) => {
  const theme = useTheme();

  const transformedRows = rowsWithTotal.map((row: any) => ({
    ...row,
    purchaseDate: row.purchaseDate
      ? new Date(row.purchaseDate).toISOString().slice(0, 10)
      : null,
    maintenanceSchedule: row.maintenanceSchedule
      ? new Date(row.maintenanceSchedule).toISOString().slice(0, 10)
      : null,
  }));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{ color: "white" }}
    >
      <DialogTitle sx={{ color: theme.palette.primary.main }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr={4}
        >
          {reportName}
          <PDFDownloadLink
            document={
              <AssetStockViewReport
                data={rowsWithTotal}
                assetInfo={assetInfo}
              />
            }
            fileName={fileName}
          >
            {/* @ts-ignore  */}
            {({ loading, error }) => {
              if (loading) {
                return <CircularProgress />;
              }
              if (error) {
                enqueueSnackbar("Error generating PDF", { variant: "error" });
              }
              return (
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Download
                </Button>
              );
            }}
          </PDFDownloadLink>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
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
          <AssetStockViewReport
            data={transformedRows}
            assetInfo={assetInfo}
          />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
};

export default AssetStockReportDialog;
