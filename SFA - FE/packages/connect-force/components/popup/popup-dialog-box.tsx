import { setPopupDialog } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { Box, Button, Modal } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { public_sanse } from "@/app/dashboard/font";
import {
  activeMessage,
  approvedMessage,
  archivedMessage,
  inActiveMessage,
  rejectedMessage,
  unArchivedMessage,
  cancelMessage,
  requestToCancelMessage,
  employeeAttendanceEditMessage,
  employeeAttendanceRegisterMessage,
} from "@/data/commons";
 
type PopupDialogProps = {
  onArchive?: () => void;
  archivedStatus?: any;
  activeStatus?: any;
  onActive?: () => void;
  approvedStatus?: any;
  rejectedStatus?: any;
  onApprove?: () => void;
  onReject?: () => void;
  cancelStatus?:any;
  onCancel?:()=>void;
  requestToCancelStatus?:any;
  onrequestToCancel?:()=>void;
  onAttendanceEdit?:() => void;
  attendanceStatus?: any;
  onAttendanceRegister?:() => void;
  attendanceRegisterStatus?: any;
};
 
const PopupDialogBox: React.FC<PopupDialogProps> = ({
  onArchive,
  archivedStatus,
  activeStatus,
  onActive,
  approvedStatus,
  rejectedStatus,
  onApprove,
  onReject,
  cancelStatus,
  onCancel,
  requestToCancelStatus,
  onrequestToCancel,
  onAttendanceEdit,
  attendanceStatus,
  onAttendanceRegister,
  attendanceRegisterStatus,
}) => {
  const isPopupDialogOpen = useSelector((state) => state.layout.popupDialog);
  const handleSubmit = () => {
    if (onArchive) {
      onArchive();
    }
    if (onActive) {
      onActive();
    }
    if (onApprove) {
      onApprove();
    }
    if (onReject) {
      onReject();
    }
    if(onCancel){
      onCancel();
    }
    if(onrequestToCancel){
      onrequestToCancel();
    }
    if(onAttendanceEdit){
      onAttendanceEdit();
    }
    if(onAttendanceRegister){
      onAttendanceRegister();
    }
  };

  const handleClose = () => dispatch(setPopupDialog(false));
  return (
    <>
      <CustomModal
        disableEnforceFocus
        open={isPopupDialogOpen}
        className={`${public_sanse.className}`}
      >
        <CustomBox>
          <Grid>
            <h3 style={{ color: "#454f5b" }}>
              {activeStatus == true
                ? inActiveMessage
                : activeStatus == false
                ? activeMessage
                : archivedStatus == true
                ? unArchivedMessage
                : archivedStatus == false
                ? archivedMessage
                :cancelStatus == true 
                ?cancelMessage
                :requestToCancelStatus == true
                ?requestToCancelMessage
                : approvedStatus == true
                ? approvedMessage
                : attendanceStatus == true
                ? employeeAttendanceEditMessage
                : attendanceRegisterStatus == true
                ? employeeAttendanceRegisterMessage
                : rejectedMessage
                }
            </h3>
          </Grid>
          <GridButton>
            <Button
              variant="outlined"
              onClick={() => dispatch(setPopupDialog(false))}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </GridButton>
        </CustomBox>
      </CustomModal>
    </>
  );
};
 
export default PopupDialogBox;
 
const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
 
const CustomBox = styled(Box)`
  width: 30%;
  padding: 2em;
  border-radius: 16px;
  background-color: white;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    width: 50%;
  }
`;
 
const Grid = styled.div`
  margin-bottom: 16px;
 
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
 
const GridButton = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 8px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, auto);
  }
`;