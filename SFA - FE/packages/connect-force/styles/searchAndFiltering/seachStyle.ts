import styled from "styled-components";
import { Button, Box, TextField } from "@mui/material";

const Root = styled(Box)`
  flex: 1;
  margin-left: 16px;
  display: flex;
  align-items: center;
`;

const Input = styled(TextField)`
  width: 100%;
`;

export default {
  Root,
  Input,
};
