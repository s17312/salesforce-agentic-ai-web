import { Box, Button, Modal } from "@mui/material";
import styled from "styled-components";

export const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.034); // Semi-transparent white
  backdrop-filter: blur(1.5px); // Apply blur
  -webkit-backdrop-filter: blur(1.5px); // Apply blur for Safari
`;

export const CustomBox = styled(Box)`
  width: 30%;
  padding: 2em;
  border-radius: 16px;
  background-color: white;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media (max-width: 768px) {// For mobile devices
    width: 80%;
  }
`;

export const Grid = styled.div`
  display: grid;
`;

export const GridButton = styled(Box)`
  margin-top: 3%;
  display: grid;
  grid-template-columns: repeat(1, auto);
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, auto);
  }
`;

export const CustomButton = styled(Button)`
  background-color: #36B37E;
  width: 100px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2A8D63;
  }
`;