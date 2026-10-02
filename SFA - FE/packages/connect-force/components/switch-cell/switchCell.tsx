import { CustomSwitch } from "@/styles/InputFeilds/customSwitch";
import { LoadingButton } from "@mui/lab";
import {
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import { useState } from "react";

const SwitchCell = ({
  row,
  updateServiceReq,
  enqueueSnackbar,
  featureName,
}: {
  row: any;
  updateServiceReq: any;
  enqueueSnackbar: any;
  featureName: string;
}) => {
  const [isActive, setIsActive] = useState<boolean>(row.active);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSwitchClick = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    const newIsActive = !isActive;
    const status = {
      isActive: newIsActive,
      isArchive: row.isArchive,
    };
    try {
      setIsLoading(true);
      await updateServiceReq(row.uId, status);
      enqueueSnackbar(`${capitalizeFirstLetter(featureName)} Status updated successfully`, {
        variant: "success",
      });
      setIsActive(newIsActive);
      setIsLoading(false);
    } catch (error: any) {
      //This part is commented since we already have centralized error handling and this will cause to trigger multiple error messages.
      // enqueueSnackbar("An error occurred. Please try again later", {
      //   variant: "error",
      // });
    }
    setOpenDialog(false);
  };

  const capitalizeFirstLetter = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <>
      <Tooltip title={isActive ? "Active" : "Inactive"}>
        <CustomSwitch
          name={`Switch${row.id}`}
          checked={isActive}
          onChange={handleSwitchClick}
        />
      </Tooltip>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        componentsProps={{
          backdrop: {
            style: {
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        }}
      >
        <DialogContent sx={{ mt: 3 }}>
          <DialogContentText id="alert-dialog-description" style={{ textAlign: 'center' }}>
            Confirm {capitalizeFirstLetter(featureName)} {isActive ? "deactivation" : "activation"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="outlined" onClick={handleClose} sx={{ px: 4 }}>
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            loadingPosition="end"
            variant="contained"
            onClick={handleConfirm}
            autoFocus
            sx={{ border: 0, px: 4 }}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SwitchCell;
