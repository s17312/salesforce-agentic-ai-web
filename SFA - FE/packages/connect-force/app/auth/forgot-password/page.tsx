'use client';
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <BgImage>
            <Grid
                container
                component="main"
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <CssBaseline />
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    item
                    xs={12}
                    sm={8}
                    md={4}
                    sx={{ "& > :first-child": { mt: 0 } }}
                >
                    <Box
                        sx={{
                            mt: { xs: 2, md: 8 },
                            minWidth: { xs: "100%", sm: "500px" },
                            width: { xs: "100%", sm: "500px" },
                        }}
                    >
                        <ForgotPasswordForm />
                    </Box>
                </Grid>
            </Grid>
        </BgImage>
    );
}

const BgImage = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url('https://i.ibb.co/qd311W1/BgImg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
  @media (max-width: 600px) {
    background-image: none;
  }
`;