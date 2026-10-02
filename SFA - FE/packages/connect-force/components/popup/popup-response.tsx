import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import React, { useEffect } from "react";
import { public_sanse } from "@/app/dashboard/font";
import CloseIcon from "@/assets/icons/popup-responce/close-circle.svg";
import TickIcon from "@/assets/icons/popup-responce/tick-circle.svg";
import Image from "next/image";
import { ERROR_MSG, SUCCESS_MSG } from "@/data/commons";
import { Box, Button, Modal, styled } from "@mui/material";

type PopupDialogProps = {
  redirectBack?: () => void;
  type: "error" | "success";
  message: string | any;
};

const PopupResponse: React.FC<PopupDialogProps> = ({
  redirectBack,
  type,
  message,
}) => {
  const isPopupDialogOpen = useSelector((state) => state.layout.popupResponse);

  const handleClose = () => {
    if (redirectBack) {
      redirectBack();
    }
    dispatch(setPopupResponse(false));
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }
    }, 0);
  };

  return (
    <>
      <CustomModal
        disableEnforceFocus
        open={isPopupDialogOpen}
        className={`${public_sanse.className}`}
        onKeyDown={(event: any) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleClose();
          }
        }}
      >
        <CustomBox>
          <Grid>
            {type === ERROR_MSG && (
              <Image src={CloseIcon} height={100} width={100} alt={"Reject"} />
            )}
            {type === SUCCESS_MSG && (
              <Image src={TickIcon} height={100} width={100} alt={"Reject"} />
            )}
          </Grid>
          <Grid>
            {type === ERROR_MSG && (
              <span
                style={{
                  color: "#454f5b",
                  fontSize: "22px",
                  fontWeight: "bold",
                  marginTop: "5%",
                }}
              >
                Oops! Something Went Wrong.
              </span>
            )}
            {type === SUCCESS_MSG && (
              <span
                style={{
                  color: "#454f5b",
                  fontSize: "22px",
                  fontWeight: "bold",
                  marginTop: "5%",
                }}
              >
                Success!
              </span>
            )}
          </Grid>
          <Grid>
            <span
              style={{ color: "#637381", fontSize: "18px", marginTop: "3%" }}
            >
              {message}
            </span>
          </Grid>
          <GridButton mt={3}>
            <CustomButton
              variant="contained"
              type="submit"
              onClick={handleClose}
            >
              Ok
            </CustomButton>
          </GridButton>
        </CustomBox>
      </CustomModal>
    </>
  );
};

export default PopupResponse;

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
  text-align: center;
  @media (max-width: 768px) {
    width: 30%;
  }
`;

const Grid = styled(Box)`
  display: grid;
`;

const GridButton = styled(Box)`
  margin-top: 3%;
  display: grid;
  grid-template-columns: repeat(1, auto);
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, auto);
  }
`;

const CustomButton = styled(Button)`
  background-color: #36b37e;
  width: 100px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2a8d63;
  }
`;
