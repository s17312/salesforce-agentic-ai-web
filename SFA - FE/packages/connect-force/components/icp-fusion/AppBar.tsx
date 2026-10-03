import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Button,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import PaletteIcon from '@mui/icons-material/Palette';
import { SaveIcon } from '@/components/icons/saveIcon';
import { useThemeContext } from '@/context/ThemeContext';

export function AppBar({
  username,
  userRole = "Admin",
  userImage = "https://www.w3schools.com/howto/img_avatar.png",
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  onToggleDrawerClick,
  ...props
}: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { openAppearanceDrawer, currentTheme } = useThemeContext();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    handleClose();
    if (onSettingsClick) onSettingsClick();
    openAppearanceDrawer(); // Opens right-side Appearance drawer as shown in Image 3
  };

  return (
    <MuiAppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: currentTheme?.outerBg || '#080a25',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 1200,
        height: '60px',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease',
      }}
      {...props}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, minHeight: '60px !important' }}>
        {/* Left Side: Hamburger & Saved Pages Button */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton
            edge="start"
            color="inherit"
            onClick={onToggleDrawerClick}
            sx={{
              color: '#ffffff',
              p: 0.8,
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              bgcolor: 'rgba(255,255,255,0.06)',
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              borderRadius: '10px',
              px: 2,
              py: 0.6,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.28)',
                boxShadow: 'none',
              },
            }}
          >
            Saved Pages
          </Button>
        </Stack>

        {/* Center: Connect Force Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChartIcon sx={{ color: currentTheme?.primaryMain || '#0a0d2c', fontSize: '1.25rem' }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.3px',
              fontSize: '1.25rem',
              fontFamily: '"Public Sans", sans-serif',
            }}
          >
            Connect Force
          </Typography>
        </Box>

        {/* Right Side: Theme Palette Shortcut + Profile & Role Dropdown */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Quick Palette Button to open Appearance Drawer */}
          <Tooltip title="Theme & Appearance">
            <IconButton
              onClick={openAppearanceDrawer}
              sx={{
                color: '#ffffff',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                p: 0.9,
                borderRadius: '8px',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
              }}
            >
              <PaletteIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <Box
            onClick={handleAvatarClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              py: 0.5,
              px: 1,
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            <Avatar
              src={userImage}
              alt={username || 'Admin'}
              sx={{ width: 34, height: 34, border: '1.5px solid rgba(255,255,255,0.3)' }}
            />
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem' }}>
              {userRole || username || 'Admin'}
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: '#ffffff', fontSize: '1.1rem' }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 4,
              sx: {
                minWidth: 180,
                mt: 1,
                borderRadius: '10px',
                bgcolor: currentTheme?.sidebarBg || '#0f1338',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)',
                '& .MuiMenuItem-root': {
                  py: 1,
                  fontSize: '0.875rem',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                },
              },
            }}
          >
            <MenuItem onClick={() => { handleClose(); if (onProfileClick) onProfileClick(); }}>
              <ListItemIcon><PersonIcon fontSize="small" sx={{ color: '#b9c0e8' }} /></ListItemIcon>
              Profile
            </MenuItem>

            {/* Settings Menu Item triggers Appearance Drawer as requested in Image 3 */}
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon><SettingsIcon fontSize="small" sx={{ color: '#b9c0e8' }} /></ListItemIcon>
              Settings
            </MenuItem>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <MenuItem onClick={() => { handleClose(); if (onLogoutClick) onLogoutClick(); }} sx={{ color: '#ff6b6b' }}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </MuiAppBar>
  );
}

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return <Box>{children}</Box>;
}

export function BasePage({ children }: { children: React.ReactNode }) {
  return <Box>{children}</Box>;
}

export function TitleBreadcrumb({ title }: { title: string }) {
  return <Typography variant="h5" fontWeight={700}>{title}</Typography>;
}

export function Breadcrumb() {
  return null;
}

export function CTAButton({ ctaText, handleOnClick }: any) {
  return <button onClick={handleOnClick}>{ctaText}</button>;
}

export default AppBar;
