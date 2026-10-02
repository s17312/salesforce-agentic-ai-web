import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  styled,
  DialogContentText,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useSelector } from "@/redux/store";
import { enqueueSnackbar } from "notistack";
import { getSalesInvoiceByID } from "@/service/tour-service/sale.service";
import { formatCurrency } from "@/utils/formatCurrency";

// Custom styled components with enhanced modern look
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "20px",
    background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    maxWidth: "480px",
    overflow: "hidden",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "#070E4D",
  color: "#ffffff",
  padding: "20px 24px",
  borderRadius: "16px 16px 0 0",
  fontWeight: 700,
  fontSize: "1.25rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  letterSpacing: "0.5px",
}));

// Updated HighlightText with dynamic color based on amount
const HighlightText = styled("span")<{ isZero: boolean }>(
  ({ theme, isZero }) => ({
    color: isZero ? "#f44336" : "#00c853",
    fontWeight: "bold",
    background: isZero ? "rgba(244, 67, 54, 0.1)" : "rgba(0, 200, 83, 0.1)",
    padding: "2px 6px",
    borderRadius: "4px",
  })
);

const StyledTable = styled(Table)(({ theme }) => ({
  margin: "16px 0",
  "& .MuiTableCell-root": {
    borderBottom: "none",
    padding: "12px 16px",
    fontSize: "1rem",
  },
  "& .MuiTableRow-root:nth-of-type(odd)": {
    backgroundColor: "rgba(163, 163, 163, 0.075)",
  },
}));

interface InvoiceSummeryPopupProps {
  open: boolean;
  onClose: () => void;
  invoiceIDOrLostCallID?: string;
}

const InvoiceSummeryPopup: React.FC<InvoiceSummeryPopupProps> = ({
  open,
  onClose,
  invoiceIDOrLostCallID,
}) => {
  const existingSalesInvoice = useSelector(
    (state) => state.tourSalesInvoiceSlice.SalesInvoiceByID
  );
  const saleInvoiceHeader = existingSalesInvoice?.saleInvoiceHeader;

  useEffect(() => {
    fetchExistingSalesInvoice();
  }, [open]);

  const fetchExistingSalesInvoice = async () => {
    try {
      await getSalesInvoiceByID(
        invoiceIDOrLostCallID
          ? invoiceIDOrLostCallID
          : localStorage.getItem("invoiceID")
      );
    } catch (error) {
      enqueueSnackbar("Error fetching existing sales invoice", {
        variant: "error",
      });
    }
  };

  const isSalesCompleted = saleInvoiceHeader?.invoiceAmount !== 0;
  const isDiscountCompleted = saleInvoiceHeader?.discountAmount !== 0;
  const isReturnCompleted = saleInvoiceHeader?.returnAmount !== 0;

  let message = "";
  if (isSalesCompleted && !isDiscountCompleted && !isReturnCompleted) {
    message = "The sales are completed, but the discount and return are not.";
  } else if (isSalesCompleted && isReturnCompleted && !isDiscountCompleted) {
    message = "The sales and returns are completed, but the discount is not.";
  } else if (isSalesCompleted && isDiscountCompleted && isReturnCompleted) {
    message = "All Sales, Discounts, and Returns are completed.";
  } else {
    message = "Please review the invoice summary.";
  }

  const saleAmount = saleInvoiceHeader?.invoiceAmount || 0;
  const discountAmount = saleInvoiceHeader?.discountAmount || 0;
  const returnAmount = saleInvoiceHeader?.returnAmount || 0;

  const netSale = saleAmount - discountAmount - returnAmount;
  const formattedNetSale = netSale.toLocaleString();

  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>
        <InfoIcon sx={{ mr: 1.5, color: "#ffffff", fontSize: "28px" }} />
        Invoice Summary View
      </StyledDialogTitle>
      <DialogContent sx={{ px: "28px", py: "20px" }}>
        <DialogContentText
          sx={{
            color: "#333333",
            backgroundColor: "#33333314",
            borderRadius: "15px",
            paddingX: "16px",
            paddingY: "10px",
            lineHeight: 1.7,
            fontSize: "1rem",
            marginBottom: "16px",
            marginTop: "10px",
          }}
        >
          {message}
        </DialogContentText>
        <StyledTable>
          <TableBody>
            <TableRow>
              <TableCell>Sales</TableCell>
              <TableCell>
                <HighlightText isZero={saleInvoiceHeader?.invoiceAmount === 0}>
                  LKR {formatCurrency(saleInvoiceHeader?.invoiceAmount)}
                </HighlightText>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Discounts</TableCell>
              <TableCell>
                <HighlightText isZero={saleInvoiceHeader?.discountAmount === 0}>
                  LKR {formatCurrency(saleInvoiceHeader?.discountAmount)}
                </HighlightText>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Returns</TableCell>
              <TableCell>
                <HighlightText isZero={saleInvoiceHeader?.returnAmount === 0}>
                  LKR {formatCurrency(saleInvoiceHeader?.returnAmount)}
                </HighlightText>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Payments</TableCell>
              <TableCell>
                <HighlightText isZero={saleInvoiceHeader?.paidAmount === 0}>
                  LKR {formatCurrency(saleInvoiceHeader?.paidAmount)}
                </HighlightText>
                <span style={{ color: "#666666", fontSize: "0.95rem" }}>
                  {" "}
                  (Balance:{" "}
                  <HighlightText
                    isZero={saleInvoiceHeader?.balanceAmount === 0}
                  >
                    LKR {formatCurrency(saleInvoiceHeader?.balanceAmount)}
                  </HighlightText>
                  )
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Net Sale</TableCell>
              <TableCell>
                <HighlightText isZero={netSale === 0}>
                  LKR {formattedNetSale}
                </HighlightText>
              </TableCell>
            </TableRow>
          </TableBody>
        </StyledTable>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", padding: "20px 28px", gap: "20px" }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            padding: "6px 28px",
            fontSize: "1rem",
            textTransform: "none",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default InvoiceSummeryPopup;
