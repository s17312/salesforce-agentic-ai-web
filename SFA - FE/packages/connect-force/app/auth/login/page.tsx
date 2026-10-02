"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { LoginImg } from "./svgs/LoginImg";
import { LoginLogo } from "./svgs/Logo";
import LoginForm from "../components/loginForm";
import styled from "styled-components";

export default function LoginPage() {
  return (
    <BgImage>
      <Grid
        container
        component="main"
        sx={{
          width: "100%",
          height: "100vh",
          margin: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CssBaseline />
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            height: "100vh",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundSize: 'cover',
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: '100%',
              height: '94vh',
              borderTopRightRadius: '40px',
              borderBottomRightRadius: '40px',
              backgroundColor: "#070E4D",
              p: 2,
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxHeight: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <LoginLogo />
              </Box>

              <Typography
                color="white"
                sx={{
                  fontStyle: 'italic',
                  fontSize: { md: '16px', lg: '18px' },
                  textAlign: 'center',
                  maxWidth: '560px',
                  width: '90%',
                  mb: 2,
                }}
              >
                Empower Your Sales Team Log In to Unleash Limitless Growth with Seamless Automation Excellence!
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  '& svg': {
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '45vh',
                  },
                }}
              >
                <LoginImg />
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 2, md: 3 },
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <LoginForm />
          </Box>
        </Grid>
      </Grid>
    </BgImage>
  );
}

const BgImage = styled.div`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background-image: url('https://i.ibb.co/qd311W1/BgImg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
  @media (max-width: 900px) {
    background-image: none;
    height: auto;
    min-height: 100vh;
    overflow: auto;
  }
`;