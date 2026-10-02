import React, { forwardRef, ReactNode, useState } from 'react';
import { Box, Drawer, useTheme, useMediaQuery } from '@mui/material';
import SideBar from './SideBar';
import AppBar from './AppBar';

export interface IslandLayoutProps {
  sideBarProps?: any;
  breadcrumbProps?: any;
  crystalAppbarProps?: any;
  children?: ReactNode;
}

export const IslandLayout = forwardRef<HTMLDivElement, IslandLayoutProps>(function IslandLayout(
  { sideBarProps, crystalAppbarProps, children },
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
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#080a25',
      }}
    >
      {/* Top Header Bar */}
      <Box sx={{ width: '100%', flexShrink: 0 }}>
        <AppBar
          {...crystalAppbarProps}
          onToggleDrawerClick={handleDrawerToggle}
        />
      </Box>

      {/* Main Container under Header */}
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          height: 'calc(100vh - 60px)',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        {/* Mobile Drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: 260,
                bgcolor: '#0f1338',
              },
            }}
          >
            {sideBarProps && <SideBar {...sideBarProps} navItems={sideBarProps.items || sideBarProps.navItems} />}
          </Drawer>
        ) : (
          /* Desktop Fixed Sidebar */
          sideBarProps && (
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                width: 260,
                height: '100%',
                flexShrink: 0,
              }}
            >
              <SideBar {...sideBarProps} navItems={sideBarProps.items || sideBarProps.navItems} />
            </Box>
          )
        )}

        {/* Right Main Island Content Frame */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100%',
            width: { xs: '100%', md: 'calc(100vw - 260px)' },
            p: { xs: 1.5, sm: 2 },
            boxSizing: 'border-box',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Island Card with reduced border radius */}
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: '#f5f4fd',
              borderRadius: '16px', // Reduced border radius (Point 1)
              p: { xs: 2, sm: 3 },
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(10, 13, 44, 0.15)',
                borderRadius: '3px',
              },
            }}
          >
            {children}
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
  breadcrumbsProps: any;
  islandLayoutProps: IslandLayoutProps;
  crystalAppbarProps?: any;
  children?: ReactNode;
}) {
  return (
    <IslandLayout {...islandLayoutProps}>
      {children}
    </IslandLayout>
  );
}

export default IslandLayout;
