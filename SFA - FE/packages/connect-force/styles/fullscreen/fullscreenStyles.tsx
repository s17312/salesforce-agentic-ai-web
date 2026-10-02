import { Box } from "@mui/material";
import styled from "styled-components";

export const FsBox = styled(Box)<{ isFullScreen: boolean }>`
  background-color: transparent;
  width: 100%;

  ${({ isFullScreen }) =>
    isFullScreen &&
    `
    overflow-y: auto;
    height: 100vh;
    padding: 16px;
    background-color: #f4f6f8;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #e0e0e0;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #919eab;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #637381;
    }
  `}

  scrollbar-width: thin;
  scrollbar-color: #919eab transparent;
`;
