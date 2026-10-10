import React, { forwardRef, ReactNode, useState } from 'react';
import { Box, Drawer, useTheme, useMediaQuery } from '@mui/material';
import SideBar from './SideBar';
import AppBar from './AppBar';
import AppearanceDrawer from '@/components/theme/AppearanceDrawer';
import NotificationDrawer from '@/components/notification/NotificationDrawer';
import { useThemeContext } from '@/context/ThemeContext';

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { currentTheme } = useThemeContext();

  const handleDrawerToggle = (e?: any) => {
    if (crystalAppbarProps?.onToggleDrawerClick) {
      crystalAppbarProps.onToggleDrawerClick(e);
    }
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
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
        backgroundColor: currentTheme?.outerBg || '#080a25',
        transition: 'background-color 0.3s ease',
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
                bgcolor: currentTheme?.sidebarBg || '#0f1338',
              },
            }}
          >
            {sideBarProps && (
              <SideBar
                {...sideBarProps}
                navItems={sideBarProps.items || sideBarProps.navItems}
                isCollapsed={false}
              />
            )}
          </Drawer>
        ) : (
          /* Desktop Fixed/Collapsible Sidebar */
          sideBarProps && (
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                width: isSidebarCollapsed ? 84 : 260,
                height: '100%',
                flexShrink: 0,
                py: { xs: 1, sm: 1.25 },
                pl: { xs: 1, sm: 1.25 },
                pr: { xs: 0.5, sm: 0.625 },
                boxSizing: 'border-box',
                transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  bgcolor: currentTheme?.sidebarBg || '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'background-color 0.3s ease',
                }}
              >
                <SideBar
                  {...sideBarProps}
                  navItems={sideBarProps.items || sideBarProps.navItems}
                  isCollapsed={isSidebarCollapsed}
                />
              </Box>
            </Box>
          )
        )}

        {/* Right Main Island Content Frame */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100%',
            width: {
              xs: '100%',
              md: isSidebarCollapsed ? 'calc(100vw - 84px)' : 'calc(100vw - 260px)',
            },
            py: { xs: 1, sm: 1.25 },
            pr: { xs: 1, sm: 1.25 },
            pl: { xs: 1, sm: 1.25, md: 0.625 },
            boxSizing: 'border-box',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Island Card */}
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: currentTheme?.paperBg || '#f5f4fd',
              borderRadius: '12px',
              p: { xs: 2, sm: 2.5 },
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'background-color 0.3s ease',
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

      {/* Right-Side Appearance Drawer matching Image 1 */}
      <AppearanceDrawer />

      {/* Right-Side Notification Console Drawer */}
      <NotificationDrawer />
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
