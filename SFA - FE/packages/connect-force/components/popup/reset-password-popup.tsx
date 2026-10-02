import PasswordIcon from "@/assets/icons/PasswordIcon";
import { setPopupView } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import {
  adminSideResetPasswordForAllUsers,
  userForgotPasswordUpdate,
} from "@/service/auth/login.service";
import { getAllRequestedResetPasswordList } from "@/service/user-management/reset-request-password.service";
import { IChangePassword } from "@/types/authTypes/auth-types";
import {
  ContentCopy,
  RestartAltOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CssBaseline from "@mui/material/CssBaseline";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

type PopupViewProps = {
  data: any;
  resetForAllUsers?: boolean;
};

const ERROR_MESSAGES = {
  newPasswordRequired: "New Password is required.",
  confirmPasswordRequired: "Confirm Password is required.",
  matchPasswords: "New Password and Confirm New Password do not match.",
  minLength: "Password must be at least 6 characters.",
};

const ResetPasswordModal = ({ data, resetForAllUsers }: PopupViewProps) => {
  const router = useRouter();
  const isPopupViewOpen = useSelector((state) => state.layout.popupView);
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const [copyMessage, setCopyMessage] = useState("");

  const [formState, setFormState] = useState({
    userName: "",
    newPassword: "",
    confirmNewPassword: "",
    showNewPassword: false,
    showConfirmNewPassword: false,
    error: "",
    loading: false,
  });

  const handleClose = () => {
    dispatch(setPopupView(false));
    setFormState((prev) => ({
      ...prev,
      newPassword: "",
      confirmNewPassword: "",
      showNewPassword: false,
      showConfirmNewPassword: false,
      error: "",
    }));
    setCopyMessage("");
  };
  const handleSubmit = useCallback(async () => {
    const { userName, newPassword, confirmNewPassword } = formState;

    if (newPassword !== confirmNewPassword) {
      enqueueSnackbar("New Password and Confirm New Password do not match.", {
        variant: "error",
      });
      return;
    }

    try {
      if (resetForAllUsers) {
        const data = await adminSideResetPasswordForAllUsers({
          userName,
          newPassword,
        } as IChangePassword);
        if (data.message) {
          enqueueSnackbar(data.message, { variant: "success" });
          handleClose();
          await getAllRequestedResetPasswordList(
            undefined,
            undefined,
            undefined,
            "uId",
            "desc"
          );
        } else {
          data.details.forEach((error: { description: string }) => {
            enqueueSnackbar(error.description, { variant: "error" });
          });
        }
      } else {
        const data = await userForgotPasswordUpdate({
          userName,
          newPassword,
        } as IChangePassword);
        if (data.message) {
          enqueueSnackbar(data.message, { variant: "success" });
          handleClose();
          await getAllRequestedResetPasswordList(
            undefined,
            undefined,
            undefined,
            "uId",
            "desc"
          );
        } else {
          data.details.forEach((error: { description: string }) => {
            enqueueSnackbar(error.description, { variant: "error" });
          });
        }
      }
    } catch (error) {
      enqueueSnackbar("An unexpected error occurred. Please try again.", {
        variant: "error",
      });
    }
  }, [formState, router]);

  const handleValidate = useCallback(() => {
    const { newPassword, confirmNewPassword } = formState;

    if (!newPassword) {
      setFormState((prev) => ({
        ...prev,
        error: ERROR_MESSAGES.newPasswordRequired,
      }));
    } else if (newPassword.length < 6) {
      setFormState((prev) => ({
        ...prev,
        error: ERROR_MESSAGES.minLength,
      }));
    } else if (!confirmNewPassword) {
      setFormState((prev) => ({
        ...prev,
        error: ERROR_MESSAGES.confirmPasswordRequired,
      }));
    } else if (newPassword !== confirmNewPassword) {
      setFormState((prev) => ({
        ...prev,
        error: ERROR_MESSAGES.matchPasswords,
      }));
    } else {
      setFormState((prev) => ({ ...prev, error: "" }));
      handleSubmit();
    }
  }, [formState, handleSubmit]);

  const usernameOfRequestedUser = data?.userName;

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      userName: usernameOfRequestedUser,
    }));
  }, [usernameOfRequestedUser]);

  const {
    newPassword,
    showNewPassword,
    confirmNewPassword,
    showConfirmNewPassword,
    error,
    loading,
  } = formState;

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const togglePasswordVisibility =
    (field: "showNewPassword" | "showConfirmNewPassword") => () => {
      setFormState((prev) => ({ ...prev, [field]: !prev[field] }));
    };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.body.removeChild(textarea);
  };

  return (
    <Dialog open={isPopupViewOpen} onClose={handleClose} fullWidth>
      <CssBaseline />
      <Box display="flex" justifyContent="flex-end" pr={1} pt={1}>
        <IconButton onClick={handleClose} sx={{ color: "rgba(0, 0, 0, 0.54)" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <TitleContainer>
          <Title style={{ color: "#040707" }}>Reset Password</Title>
        </TitleContainer>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          mt={2}
        >
          <PasswordIcon sx={{ mb: 2, height: 90 }} />
        </Box>
        <Box display="flex" flexDirection="column" mt={1} gap={2}>
          {error && <ErrorContainer>{error}</ErrorContainer>}
          {copyMessage && (
            <Box
              sx={{
                color: "#014421",
                display: "flex",
                justifyContent: "center",
                fontSize: 13,
                gap: 0,
                mt: 0,
              }}
            >
              {copyMessage}
            </Box>
          )}
          <StyledTextField
            label="Username"
            variant="outlined"
            value={usernameOfRequestedUser}
            disabled
          />
          <StyledTextField
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            variant="outlined"
            value={newPassword}
            onChange={handleInputChange("newPassword")}
            inputRef={newPasswordInputRef}
            InputProps={{
              endAdornment: (
                <>
                  <IconButton
                    onClick={togglePasswordVisibility("showNewPassword")}
                    sx={{ color: "rgba(145, 158, 171, 1)" }}
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  <Tooltip title={copyTooltipOpen ? "Copied!" : "Copy"}>
                    <IconButton
                      onClick={() => {
                        if (newPasswordInputRef.current && newPassword) {
                          setFormState((prev) => ({
                            ...prev,
                            showNewPassword: true,
                          }));
                          newPasswordInputRef.current.focus();
                          newPasswordInputRef.current.select();
                          setCopyMessage(
                            "Press Ctrl + C to copy the password  or Click paste icon"
                          );
                        }
                      }}
                      sx={{ color: "rgba(145, 158, 171, 1)" }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ),
            }}
          />

          <StyledTextField
            label="Confirm New Password"
            type={showConfirmNewPassword ? "text" : "password"}
            variant="outlined"
            value={confirmNewPassword}
            onChange={handleInputChange("confirmNewPassword")}
            onPaste={() => {
              setCopyMessage("");
            }}
            InputProps={{
              endAdornment: (
                <>
                  <IconButton
                    onClick={togglePasswordVisibility("showConfirmNewPassword")}
                    sx={{ color: "rgba(145, 158, 171, 1)" }}
                  >
                    {showConfirmNewPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                  <Tooltip title={copyTooltipOpen ? "Pasted!" : "Paste"}>
                    <IconButton
                      onClick={() => {
                        copyToClipboard(newPassword);
                        setFormState((prev) => ({
                          ...prev,
                          confirmNewPassword: newPassword,
                        }));
                        setCopyMessage("");
                      }}
                      sx={{ color: "rgba(145, 158, 171, 1)" }}
                    >
                      <ContentPasteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: "10px",
            backgroundColor: "#070E4D",
            height: "40px",
            fontWeight: 400,
            "&:hover": {
              backgroundColor: "#1626bb",
            },
            marginBottom: "10px",
          }}
          onClick={handleValidate}
          loading={loading}
        >
          <Box mt={1} mr={2}>
            <RestartAltOutlined />
          </Box>
          Reset Password
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordModal;

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
  color: "#070E4D";
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
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`;
