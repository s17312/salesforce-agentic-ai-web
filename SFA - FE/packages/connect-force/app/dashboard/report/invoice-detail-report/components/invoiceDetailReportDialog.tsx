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
import { enqueueSnackbar } from "notistack";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import InvoiceDetailReport from "../report/InvoiceDetailReport";

interface InvoiceDetailReportDialogProps {
  open: boolean;
  handleClose: () => void;
  rowsWithTotal: any;
  invoiceDetailReportInfo: any;
  fileName: string;
  reportName: string;
}

const InvoiceDetailReportDialog: React.FC<InvoiceDetailReportDialogProps> = ({
  open,
  handleClose,
  rowsWithTotal,
  invoiceDetailReportInfo,
  fileName,
  reportName,
}) => {
  const theme = useTheme();

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
              <InvoiceDetailReport
                data={rowsWithTotal}
                invoiceDetailReportInfo={invoiceDetailReportInfo}
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
          <InvoiceDetailReport
            data={rowsWithTotal}
            invoiceDetailReportInfo={invoiceDetailReportInfo}
          />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailReportDialog;
