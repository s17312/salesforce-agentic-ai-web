import React, { forwardRef, ReactNode, useState } from 'react';
import { Box, Container, CssBaseline, Drawer, useTheme, useMediaQuery } from '@mui/material';
import BreadcrumbNavigation, { BreadcrumbProps } from './BreadcrumbNavigation';
import SideBar from './SideBar';
import AppBar from './AppBar';
import { Copyright } from './CommonComponents';

export interface IslandLayoutProps {
  sideBarProps?: any;
  breadcrumbProps?: Partial<BreadcrumbProps>;
  crystalAppbarProps?: any;
  children?: ReactNode;
}

export const IslandLayout = forwardRef<HTMLDivElement, IslandLayoutProps>(function IslandLayout(
  { sideBarProps, breadcrumbProps, crystalAppbarProps, children },
  ref
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CssBaseline />

      {/* SideBar for Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 },
          }}
        >
          {sideBarProps && <SideBar {...sideBarProps} navItems={sideBarProps.items || sideBarProps.navItems} />}
        </Drawer>
      ) : (
        /* Fixed SideBar for Desktop */
        sideBarProps && (
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              width: 260,
              height: '100vh',
              flexShrink: 0,
              borderRight: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <SideBar {...sideBarProps} navItems={sideBarProps.items || sideBarProps.navItems} />
          </Box>
        )
      )}

      {/* Main Content Area Column with Fixed Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: { xs: '100%', md: 'calc(100vw - 260px)' },
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        {/* Fixed Top Header (AppBar) */}
        <Box sx={{ flexShrink: 0, zIndex: 1100 }}>
          <AppBar
            {...crystalAppbarProps}
            onToggleDrawerClick={handleDrawerToggle}
          />
        </Box>

        {/* Scrollable Main Content Body */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 1.5, sm: 2.5 },
            backgroundColor: theme.palette.background.default,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.15)',
              borderRadius: '3px',
            },
          }}
        >
          {breadcrumbProps && (breadcrumbProps.pageTitle || breadcrumbProps.pageNavigation) && (
            <Box sx={{ mb: 2 }}>
              <BreadcrumbNavigation {...breadcrumbProps} />
            </Box>
          )}

          <Container maxWidth={false} disableGutters sx={{ flexGrow: 1 }}>
            {children}
          </Container>

          {/* Bottom Footer (Copyright) */}
          <Box
            component="footer"
            sx={{
              py: 2,
              px: 1,
              mt: 'auto',
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Copyright companyName="ConnectForce SFA" titleText="SFA Platform" reservedText="All rights reserved." />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export function IslandLayoutWithBreadscrumb({
  breadcrumbsProps,
  islandLayoutProps,
  children,
}: {
  breadcrumbsProps: BreadcrumbProps;
  islandLayoutProps: IslandLayoutProps;
  crystalAppbarProps?: any;
  children?: ReactNode;
}) {
  return (
    <IslandLayout {...islandLayoutProps} breadcrumbProps={breadcrumbsProps}>
      {children}
    </IslandLayout>
  );
}

export default IslandLayout;
