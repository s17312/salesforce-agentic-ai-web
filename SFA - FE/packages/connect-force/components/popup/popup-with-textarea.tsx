import { setPopupDialog, setPopupWithTextField } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { Box, Button, Modal } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import { public_sanse } from "@/app/dashboard/font";
import { requestToCancelMessage,approvedMessage,rejectedMessage } from "@/data/commons";
import CustomTextArea from "../input-field/custom-text-area";
import { useForm } from "react-hook-form";
 
type PopupDialogProps = {
  cancelStatus?:any;
  onCancel?:()=>void;
  requestToCancelStatus?:any;
  onrequestToCancel?:()=>void;
  approvedStatus?: any;
  rejectedStatus?: any;
  onApprove?: () => void;
  onReject?: () => void;
  formState:any;
  onReset:any;
  onSubmit: any;
  children:any;
};
 
const PopupWithTextField: React.FC<PopupDialogProps> = ({
  requestToCancelStatus,
  onrequestToCancel,
  approvedStatus,
  onApprove,
  rejectedStatus,
  onReject,
  onReset,
  onSubmit,
  children,
 
}) => {
  const { formState,reset,handleSubmit } =useForm();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const isPopupDialogOpen = useSelector((state) => state.layout.popupDialog);
  const isButtonDisabled = !isFormDirty || formState.isSubmitting;

  const handleClear = () => {
    reset();
    setIsFormDirty(false);
    onReset();
  };
  
  const handleFormChange = () => {
    if (!isFormDirty) {
      setIsFormDirty(true);
    }
  };

  const handleFormSubmit = (formData: any) => {
      setIsFormDirty(false);
      onSubmit(formData);
      handleClear();    
  };

  const handleClose = () => {
    dispatch(setPopupWithTextField(false));
    handleClear();   
  };

  return (
    <>
     <CustomModal
        disableEnforceFocus
        open={isPopupDialogOpen}
        className={`${public_sanse.className}`}
      >
    <Form 
        onSubmit={handleSubmit(handleFormSubmit)}
        onReset={handleClear}
        onChange={handleFormChange}
    >
        <CustomBox>
        <HeaderContainer>
            <ViewHeader>
                {
                  requestToCancelStatus == true
                  ?requestToCancelMessage
                  : approvedStatus == true
                  ? approvedMessage
                  :rejectedStatus ==true
                  ? rejectedMessage 
                  :""
                }
            </ViewHeader>
          </HeaderContainer>
          {children}
          <GridButton>
          <Button variant="outlined" type="button" onClick={handleClose}>
                Close
              </Button>
              <Button variant="contained" type="submit" disabled={isButtonDisabled}>
                Submit
            </Button>
          </GridButton>
        </CustomBox>
        </Form>
      </CustomModal>
      
    </>
  );
};
 
export default PopupWithTextField;
 
const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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
  // margin-bottom: 16px;
 
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
 
const GridButton = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, auto);
  margin-top: 16px;
  gap: 8px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, auto);
  }
`;

const HeaderContainer = styled.div`
 
  justify-content : center;
  text-align : center;
  @media (max-width: 768px) {
    grid-template-columns: 2fr;
  }
  `;

const ViewHeader = styled.div`
  font-size: 18px;
  color: #454f5b;
  font-weight: bold;
  margin-bottom:1rem;
  text-align:center;
`;