'use client';

import { useState, useCallback, useEffect } from "react";
import { IChangePassword } from "@/types/authTypes/auth-types";
import { userChangePassword } from "@/service/auth/login.service";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import styled from "styled-components";
import { ConnectForceDarkLogo } from "../login/svgs/ConnectForceDarkLogo";
import { Box, IconButton, TextField } from "@mui/material";
import { RestartAltOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const ERROR_MESSAGES = {
  usernameRequired: "Username is required.",
  oldPasswordRequired: "Old Password is required.",
  newPasswordRequired: "New Password is required.",
};

export default function ResetPasswordForm() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    userName: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    showNewPassword: false,
    showOldPassword: false,
    showConfirmNewPassword: false,
    error: "",
    loading: false,
  });

  const searchParams = useSearchParams();
  const usernameFromUrl = searchParams.get("username") || "";

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const togglePasswordVisibility = (field: "showNewPassword" | "showOldPassword" | "showConfirmNewPassword") => () => {
    setFormState((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = useCallback(async () => {
    const { userName, oldPassword, newPassword, confirmNewPassword } = formState;

    if (newPassword !== confirmNewPassword) {
      enqueueSnackbar("New Password and Confirm New Password do not match.", { variant: "error" });
      return;
    }

    try {
      const data = await userChangePassword({ userName, oldPassword, newPassword } as IChangePassword);

      if (data.message) {
        enqueueSnackbar(data.message, { variant: "success" });
        router.push("/auth/login?callbackUrl=/dashboard");
      } else {
        data.details.forEach((error: { description: string }) => {
          enqueueSnackbar(error.description, { variant: "error" });
        });
      }
    } catch (error) {
      enqueueSnackbar("An unexpected error occurred. Please try again.", { variant: "error" });
    }
  }, [formState, router]);

  const handleValidate = useCallback(() => {
    const { userName, oldPassword, newPassword, confirmNewPassword } = formState;

    if (!userName) {
      setFormState((prev) => ({ ...prev, error: ERROR_MESSAGES.usernameRequired }));
    } else if (!oldPassword) {
      setFormState((prev) => ({ ...prev, error: ERROR_MESSAGES.oldPasswordRequired }));
    } else if (!newPassword) {
      setFormState((prev) => ({ ...prev, error: ERROR_MESSAGES.newPasswordRequired }));
    } else if (newPassword !== confirmNewPassword) {
      setFormState((prev) => ({ ...prev, error: "New Password and Confirm New Password do not match." }));
    } else {
      setFormState((prev) => ({ ...prev, error: "" }));
      handleSubmit();
    }
  }, [formState, handleSubmit]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      userName: usernameFromUrl,
    }));
  }, [usernameFromUrl]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        handleValidate();
      }
    },
    [handleValidate]
  );

  const { oldPassword, newPassword, showNewPassword, confirmNewPassword, showOldPassword, showConfirmNewPassword, error, loading } = formState;

  return (
    <LoginContainer onKeyUp={handleKeyPress}>
      <ConnectForceDarkLogo />
      <TitleContainer>
        <Title>Reset Password</Title>
      </TitleContainer>

      {error && <ErrorContainer>{error}</ErrorContainer>}
      <StyledTextField
        label="Username"
        variant="outlined"
        value={usernameFromUrl}
        disabled
      />
      <Box height={8}></Box>
      <StyledTextField
        label="Old Password"
        type={showOldPassword ? "text" : "password"}
        variant="outlined"
        value={oldPassword}
        onChange={handleInputChange("oldPassword")}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={togglePasswordVisibility("showOldPassword")}
              sx={{ color: "rgba(145, 158, 171, 1)" }}
            >
              {showOldPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      <Box height={8}></Box>
      <StyledTextField
        label="New Password"
        type={showNewPassword ? "text" : "password"}
        variant="outlined"
        value={newPassword}
        onChange={handleInputChange("newPassword")}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={togglePasswordVisibility("showNewPassword")}
              sx={{ color: "rgba(145, 158, 171, 1)" }}
            >
              {showNewPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      <Box height={8}></Box>
      <StyledTextField
        label="Confirm New Password"
        type={showConfirmNewPassword ? "text" : "password"}
        variant="outlined"
        value={confirmNewPassword}
        onChange={handleInputChange("confirmNewPassword")}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={togglePasswordVisibility("showConfirmNewPassword")}
              sx={{ color: "rgba(145, 158, 171, 1)" }}
            >
              {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      <LoadingButton
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          marginTop: "26px",
          backgroundColor: "#070E4D",
          height: "40px",
          fontWeight: 400,
          '&:hover': {
            backgroundColor: "#1626bb",
          },
        }}
        onClick={handleValidate}
        loading={loading}
      >
        <Box mt={1} mr={2}>
          <RestartAltOutlined />
        </Box>
        Reset Password
      </LoadingButton>
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