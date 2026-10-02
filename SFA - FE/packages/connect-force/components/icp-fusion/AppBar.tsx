import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Box,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

export function AppBar({
  username,
  userRole,
  userImage,
  messages = 0,
  notifications = 0,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  onToggleDrawerClick,
  ...props
}: any) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MuiAppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        zIndex: theme.zIndex.drawer - 1,
      }}
      {...props}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" color="inherit" onClick={onToggleDrawerClick} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={800} color="primary.main">
            CONNECT<span style={{ color: theme.palette.secondary.main }}>FORCE</span> SFA
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton color="inherit">
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon sx={{ color: theme.palette.text.secondary }} />
            </Badge>
          </IconButton>

          <Box
            onClick={handleAvatarClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              py: 0.5,
              px: 1,
              borderRadius: 2,
              '&:hover': { bgcolor: theme.palette.action.hover },
            }}
          >
            <Avatar src={userImage} sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main }}>
              {username ? username[0].toUpperCase() : 'A'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2} color="text.primary">
                {username || 'System Admin'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {userRole || 'Administrator'}
              </Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { minWidth: 180, mt: 1, borderRadius: 2 },
            }}
          >
            <MenuItem onClick={() => { handleClose(); if (onProfileClick) onProfileClick(); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); if (onSettingsClick) onSettingsClick(); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleClose(); if (onLogoutClick) onLogoutClick(); }} sx={{ color: 'error.main' }}>
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
