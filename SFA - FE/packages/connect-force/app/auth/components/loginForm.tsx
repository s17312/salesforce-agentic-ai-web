import React, { useState } from "react";
import styled from "styled-components";
import { TextField, IconButton, Box, Typography, Divider } from "@mui/material";
import { LogoutOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { LoadingButton } from "@mui/lab";
import Link from "next/link";
import { ConnectForceDarkLogo } from "../login/svgs/ConnectForceDarkLogo";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userName, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleValidate = () => {
    if (!userName || !password) {
      setError("Username and Password required.");
      return;
    }
    setError("");
    handleLogin(userName, password);
  };

const handleLogin = async (validUserName: string, validPassword: string) => {
  try {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      userName: validUserName,
      password: validPassword,
      callbackUrl,
    });

    if (!res?.error) {
      // Fetch session to get user info
      const session = await getSession();
      if (session?.user?.isFirstLogin) {
        setLoading(false);
        router.push(`/auth/change-password?username=${encodeURIComponent(validUserName)}`);
        return;
      }
      setPassword("");
      setUsername("");
      setLoading(false);
      router.push(callbackUrl);
    } else {
      setError("Invalid Username or Password");
      setLoading(false);
    }
  } catch (error: any) {
    setLoading(false);
    setError(error);
  }
};

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleValidate();
    }
  };

  return (
    <LoginContainer onKeyUp={handleKeyPress}>
      <ConnectForceDarkLogo />
      <TitleContainer>
        <Title>Login</Title>
      </TitleContainer>

      {error && <ErrorContainer>{error}</ErrorContainer>}
      <StyledTextField
        label="Username"
        variant="outlined"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Box height={8}></Box>
      <StyledTextField
        label="Password"
        type={showPassword ? "text" : "password"}
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={handleClickShowPassword}
              sx={{ color: "rgba(145, 158, 171, 1)" }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      <Actions onClick={() => router.push("/auth/forgot-password")}>
        <ActionText>Forgot Password ?</ActionText>
      </Actions>
      <LoadingButton
        variant="contained"
        color="primary"
        fullWidth
        sx={{
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
          <LogoutOutlined />
        </Box>
        Login
      </LoadingButton>

      <Box sx={{
        marginTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#696A6B',
        "&:hover": {
          cursor: 'default',
        },
      }}>
        <Divider sx={{ width: '100%', bgcolor: '#ffffff', mb: '10px' }} />

        <Typography sx={{ fontSize: '12px' }}>
          Designed & Developed by
        </Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Link
            href="https://icptechno.com/"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Typography sx={{
              fontSize: '12px',
              color: '#169941',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                textDecorationColor: '#16aa47',
                color: '#16aa47',
              },
            }}>
              ICP Technologies
            </Typography>
          </Link>
          <Typography sx={{ fontSize: '12px' }}>&nbsp;2024 © All rights reserved</Typography>
        </Box>
      </Box>
    </LoginContainer>
  );
};

export default LoginForm;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 32px 30px 32px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  border: 1px solid rgb(255, 255, 255);
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: #f8f6ff;
`;
const TitleContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 20px;
`;
const Title = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: '#070E4D';
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
  width: 100%;
  background-color: rgba(145, 158, 171, 0.08);
  border-radius: 8px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 16.94px;
`;

const ActionText = styled.span`
  font-size: 14px;
  margin-bottom: 30px;
  color: #070E4D;
  cursor: pointer;
  font-style: italic; // Makes text italic
  &:hover {
    color: #1626bb;
  }
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