'use client';

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import styled from "styled-components";
import { ConnectForceDarkLogo } from "../login/svgs/ConnectForceDarkLogo";
import { Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { userForgotPassword } from "@/service/auth/login.service";

const ERROR_MESSAGES = {
  usernameRequired: "Username is required.",
  reasonRequired: "Reason is required.",
  reasonMax: "Reason for reset must be at most 100 characters.",
};

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    userName: "",
    reason: "",
    error: "",
    loading: false,
  });

  const handleInputChange = (field: "userName" | "reason") => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = useCallback(async () => {
    setFormState((prev) => ({ ...prev, loading: true }));
    try {

      const payload = {
        userName: formState.userName,
        reason: formState.reason,
      };
      const res = await userForgotPassword(payload);
      if (res.responseCode == "404" || res.responseCode == "400") {
        enqueueSnackbar(res.details[0].description, { variant: "error" });
      } else {
        enqueueSnackbar(res.message, { variant: "success" });
        setFormState({ userName: "", reason: "", error: "", loading: false });
      }
    } catch (error) {
      enqueueSnackbar("An unexpected error occurred. Please try again.", { variant: "error" });
    } finally {
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  }, [formState]);

  const handleValidate = useCallback(() => {
    const { userName, reason } = formState;

    if (!userName) {
      setFormState((prev) => ({ ...prev, error: ERROR_MESSAGES.usernameRequired }));
    } else if (!reason) {
      setFormState((prev) => ({ ...prev, error: ERROR_MESSAGES.reasonRequired }));
    } else if (reason.length > 100) {
      setFormState((prev) => ({ ...prev, error: ERROR_MESSAGES.reasonMax }));
    } else {
      setFormState((prev) => ({ ...prev, error: "" }));
      handleSubmit();
    }
  }, [formState, handleSubmit]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        handleValidate();
      }
    },
    [handleValidate]
  );

  const { userName, reason, error, loading } = formState;

  return (
    <LoginContainer onKeyUp={handleKeyPress}>
      <ConnectForceDarkLogo />
      <TitleContainer>
        <Title>Request Password Reset</Title>
      </TitleContainer>

      {error && <ErrorContainer>{error}</ErrorContainer>}
      <StyledTextField
        label="Username *"
        variant="outlined"
        value={userName}
        onChange={handleInputChange("userName")}
      />
      <Box height={8}></Box>
      <StyledTextField
        label="Reason for Reset *"
        variant="outlined"
        value={reason}
        onChange={handleInputChange("reason")}
        multiline
        minRows={3}
        inputProps={{ maxLength: 100 }}
        error={
          (!!error && (error === ERROR_MESSAGES.reasonRequired || error === ERROR_MESSAGES.reasonMax)) ||
          reason.length > 100
        }
        helperText={
          reason.length > 100
            ? "Reason for reset must be at most 100 characters."
            : error === ERROR_MESSAGES.reasonRequired || error === ERROR_MESSAGES.reasonMax
              ? error
              : `${reason.length}/100`
        }
      />
      <LoadingButton
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          backgroundColor: "#070E4D",
          height: "40px",
          fontWeight: 400,
          mt: 2,
          '&:hover': {
            backgroundColor: "#1626bb",
          },
        }}
        onClick={handleValidate}
        loading={loading}
      >
        Submit Request
      </LoadingButton>
      <Actions onClick={() => router.push("/auth/login?callbackUrl=/dashboard")}>
        <ActionText>Back to login</ActionText>
      </Actions>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 40px 60px 40px;
  margin: 0 auto;
  border: 1px solid rgb(255, 255, 255);
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #f8f6ff;
`;

const TitleContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
`;

const Title = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: '#070E4D';
  text-align: center;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
  width: 100%;
  background-color: rgba(145, 158, 171, 0.08);
  border-radius: 8px;
`;

const ErrorContainer = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  width: 100%;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  /* margin-bottom: 16.94px; */
`;

const ActionText = styled.span`
  font-size: 14px;
  /* margin-bottom: 30px; */
  color: #070E4D;
  cursor: pointer;
  font-style: italic; // Makes text italic
  &:hover {
    color: #1626bb;
  }
`;
