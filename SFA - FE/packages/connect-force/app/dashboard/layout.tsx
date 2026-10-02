"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { PropsWithChildren, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { ToastContainer } from "react-toastify";
import { IslandLayout } from "@icp/react-fusion";
import { navItems } from "@/data/navigation-items";
import styled from "styled-components";
import { useRouter, usePathname } from "next/navigation";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import SnackbarProvider from "@/components/snackbar/SnackbarProvider";
import MainLayout from "@/layout/MainLayout";
import { SessionProvider, useSession } from "next-auth/react";
import AuthProvider from "../context/AuthProvider";


export default function RootLayout({ children }: PropsWithChildren) {
  let pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <html lang="en" >
      <body
        style={{
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          overflowX: "hidden",
          width: "100%",
        }}
      >
        <AuthProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <CustomToastContainer
                className="toast-container"
                autoClose={3000}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <Provider store={store}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <SnackbarProvider>
                    <MainLayout>
                      {children}
                    </MainLayout>
                  </SnackbarProvider>
                </LocalizationProvider>
              </Provider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

const CustomToastContainer = styled(ToastContainer)`

`;
