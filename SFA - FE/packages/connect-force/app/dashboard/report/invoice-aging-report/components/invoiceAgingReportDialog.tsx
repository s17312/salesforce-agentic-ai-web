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
import InvoiceAgingReportMap from "../report/InvoiceAgingReportMap";

interface InvoiceAgingReportDialogTableProps {
  open: boolean;
  handleClose: () => void;
  rowsWithTotal: any;
  invoiceAgingReportInfo: any;
  fileName: string;
  reportName: string;
}

const InvoiceAgingReportDialog: React.FC<
  InvoiceAgingReportDialogTableProps
> = ({
  open,
  handleClose,
  rowsWithTotal,
  invoiceAgingReportInfo,
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
              <InvoiceAgingReportMap
                data={rowsWithTotal}
                invoiceAgingReportInfo={invoiceAgingReportInfo}
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
          <InvoiceAgingReportMap
            data={rowsWithTotal}
            invoiceAgingReportInfo={invoiceAgingReportInfo}
          />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceAgingReportDialog;
