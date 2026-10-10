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
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { SaveIcon } from '@/components/icons/saveIcon';
import { alpha } from '@mui/material/styles';
import { useThemeContext } from '@/context/ThemeContext';
import { useNotificationContext } from '@/context/NotificationContext';

export function AppBar({
  username,
  userRole = "Admin",
  userImage = "https://www.w3schools.com/howto/img_avatar.png",
  onProfileClick,
  onAppearanceClick,
  onSettingsClick,
  onLogoutClick,
  onToggleDrawerClick,
  ...props
}: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { openAppearanceDrawer, currentTheme } = useThemeContext();
  const { unreadCount, openNotificationDrawer, hasNewPulse } = useNotificationContext();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAppearanceClick = () => {
    handleClose();
    if (onAppearanceClick) onAppearanceClick();
    openAppearanceDrawer(); // Opens right-side Appearance drawer
  };

  const handleSettingsClick = () => {
    handleClose();
    if (onSettingsClick) onSettingsClick();
  };

  return (
    <MuiAppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: currentTheme?.outerBg || '#f4f3fb',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
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
              color: currentTheme?.textPrimary || '#1e293b',
              p: 0.8,
              borderRadius: '8px',
              border: `1px solid ${alpha(currentTheme?.primaryMain || '#000000', 0.18)}`,
              bgcolor: currentTheme?.headerTint || 'rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha(currentTheme?.primaryMain || '#6366f1', 0.15),
                color: currentTheme?.primaryMain || '#1e293b',
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: currentTheme?.primaryMain || '#6366f1',
              color: '#ffffff',
              borderRadius: '10px',
              px: 2,
              py: 0.6,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: `0 3px 10px ${alpha(currentTheme?.primaryMain || '#6366f1', 0.25)}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': {
                backgroundColor: currentTheme?.primaryDark || '#4f46e5',
                boxShadow: `0 4px 14px ${alpha(currentTheme?.primaryMain || '#6366f1', 0.35)}`,
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
              bgcolor: currentTheme?.primaryMain || '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 2px 8px ${alpha(currentTheme?.primaryMain || '#6366f1', 0.3)}`,
            }}
          >
            <BarChartIcon sx={{ color: '#ffffff', fontSize: '1.25rem' }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: currentTheme?.textPrimary || '#0f172a',
              letterSpacing: '-0.3px',
              fontSize: '1.25rem',
              fontFamily: '"Public Sans", sans-serif',
            }}
          >
            Connect Force
          </Typography>
        </Box>

        {/* Right Side: Notification Bell + Theme Palette Shortcut + Profile & Role Dropdown */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Notification Bell Button */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={openNotificationDrawer}
              sx={{
                color: currentTheme?.textPrimary || '#1e293b',
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                p: 0.9,
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                animation: hasNewPulse ? 'bellShake 0.6s ease infinite' : 'none',
                '@keyframes bellShake': {
                  '0%, 100%': { transform: 'rotate(0deg)' },
                  '20%, 60%': { transform: 'rotate(12deg)' },
                  '40%, 80%': { transform: 'rotate(-12deg)' },
                },
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                max={99}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.68rem',
                    height: 18,
                    minWidth: 18,
                    fontWeight: 800,
                    border: '1.5px solid #ffffff',
                    animation: unreadCount > 0 ? 'pulseBadge 2.2s infinite' : 'none',
                    '@keyframes pulseBadge': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.15)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  },
                }}
              >
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Quick Palette Button to open Appearance Drawer */}
          <Tooltip title="Theme & Appearance">
            <IconButton
              onClick={openAppearanceDrawer}
              sx={{
                color: currentTheme?.textPrimary || '#1e293b',
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                p: 0.9,
                borderRadius: '8px',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' },
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
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' },
            }}
          >
            <Avatar
              src={userImage}
              alt={username || 'Admin'}
              sx={{ width: 34, height: 34, border: `1.5px solid ${alpha(currentTheme?.primaryMain || '#6366f1', 0.4)}` }}
            />
            <Typography variant="body2" sx={{ color: currentTheme?.textPrimary || '#1e293b', fontWeight: 600, fontSize: '0.875rem' }}>
              {userRole || username || 'Admin'}
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: currentTheme?.textPrimary || '#1e293b', fontSize: '1.1rem' }} />
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
                bgcolor: '#ffffff',
                color: currentTheme?.textPrimary || '#1e293b',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                '& .MuiMenuItem-root': {
                  fontSize: '0.875rem',
                  py: 1,
                  px: 2,
                  '&:hover': {
                    bgcolor: currentTheme?.headerTint || '#f1f5f9',
                  },
                },
              },
            }}
          >
            <MenuItem onClick={() => { handleClose(); if (onProfileClick) onProfileClick(); }}>
              <ListItemIcon><PersonIcon fontSize="small" sx={{ color: currentTheme?.primaryMain || '#6366f1' }} /></ListItemIcon>
              Profile
            </MenuItem>

            {/* Appearance menu item to open right-side Appearance drawer */}
            <MenuItem onClick={handleAppearanceClick}>
              <ListItemIcon><PaletteIcon fontSize="small" sx={{ color: currentTheme?.primaryMain || '#6366f1' }} /></ListItemIcon>
              Appearance
            </MenuItem>

            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon><SettingsIcon fontSize="small" sx={{ color: currentTheme?.primaryMain || '#6366f1' }} /></ListItemIcon>
              Settings
            </MenuItem>

            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
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
