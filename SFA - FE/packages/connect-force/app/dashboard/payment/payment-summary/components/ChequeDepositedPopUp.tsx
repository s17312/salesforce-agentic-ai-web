import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import theme from "@/theme";

interface ChequeDepositedPopUpProps {
  open: boolean;
  onClose: () => void;
  onAction: (action: "cleared" | "bounced") => void;
}

const ChequeDepositedPopUp: React.FC<ChequeDepositedPopUpProps> = ({
  open,
  onClose,
  onAction,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
          padding: "24px",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
          fontWeight: "600",
          color: "#333333",
          padding: "0 0 16px 0",
        }}
      >
        Update Cheque State
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            textAlign: "center",
            color: "#666666",
            fontSize: "0.875rem",
          }}
        >
          The selected record will be update. Are you sure you want to continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: "16px",
          padding: "16px 0 0 0",
        }}
      >
        <Button
          onClick={() => onAction("cleared")}
          variant="contained"
          startIcon={<DoneIcon />}
          sx={{
            backgroundColor: "#4caf50",
            borderRadius: "8px",
            padding: "8px 24px",
            textTransform: "none",
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: "#388e3c",
            },
          }}
        >
          Cleared
        </Button>
        <Button
          onClick={() => onAction("bounced")}
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{
            color: "#f44336",
            borderColor: "#f44336",
            borderRadius: "8px",
            padding: "8px 24px",
            textTransform: "none",
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              borderColor: "#d32f2f",
            },
          }}
        >
          Bounced
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChequeDepositedPopUp;
