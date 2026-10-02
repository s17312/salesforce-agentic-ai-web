"use client";

import { ThemeProvider } from "@mui/material";
import theme from "@/theme/index";
import AuthProvider from "../context/AuthProvider";
import SnackbarProvider from "@/components/snackbar";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <ToastContainer
              className="toast-container"
              autoClose={3000}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <SnackbarProvider>
              {children}
            </SnackbarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
