import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

interface DeleteTempPaymentsDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isEdit: boolean;
}

const DeleteTempPaymentsDialog: React.FC<DeleteTempPaymentsDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isEdit,
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
          fontSize: "2.50rem",
          fontWeight: "600",
          color: "#333333",
          padding: "0 0 16px 0",
        }}
      >
        <InfoIcon sx={{ marginRight: 1, color: "#555555" }} />
        Confirm Payment Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            textAlign: "center",
            color: "#666666",
            fontSize: "0.875rem",
          }}
        >
          {isEdit
            ? "You have partial or fully paid invoice payments. Are you sure you want to delete the relevant payments to edit this row?"
            : "You have partial or fully paid invoice payments. Are you sure you want to delete them?"}
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
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "#666666",
            borderColor: "#dddddd",
            borderRadius: "8px",
            padding: "8px 24px",
            textTransform: "none",
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#cccccc",
            },
          }}
        >
          No, Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={{
            backgroundColor: "#f44336",
            borderRadius: "8px",
            padding: "8px 24px",
            textTransform: "none",
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
          }}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTempPaymentsDialog;
